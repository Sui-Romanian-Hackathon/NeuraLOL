const os = require("os");

// Importuri NU MODIFICA
require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const { getFullnodeUrl, SuiClient } = require("@mysten/sui.js/client");
const { Ed25519Keypair } = require("@mysten/sui.js/keypairs/ed25519");
const { TransactionBlock } = require("@mysten/sui.js/transactions");

const app = express();
const PORT = 5001;

const pythonExecutable = os.platform() === "darwin" ? "python3" : "python";

// Middlewares NU MODIFICA
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());

// Folder uploads
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Doar fișiere imagine!"));
  },
});

// Ruta test
app.get("/", (req, res) => {
  res.json({ message: "Backend-ul funcționează!" });
});

// Ruta upload + ML + Recompensă
app.post("/api/upload", upload.single("image"), async (req, res) => {
  try {
    const imagePath = req.file.path;
    console.log("Imagine primită pentru ML:", imagePath);

    // === ML Detection ===
    const hasTrash = mlDetection(imagePath);

    if (hasTrash === null) {
      return res
        .status(500)
        .json({ success: false, message: "Eroare ML Python" });
    }

    if (hasTrash) {
      res.json({ success: true, message: "Gunoi detectat!" });
    } else {
      res.json({ success: false, message: "Niciun gunoi detectat." });
    }

    // NU mai ștergem imaginea, astfel rămâne în uploads
    // fs.unlinkSync(imagePath);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Eroare server" });
  }
});

// === FUNCȚII AJUTĂTOARE ===
function mlDetection(imagePath) {
  const result = spawnSync(
  pythonExecutable,
  [path.join(__dirname, "ml", "predict.py"), imagePath],
  { encoding: "utf-8" }
);

  console.log("===== Debug ML =====");
  console.log("Imagine trimisă la Python:", imagePath);
  console.log("Python stdout:", result.stdout.trim());
  console.log("Python stderr:", result.stderr.trim());
  console.log("Python error object:", result.error);

  if (result.error || result.status !== 0) {
    console.error("Python a dat eroare la rulare ML");
    return null; // eroare
  }

  const output = result.stdout.trim().split("\n").pop();  // ultima linie
  return output === "Garbage";

}

// Pornire server  NU MODIFICA
app.listen(PORT, () => {
  console.log(`Backend: http://localhost:${PORT}`);
});
