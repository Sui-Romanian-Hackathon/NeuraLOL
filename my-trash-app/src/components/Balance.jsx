import { Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useWalletKit } from "@mysten/wallet-kit";
import { client } from "../services/suiClient";

export default function Balance() {
  const { currentWallet } = useWalletKit();

  const { data, isLoading, error } = useQuery({
    queryKey: ["balance", currentWallet?.address],
    queryFn: async () => {
      if (!currentWallet?.address) return 0;
      const bal = await client.getBalance({ owner: currentWallet.address });
      return Number(bal.totalBalance) / 1_000_000_000;
    },
    enabled: !!currentWallet?.address,
  });

  if (isLoading) return <Typography>Încărcare sold...</Typography>;
  if (error)
    return <Typography color="error">Eroare: {error.message}</Typography>;

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Sold curent
      </Typography>
      <Typography variant="h3" color="primary">
        {data?.toFixed(6)} SUI
      </Typography>
    </>
  );
}
