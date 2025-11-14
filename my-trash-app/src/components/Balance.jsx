// src/components/Balance.jsx
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import { useWalletKit } from "@mysten/wallet-kit";
import { useQuery } from "@tanstack/react-query";
import { client } from "../services/suiClient";

export default function Balance() {
  const { currentWallet, isConnected } = useWalletKit(); // ← AICI e cheia!!!

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["balance", currentWallet?.accounts?.[0]?.address],
    queryFn: async () => {
      const address = currentWallet?.accounts?.[0]?.address;
      if (!address) throw new Error("No address found");

      console.log("Citeste sold pentru adresa:", address); // debug
      const res = await client.getBalance({
        owner: address,
        coinType: "0x2::sui::SUI",
      });
      console.log("Raw balance:", res);
      return Number(res.totalBalance) / 1_000_000_000;
    },
    enabled: isConnected && !!currentWallet?.accounts?.[0]?.address, // ← așteaptă adresa reală
    retry: 3,
    refetchInterval: 8000,
  });

  if (!isConnected) {
    return <Typography>Conectează wallet-ul</Typography>;
  }

  if (isLoading) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <CircularProgress />
        <Typography>Se încarcă soldul...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography color="error">Eroare: {error.message}</Typography>
        <Button onClick={() => refetch()} variant="outlined" sx={{ mt: 2 }}>
          Reîncearcă
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ textAlign: "center", py: 8 }}>
      <Typography variant="h5" color="text.secondary" gutterBottom>
        Sold curent (Testnet)
      </Typography>
      <Typography variant="h1" color="primary" sx={{ fontWeight: "bold" }}>
        {data?.toFixed(6) ?? "0.000000"} SUI
      </Typography>
      <Button onClick={() => refetch()} variant="outlined" sx={{ mt: 3 }}>
        Refresh
      </Button>
    </Box>
  );
}
