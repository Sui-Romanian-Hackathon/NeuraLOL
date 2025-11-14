// src/components/Transactions.jsx
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import { useWalletKit } from "@mysten/wallet-kit";
import { useQuery } from "@tanstack/react-query";
import { client } from "../services/suiClient";

export default function Transactions() {
  const { currentWallet, isConnected } = useWalletKit();

  const address = currentWallet?.accounts?.[0]?.address;

  const {
    data: txs,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["transactions", address],
    queryFn: async () => {
      if (!address) throw new Error("Address not found");

      console.log("Caut tranzacții pentru:", address);

      const res = await client.queryTransactionBlocks({
        filter: {
          FromAddress: address,
        },
        limit: 20,
        order: "descending",
        options: {
          showInput: false,
          showEffects: false,
          showEvents: false,
          showBalanceChanges: false,
        },
      });

      console.log("Tranzacții:", res);

      return res?.data || [];
    },
    enabled: isConnected && !!address,
    retry: 3,
    refetchInterval: 12000,
  });

  if (!isConnected) {
    return (
      <Typography>Conectează wallet-ul pentru a vedea tranzacțiile.</Typography>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Se încarcă tranzacțiile...</Typography>
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
    <Box sx={{ py: 3 }}>
      <Typography variant="h5" gutterBottom>
        Ultimele tranzacții ({txs.length})
      </Typography>

      {txs.length === 0 ? (
        <Typography color="text.secondary">Nu există tranzacții.</Typography>
      ) : (
        <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none" }}>
          {txs.map((tx) => (
            <Box
              key={tx.digest}
              component="li"
              sx={{
                mb: 2,
                p: 2,
                bgcolor: "#f5f5f5",
                borderRadius: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Digest:
              </Typography>

              <a
                href={`https://suiscan.xyz/testnet/tx/${tx.digest}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#1976d2",
                  textDecoration: "none",
                  fontFamily: "monospace",
                  wordBreak: "break-all",
                }}
              >
                {tx.digest}
              </a>
            </Box>
          ))}
        </Box>
      )}

      <Button onClick={refetch} variant="outlined" sx={{ mt: 3 }}>
        Refresh
      </Button>
    </Box>
  );
}
