import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Paper,
} from "@mui/material";
import { useWalletKit } from "@mysten/wallet-kit";
import { useQuery } from "@tanstack/react-query";
import { client } from "../services/suiClient";

export default function Transactions() {
  const { currentWallet, isConnected } = useWalletKit();
  const address = currentWallet?.accounts?.[0]?.address?.toLowerCase();

  const {
    data: txs,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["transactions", address],
    queryFn: async () => {
      if (!address) throw new Error("Address not found");

      const sent = await client.queryTransactionBlocks({
        filter: { FromAddress: address },
        limit: 50,
        order: "descending",
        options: { showEffects: true, showBalanceChanges: true },
      });

      const received = await client.queryTransactionBlocks({
        filter: { ToAddress: address },
        limit: 50,
        order: "descending",
        options: { showEffects: true, showBalanceChanges: true },
      });

      const merged = [...sent.data, ...received.data];

      merged.sort((a, b) => (b.timestampMs || 0) - (a.timestampMs || 0));

      const neuralolTxs = merged
        .map((tx) => {
          if (!tx.balanceChanges) return null;

          // Luăm doar NEURALOL
          const changes = tx.balanceChanges
            .filter((b) => b.coinType?.toLowerCase().includes("neuralol"))
            .map((b) => {
              const sign = sent.data.some((s) => s.digest === tx.digest)
                ? "-"
                : "+";
              return { sign, amount: Math.abs(b.amount) };
            });

          if (changes.length === 0) return null;

          return {
            digest: tx.digest,
            timestamp: tx.timestampMs,
            changes,
          };
        })
        .filter(Boolean);

      return neuralolTxs;
    },
    enabled: isConnected && !!address,
    retry: 3,
    refetchInterval: 15000,
  });

  if (!isConnected)
    return (
      <Typography>Conectează wallet-ul pentru a vedea tranzacțiile.</Typography>
    );
  if (isLoading)
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Se încarcă tranzacțiile...</Typography>
      </Box>
    );
  if (error)
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography color="error">Eroare: {error.message}</Typography>
        <Button onClick={refetch} variant="outlined" sx={{ mt: 2 }}>
          Reîncearcă
        </Button>
      </Box>
    );

  return (
    <Box sx={{ py: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        Tranzacții NEURALOL ({txs.length})
      </Typography>

      {txs.length === 0 ? (
        <Typography color="text.secondary">
          Nu există tranzacții NEURALOL.
        </Typography>
      ) : (
        <Box
          component="ul"
          sx={{
            m: 0,
            p: 0,
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {txs.map((tx, index) => (
            <Paper
              key={tx.digest + index}
              elevation={1}
              sx={{ p: 2, borderRadius: 2, bgcolor: "#f9f9f9" }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
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
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                {tx.digest}
              </a>

              {tx.changes.map((c, i) => (
                <Typography
                  key={i}
                  variant="body1"
                  sx={{
                    fontWeight: "bold",
                    color: c.sign === "+" ? "#2e7d32" : "#d32f2f",
                  }}
                >
                  {c.sign}
                  {c.amount} NEURALOL
                </Typography>
              ))}

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: "block" }}
              >
                {new Date(Number(tx.timestamp)).toLocaleString()}
              </Typography>
            </Paper>
          ))}
        </Box>
      )}

      <Button
        onClick={refetch}
        variant="contained"
        sx={{
          mt: 3,
          backgroundColor: "#2e7d32",
          color: "white",
          "&:hover": { backgroundColor: "#27632a" },
        }}
      >
        Refresh
      </Button>
    </Box>
  );
}
