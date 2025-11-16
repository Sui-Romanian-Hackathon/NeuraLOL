import dotenv from "dotenv";
dotenv.config();

import { createTracker } from "./contractTracker.js";
import { SuiClient } from "@mysten/sui/client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

const RPC_URL = process.env.SUI_RPC_URL;
const PACKAGE_ID = process.env.GARBAGETRACKER_PACKAGE_ID;

async function main() {
  const provider = new SuiClient({ url: RPC_URL });
  const signer = Ed25519Keypair.fromSecretKey(
    "suiprivkey1qpfe3rg3gy9t8z95509gh58dgd33jthd4nff2j4ujg2k8ex9a2msvjj5a4z"
  );

  const trackerId = await createTracker(provider, signer, PACKAGE_ID);
  console.log("Tracker publicat cu objectId:", trackerId);
}

main().catch((err) => {
  console.error("Eroare la publicarea Tracker-ului:", err);
});
