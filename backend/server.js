require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const { getFullnodeUrl, SuiClient } = require("@mysten/sui.js/client");
const { Ed25519Keypair } = require("@mysten/sui.js/keypairs/ed25519");
const { TransactionBlock } = require("@mysten/sui.js/transactions");

const app = express();
const PORT = 5000;

// Middlewares
app.use(
  cors({
    origin: "http://localhost:3000", // Permite doar frontend-ul local
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
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) cb(null, true);
    else cb(new Error("Doar fișiere video!"));
  },
});

// Ruta test
app.get("/", (req, res) => {
  res.json({ message: "Backend-ul funcționează!" });
});

// Ruta upload + ML + Recompensă
app.post("/api/upload", upload.single("video"), async (req, res) => {
  try {
    const { walletAddress } = req.body;
    const videoPath = req.file.path;

    if (!walletAddress) {
      return res.status(400).json({ error: "Wallet address lipsă" });
    }

    // === ML MOCK (înlocuiește mai târziu) ===
    const hasTrash = await mockMLDetection(videoPath);

    if (hasTrash) {
      const txHash = await rewardUser(walletAddress);
      res.json({
        success: true,
        message: "Gunoi detectat! Recompensă trimisă.",
        txHash,
      });
    } else {
      res.json({ success: false, message: "Niciun gunoi detectat." });
    }

    // Șterge video-ul
    fs.unlinkSync(videoPath);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Eroare server" });
  }
});

// === FUNCȚII AJUTĂTOARE ===

async function mockMLDetection(videoPath) {
  console.log("Procesez:", videoPath);
  await new Promise((r) => setTimeout(r, 2000));
  return Math.random() > 0.5; // 50% șansă
}

async function rewardUser(toAddress) {
  const client = new SuiClient({ url: getFullnodeUrl("testnet") });

  const secretKey = process.env.ADMIN_PRIVATE_KEY;
  if (!secretKey) throw new Error("Lipsește ADMIN_PRIVATE_KEY în .env");

  const keypair = Ed25519Keypair.fromSecretKey(
    Buffer.from(secretKey, "base64")
  );

  const txb = new TransactionBlock();
  const [coin] = txb.splitCoins(txb.gas, [1_000_000_000]); // 1 SUI
  txb.transferObjects([coin], toAddress);

  const result = await client.signAndExecuteTransactionBlock({
    signer: keypair,
    transactionBlock: txb,
  });

  return result.digest;
}

// Pornire server
app.listen(PORT, () => {
  console.log(`Backend: http://localhost:${PORT}`);
});
