import { useEffect, useState } from "react";
import api from "../api/axios";
import AdminSidebar from "../components/AdminSidebar";
import Navbar from "../components/Navbar";
import { 
  CheckCircle2, 
  Clock, 
  User, 
  Mail, 
  MapPin, 
  Briefcase, 
  ShieldCheck, 
  ChevronRight,
  Search,
  Filter,
  Loader2,
  AlertCircle,
  Image as ImageIcon
} from "lucide-react";

const AdminServiceApproval = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/providers/all");
      setProviders(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const approveService = async (providerId, serviceId) => {
    if (!providerId || !serviceId) return;

    try {
      setActionLoading(true);
      await api.put(`/admin/approve-service/${providerId}/${serviceId}`);
      alert("Service approved successfully ✅");
      fetchProviders();
    } catch (err) {
      alert("Failed to approve service.");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredProviders = providers.filter(p => 
    p.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.services?.some(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const pendingCount = providers.reduce((acc, p) => 
    acc + p.services.filter(s => !s.isApproved).length, 0
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <AdminSidebar />

      <main className="ml-72 p-8 pt-32 transition-all duration-500">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <Briefcase className="text-indigo-600" size={18} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Inventory Moderation</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Service Catalog</h1>
            <p className="text-slate-500 text-sm font-medium mt-1">Review and authorize new service offerings from platform partners.</p>
          </div>

          <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="text-right">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pending Review</p>
                <p className="text-sm font-black text-amber-500">{pendingCount} Services</p>
            </div>
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 border border-amber-100">
                <Clock size={20} />
            </div>
          </div>
        </div>

        {/* --- SEARCH BAR --- */}
        <div className="bg-white border border-slate-100 p-2 rounded-[2rem] shadow-sm flex items-center gap-2 mb-10">
            <div className="relative flex-1 group">
                <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                    type="text"
                    placeholder="Search by partner name or service type..."
                    className="w-full bg-slate-50 border-none pl-14 pr-6 py-4 rounded-[1.5rem] text-sm font-bold text-slate-900 outline-none focus:ring-4 ring-indigo-500/5 focus:bg-white transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        {/* --- PROVIDER LIST --- */}
        {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Catalog Data</p>
            </div>
        ) : filteredProviders.length === 0 ? (
            <div className="bg-white rounded-[3rem] border border-dashed border-slate-200 py-24 flex flex-col items-center text-center">
                <AlertCircle size={48} className="text-slate-200 mb-4" />
                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">No Catalog Entries</h3>
                <p className="text-slate-400 text-sm font-medium">No service providers match your search.</p>
            </div>
        ) : (
          <div className="space-y-10">
            {filteredProviders.map((provider) => (
              <div key={provider._id} className="relative">
                {/* Provider Header Sub-Card */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4 px-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-sm">
                            {provider.user?.name?.charAt(0)}
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">{provider.user?.name}</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-2">
                                <Mail size={10} className="text-indigo-400" /> {provider.user?.email}
                                <span className="text-slate-200">|</span>
                                <MapPin size={10} className="text-indigo-400" /> {provider.city}
                            </p>
                        </div>
                    </div>
                    <div className="hidden md:block h-px flex-1 bg-slate-100 mx-6"></div>
                    <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest bg-white border border-slate-100 px-3 py-1 rounded-full">
                        Partner ID: {provider._id.slice(-6)}
                    </div>
                </div>

                {/* Service Grid for this Provider */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {provider.services.map((s) => (
                    <div 
                        key={s._id} 
                        className={`group bg-white rounded-[2.5rem] border transition-all duration-500 overflow-hidden flex flex-col ${
                            s.isApproved 
                            ? "border-slate-100 shadow-sm opacity-80" 
                            : "border-amber-100 shadow-xl shadow-amber-500/5 ring-1 ring-amber-50"
                        }`}
                    >
                      {/* Image Placeholder or Actual Image */}
                      <div className="h-32 bg-slate-50 relative flex items-center justify-center overflow-hidden border-b border-slate-50">
                        {s.image ? (
                           <img src={`http://localhost:5000${s.image}`} className="w-full h-full object-cover" alt={s.name} />
                        ) : (
                           <ImageIcon size={24} className="text-slate-200" />
                        )}
                        <div className={`absolute top-4 right-4 px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-[0.15em] border ${
                            s.isApproved ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                        }`}>
                            {s.isApproved ? "Live on Market" : "Needs Review"}
                        </div>
                      </div>

                      <div className="p-6 flex-1 flex flex-col">
                        <div className="mb-4">
                            <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-1">{s.category}</p>
                            <h4 className="text-base font-black text-slate-900 tracking-tight leading-tight">{s.name}</h4>
                        </div>

                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                            {!s.isApproved ? (
                                <button
                                    disabled={actionLoading}
                                    onClick={() => approveService(provider._id, s._id)}
                                    className="w-full bg-slate-900 hover:bg-emerald-600 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    {actionLoading ? <Loader2 size={12} className="animate-spin" /> : <ShieldCheck size={14} />}
                                    Authorize Service
                                </button>
                            ) : (
                                <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest mx-auto">
                                    <CheckCircle2 size={14} /> Approved System Asset
                                </div>
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-20 py-10 border-t border-slate-100 text-center">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Hubly Global Service Audit Protocol v4.0</p>
        </div>
      </main>
    </div>
  );
};

export default AdminServiceApproval;