import React from "react";
import {
  Typography,
  Box,
  Button as MuiButton,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useWalletKit } from "@mysten/wallet-kit";
import { useUser } from "../context/UserContext";

export default function Account() {
  const { currentWallet, disconnect } = useWalletKit();
  const { user, setUser } = useUser();

  const handleDisconnect = () => disconnect();

  const handleCopy = (text) => navigator.clipboard.writeText(text);

  const handleChange = (field, value) => {
    setUser({ ...user, [field]: value });
  };

  const fields = [
    {
      label: "Adresă Wallet",
      value: currentWallet?.accounts?.[0]?.address ?? "Necunoscut",
      editable: false,
    },
    {
      label: "Email",
      value: user?.email ?? "Necunoscut",
      editable: true,
      key: "email",
    },
    {
      label: "Nume utilizator",
      value: user?.name ?? "Necunoscut",
      editable: true,
      key: "name",
    },
    {
      label: "Tip cont",
      value: user?.userType ?? "Necunoscut",
      editable: true,
      key: "userType",
    },
  ];

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", p: { xs: 2, md: 4 } }}>
      <Typography
        variant="h4"
        sx={{
          fontFamily: "serif",
          fontWeight: "bold",
          color: "#2e7d32",
          mb: 4,
        }}
      >
        Contul Meu
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {fields.map((field) => (
          <Paper
            key={field.label}
            elevation={2}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
              borderRadius: 2,
              bgcolor: "#f1f8e9",
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: "bold", color: "#33691e" }}>
                {field.label}
              </Typography>

              {field.editable ? (
                <input
                  type="text"
                  value={field.value}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  style={{
                    width: "100%",
                    padding: "6px 8px",
                    borderRadius: 4,
                    border: "1px solid #ccc",
                    fontFamily: "serif",
                    marginTop: 4,
                  }}
                />
              ) : (
                <Typography
                  sx={{
                    fontFamily:
                      field.label === "Adresă Wallet" ? "monospace" : "inherit",
                    wordBreak: "break-all",
                    mt: 1,
                  }}
                >
                  {field.value}
                </Typography>
              )}
            </Box>

            <Tooltip title="Copy">
              <IconButton onClick={() => handleCopy(field.value)}>
                <ContentCopyIcon sx={{ color: "#2e7d32" }} />
              </IconButton>
            </Tooltip>
          </Paper>
        ))}
      </Box>

      <Box sx={{ mt: 4, textAlign: "center" }}>
        <MuiButton
          variant="contained"
          color="error"
          onClick={handleDisconnect}
          size="large"
          sx={{ px: 4, py: 1.5 }}
        >
          Deconectează Wallet
        </MuiButton>
      </Box>
    </Box>
  );
}
