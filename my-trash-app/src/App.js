// src/App.js – FINAL + Detectare aplicație instalată pe mobil
import React, { useEffect, useState } from "react";
import {
  WalletKitProvider,
  ConnectButton,
  useWalletKit,
} from "@mysten/wallet-kit";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";
import {
  Tabs,
  Tab,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Select,
  MenuItem,
  useMediaQuery,
  useTheme,
  Grid,
  Button as MuiButton,
} from "@mui/material";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

// ---------- Detectare mobil ----------
function useIsMobile() {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down("md"));
}

// ---------- Detectare dacă Sui Wallet App este instalat ----------
function useIsSuiWalletAppInstalled() {
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Deep link către aplicație
    const deepLink = "suiwallet://connect";
    const fallbackTimeout = 1000; // ms

    const startTime = Date.now();

    // Încercăm să deschidem aplicația
    window.location.href = deepLink;

    // Dacă nu se deschide în 1 secundă → probabil nu e instalată
    const timer = setTimeout(() => {
      const timeElapsed = Date.now() - startTime;
      if (timeElapsed < fallbackTimeout + 100) {
        setIsInstalled(false); // Nu s-a deschis → nu e instalată
      }
    }, fallbackTimeout);

    // Dacă pagina se ascunde (aplicația se deschide), anulăm timeout-ul
    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearTimeout(timer);
        setIsInstalled(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return isInstalled;
}

// ---------- Sui Client ----------
const client = new SuiClient({ url: getFullnodeUrl("devnet") });
const queryClient = new QueryClient();

// ---------- Protected Route ----------
function ProtectedRoute({ children }) {
  const { currentWallet } = useWalletKit();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentWallet) {
      navigate("/", { replace: true });
    }
  }, [currentWallet, navigate]);

  return currentWallet ? children : <Navigate to="/" replace />;
}

// ---------- Home Page (Connect) ----------
function HomePage() {
  const { currentWallet } = useWalletKit();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const isSuiWalletInstalled = useIsSuiWalletAppInstalled();

  useEffect(() => {
    if (currentWallet) {
      navigate("/dashboard", { replace: true });
    }
  }, [currentWallet, navigate]);

  // Linkuri magazine
  const appStoreLink = "https://apps.apple.com/app/sui-wallet/id1663347150";
  const playStoreLink =
    "https://play.google.com/store/apps/details?id=com.mystenlabs.suiwallet";

  // Deep link către aplicație
  const openSuiWallet = () => {
    window.location.href = "suiwallet://connect";
  };

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 10 }}>
      <Typography variant="h4" gutterBottom>
        Conectează-te cu Sui Wallet
      </Typography>

      {isMobile ? (
        // === PE MOBIL ===
        <Box sx={{ mt: 4 }}>
          {isSuiWalletInstalled ? (
            // Aplicația ESTE instalată → permite conectare
            <>
              <Typography variant="body1" paragraph color="success.main">
                Sui Wallet detectat!
              </Typography>
              <ConnectButton />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 2, display: "block" }}
              >
                Apasă butonul de mai sus pentru a te conecta.
              </Typography>
            </>
          ) : (
            // Aplicația NU e instalată → ghidează spre descărcare
            <>
              <Typography variant="body1" paragraph>
                Instalează aplicația Sui Wallet pentru a te conecta.
              </Typography>

              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}
              >
                <MuiButton
                  variant="contained"
                  color="primary"
                  href={appStoreLink}
                  target="_blank"
                  size="large"
                  sx={{ py: 1.5 }}
                >
                  App Store
                </MuiButton>
                <MuiButton
                  variant="contained"
                  color="primary"
                  href={playStoreLink}
                  target="_blank"
                  size="large"
                  sx={{ py: 1.5 }}
                >
                  Google Play
                </MuiButton>
              </Box>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 4, display: "block" }}
              >
                După instalare, redeschide pagina și apasă „Connect”.
              </Typography>
            </>
          )}
        </Box>
      ) : (
        // === PE DESKTOP ===
        <>
          <ConnectButton />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
            Asigură-te că ai extensia Sui Wallet instalată.
          </Typography>
        </>
      )}
    </Container>
  );
}

// ---------- Tab Panel ----------
function TabPanel({ children, value, index }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// ---------- Dashboard (identic ca înainte) ----------
const TAB_PATHS = [
  "/dashboard/account",
  "/dashboard/transactions",
  "/dashboard/uploads",
  "/dashboard/balance",
  "/dashboard/nfts",
];
const TAB_LABELS = ["Cont", "Tranzacții", "Uploaduri", "Sold", "NFT"];

function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [value, setValue] = React.useState(0);

  useEffect(() => {
    const idx = TAB_PATHS.findIndex((path) =>
      location.pathname.startsWith(path)
    );
    if (idx !== -1) {
      setValue(idx);
    } else if (location.pathname === "/dashboard") {
      setValue(0);
      navigate("/dashboard/account", { replace: true });
    }
  }, [location.pathname, navigate]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(TAB_PATHS[newValue]);
  };

  const handleSelectChange = (event) => {
    const newValue = event.target.value;
    setValue(newValue);
    navigate(TAB_PATHS[newValue]);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        {isMobile ? (
          <Select
            value={value}
            onChange={handleSelectChange}
            fullWidth
            sx={{ mx: 2, my: 1 }}
          >
            {TAB_LABELS.map((label, idx) => (
              <MenuItem key={idx} value={idx}>
                {label}
              </MenuItem>
            ))}
          </Select>
        ) : (
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ px: 2 }}
          >
            {TAB_LABELS.map((label, idx) => (
              <Tab key={idx} label={label} />
            ))}
          </Tabs>
        )}
      </Box>

      <TabPanel value={value} index={0}>
        <Account />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Transactions />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Uploads />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Balance />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <NFTs />
      </TabPanel>
    </Box>
  );
}

// ---------- Account ----------
function Account() {
  const { currentWallet, disconnect } = useWalletKit();

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Contul Meu
      </Typography>
      <Typography>
        <strong>Adresă:</strong>{" "}
        <Box
          component="span"
          sx={{ fontFamily: "monospace", fontSize: "0.9em" }}
        >
          {currentWallet?.address}
        </Box>
      </Typography>

      <Box sx={{ mt: 3 }}>
        <MuiButton
          variant="contained"
          color="error"
          onClick={handleDisconnect}
          size="large"
          sx={{ px: 4, py: 1.5 }}
        >
          Deconectează Wallet
        </MuiButton>
      </Box>
    </>
  );
}

// ---------- Transactions, Balance, NFTs, Uploads ----------
function Transactions() {
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

function Balance() {
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

function NFTs() {
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

function Uploads() {
  return (
    <>
      <Typography variant="h5" gutterBottom>
        Uploaduri
      </Typography>
      <Typography color="text.secondary">
        Aici poți adăuga upload IPFS pentru NFT-uri.
      </Typography>
    </>
  );
}

// ---------- Routing ----------
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <Container maxWidth={false} sx={{ mt: 3, px: { xs: 1, sm: 3 } }}>
              <Dashboard />
            </Container>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// ---------- Root ----------
export default function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletKitProvider
        autoConnect={false}
        chains={["sui:devnet"]}
        enableMobileWallets={true} // Necesare pentru detectare
      >
        <Router>
          <AppRoutes />
        </Router>
      </WalletKitProvider>
    </QueryClientProvider>
  );
}
