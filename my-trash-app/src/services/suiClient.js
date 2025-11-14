// src/lib/suiClient.js
import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";

export const client = new SuiClient({
  url: getFullnodeUrl("testnet"), // sau "devnet"
});
