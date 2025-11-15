// backend/server.js
import os from "os";
import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { mintAndSendNeuralol } from "./contractToken.js";

dotenv.config();

// Fix __dirname în ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Folosim Python 3.11 direct
const pythonExecutable = os.platform() === "darwin" ? "python3" : "python";

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors({ origin: "http://localhost:3000" }));
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

// ==================== ROUTA TEST ====================
app.get("/", (req, res) => {
  res.json({ message: "Backend-ul funcționează!" });
});

// ==================== ROUTA UPLOAD + ML + TOKEN ====================
app.post("/api/upload", upload.single("image"), async (req, res) => {
  try {
    const imagePath = req.file.path;
    console.log("SERVER LOG: Imagine primită pentru ML:", imagePath);

    // Rulează ML
    const hasTrash = mlDetection(imagePath);

    if (hasTrash === null) {
      return res
        .status(500)
        .json({ success: false, message: "Eroare ML Python" });
    }

    // Dacă ML detectează gunoi
    if (hasTrash) {
      const { walletAddress } = req.body;

      if (!walletAddress) {
        return res.status(400).json({
          success: true,
          message: "Gunoi detectat, dar lipseste walletAddress",
        });
      }

      try {
        const txResult = await mintAndSendNeuralol(walletAddress, 100);
        return res.json({
          success: true,
          ml: true,
          tokenSent: true,
          message: `Gunoi detectat! Trimisi 100 NEURALOL către ${walletAddress}`,
          tx: txResult,
        });
      } catch (err) {
        console.error("Eroare la trimitere token:", err);
        return res.status(500).json({
          success: true,
          ml: true,
          tokenSent: false,
          message: `Gunoi detectat, dar tranzacția SUI a eșuat: ${err.message}`,
        });
      }
    } else {
      // Dacă ML nu detectează gunoi
      return res.json({
        success: false,
        ml: false,
        message: "Niciun gunoi detectat.",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Eroare server" });
  }
});

// ==================== FUNCȚIA ML Detection ====================
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

  const output = result.stdout.trim().split("\n").pop(); // ultima linie
  return output === "Garbage";
}

// ==================== Pornire server ====================
app.listen(PORT, () => {
  console.log(`Backend: http://localhost:${PORT}`);
});
