import { useState } from "react";
import api from "../api/axios";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  Eye, 
  EyeOff, 
  ChevronLeft, 
  ArrowRight,
  Hash,
  AlertCircle
} from "lucide-react";

const ResetPassword = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fallback if user navigates here without email state
  const email = state?.email || "your email";

  const reset = async () => {
    if (otp.length < 4) return alert("Please enter a valid OTP");
    if (password.length < 6) return alert("Password must be at least 6 characters");

    try {
      setLoading(true);
      await api.post("/auth/reset-password", {
        email: state.email,
        otp,
        newPassword: password,
      });

      alert("✅ Password reset successful! Please login with your new password.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Verification failed. Please check your OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center px-6 py-12">
      
      {/* --- BACK TO LOGIN --- */}
      <div className="w-full max-w-md mb-8">
        <Link 
          to="/login" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors group"
        >
          <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-1" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to Login</span>
        </Link>
      </div>

      {/* --- MAIN CARD --- */}
      <div className="bg-white w-full max-w-md rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 p-8 md:p-12 relative overflow-hidden">
        
        {/* DECORATIVE ELEMENT */}
        <div className="absolute -top-10 -right-10 text-slate-50 opacity-10 rotate-12">
            <ShieldCheck size={200} />
        </div>

        {/* HEADER */}
        <div className="relative z-10 mb-10 text-center">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto mb-6 border border-indigo-100 shadow-sm">
                <Lock size={28} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create New Password</h1>
            <p className="text-slate-400 text-sm font-medium mt-2">
                We've sent a code to <span className="text-slate-900 font-bold">{email}</span>
            </p>
        </div>

        {/* FORM */}
        <div className="space-y-6 relative z-10">
          
          {/* OTP INPUT */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
               <Hash size={12} className="text-indigo-500" /> Enter 6-Digit OTP
            </label>
            <input
              type="text"
              maxLength="6"
              className="w-full bg-slate-50 border-none p-5 rounded-2xl text-center text-xl font-black tracking-[0.5em] text-slate-900 outline-none ring-2 ring-transparent focus:ring-indigo-500/10 focus:bg-white transition-all placeholder:text-slate-200"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            />
          </div>

          {/* NEW PASSWORD INPUT */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
               <Key size={12} className="text-indigo-500" /> New Secure Password
            </label>
            <div className="relative group">
                <input
                    type={showPassword ? "text" : "password"}
                    className="w-full bg-slate-50 border-none p-5 pr-14 rounded-2xl text-sm font-bold text-slate-900 outline-none ring-2 ring-transparent focus:ring-indigo-500/10 focus:bg-white transition-all"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-600 transition-colors"
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
          </div>

          {/* SECURITY ALERT */}
          <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
            <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[10px] font-bold text-amber-700 leading-relaxed uppercase">
                Ensure your new password is unique and not used on other platforms.
            </p>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            onClick={reset}
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-indigo-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all transform active:scale-[0.98] shadow-xl shadow-slate-200 hover:shadow-indigo-200 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Reset Password"}
            {!loading && <ArrowRight size={16} />}
          </button>

          {/* RESEND LINK */}
          <div className="text-center mt-4">
            <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">
                Didn't get a code? Resend
            </button>
          </div>

        </div>
      </div>

      {/* FOOTER FOOTNOTE */}
      <p className="mt-8 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
        Secure Encryption Active
      </p>
    </div>
  );
};

export default ResetPassword;