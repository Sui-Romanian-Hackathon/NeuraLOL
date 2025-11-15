import React from "react";
import { Box, Typography } from "@mui/material";

export default function StatusSesizari() {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5">Status Sesizări</Typography>
      <Typography>Vizualizează starea fiecărei sesizări: în curs, rezolvată, ignorată.</Typography>
    </Box>
  );
}
