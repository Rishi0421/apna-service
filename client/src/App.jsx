import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import SearchResults from "./pages/SearchResults";

import UserProfile from "./pages/UserProfile";
import MyBookings from "./pages/MyBookings";
import ChangePassword from "./pages/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import HelpSupport from "./pages/HelpSupport";

import ProviderDashboard from "./pages/ProviderDashboard";
import ProviderProfile from "./pages/ProviderProfile";
import ProviderReviews from "./pages/ProviderReviews";

import AdminDashboard from "./pages/AdminDashboard";
import AdminReports from "./pages/AdminReports";
import AdminServiceApproval from "./pages/AdminServiceApproval";
import AdminUsers from "./pages/Users";
import AdminProviders from "./pages/Providers";
import AdminBookings from "./pages/AdminBookings";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ================= COMMON (AUTH) ================= */}
        <Route
          path="/chat/:chatId"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />

        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <SearchResults />
            </ProtectedRoute>
          }
        />

        {/* ================= USER ================= */}
        <Route
          path="/home"
          element={
            <RoleRoute role="user">
              <Home />
            </RoleRoute>
          }
        />

        <Route
          path="/bookings"
          element={
            <RoleRoute role="user">
              <MyBookings />
            </RoleRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <RoleRoute role="user">
              <UserProfile />
            </RoleRoute>
          }
        />

        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />

        <Route
          path="/help-support"
          element={
            <ProtectedRoute>
              <HelpSupport />
            </ProtectedRoute>
          }
        />

        {/* ================= PROVIDER ================= */}
        <Route
          path="/provider"
          element={
            <RoleRoute role="provider">
              <ProviderDashboard />
            </RoleRoute>
          }
        />

        <Route
          path="/provider/profile"
          element={
            <RoleRoute role="provider">
              <ProviderProfile />
            </RoleRoute>
          }
        />

        <Route
          path="/provider/reviews"
          element={
            <RoleRoute role="provider">
              {/* lazy simple reviews page for provider */}
              <ProviderReviews />
            </RoleRoute>
          }
        />

        {/* ================= ADMIN ================= */}
        <Route
          path="/admin"
          element={
            <RoleRoute role="admin">
              <AdminDashboard />
            </RoleRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <RoleRoute role="admin">
              <AdminUsers />
            </RoleRoute>
          }
        />

        <Route
          path="/admin/providers"
          element={
            <RoleRoute role="admin">
              <AdminProviders />
            </RoleRoute>
          }
        />

        <Route
          path="/admin/services"
          element={
            <RoleRoute role="admin">
              <AdminServiceApproval />
            </RoleRoute>
          }
        />

        <Route
          path="/admin/reports"
          element={
            <RoleRoute role="admin">
              <AdminReports />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <RoleRoute role="admin">
              <AdminBookings />
            </RoleRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
