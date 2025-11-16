import { SuiClient } from "@mysten/sui/client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { Transaction } from "@mysten/sui/transactions";
import bs58 from "bs58";

// ======================
// Inițializare Client și Keypair
// ======================

export function createProvider(rpcUrl) {
  return new SuiClient({ url: rpcUrl });
}

// ======================
// Funcții blockchain
// ======================
export async function createTracker(provider, signer, packageId) {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::garbagetracker::init_tracker`,
    arguments: [], // ✅ nu mai trimite nimic
  });

  const result = await provider.signAndExecuteTransaction({
    transaction: tx,
    signer,
    options: { showEffects: true, showEvents: true },
    gasBudget: 200_000,
    skipDryRun: true,
  });

  const trackerObjectId = result.effects?.created?.[0]?.reference?.objectId;
  if (!trackerObjectId) throw new Error("Tracker objectId nu a fost creat!");
  return trackerObjectId;
}

export async function addUpload(
  provider,
  signer,
  packageId,
  trackerObjectId,
  wallet,
  timestamp,
  lat,
  lng,
  ml_result
) {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::garbagetracker::init_tracker`,
    arguments: [],
  });

  const result = await provider.signAndExecuteTransaction({
    transaction: tx,
    signer,
    options: { showEffects: true, showEvents: true },
    gasBudget: 200_000,
    skipDryRun: true,
  });

  return result;
}
