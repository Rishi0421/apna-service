import { useEffect, useState } from "react";
import api from "../api/axios";
import AdminSidebar from "../components/AdminSidebar";
import Navbar from "../components/Navbar";
import { 
  Wrench, 
  ShieldOff, 
  ShieldCheck, 
  Search, 
  Mail, 
  MapPin, 
  UserX, 
  Filter,
  Loader2,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  MoreHorizontal,
  ChevronRight
} from "lucide-react";

const AdminProviders = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/providers");
      setProviders(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleBlock = async (provider) => {
    if (!provider.user) return;
    try {
      if (provider.user.isBlocked) {
        await api.put(`/admin/providers/unblock/${provider._id}`);
      } else {
        await api.put(`/admin/providers/block/${provider._id}`);
      }
      fetchProviders();
    } catch (err) {
      alert("System action failed. Please try again.");
    }
  };

  const filteredProviders = providers.filter(p => 
    p.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const blockedCount = providers.filter(p => p.user?.isBlocked).length;
  const verifiedCount = providers.filter(p => p.isVerified).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <AdminSidebar />

      <main className="ml-72 p-8 pt-32 transition-all duration-500">
        
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <Wrench className="text-indigo-600" size={18} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Partner Relations</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight text-italic">Partner_Registry</h1>
            <p className="text-slate-500 text-sm font-medium mt-1">Oversee service providers, manage verification, and control access.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm text-center min-w-[120px]">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Total Partners</p>
                <p className="text-xl font-black text-slate-900">{providers.length}</p>
            </div>
            <div className="bg-emerald-50 px-5 py-3 rounded-2xl border border-emerald-100 shadow-sm text-center min-w-[120px]">
                <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-0.5">Verified</p>
                <p className="text-xl font-black text-emerald-600">{verifiedCount}</p>
            </div>
            <div className="bg-rose-50 px-5 py-3 rounded-2xl border border-rose-100 shadow-sm text-center min-w-[120px]">
                <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest mb-0.5">Blocked</p>
                <p className="text-xl font-black text-rose-600">{blockedCount}</p>
            </div>
          </div>
        </div>

        {/* --- CONTROL BAR --- */}
        <div className="bg-white border border-slate-100 p-2 rounded-[2rem] shadow-sm flex items-center gap-2 mb-8">
            <div className="relative flex-1 group">
                <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                    type="text"
                    placeholder="Search by partner name, email, or operational city..."
                    className="w-full bg-slate-50 border-none pl-14 pr-6 py-4 rounded-[1.5rem] text-sm font-bold text-slate-900 outline-none focus:ring-4 ring-indigo-500/5 focus:bg-white transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <button className="hidden md:flex items-center gap-2 px-6 py-4 text-slate-400 hover:text-slate-900 transition-colors font-black text-[10px] uppercase tracking-widest">
                <Filter size={16} /> Advanced Filter
            </button>
        </div>

        {/* --- PROVIDERS LIST --- */}
        {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Partner Data</p>
            </div>
        ) : filteredProviders.length === 0 ? (
            <div className="bg-white rounded-[3rem] border border-dashed border-slate-200 py-24 flex flex-col items-center text-center">
                <UserX size={48} className="text-slate-200 mb-4" />
                <h3 className="text-lg font-bold text-slate-900 uppercase">No Providers Found</h3>
                <p className="text-slate-400 text-sm font-medium">No partners match your current filter criteria.</p>
            </div>
        ) : (
            <div className="grid gap-4">
                {filteredProviders.map((p) => (
                    <div 
                        key={p._id} 
                        className={`group bg-white rounded-[2rem] border transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between p-5 md:p-6 ${
                            p.user?.isBlocked 
                            ? "border-rose-100 bg-rose-50/20 shadow-none grayscale-[0.5]" 
                            : "border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
                        }`}
                    >
                        <div className="flex items-center gap-6">
                            {/* PROVIDER ICON */}
                            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center font-black text-xl shadow-inner relative ${
                                p.user?.isBlocked ? "bg-rose-100 text-rose-500" : "bg-slate-900 text-white"
                            }`}>
                                {p.user?.name?.charAt(0) || "D"}
                                {p.isVerified && (
                                    <div className="absolute -top-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white">
                                        <ShieldCheck size={12} />
                                    </div>
                                )}
                            </div>

                            {/* PROVIDER DETAILS */}
                            <div>
                                <h3 className={`text-base font-black tracking-tight ${p.user?.isBlocked ? "text-rose-900" : "text-slate-900"}`}>
                                    {p.user?.name || "Deleted User Account"}
                                </h3>
                                <div className="flex flex-wrap items-center gap-x-6 gap-y-1 mt-1.5">
                                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                                        <Mail size={12} className="text-indigo-400" />
                                        {p.user?.email || "N/A"}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                                        <MapPin size={12} className="text-indigo-400" />
                                        {p.city || "Area Unknown"}
                                    </div>
                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                                        p.user?.isBlocked ? "bg-rose-50 border-rose-100 text-rose-500" : "bg-indigo-50 border-indigo-100 text-indigo-600"
                                    }`}>
                                        {p.user?.isBlocked ? "Account Restricted" : "Marketplace Active"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex items-center gap-3 mt-4 md:mt-0">
                            <button
                                disabled={!p.user}
                                onClick={() => toggleBlock(p)}
                                className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all transform active:scale-[0.98] flex items-center gap-2 ${
                                    !p.user 
                                    ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                                    : p.user.isBlocked 
                                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100 hover:bg-emerald-600" 
                                        : "bg-white border border-rose-100 text-rose-500 hover:bg-rose-500 hover:text-white"
                                }`}
                            >
                                {p.user?.isBlocked ? (
                                    <><ShieldCheck size={14} /> Restore Access</>
                                ) : (
                                    <><ShieldOff size={14} /> Revoke Access</>
                                )}
                            </button>
                            
                            <button className="p-3 rounded-xl text-slate-300 hover:text-slate-600 hover:bg-slate-50 transition-all">
                                <MoreHorizontal size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}

        <div className="mt-12 text-center">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Master Database v2.1 Partner Sync</p>
        </div>
      </main>
    </div>
  );
};

export default AdminProviders;