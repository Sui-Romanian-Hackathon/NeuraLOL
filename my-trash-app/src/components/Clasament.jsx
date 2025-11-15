import React from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";

export default function Clasament() {
  // Aici vei pune datele reale luate din backend când vrei
  const mockUsers = [
    { name: "Bianca", points: 120 },
    { name: "Alex", points: 95 },
    { name: "Maria", points: 80 },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Clasament utilizatori activi
      </Typography>

      <List>
        {mockUsers.map((user, idx) => (
          <ListItem key={idx}>
            <ListItemText
              primary={`${idx + 1}. ${user.name}`}
              secondary={`Puncte: ${user.points}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
