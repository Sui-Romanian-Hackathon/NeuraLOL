// src/components/Clasament.js
import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

export default function Clasament() {
  const leaderboard = [
    { id: 1, name: "Alice", score: 950 },
    { id: 2, name: "Bob", score: 880 },
    { id: 3, name: "Charlie", score: 850 },
    { id: 4, name: "David", score: 800 },
    { id: 5, name: "Eve", score: 780 },
  ];

  const getColorByRank = (rank) => {
    switch (rank) {
      case 1:
        return "#FFD700"; // Aur
      case 2:
        return "#C0C0C0"; // Argint
      case 3:
        return "#CD7F32"; // Bronz
      default:
        return "#e8f5e9"; // Alte locuri
    }
  };

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
        Clasament
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {leaderboard.map((player, index) => (
          <Paper
            key={player.id}
            elevation={3}
            sx={{
              p: 2,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              bgcolor: getColorByRank(index + 1),
              color: index < 3 ? "#fff" : "#2e7d32",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {index < 3 && <EmojiEventsIcon fontSize="large" />}
              <Typography
                variant="h6"
                sx={{ fontFamily: "serif", fontWeight: "bold" }}
              >
                {index + 1}. {player.name}
              </Typography>
            </Box>
            <Typography
              variant="h6"
              sx={{ fontFamily: "serif", fontWeight: "bold" }}
            >
              {player.score} Puncte
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
