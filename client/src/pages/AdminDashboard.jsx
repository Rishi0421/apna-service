import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import AdminSidebar from "../components/AdminSidebar";
import { 
  Users, 
  Wrench, 
  ShieldCheck, 
  Clock, 
  CalendarCheck, 
  CheckCircle2, 
  Mail, 
  MapPin, 
  ArrowUpRight,
  Loader2,
  AlertCircle,
  Briefcase,
  ChevronRight
} from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [pendingProviders, setPendingProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
    fetchProviders();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/admin/dashboard");
      setStats(res.data.stats);
    } catch (err) { console.error(err); }
  };

  const fetchProviders = async () => {
    try {
      const res = await api.get("/providers/all");
      setPendingProviders(res.data.filter(p => !p.isVerified));
    } finally {
      setLoading(false);
    }
  };

  const verifyProvider = async (id) => {
    try {
      await api.put(`/providers/verify/${id}`);
      alert("Provider account verified successfully ✅");
      fetchProviders();
      fetchDashboard();
    } catch (err) {
      alert("Verification failed");
    }
  };

  if (loading || !stats) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Booting Admin Console</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <AdminSidebar />

      {/* Main Content: Shifted left to make room for Sidebar (w-72) */}
      <div className="ml-72 p-8 pt-32 transition-all duration-500">
        
        {/* --- DASHBOARD HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Live System Overview</span>
                </div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">Console_Dashboard</h1>
                <p className="text-slate-500 text-sm font-medium mt-1">Global platform statistics and moderation queue.</p>
            </div>
            
            <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Server Status</p>
                    <p className="text-xs font-bold text-emerald-500 uppercase">Operational</p>
                </div>
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
                    <ShieldCheck size={20} />
                </div>
            </div>
        </div>

        {/* --- STATS GRID (Bento Style) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-12">
          <StatCard label="Total Users" value={stats.totalUsers} icon={<Users />} color="blue" />
          <StatCard label="Partners" value={stats.totalProviders} icon={<Wrench />} color="indigo" />
          <StatCard label="Verified" value={stats.verifiedProviders} icon={<ShieldCheck />} color="emerald" />
          <StatCard label="Pending" value={stats.pendingProviders} icon={<Clock />} color="amber" />
          <StatCard label="Bookings" value={stats.totalBookings} icon={<CalendarCheck />} color="violet" />
          <StatCard label="Completed" value={stats.completedJobs} icon={<CheckCircle2 />} color="rose" />
        </div>

        {/* --- MODERATION QUEUE --- */}
        <div className="mb-8 flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 border border-amber-100">
                    <AlertCircle size={20} />
                </div>
                <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Pending Approvals</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Action Required: {pendingProviders.length} Accounts</p>
                </div>
            </div>
        </div>

        <div className="grid gap-6">
          {pendingProviders.length === 0 ? (
            <div className="bg-white rounded-[2.5rem] border border-dashed border-slate-200 py-20 flex flex-col items-center justify-center text-center">
                <CheckCircle2 size={48} className="text-slate-200 mb-4" />
                <h3 className="text-lg font-bold text-slate-900 uppercase">Queue Empty</h3>
                <p className="text-slate-400 text-sm font-medium">All provider accounts have been reviewed.</p>
            </div>
          ) : (
            pendingProviders.map(provider => (
                <div key={provider._id} className="group bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500">
                  <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                    
                    {/* Partner Identity */}
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-slate-200">
                            {provider.user?.name?.charAt(0)}
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-1">{provider.user?.name}</h3>
                            <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                                <span className="flex items-center gap-1.5"><Mail size={14} className="text-indigo-500" /> {provider.user?.email}</span>
                                <span className="flex items-center gap-1.5"><MapPin size={14} className="text-indigo-500" /> {provider.city}</span>
                            </div>
                        </div>
                    </div>

                    {/* Services Overview */}
                    <div className="flex-1 max-w-md xl:px-12 xl:border-x border-slate-50">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3">Portfolio Submission</p>
                        <div className="flex flex-wrap gap-2">
                            {provider.services.map(s => (
                                <span key={s._id} className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-[10px] font-black text-slate-600 uppercase tracking-tight flex items-center gap-1.5">
                                    <Briefcase size={10} /> {s.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Pincodes */}
                    <div className="hidden 2xl:block min-w-[200px]">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Coverage</p>
                        <p className="text-xs font-bold text-slate-600 leading-relaxed">{provider.pincodes.join(", ")}</p>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={() => verifyProvider(provider._id)}
                        className="bg-slate-900 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all transform active:scale-[0.98] shadow-xl shadow-slate-200 flex items-center justify-center gap-2 group/btn"
                    >
                        Grant System Access
                        <ArrowUpRight size={16} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};

/* --- REUSABLE STAT CARD --- */
const StatCard = ({ label, value, icon, color }) => {
    const colors = {
        blue: "text-blue-600 bg-blue-50 border-blue-100",
        indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
        emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
        amber: "text-amber-600 bg-amber-50 border-amber-100",
        violet: "text-violet-600 bg-violet-50 border-violet-100",
        rose: "text-rose-600 bg-rose-50 border-rose-100"
    };

    return (
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)] transition-all">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-6 border ${colors[color]}`}>
                {icon}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
            <div className="flex items-baseline gap-2">
                <p className="text-2xl font-black text-slate-900 tracking-tighter">{value}</p>
                <div className="h-1 w-1 rounded-full bg-slate-200"></div>
            </div>
        </div>
    );
};

export default AdminDashboard;