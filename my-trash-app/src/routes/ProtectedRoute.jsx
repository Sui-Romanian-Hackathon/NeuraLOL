// src/routes/ProtectedRoute.jsx
import { useEffect } from "react";
import { useWalletKit } from "@mysten/wallet-kit";
import { Navigate, useNavigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { currentWallet } = useWalletKit();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentWallet) {
      navigate("/", { replace: true });
    }
  }, [currentWallet, navigate]);

  return currentWallet ? children : <Navigate to="/" replace />;
}
