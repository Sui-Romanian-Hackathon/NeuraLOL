// Merged Dashboard.js – Stilizare profesionistă
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
  Button,
} from "@mui/material";

import { useWalletKit } from "@mysten/wallet-kit";

import logoImage from "./Gemini_Generated_Image_361i7d361i7d361i.png";
import backgroundImage from "./backround.png";

import TabPanel from "../components/TabPanel";
import Account from "../components/Account";
import Transactions from "../components/Transactions";
import Uploads from "../components/Uploads";
import Balance from "../components/Balance";
import NFTs from "../components/NFTs";
import Clasament from "../components/Clasament";
import Notificari from "../components/Notificari";
import Raportari from "../components/Raportari";
import StatusSesizari from "../components/StatusSesizari";
import Statistici from "../components/Statistici";
import { useUser } from "../context/UserContext";

const primaryGreen = "#2e7d32";
const lightGreen = "#e8f5e9";
const secondaryGreen = "#c8e6c9";
const heroOverlay = "rgba(46,125,50,0.65)";

function UserTypeSelector() {
  const { userType, setUserType } = useUser();
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Typography
        variant="subtitle1"
        sx={{ fontFamily: "serif", fontWeight: "500", color: "#333" }}
      >
        Tip utilizator:
      </Typography>
      <Select
        value={userType}
        onChange={(e) => setUserType(e.target.value)}
        size="small"
        sx={{
          color: "#333",
          borderColor: "#333",
          ".MuiOutlinedInput-notchedOutline": { borderColor: "#333" },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#333",
          },
          fontFamily: "serif",
          backgroundColor: "#fff",
        }}
      >
        <MenuItem value="user" sx={{ fontFamily: "serif" }}>
          Utilizator
        </MenuItem>
        <MenuItem value="admin" sx={{ fontFamily: "serif" }}>
          Admin
        </MenuItem>
      </Select>
    </Box>
  );
}

export default function Dashboard() {
  const { userType } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { currentWallet } = useWalletKit();
  const walletAddress = currentWallet?.accounts?.[0]?.address;

  const [value, setValue] = useState(0);

  const allTabs = {
    user: [
      { label: "Cont", path: "/dashboard/account", component: <Account /> },
      {
        label: "Tranzacții",
        path: "/dashboard/transactions",
        component: <Transactions />,
      },
      {
        label: "Uploaduri",
        path: "/dashboard/uploads",
        component: <Uploads walletAddress={walletAddress} />,
      },
      { label: "Sold", path: "/dashboard/balance", component: <Balance /> },
      { label: "NFT", path: "/dashboard/nfts", component: <NFTs /> },
      {
        label: "Clasament",
        path: "/dashboard/clasament",
        component: <Clasament />,
      },
      {
        label: "Notificări",
        path: "/dashboard/notificari",
        component: <Notificari />,
      },
    ],
    admin: [
      { label: "Cont", path: "/dashboard/account", component: <Account /> },
      {
        label: "Tranzacții",
        path: "/dashboard/transactions",
        component: <Transactions />,
      },
      {
        label: "Uploaduri",
        path: "/dashboard/uploads",
        component: <Uploads walletAddress={walletAddress} />,
      },
      { label: "Sold", path: "/dashboard/balance", component: <Balance /> },
      { label: "NFT", path: "/dashboard/nfts", component: <NFTs /> },
      {
        label: "Clasament",
        path: "/dashboard/clasament",
        component: <Clasament />,
      },
      {
        label: "Notificări",
        path: "/dashboard/notificari",
        component: <Notificari />,
      },
      {
        label: "Raportări",
        path: "/dashboard/raportari",
        component: <Raportari />,
      },
      {
        label: "Status Sesizări",
        path: "/dashboard/status-sesizari",
        component: <StatusSesizari />,
      },
      {
        label: "Statistici",
        path: "/dashboard/statistici",
        component: <Statistici />,
      },
    ],
  };

  const tabs = allTabs[userType] || allTabs.user;
  const TAB_PATHS = tabs.map((t) => t.path);
  const TAB_LABELS = tabs.map((t) => t.label);

  useEffect(() => {
    const idx = TAB_PATHS.findIndex((p) => location.pathname.startsWith(p));
    if (idx !== -1) setValue(idx);
    else if (location.pathname === "/dashboard")
      navigate(TAB_PATHS[0], { replace: true });
  }, [location.pathname, navigate, TAB_PATHS]);

  const handleChange = (_, newValue) => {
    setValue(newValue);
    navigate(TAB_PATHS[newValue]);
  };

  return (
    <Box
      sx={{ width: "100%", minHeight: "100vh", backgroundColor: lightGreen }}
    >
      {/* HEADER */}
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#fff",
          color: "#333",
          boxShadow: "0 3px 6px rgba(0,0,0,0.08)",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            maxWidth: 1200,
            margin: "0 auto",
            width: "100%",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              component="img"
              src={logoImage}
              alt="Logo"
              sx={{ width: 70, height: 70 }}
            />
            <Typography
              variant="h5"
              sx={{
                fontFamily: "serif",
                fontWeight: "700",
                color: primaryGreen,
              }}
            >
              CleanScan
            </Typography>
          </Box>
          {!isMobile && <UserTypeSelector />}
        </Toolbar>
      </AppBar>

      {/* HERO */}
      <Box sx={{ position: "relative", textAlign: "center", py: 10 }}>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.75)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: heroOverlay,
          }}
        />
        <Box sx={{ position: "relative", zIndex: 2, color: "white", px: 3 }}>
          <Typography
            variant="h3"
            sx={{ fontFamily: "serif", fontWeight: "700", mb: 2 }}
          >
            Curated Sustainability for Responsible Citizens
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontFamily: "serif", maxWidth: 600, mx: "auto", mb: 4 }}
          >
            Descoperiți progresul, raportați problemele și câștigați recompense
            pentru un mediu mai curat.
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              sx={{
                backgroundColor: secondaryGreen,
                color: "#333",
                fontWeight: "600",
                px: 4,
                py: 1.5,
                borderRadius: 3,
                "&:hover": {
                  backgroundColor: "#b2dfbb",
                  transform: "translateY(-2px)",
                },
              }}
              onClick={() => navigate(TAB_PATHS[1])}
            >
              Vezi Progresul
            </Button>
            <Button
              variant="outlined"
              sx={{
                color: "white",
                borderColor: "white",
                fontWeight: "bold",
                borderRadius: 2,
                px: 4,
                py: 1.5,
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderColor: "white",
                },
              }}
              onClick={() => navigate("/dashboard/uploads")}
            >
              Raportează o Problemă
            </Button>
          </Box>
        </Box>
      </Box>

      {/* TABS */}
      {isMobile ? (
        <Select
          value={value}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2, px: 2 }}
        >
          {TAB_LABELS.map((label, idx) => (
            <MenuItem key={label} value={idx}>
              {label}
            </MenuItem>
          ))}
        </Select>
      ) : (
        <Tabs
          value={value}
          onChange={handleChange}
          sx={{
            backgroundColor: lightGreen,
            "& .MuiTab-root": { textTransform: "none", fontWeight: "600" },
            "& .Mui-selected": { color: primaryGreen },
          }}
        >
          {TAB_LABELS.map((label) => (
            <Tab key={label} label={label} />
          ))}
        </Tabs>
      )}

      {/* TAB PANELS */}
      {tabs.map((tab, idx) => (
        <TabPanel key={tab.path} value={value} index={idx}>
          <Box sx={{ maxWidth: 1200, mx: "auto", pt: 4 }}>{tab.component}</Box>
        </TabPanel>
      ))}
    </Box>
  );
}
