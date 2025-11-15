// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Select,
  MenuItem,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import { useWalletKit } from "@mysten/wallet-kit";

import TabPanel from "../components/TabPanel";
import Account from "../components/Account";
import Transactions from "../components/Transactions";
import Uploads from "../components/Uploads";
import Balance from "../components/Balance";
import NFTs from "../components/NFTs";
import Clasament from "../components/Clasament";
import Notificari from "../components/Notificari";
import { useUser } from "../context/UserContext";
import Raportari from "../components/Raportari";
import StatusSesizari from "../components/StatusSesizari";
import Statistici from "../components/Statistici";


// Component pentru selectarea tipului de utilizator
function UserTypeSelector() {
  const { userType, setUserType } = useUser();

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Typography variant="body1" color="white">
        Tip utilizator:
      </Typography>
      <Select
        value={userType}
        onChange={(e) => setUserType(e.target.value)}
        size="small"
        sx={{ color: "white", borderColor: "white" }}
      >
        <MenuItem value="user">Utilizator</MenuItem>
        <MenuItem value="admin">Admin</MenuItem>
      </Select>
    </Box>
  );
}

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { currentWallet, isConnected } = useWalletKit();

  const walletAddress = currentWallet?.accounts?.[0]?.address;

  const [value, setValue] = useState(0);

  // Definim tab-urile în funcție de tipul utilizatorului
  const allTabs = {
    user: [
      { label: "Cont", path: "/dashboard/account", component: <Account /> },
      { label: "Tranzacții", path: "/dashboard/transactions", component: <Transactions /> },
      { label: "Uploaduri", path: "/dashboard/uploads", component: <Uploads /> },
      { label: "Sold", path: "/dashboard/balance", component: <Balance /> },
      { label: "NFT", path: "/dashboard/nfts", component: <NFTs /> },
      { label: "Clasament", path: "/dashboard/clasament", component: <Clasament /> },
      { label: "Notificări", path: "/dashboard/notificari", component: <Notificari /> },

    ],
    admin: [
      { label: "Cont", path: "/dashboard/account", component: <Account /> },
      { label: "Tranzacții", path: "/dashboard/transactions", component: <Transactions /> },
      { label: "Sold", path: "/dashboard/balance", component: <Balance /> },
      { label: "NFT", path: "/dashboard/nfts", component: <NFTs /> },
      { label: "Clasament", path: "/dashboard/clasament", component: <Clasament /> },
      { label: "Notificări", path: "/dashboard/notificari", component: <Notificari /> },
      { label: "Raportări", path: "/dashboard/raportari", component: <Raportari /> },
    { label: "Status Sesizări", path: "/dashboard/status-sesizari", component: <StatusSesizari /> },
    { label: "Statistici", path: "/dashboard/statistici", component: <Statistici /> },
    ],
  };

  const tabs = allTabs[userType] || allTabs.user;

  const TAB_PATHS = tabs.map((t) => t.path);
  const TAB_LABELS = tabs.map((t) => t.label);

  // Sincronizare tab cu URL
  useEffect(() => {
    const idx = TAB_PATHS.findIndex((p) => location.pathname.startsWith(p));
    if (idx !== -1) setValue(idx);
    else if (location.pathname === "/dashboard") navigate(TAB_PATHS[0], { replace: true });
  }, [location.pathname, navigate, TAB_PATHS]);

  const handleChange = (_, newValue) => {
    setValue(newValue);
    navigate(TAB_PATHS[newValue]);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">Dashboard</Typography>
          <UserTypeSelector /> {/* Selector tip utilizator */}
        </Toolbar>
      </AppBar>

      {isMobile ? (
        <Select value={value} onChange={handleChange} fullWidth>
          {TAB_LABELS.map((label, idx) => (
            <MenuItem key={label} value={idx}>
              {label}
            </MenuItem>
          ))}
        </Select>
      ) : (
        <Tabs value={value} onChange={handleChange}>
          {TAB_LABELS.map((label) => (
            <Tab key={label} label={label} />
          ))}
        </Tabs>
      )}

      <TabPanel value={value} index={0}>
        <Account />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Transactions />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Uploads walletAddress={walletAddress} />
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
