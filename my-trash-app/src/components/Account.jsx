import { Typography, Box, Button as MuiButton } from "@mui/material";
import { useWalletKit } from "@mysten/wallet-kit";

export default function Account() {
  const { currentWallet, disconnect } = useWalletKit();

  const handleDisconnect = () => disconnect();
  const primaryGreen = "#2e7d32";

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "70vh",
        py: 0, 
        px: 0, 
        display: "flex",
        flexDirection: "column",
        gap: 2,
        // Asigură că fundalul este transparent și se potrivește cu Dashboard-ul
        backgroundColor: "transparent",
      }}
    >
      <Typography
        variant="h4"
        sx={{ color: primaryGreen, fontWeight: "bold", fontFamily: "serif" }}
      >
        Contul Meu
      </Typography>

      <Typography sx={{ fontSize: "1.1rem", fontFamily: "serif" }}>
        <strong>Adresă Wallet:</strong> {currentWallet?.address || "Wallet neconectat"}
      </Typography>

      <MuiButton
        variant="contained"
        sx={{
          mt: 2,
          width: "250px",
          backgroundColor: primaryGreen,
          color: "white",
          "&:hover": { backgroundColor: "#1b5e20" },
          textTransform: "none",
          fontFamily: "serif",
        }}
        onClick={handleDisconnect}
      >
        Deconectează Wallet
      </MuiButton>

      <Typography
        variant="h5"
        sx={{ mt: 4, color: primaryGreen, fontWeight: "bold", fontFamily: "serif" }}
      >
        Statistici
      </Typography>

      <Typography sx={{ fontFamily: "serif", color: "black" }}>
        - Tokenuri câștigate: 120
      </Typography>
      <Typography sx={{ fontFamily: "serif", color: "black" }}>
        - Raportări active: 15
      </Typography>
    </Box>
  );
}