// testTracker.js
import dotenv from "dotenv";
dotenv.config();

import { initTrackerService, uploadImageService } from "./trackerService.js";

async function test() {
  try {
    // 1️⃣ Creează un Tracker
    const trackerId = await initTrackerService();
    console.log("✅ Tracker ID:", trackerId);

    // 2️⃣ Adaugă un upload
    // Simulăm datele ML validate
    const walletAddress =
      "0x91bc69683ac2e564d1eb05c43f2c1006cb5ff91237dc82eb5803be2260ad4c0c";
    const timestamp = Math.floor(Date.now() / 1000); // secunde
    const lat = 45123456; // ex: 45.123456 * 1e6
    const lng = 26456789; // ex: 26.456789 * 1e6
    const ml_result = true;

    const uploadResult = await uploadImageService(
      trackerId,
      walletAddress,
      timestamp,
      lat,
      lng,
      ml_result
    );

    console.log("✅ Upload finalizat, digest tranzacție:", uploadResult.digest);
  } catch (err) {
    console.error("❌ Eroare la test:", err);
  }
}

test();
