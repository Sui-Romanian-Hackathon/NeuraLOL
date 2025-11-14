import { Typography, Box, Button as MuiButton } from "@mui/material";
import { useWalletKit } from "@mysten/wallet-kit";

export default function Account() {
  const { currentWallet, disconnect } = useWalletKit();

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Contul Meu
      </Typography>

      <Typography>
        <strong>Adresă:</strong>{" "}
        <Box
          component="span"
          sx={{ fontFamily: "monospace", fontSize: "0.9em" }}
        >
          {currentWallet?.address}
        </Box>
      </Typography>

      <Box sx={{ mt: 3 }}>
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
    </>
  );
}
