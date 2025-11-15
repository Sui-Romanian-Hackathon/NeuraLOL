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

const TAB_PATHS = [
  "/dashboard/account",
  "/dashboard/transactions",
  "/dashboard/uploads",
  "/dashboard/balance",
  "/dashboard/nfts",
];

const TAB_LABELS = ["Cont", "Tranzacții", "Uploaduri", "Sold", "NFT"];

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { currentWallet, isConnected } = useWalletKit();

  const walletAddress = currentWallet?.accounts?.[0]?.address;

  const [value, setValue] = useState(0);

  useEffect(() => {
    const idx = TAB_PATHS.findIndex((p) => location.pathname.startsWith(p));

    if (idx !== -1) setValue(idx);
    else if (location.pathname === "/dashboard")
      navigate("/dashboard/account", { replace: true });
  }, [location.pathname, navigate]);

  const handleChange = (_, newValue) => {
    setValue(newValue);
    navigate(TAB_PATHS[newValue]);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
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
