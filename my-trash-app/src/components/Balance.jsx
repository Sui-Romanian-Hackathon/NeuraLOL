// src/components/Balance.jsx
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import { useWalletKit } from "@mysten/wallet-kit";
import { useQuery } from "@tanstack/react-query";
import { client } from "../services/suiClient";

export default function Balance() {
  const { currentWallet, isConnected } = useWalletKit();
  const address = currentWallet?.accounts?.[0]?.address;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["allBalances", address],
    queryFn: async () => {
      if (!address) throw new Error("No address found");

      const res = await client.getAllBalances({ owner: address });

      return res.map((b) => {
        const coinType = b.coinType;
        let balanceDisplay;

        if (coinType === "0x2::sui::SUI") {
          balanceDisplay = Number(b.totalBalance) / 1_000_000_000;
        } else {
          balanceDisplay = Number(b.totalBalance);
        }

        return { coinType, balanceDisplay };
      });
    },
    enabled: isConnected && !!address,
    retry: 3,
    refetchInterval: 8000,
  });

  if (!isConnected) {
    return <Typography>Conectează wallet-ul</Typography>;
  }

  if (isLoading) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <CircularProgress size={60} thickness={4} />
        <Typography sx={{ mt: 2, fontWeight: 500 }}>
          Se încarcă soldurile...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography color="error">Eroare: {error.message}</Typography>
        <Button onClick={refetch} variant="outlined" sx={{ mt: 2 }}>
          Reîncearcă
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 6, px: { xs: 2, md: 8 } }}>
      {/* Titlu stilizat profesional, integrat cu Dashboard */}
      <Typography
        variant="h3"
        sx={{
          fontFamily: "serif",
          fontWeight: "bold",
          textAlign: "center",
          color: "#2e7d32",
          mb: 4,
          textShadow: "1px 1px 4px rgba(0,0,0,0.2)",
          borderBottom: "2px solid #c8e6c9",
          display: "inline-block",
          pb: 1,
        }}
      >
        Soldurile contului
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 4,
          mt: 4,
        }}
      >
        {data.map((token) => {
          const isSUI = token.coinType === "0x2::sui::SUI";

          return (
            <Card
              key={token.coinType}
              sx={{
                borderRadius: 3,
                boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
                },
                background: isSUI
                  ? "linear-gradient(135deg, #2196f3 0%, #90caf9 100%)"
                  : "linear-gradient(135deg, #9c27b0 0%, #e1bee7 100%)",
                color: "#fff",
              }}
            >
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                  {isSUI ? "SUI Balance" : "NEURALOL Balance"}
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    fontFamily: "monospace",
                    fontWeight: 700,
                    lineHeight: 1.2,
                  }}
                >
                  {token.balanceDisplay.toLocaleString(undefined, {
                    minimumFractionDigits: isSUI ? 6 : 0,
                    maximumFractionDigits: isSUI ? 6 : 0,
                  })}{" "}
                  {isSUI ? "SUI" : "NEURALOL"}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      <Box sx={{ textAlign: "center", mt: 6 }}>
        <Button
          onClick={refetch}
          variant="contained"
          sx={{
            px: 5,
            py: 1.8,
            fontWeight: "bold",
            fontSize: "1rem",
            borderRadius: 3,
            backgroundColor: "#2e7d32", // primaryGreen
            color: "#fff",
            transition: "all 0.2s",
            "&:hover": {
              backgroundColor: "#27632a",
              transform: "translateY(-2px)",
              boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
            },
            "&:active": {
              transform: "translateY(0)",
              boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
            },
          }}
        >
          Refresh
        </Button>
      </Box>
    </Box>
  );
}
