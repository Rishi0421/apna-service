import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { 
  Lock, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ChevronLeft,
  AlertCircle
} from "lucide-react";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = async () => {
    if (newPassword.length < 6) {
      alert("New password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);
      await api.put("/auth/change-password", {
        oldPassword,
        newPassword,
      });

      alert("✅ Password updated successfully");
      navigate("/profile");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20 flex justify-center">
        <div className="w-full max-w-md">
          
          {/* BACK BUTTON */}
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors mb-8 group"
          >
            <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-1" />
            <span className="text-xs font-black uppercase tracking-widest">Back</span>
          </button>

          <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 relative overflow-hidden">
            {/* DECORATIVE BACKGROUND ICON */}
            <div className="absolute -top-6 -right-6 text-slate-50 opacity-10 rotate-12">
                <ShieldCheck size={160} />
            </div>

            {/* HEADER */}
            <div className="relative z-10 mb-10">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 border border-blue-100 shadow-sm">
                    <Lock size={24} />
                </div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Security Update</h1>
                <p className="text-slate-500 text-sm font-medium mt-1">Update your password to keep your account secure.</p>
            </div>

            {/* FORM */}
            <div className="space-y-6 relative z-10">
              
              {/* OLD PASSWORD */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Current Password</label>
                <div className="relative group">
                    <input
                        type={showOld ? "text" : "password"}
                        placeholder="••••••••"
                        className="w-full bg-slate-50 border-none p-4 pr-12 rounded-2xl text-sm font-bold text-slate-900 outline-none ring-2 ring-transparent focus:ring-blue-500/10 focus:bg-white transition-all"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />
                    <button 
                        type="button"
                        onClick={() => setShowOld(!showOld)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-600 transition-colors"
                    >
                        {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
              </div>

              {/* NEW PASSWORD */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">New Secure Password</label>
                <div className="relative group">
                    <input
                        type={showNew ? "text" : "password"}
                        placeholder="••••••••"
                        className="w-full bg-slate-50 border-none p-4 pr-12 rounded-2xl text-sm font-bold text-slate-900 outline-none ring-2 ring-transparent focus:ring-blue-500/10 focus:bg-white transition-all"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button 
                        type="button"
                        onClick={() => setShowNew(!showNew)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-600 transition-colors"
                    >
                        {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
              </div>

              {/* SECURITY TIP */}
              <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100 mt-2">
                <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[10px] font-bold text-amber-700 leading-relaxed uppercase tracking-tight">
                    Strong passwords use a mix of letters, numbers, and symbols. Minimum 6 characters.
                </p>
              </div>

              {/* ACTION BUTTON */}
              <button
                onClick={handleChange}
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-blue-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all transform active:scale-[0.98] shadow-xl shadow-slate-200 hover:shadow-blue-200 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Security"}
                {!loading && <ArrowRight size={16} />}
              </button>

              {/* FORGOT PASSWORD LINK */}
              <div className="text-center pt-4">
                <p className="text-xs font-bold text-slate-400">
                    Trouble remembering?{" "}
                    <Link
                        to="/forgot-password"
                        className="text-blue-600 hover:underline underline-offset-4 decoration-2"
                    >
                        Reset via Email
                    </Link>
                </p>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChangePassword;