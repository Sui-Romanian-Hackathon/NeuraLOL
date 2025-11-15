// server.js
import dotenv from "dotenv";
dotenv.config(); // MUST be first
import express from "express";
import cors from "cors";
import { mintAndSendNeuralol } from "./contractToken.js";

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// Ruta test
app.get("/", (req, res) => {
  console.log("SERVER LOG: Cerere GET primită pe /");
  res.json({ message: "Backend-ul funcționează!" });
});

// ===== ROUTE: Trimite NEURALOL direct fără upload =====
app.post("/api/send", async (req, res) => {
  console.log("SERVER LOG: Cerere POST primită pe /api/send");

  const { walletAddress, amount } = req.body;
  console.log(
    `SERVER LOG: Date primite: Adresă=${walletAddress}, Sumă=${amount}`
  );

  if (!walletAddress) {
    return res.status(400).json({ error: "Lipseste walletAddress" });
  }

  const AMOUNT = amount ? Number(amount) : 100; // default 100 NEURALOL
  console.log(
    `SERVER LOG: Apelare mintAndSendNeuralol către ${walletAddress} cu ${AMOUNT}.`
  );

  try {
    const result = await mintAndSendNeuralol(walletAddress, AMOUNT);
    res.json({
      success: true,
      message: `Trimis ${AMOUNT} NEURALOL către ${walletAddress}`,
      tx: result,
    });
  } catch (err) {
    console.error("SERVER LOG: ❌ EROARE CATCH la /api/send:", err);
    res.status(500).json({
      success: false,
      message: `Eroare la tranzacția Sui: ${err.message}`,
    });
  }
});

// Pornire server
app.listen(PORT, () => {
  console.log("SERVER LOG: Blocul app.listen a fost apelat.");
  console.log(`✅ Backend: http://localhost:${PORT}`);
});
