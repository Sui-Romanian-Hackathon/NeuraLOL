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

      // 🟦 1. Tranzacții trimise
      const sent = await client.queryTransactionBlocks({
        filter: { FromAddress: address },
        limit: 50,
        order: "descending",
        options: {
          showEffects: true,
          showBalanceChanges: true,
          showInput: true,
          showObjectChanges: true,
        },
      });

      // 🟩 2. Tranzacții primite
      const received = await client.queryTransactionBlocks({
        filter: { ToAddress: address },
        limit: 50,
        order: "descending",
        options: {
          showEffects: true,
          showBalanceChanges: true,
          showInput: true,
          showObjectChanges: true,
        },
      });

      // 🟧 3. Combinație + sortare după timp
      const merged = [...sent.data, ...received.data];

      merged.sort((a, b) => {
        const ta = new Date(a.timestampMs || 0).getTime();
        const tb = new Date(b.timestampMs || 0).getTime();
        return tb - ta;
      });

      // 🟨 4. Filtrare strict NeuraLOL
      const neuralolTxs = merged.filter((tx) => {
        const hasCoin = tx.balanceChanges?.some((b) =>
          b.coinType?.toLowerCase().includes("neuralol")
        );
        const hasObject = tx.objectChanges?.some((o) =>
          o.type?.toLowerCase().includes("neuralol")
        );
        return hasCoin || hasObject;
      });

      console.log("Tranzacții NeuraLOL:", neuralolTxs);

      return neuralolTxs;
    },
    enabled: isConnected && !!address,
    retry: 3,
    refetchInterval: 15000,
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
        Tranzacții NeuraLOL ({txs.length})
      </Typography>

      {txs.length === 0 ? (
        <Typography color="text.secondary">
          Nu există tranzacții NeuraLOL.
        </Typography>
      ) : (
        <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none" }}>
          {txs.map((tx, index) => (
            <Box
              key={tx.digest + index} // index adăugat ca fallback pentru duplicate digest
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

              {tx.balanceChanges?.map((b, i) => (
                <Typography key={i} variant="body2">
                  {b.amount > 0 ? "+" : ""}
                  {b.amount} {b.coinType?.split("::").pop()}
                </Typography>
              ))}
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
