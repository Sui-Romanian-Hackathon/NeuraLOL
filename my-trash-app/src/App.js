import { WalletKitProvider } from "@mysten/wallet-kit";
import { BrowserRouter as Router } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRoutes from "./routes/AppRoutes";
// ---------- Sui Client ----------

const queryClient = new QueryClient();

// ---------- Root ----------
export default function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletKitProvider
        autoConnect={false}
        chains={["sui:testnet"]}
        enableMobileWallets={true} // Necesare pentru detectare
      >
        <Router>
          <AppRoutes />
        </Router>
      </WalletKitProvider>
    </QueryClientProvider>
  );
}
