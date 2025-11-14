import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWalletKit, ConnectButton } from "@mysten/wallet-kit";
import { Container, Typography, Box, Button as MuiButton } from "@mui/material";
import useIsMobile from "../hooks/useIsMobile";
import useIsSuiWalletAppInstalled from "../hooks/useIsSuiWalletAppInstalled";

export default function HomePage() {
  const { currentWallet } = useWalletKit();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const isSuiWalletInstalled = useIsSuiWalletAppInstalled();

  useEffect(() => {
    if (currentWallet) navigate("/dashboard", { replace: true });
  }, [currentWallet, navigate]);

  const appStoreLink = "https://apps.apple.com/app/sui-wallet/id1663347150";
  const playStoreLink =
    "https://play.google.com/store/apps/details?id=com.mystenlabs.suiwallet";

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 10 }}>
      <Typography variant="h4" gutterBottom>
        Conectează-te cu Sui Wallet
      </Typography>

      {isMobile ? (
        <>
          {isSuiWalletInstalled ? (
            <>
              <Typography variant="body1" paragraph color="success.main">
                Sui Wallet detectat!
              </Typography>
              <ConnectButton />
            </>
          ) : (
            <>
              <Typography variant="body1" paragraph>
                Instalează aplicația Sui Wallet pentru a te conecta.
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <MuiButton variant="contained" href={appStoreLink}>
                  App Store
                </MuiButton>
                <MuiButton variant="contained" href={playStoreLink}>
                  Google Play
                </MuiButton>
              </Box>
            </>
          )}
        </>
      ) : (
        <>
          <ConnectButton />
        </>
      )}
    </Container>
  );
}
