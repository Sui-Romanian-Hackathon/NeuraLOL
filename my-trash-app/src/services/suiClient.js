// src/services/suiClient.js
import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";

// Poți schimba "devnet" → "mainnet" sau "testnet"
export const client = new SuiClient({
  url: getFullnodeUrl("devnet"),
});
