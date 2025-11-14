import { Typography, Box } from "@mui/material";
import { useWalletKit } from "@mysten/wallet-kit";
import { useQuery } from "@tanstack/react-query";
import { client } from "../services/suiClient";

export default function Transactions() {
  const { currentWallet } = useWalletKit();

  const { data, isLoading, error } = useQuery({
    queryKey: ["txs", currentWallet?.address],
    queryFn: async () => {
      if (!currentWallet?.address) return [];
      const resp = await client.getTransactionDigests({
        filter: { FromAddress: currentWallet.address },
        order: "descending",
        limit: 10,
      });
      return resp.data || [];
    },
    enabled: !!currentWallet?.address,
  });

  if (isLoading) return <Typography>Încărcare...</Typography>;
  if (error)
    return <Typography color="error">Eroare: {error.message}</Typography>;

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Ultimele 10 tranzacții
      </Typography>

      {data?.length ? (
        <Box component="ul" sx={{ pl: 2 }}>
          {data.map((tx) => (
            <li key={tx.digest}>
              <a
                href={`https://suiscan.xyz/devnet/tx/${tx.digest}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#1976d2" }}
              >
                {tx.digest.slice(0, 8)}...{tx.digest.slice(-6)}
              </a>
            </li>
          ))}
        </Box>
      ) : (
        <Typography>Nu există tranzacții.</Typography>
      )}
    </>
  );
}
