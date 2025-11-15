// contractToken.js
import dotenv from "dotenv";
dotenv.config(); // FOARTE IMPORTANT: trebuie să fie primul lucru

import { SuiClient } from "@mysten/sui/client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { Transaction } from "@mysten/sui/transactions";
import bs58 from "bs58";

// === Configurări din .env ===
const RPC_URL = process.env.SUI_RPC_URL;
const PACKAGE_ID = process.env.NEURALOL_PACKAGE_ID;
const TREASURY_CAP_ID = process.env.NEURALOL_TREASURY_CAP_ID;
const COIN_DECIMALS = Number(process.env.NEURALOL_DECIMALS || 6);

// --- verificări ---
if (!RPC_URL) throw new Error("❌ SUI_RPC_URL nu este definit în .env!");
if (!PACKAGE_ID)
  throw new Error("❌ NEURALOL_PACKAGE_ID nu este definit în .env!");
if (!TREASURY_CAP_ID)
  throw new Error("❌ NEURALOL_TREASURY_CAP_ID nu este definit în .env!");
if (!process.env.PUBLISHER_PRIVATE_KEY)
  throw new Error("❌ PUBLISHER_PRIVATE_KEY nu este definit în .env!");

// Debug
console.log("DEBUG: RPC_URL =", RPC_URL);

// === Inițializare Client Sui ===
const provider = new SuiClient({ fullnode: RPC_URL });

// === Funcții auxiliare pentru cheie ===
function decodeSuiPrivateKey(rawKey) {
  if (!rawKey) throw new Error("Cheia privată nu poate fi goală");
  const suiKey = rawKey.trim();

  // Hex key
  if (suiKey.startsWith("0x")) {
    const hex = suiKey.slice(2);
    if (hex.length !== 64)
      throw new Error(
        `Cheia privată hex trebuie să aibă 64 caractere, dar are ${hex.length}`
      );
    const bytes = Uint8Array.from(Buffer.from(hex, "hex"));
    console.log("LOG: Folosit Hex private key, length =", bytes.length);
    return bytes;
  }

  // Base58 Sui key
  if (suiKey.startsWith("suiprivkey1")) {
    const base58 = suiKey.slice("suiprivkey1".length);
    const bytes = bs58.decode(base58);
    if (bytes.length !== 32)
      throw new Error(
        `Cheia privată trebuie să aibă 32 bytes, dar are ${bytes.length}`
      );
    console.log("LOG: Folosit Base58 Sui private key, length =", bytes.length);
    return bytes;
  }

  throw new Error("Cheia privată trebuie să înceapă cu 'suiprivkey1' sau '0x'");
}

// === Decodare și keypair ===
const secretKeyBytes = decodeSuiPrivateKey(process.env.PUBLISHER_PRIVATE_KEY);
console.log(`LOG: Lungime cheie decodată: ${secretKeyBytes.length} bytes`);
const publisherKeypair = Ed25519Keypair.fromSecretKey(secretKeyBytes);

// === Funcție principală ===
export async function mintAndSendNeuralol(recipientAddress, amount) {
  console.log(
    `LOG: Încep mint & send pentru ${amount} tokeni către ${recipientAddress}`
  );
  if (!recipientAddress) throw new Error("❌ Adresă destinatar invalidă!");
  if (!amount || isNaN(amount) || amount <= 0)
    throw new Error("❌ Suma trebuie să fie un număr pozitiv!");

  const amountInMIST = BigInt(amount) * BigInt(10 ** COIN_DECIMALS);

  const tx = new Transaction();
  tx.moveCall({
    target: `${PACKAGE_ID}::my_coin::mint_to_self`,
    arguments: [
      tx.object(TREASURY_CAP_ID),
      tx.pure("u64", amountInMIST.toString()),
      tx.pure("address", recipientAddress),
    ],
  });

  console.log("LOG: Tranzacție construită. Semnare și execuție...");
  try {
    const result = await provider.signAndExecuteTransaction({
      transaction: tx,
      signer: publisherKeypair,
      options: { showEffects: true, showEvents: true },
    });
    console.log("LOG: Tranzacție finalizată cu succes:", result.digest);
    return result;
  } catch (error) {
    console.error("LOG: ❌ Eroare la signAndExecuteTransaction:", error);
    throw error;
  }
}
