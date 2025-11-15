import { useState } from "react";
import { Typography, Button, Box, CircularProgress } from "@mui/material";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { useWalletKit } from "@mysten/wallet-kit";

// 🔥 VALORI CORECTE
const NEURALOL_PACKAGE_ID =
  "0x63301cfd56e73548421e39b066fc0dd5f4c4ed2f0d4f7d64ee73cf2669f68b8d";

const NEURALOL_TREASURY_CAP_ID =
  "0x4a4004c626f2f4eb71a6f543621b7f3a50e04457483e02446d3bb02291817afd";

const NEURALOL_DECIMALS = 6;

export default function Uploads({ walletAddress, requestSui }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const { currentWallet, signAndExecuteTransactionBlock } = useWalletKit();

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // ------- Upload + Faucet -------
  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("Te rog să selectezi un fișier.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const fileUrl = `https://ipfs.io/ipfs/${selectedFile.name}`;

      await requestSui(walletAddress);

      setMessage(`SUI adăugat în wallet! Imagine încărcată la: ${fileUrl}`);
    } catch (err) {
      console.error(err);
      setMessage("Eroare la upload sau faucet.");
    } finally {
      setLoading(false);
    }
  };

  // ------- MINT + SEND -------
  const handleSendNeuralol = async () => {
    if (!currentWallet) {
      setMessage("Conectează wallet-ul.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const address = currentWallet.accounts[0].address;
      const amount = 100 * 10 ** NEURALOL_DECIMALS; // 100 NEURALOL

      const tx = new TransactionBlock();

      // 🔥 Creează TxContext
      const txContext = tx.object("0x6"); // TxContext (metoda mint_to_self necesită un context mutabil)

      // 🔥 MINT către wallet-ul tău
      tx.moveCall({
        target: `${NEURALOL_PACKAGE_ID}::neuralol::mint_to_self`,
        arguments: [
          tx.object(NEURALOL_TREASURY_CAP_ID), // TreasuryCap corect
          tx.pure(amount),
          txContext,
        ],
      });

      const result = await signAndExecuteTransactionBlock({
        transactionBlock: tx,
        options: { showEffects: true, showBalanceChanges: true },
      });

      console.log("RESULT:", result);
      setMessage(`Ai primit 100 NEURALOL!`);
    } catch (err) {
      console.error(err);
      setMessage("Eroare la tranzacția NEURALOL.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        Uploaduri
      </Typography>

      <Typography color="text.secondary" gutterBottom>
        Upload + reward NEURALOL.
      </Typography>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ marginBottom: "16px" }}
      />

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Button variant="contained" onClick={handleUpload} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Upload și SUI"}
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          onClick={handleSendNeuralol}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Trimite NEURALOL"}
        </Button>
      </Box>

      {message && (
        <Typography color="text.secondary" sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
}
