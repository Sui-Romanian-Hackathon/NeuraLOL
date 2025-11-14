import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import HomePage from "../pages/HomePage";
import Dashboard from "../pages/Dashboard";
import { Container } from "@mui/material";

export default function AppRoutes() {
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
