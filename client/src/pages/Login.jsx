import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ChevronLeft, 
  ArrowRight, 
  ShieldCheck,
  Loader2
} from "lucide-react";

const LOGO_URL = "https://res.cloudinary.com/duapy4aje/image/upload/v1770234081/cad83f04-35b6-492d-9f9a-31292d578213.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post("/auth/login", { email, password });

      // Save user and token to context
      login(res.data.user, res.data.token);

      // Role-based redirection
      if (res.data.user.role === "admin") navigate("/admin");
      else if (res.data.user.role === "provider") navigate("/provider");
      else navigate("/home");
      
    } catch (err) {
      alert(err.response?.data?.message || "Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center px-6 py-12">
      
      {/* --- BACK TO HOME --- */}
      <div className="w-full max-w-md mb-8">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors group"
        >
          <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-1" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to Website</span>
        </Link>
      </div>

      {/* --- LOGIN CARD --- */}
      <div className="bg-white w-full max-w-md rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 p-8 md:p-12 relative overflow-hidden">
        
        {/* LOGO AREA */}
        <div className="flex flex-col items-center mb-10 relative z-10">
            <img src={LOGO_URL} alt="Hubly Logo" className="h-12 w-auto mb-6 transition-transform hover:scale-105" />
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">System Login</h1>
            <p className="text-slate-400 text-sm font-medium mt-1 text-center">Welcome back to your professional service hub.</p>
        </div>

        {/* --- FORM --- */}
        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          
          {/* EMAIL INPUT */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Email Identity</label>
            <div className="relative group">
                <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                <input
                    type="email"
                    className="w-full bg-slate-50 border-none pl-14 pr-6 py-4 rounded-2xl text-sm font-bold text-slate-900 outline-none ring-2 ring-transparent focus:ring-indigo-500/10 focus:bg-white transition-all"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
          </div>

          {/* PASSWORD INPUT */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Security Key</label>
                <Link to="/forgot-password" size={14} className="text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:text-indigo-700">
                    Forgot?
                </Link>
            </div>
            <div className="relative group">
                <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                <input
                    type={showPassword ? "text" : "password"}
                    className="w-full bg-slate-50 border-none pl-14 pr-14 py-4 rounded-2xl text-sm font-bold text-slate-900 outline-none ring-2 ring-transparent focus:ring-indigo-500/10 focus:bg-white transition-all"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-600 transition-colors"
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button 
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-indigo-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all transform active:scale-[0.98] shadow-xl shadow-slate-200 hover:shadow-indigo-200 flex items-center justify-center gap-3 mt-4 disabled:opacity-50"
          >
            {loading ? (
                <>
                    <Loader2 className="animate-spin" size={18} />
                    Authenticating...
                </>
            ) : (
                <>
                    Secure Access <ArrowRight size={16} />
                </>
            )}
          </button>
        </form>

        {/* --- FOOTER --- */}
        <div className="mt-10 text-center relative z-10 border-t border-slate-50 pt-8">
            <p className="text-xs font-bold text-slate-400">
                New to Hubly?{" "}
                <Link to="/register" className="text-indigo-600 hover:underline underline-offset-4 decoration-2">
                    Create Partner Account
                </Link>
            </p>
        </div>

        {/* DECORATIVE ELEMENT */}
        <div className="absolute -bottom-10 -right-10 text-slate-50 opacity-10 rotate-12 pointer-events-none">
            <ShieldCheck size={200} />
        </div>
      </div>

      <p className="mt-8 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
        End-to-End Encrypted Session
      </p>
    </div>
  );
};

export default Login;