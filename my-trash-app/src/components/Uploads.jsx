import { useState } from "react";
import { Typography, Button, Box, CircularProgress } from "@mui/material";

export default function Uploads({ walletAddress, requestSui }) {
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

 /* if (!walletAddress) {
    setMessage("Te rog să introduci walletAddress.");
    return;
  }*/

  setLoading(true);
  setMessage("");

  try {
    const formData = new FormData();
    formData.append("image", selectedFile);
   // formData.append("walletAddress", walletAddress);

    // Trimite la backend
    const res = await fetch("http://localhost:5001/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log("Backend Response:", data);

    if (data.success) {
  setMessage(
    `Gunoi detectat!`
  );
} else {
  setMessage(`Niciun gunoi detectat.`);
}

  } catch (err) {
    console.error(err);
    setMessage("A apărut o eroare la upload sau la ML.");
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
        Aici poți adăuga upload IPFS pentru NFT-uri.
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
          {loading ? <CircularProgress size={24} /> : "Upload și adaugă SUI"}
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
