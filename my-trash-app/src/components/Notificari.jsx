// src/components/Notificari.js
import React from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";

export default function Notificari() {
  const mockNotifications = [
    { id: 1, message: "Ai primit 10 puncte pentru uploadul imaginii" },
    { id: 2, message: "Un NFT a fost adăugat în portofelul tău" },
    { id: 3, message: "Tranzacția ta a fost finalizată" },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Notificări
      </Typography>
      <List>
        {mockNotifications.map((notif) => (
          <ListItem key={notif.id}>
            <ListItemText primary={notif.message} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
