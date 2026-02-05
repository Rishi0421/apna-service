import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const sendOtp = async () => {
    if (!email) {
      alert("Please enter email");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/forgot-password", { email });
      alert("OTP sent to your email (check console for now)");
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const reset = async () => {
    if (!otp || !password) {
      alert("OTP and new password required");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword: password,
      });

      alert("Password reset successful");
      navigate("/login"); // 🔥 important UX
    } catch (err) {
      alert(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Forgot Password</h2>

      {step === 1 && (
        <>
          <input
            className="border p-2 w-full mb-3"
            placeholder="Registered Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            onClick={sendOtp}
            disabled={loading}
            className="bg-black text-white w-full py-2 disabled:opacity-50"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            className="border p-2 w-full mb-3"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <input
            type="password"
            className="border p-2 w-full mb-3"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={reset}
            disabled={loading}
            className="bg-blue-600 text-white w-full py-2 disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;
