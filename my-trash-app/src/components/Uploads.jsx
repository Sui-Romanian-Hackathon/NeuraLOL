// src/components/Uploads.jsx
import { useState } from "react";
import {
  Typography,
  Button,
  Box,
  CircularProgress,
  Paper,
} from "@mui/material";

export default function Uploads({ walletAddress }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setMessage("");
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
        setMessage(`Gunoi detectat! Ai primit 100 NEURALOL în contul tău.`);
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
    <Paper
      elevation={3}
      sx={{
        p: 4,
        borderRadius: 3,
        maxWidth: 600,
        margin: "0 auto",
        textAlign: "center",
        backgroundColor: "#f9f9f9",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontFamily: "serif",
          fontWeight: "bold",
          color: "#2e7d32",
          mb: 1,
        }}
      >
        Uploaduri + Recompensă NEURALOL
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Încarcă o imagine pentru detectarea gunoiului. Dacă este detectat,
        primești token.
      </Typography>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{
          marginBottom: "20px",
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      />

      <Box>
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={loading}
          sx={{
            backgroundColor: "#2e7d32",
            color: "white",
            fontWeight: "bold",
            px: 4,
            py: 1.5,
            borderRadius: 2,
            "&:hover": {
              backgroundColor: "#27632a",
            },
          }}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : (
            "Upload și primește NEURALOL"
          )}
        </Button>
      </Box>

      {message && (
        <Box
          sx={{
            mt: 3,
            p: 2,
            borderRadius: 2,
            backgroundColor: message.includes("Ai primit")
              ? "#e8f5e9"
              : "#fff3e0",
            color: message.includes("Ai primit") ? "#2e7d32" : "#f57c00",
            fontWeight: "medium",
          }}
        >
          <Typography>{message}</Typography>
        </Box>
      )}
    </Paper>
  );
}
