// Footer.jsx
import React from "react";
import { Box, Typography } from "@mui/material";

import logo1 from "../assets/sponsorLogo1.png";
import logo2 from "../assets/sponsorLogo1.png";
import logo3 from "../assets/sponsorLogo1.png";
import logo4 from "../assets/sponsorLogo2.jpg";
import logo5 from "../assets/sponsorLogo2.jpg";

export default function Footer() {
  const logos = [logo1, logo2, logo3, logo4, logo5];

  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        backgroundColor: "#ffffff",
        borderTop: "1px solid rgba(0,0,0,0.08)",
        mt: 6,
        py: 4,
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: 3,
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(3, 1fr)",
            md: "repeat(5, 1fr)",
          },
          alignItems: "center",
          justifyItems: "center",
          gap: 4,
          mb: 3,
        }}
      >
        {logos.map((src, idx) => (
          <Box
            key={idx}
            component="img"
            src={src}
            alt="sponsor"
            loading="lazy"
            sx={{
              height: 45,
              maxWidth: "120px",
              filter: "grayscale(100%)",
              opacity: 0.8,
              transition: "0.3s",
              "&:hover": {
                opacity: 1,
                filter: "none",
              },
            }}
          />
        ))}
      </Box>

      <Typography
        variant="body2"
        sx={{
          textAlign: "center",
          color: "rgba(0,0,0,0.6)",
          fontFamily: "serif",
          fontSize: "0.9rem",
        }}
      >
        © 2025 NeuraLOL — All Rights Reserved
      </Typography>
    </Box>
  );
}
