import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { 
  User, 
  Mail, 
  Lock, 
  ChevronLeft, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Briefcase,
  UserCircle
} from "lucide-react";

const LOGO_URL = "https://res.cloudinary.com/duapy4aje/image/upload/v1770234081/cad83f04-35b6-492d-9f9a-31292d578213.png";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) return alert("Password must be at least 6 characters");
    
    try {
      setLoading(true);
      await api.post("/auth/register", { name, email, password, role });
      alert("✅ Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center px-6 py-12">
      
      {/* --- BACK BUTTON --- */}
      <div className="w-full max-w-md mb-8">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors group"
        >
          <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-1" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Return to Home</span>
        </Link>
      </div>

      {/* --- SIGNUP CARD --- */}
      <div className="bg-white w-full max-w-md rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 p-8 md:p-12 relative overflow-hidden">
        
        {/* LOGO AREA */}
        <div className="flex flex-col items-center mb-10 relative z-10">
            <img src={LOGO_URL} alt="Logo" className="h-12 w-auto mb-6" />
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create Account</h1>
            <p className="text-slate-400 text-sm font-medium mt-1">Join our network of trusted services.</p>
        </div>

        {/* --- FORM --- */}
        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          
          {/* ROLE SELECTOR (Custom Chips instead of Select) */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Register As</label>
            <div className="grid grid-cols-2 gap-3">
                <button
                    type="button"
                    onClick={() => setRole("user")}
                    className={`flex items-center justify-center gap-2 py-3 rounded-2xl border-2 transition-all font-bold text-xs uppercase tracking-widest ${
                        role === "user" 
                        ? "border-blue-600 bg-blue-50 text-blue-600 shadow-sm" 
                        : "border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200"
                    }`}
                >
                    <UserCircle size={16} /> Customer
                </button>
                <button
                    type="button"
                    onClick={() => setRole("provider")}
                    className={`flex items-center justify-center gap-2 py-3 rounded-2xl border-2 transition-all font-bold text-xs uppercase tracking-widest ${
                        role === "provider" 
                        ? "border-blue-600 bg-blue-50 text-blue-600 shadow-sm" 
                        : "border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200"
                    }`}
                >
                    <Briefcase size={16} /> Partner
                </button>
            </div>
          </div>

          {/* NAME INPUT */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Full Name</label>
            <div className="relative group">
                <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <input
                    className="w-full bg-slate-50 border-none pl-14 pr-6 py-4 rounded-2xl text-sm font-bold text-slate-900 outline-none ring-2 ring-transparent focus:ring-blue-500/10 focus:bg-white transition-all"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
          </div>

          {/* EMAIL INPUT */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Email Address</label>
            <div className="relative group">
                <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <input
                    type="email"
                    className="w-full bg-slate-50 border-none pl-14 pr-6 py-4 rounded-2xl text-sm font-bold text-slate-900 outline-none ring-2 ring-transparent focus:ring-blue-500/10 focus:bg-white transition-all"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
          </div>

          {/* PASSWORD INPUT */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Create Password</label>
            <div className="relative group">
                <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <input
                    type={showPassword ? "text" : "password"}
                    className="w-full bg-slate-50 border-none pl-14 pr-14 py-4 rounded-2xl text-sm font-bold text-slate-900 outline-none ring-2 ring-transparent focus:ring-blue-500/10 focus:bg-white transition-all"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-600 transition-colors"
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button 
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-blue-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all transform active:scale-[0.98] shadow-xl shadow-slate-200 hover:shadow-blue-200 flex items-center justify-center gap-3 mt-4 disabled:opacity-50"
          >
            {loading ? "Establishing Account..." : "Create Account"}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        {/* --- FOOTER --- */}
        <div className="mt-10 text-center relative z-10 border-t border-slate-50 pt-8">
            <p className="text-xs font-bold text-slate-400">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:underline underline-offset-4 decoration-2">
                    Log In Here
                </Link>
            </p>
        </div>

        {/* DECORATIVE ELEMENT */}
        <div className="absolute -bottom-10 -left-10 text-slate-50 opacity-10 rotate-12 pointer-events-none">
            <ShieldCheck size={200} />
        </div>
      </div>

      <p className="mt-8 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
        © 2024 Hubly Secure Registration
      </p>
    </div>
  );
};

export default Signup;