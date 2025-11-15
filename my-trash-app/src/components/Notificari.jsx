// src/components/Notificari.js
import React from "react";
import { Box, Typography, Paper } from "@mui/material";

export default function Notificari() {
  const mockNotifications = [
    { id: 1, message: "Ai primit 10 puncte pentru uploadul imaginii" },
    { id: 2, message: "Un NFT a fost adăugat în portofelul tău" },
    { id: 3, message: "Tranzacția ta a fost finalizată" },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 800, mx: "auto" }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontFamily: "serif",
          fontWeight: "bold",
          color: "#2e7d32",
          mb: 3,
        }}
      >
        Notificări
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {mockNotifications.map((notif) => (
          <Paper
            key={notif.id}
            elevation={2}
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: "#f1f8e9",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              },
            }}
          >
            <Typography
              variant="body1"
              sx={{ fontFamily: "serif", color: "#33691e" }}
            >
              {notif.message}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
