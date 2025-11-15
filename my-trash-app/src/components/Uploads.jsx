// src/components/Uploads.jsx
import { useState } from "react";
import { Typography, Button, Box, CircularProgress } from "@mui/material";

export default function Uploads({ walletAddress }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("Te rog să selectezi un fișier.");
      return;
    }

    if (!walletAddress) {
      setMessage("Te rog să conectezi wallet-ul.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // === Upload imagine + ML detection + walletAddress ===
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("walletAddress", walletAddress);

      const res = await fetch("http://localhost:5001/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Backend Response:", data);

      if (!data.success) {
        setMessage(data.message || "Niciun gunoi detectat.");
        setLoading(false);
        return;
      }

      if (data.tokenSent) {
        setMessage(
          `Gunoi detectat! Trimisi 100 NEURALOL către ${walletAddress}`
        );
      } else {
        setMessage(
          `Gunoi detectat, dar tranzacția SUI a eșuat: ${data.message}`
        );
      }
    } catch (err) {
      console.error(err);
      setMessage(
        "A apărut o eroare la upload, ML sau tranzacția SUI. Vezi consola."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        Uploaduri + Recompensă NEURALOL
      </Typography>
      <Typography color="text.secondary" gutterBottom>
        Încarcă o imagine pentru detectarea gunoiului. Dacă este detectat,
        primești token.
      </Typography>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ marginBottom: "16px" }}
      />

      <Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            "Upload și primește NEURALOL"
          )}
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
