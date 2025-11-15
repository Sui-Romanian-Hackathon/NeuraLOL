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

// Import imagini
import logoImage from "./Gemini_Generated_Image_361i7d361i7d361i.png";
import backgroundImage from "./backround.png"; // fundal Hero

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

const logoUrl = logoImage;
const primaryGreen = "#2e7d32";
const lightGreen = "#e8f5e9";
const secondaryGreen = "#c8e6c9";

function UserTypeSelector() {
  const { userType, setUserType } = useUser();
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Typography variant="body1" color="black" sx={{ fontFamily: "serif" }}>
        Tip utilizator:
      </Typography>
      <Select
        value={userType}
        onChange={(e) => setUserType(e.target.value)}
        size="small"
        sx={{
          color: "black",
          borderColor: "black",
          ".MuiOutlinedInput-notchedOutline": { borderColor: "black" },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "black",
          },
          fontFamily: "serif",
          backgroundColor: "white",
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
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { userType } = useUser();
  const [value, setValue] = useState(0);

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
      { label: "Uploaduri", path: "/dashboard/uploads", component: <Uploads /> },
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
    <Box sx={{ width: "100%", minHeight: "100vh", backgroundColor: lightGreen }}>
      {/* AppBar */}
      <AppBar
        position="static"
        sx={{
          backgroundColor: "white",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
          color: "black",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            maxWidth: "1200px",
            margin: "0 auto",
            width: "100%",
            py: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box component="img" src={logoUrl} alt="Logo CleanScan" sx={{ width: 80, height: 80 }} />
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", fontFamily: "serif", color: primaryGreen }}
            >
              CleanScan
            </Typography>
          </Box>

          <Box sx={{ display: isMobile ? "none" : "flex", alignItems: "center", gap: 4, flexGrow: 1, justifyContent: "center" }} />

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ width: 30, height: 30, backgroundColor: primaryGreen, borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Typography color="white">🔍</Typography>
            </Box>
            <Typography sx={{ cursor: "pointer", color: primaryGreen, fontSize: "1.5rem" }}>🛒</Typography>
            <Typography sx={{ cursor: "pointer", color: primaryGreen, fontSize: "1.5rem" }}>👤</Typography>
            {!isMobile && <UserTypeSelector />}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero cu imagine de fundal + overlay */}
      <Box
        sx={{
          position: "relative",
          textAlign: "center",
          py: 8,
          px: 3,
        }}
      >
        {/* Imagine de fundal */}
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
            zIndex: 0,
          }}
        />
        {/* Overlay semi-transparent */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(46, 125, 50, 0.6)", // verde semi-transparent
            zIndex: 1,
          }}
        />
        {/* Conținutul Hero */}
        <Box sx={{ position: "relative", zIndex: 2, color: "white" }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: "normal",
              fontFamily: "serif",
              mb: 2,
              maxWidth: 700,
              margin: "0 auto",
            }}
          >
            Curated Sustainability for Responsible Citizens
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontFamily: "serif",
              fontWeight: "lighter",
              mb: 4,
              maxWidth: 600,
              margin: "20px auto 40px",
            }}
          >
            Descoperiți progresul, raportați problemele și câștigați recompense
            pentru un mediu mai curat.
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 6 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: secondaryGreen,
                color: "black",
                "&:hover": { backgroundColor: "#a5d6a7" },
                textTransform: "none",
                fontFamily: "serif",
                py: 1,
                px: 3,
              }}
              onClick={() => navigate(TAB_PATHS[1])}
            >
              Vezi Progresul
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: "white",
                color: "white",
                "&:hover": { borderColor: secondaryGreen, color: secondaryGreen },
                textTransform: "none",
                fontFamily: "serif",
                py: 1,
                px: 3,
              }}
              onClick={() => navigate("/dashboard/raportari")}
            >
              Raportează o Problemă
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Tabs */}
      {isMobile ? (
        <Select 
          value={value} 
          onChange={handleChange} 
          fullWidth 
          sx={{ backgroundColor: secondaryGreen, fontFamily: "serif" }}
        >
          {TAB_LABELS.map((label, idx) => (
            <MenuItem key={label} value={idx} sx={{ fontFamily: "serif" }}>
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
            borderBottom: `1px solid ${secondaryGreen}`
          }}
          indicatorColor="primary"
          textColor="inherit"
          variant="scrollable"
          scrollButtons="auto"
        >
          {TAB_LABELS.map((label) => (
            <Tab 
              key={label} 
              label={label} 
              sx={{ 
                color: primaryGreen,
                fontFamily: "serif",
                "&.Mui-selected": { color: primaryGreen },
              }} 
            />
          ))}
        </Tabs>
      )}

      {/* TabPanel */}
      {tabs.map((tab, idx) => (
        <TabPanel key={tab.path} value={value} index={idx}>
          <Box 
            sx={{ 
              width: "100%", 
              px: 3, 
              pt: 4, 
              maxWidth: "1200px", 
              margin: "0 auto",
              backgroundColor: 'transparent' 
            }}
          >
            {tab.component}
          </Box>
        </TabPanel>
      ))}
    </Box>
  );
}
