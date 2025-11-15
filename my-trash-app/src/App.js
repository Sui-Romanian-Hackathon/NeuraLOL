import { WalletKitProvider } from "@mysten/wallet-kit";
import { BrowserRouter as Router } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRoutes from "./routes/AppRoutes";
import { UserProvider } from "./context/UserContext"; // <-- import

const queryClient = new QueryClient();

export default function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletKitProvider
        autoConnect={false}
        chains={["sui:testnet"]}
        enableMobileWallets={true} // Necesare pentru detectare
      >
        <UserProvider> {/* <-- învelim totul */}
          <Router>
            <AppRoutes />
          </Router>
        </UserProvider>
      </WalletKitProvider>
    </QueryClientProvider>
  );
}
