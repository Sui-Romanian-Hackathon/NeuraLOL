// trackerService.js
import dotenv from "dotenv";
dotenv.config();
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

import { createProvider, createTracker, addUpload } from "./contractTracker.js";

const RPC_URL = process.env.SUI_RPC_URL;
const PACKAGE_ID = process.env.GARBAGETRACKER_PACKAGE_ID;

const provider = createProvider(RPC_URL);
const signer = Ed25519Keypair.fromSecretKey(
  "suiprivkey1qpfe3rg3gy9t8z95509gh58dgd33jthd4nff2j4ujg2k8ex9a2msvjj5a4z"
);

export async function initTrackerService() {
  const trackerId = await createTracker(provider, signer, PACKAGE_ID);
  console.log("Tracker creat:", trackerId);
  return trackerId;
}

export async function uploadImageService(
  trackerId,
  wallet,
  timestamp,
  lat,
  lng,
  ml_result
) {
  const result = await addUpload(
    provider,
    signer,
    PACKAGE_ID,
    trackerId,
    wallet,
    timestamp,
    lat,
    lng,
    ml_result
  );

  console.log("Upload adăugat:", result.digest);
  return result;
}
