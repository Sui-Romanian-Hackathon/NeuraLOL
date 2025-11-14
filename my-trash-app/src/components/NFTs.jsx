import { Typography, Grid, Box } from "@mui/material";
import { useWalletKit } from "@mysten/wallet-kit";
import { useQuery } from "@tanstack/react-query";
import { client } from "../services/suiClient";

export default function NFTs() {
  const { currentWallet } = useWalletKit();

  const { data, isLoading, error } = useQuery({
    queryKey: ["nfts", currentWallet?.address],
    queryFn: async () => {
      if (!currentWallet?.address) return [];
      const objs = await client.getOwnedObjects({
        owner: currentWallet.address,
        options: { showType: true, showDisplay: true, showContent: true },
      });

      return (
        objs.data.filter((o) => {
          const d = o.data?.display?.data;
          return d?.name || o.data?.type?.includes("nft");
        }) || []
      );
    },
    enabled: !!currentWallet?.address,
  });

  if (isLoading) return <Typography>Încărcare NFT-uri...</Typography>;
  if (error)
    return <Typography color="error">Eroare: {error.message}</Typography>;

  return (
    <>
      <Typography variant="h5" gutterBottom>
        NFT-urile tale
      </Typography>

      {data?.length ? (
        <Grid container spacing={2}>
          {data.map((nft) => {
            const d = nft.data?.display?.data;
            const img =
              d?.image_url || d?.url || "https://via.placeholder.com/180";

            return (
              <Grid item xs={6} sm={4} md={3} key={nft.data?.objectId}>
                <Box
                  sx={{
                    border: "1px solid #ddd",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={img}
                    alt={d?.name}
                    style={{ width: "100%", height: 150, objectFit: "cover" }}
                  />
                  <Typography sx={{ p: 1, fontWeight: "bold" }}>
                    {d?.name || "Fără nume"}
                  </Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Typography>Nu deții NFT-uri.</Typography>
      )}
    </>
  );
}
