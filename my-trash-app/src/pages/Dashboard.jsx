// DashboardWithBanner.js – Dashboard + Improved Scrolling Logos Banner
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
import Footer from "../components/Footer";
import { useUser } from "../context/UserContext";

// NEW: Logo imports
import logo1 from "../assets/sponsorLogo1.png";
import logo2 from "../assets/sponsorLogo1.png";
import logo3 from "../assets/sponsorLogo1.png";
import logo4 from "../assets/sponsorLogo2.jpg";
import logo5 from "../assets/sponsorLogo2.jpg";

const primaryGreen = "#2e7d32";
const lightGreen = "#e8f5e9";
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

// NEW: Logo Banner Component
// export default function Footer() {
//   const logos = [logo1, logo2, logo3, logo4, logo5];

//   return (
//     <Box
//       component="footer"
//       sx={{
//         width: "100%",
//         backgroundColor: "#ffffff",
//         borderTop: "1px solid rgba(0,0,0,0.08)",
//         mt: 6,
//         py: 4,
//       }}
//     >
//       {/* Logos Row */}
//       <Box
//         sx={{
//           maxWidth: 1200,
//           mx: "auto",
//           px: 3,
//           display: "grid",
//           gridTemplateColumns: {
//             xs: "repeat(2, 1fr)",
//             sm: "repeat(3, 1fr)",
//             md: "repeat(5, 1fr)",
//           },
//           alignItems: "center",
//           justifyItems: "center",
//           gap: 4,
//           mb: 3,
//         }}
//       >
//         {logos.map((src, idx) => (
//           <Box
//             key={idx}
//             component="img"
//             src={src}
//             alt="sponsor"
//             loading="lazy"
//             sx={{
//               height: 45,
//               maxWidth: "120px",
//               filter: "grayscale(100%)",
//               opacity: 0.8,
//               transition: "0.3s",
//               "&:hover": {
//                 opacity: 1,
//                 filter: "none",
//               },
//             }}
//           />
//         ))}
//       </Box>

//       {/* Copyright */}
//       <Typography
//         variant="body2"
//         sx={{
//           textAlign: "center",
//           color: "rgba(0,0,0,0.6)",
//           fontFamily: "serif",
//           fontSize: "0.9rem",
//         }}
//       >
//         © 2025 NeuraLOL — All Rights Reserved
//       </Typography>
//     </Box>
//   );
// }


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
      { label: "Tranzacții", path: "/dashboard/transactions", component: <Transactions /> },
      { label: "Uploaduri", path: "/dashboard/uploads", component: <Uploads walletAddress={walletAddress} /> },
      { label: "Sold", path: "/dashboard/balance", component: <Balance /> },
      { label: "NFT", path: "/dashboard/nfts", component: <NFTs /> },
      { label: "Clasament", path: "/dashboard/clasament", component: <Clasament /> },
      { label: "Notificări", path: "/dashboard/notificari", component: <Notificari /> },
    ],
    admin: [
      { label: "Cont", path: "/dashboard/account", component: <Account /> },
      { label: "Tranzacții", path: "/dashboard/transactions", component: <Transactions /> },
      { label: "Uploaduri", path: "/dashboard/uploads", component: <Uploads walletAddress={walletAddress} /> },
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
      {/* HEADER */}
      <AppBar
        position="static"
        sx={{ backgroundColor: "#fff", color: "#333", boxShadow: "0 3px 6px rgba(0,0,0,0.08)" }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", maxWidth: 1200, margin: "0 auto", width: "100%" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box component="img" src={logoImage} alt="Logo" sx={{ width: 70, height: 70 }} />
            <Typography variant="h5" sx={{ fontFamily: "serif", fontWeight: "700", color: primaryGreen }}>
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
        <Box sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: heroOverlay }} />

        <Box sx={{ position: "relative", zIndex: 2, color: "white", px: 3 }}>
          <Typography variant="h3" sx={{ fontFamily: "serif", fontWeight: "700", mb: 2 }}>
            Curated Sustainability for Responsible Citizens
          </Typography>
          <Typography variant="h6" sx={{ fontFamily: "serif", maxWidth: 600, mx: "auto", mb: 4 }}>
            Descoperiți progresul, raportați problemele și câștigați recompense pentru un mediu mai curat.
          </Typography>
        </Box>
      </Box>

      {/* LOGO BANNER */}
      {/* <LogosBanner /> */}

      {/* TABS */}
      {isMobile ? (
        <Select value={value} onChange={handleChange} fullWidth sx={{ mb: 2, px: 2 }}>
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
      <Footer />
    </Box>
  );
}