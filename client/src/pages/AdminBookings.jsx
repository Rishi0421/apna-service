import { useEffect, useState } from "react";
import api from "../api/axios";
import AdminSidebar from "../components/AdminSidebar";
import Navbar from "../components/Navbar";
import { 
  CalendarDays, 
  User, 
  Wrench, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter, 
  ArrowRight, 
  MapPin, 
  Activity,
  Loader2,
  ChevronRight,
  Database
} from "lucide-react";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/bookings");
      setBookings(res.data);
    } catch (err) {
      console.error("Failed to fetch admin bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "completed": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "pending": return "bg-amber-50 text-amber-600 border-amber-100";
      case "rejected": return "bg-rose-50 text-rose-600 border-rose-100";
      case "accepted": 
      case "on_the_way":
      case "started": return "bg-blue-50 text-blue-600 border-blue-100";
      default: return "bg-slate-50 text-slate-400 border-slate-100";
    }
  };

  const filteredBookings = bookings.filter(b => 
    b.service?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.provider?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <AdminSidebar />

      <main className="ml-72 p-8 pt-32 transition-all duration-500">
        
        {/* --- HEADER & SUMMARY --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <Database className="text-indigo-600" size={18} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Transaction Audit</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Global Bookings</h1>
            <p className="text-slate-500 text-sm font-medium mt-1">Real-time monitoring of all service exchanges across the platform.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Live Volume</span>
                <span className="text-xl font-black text-slate-900">{bookings.length}</span>
            </div>
          </div>
        </div>

        {/* --- CONTROL BAR --- */}
        <div className="bg-white border border-slate-100 p-2 rounded-[2rem] shadow-sm flex items-center gap-2 mb-10">
            <div className="relative flex-1 group">
                <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                    type="text"
                    placeholder="Search by service, customer name, or provider..."
                    className="w-full bg-slate-50 border-none pl-14 pr-6 py-4 rounded-[1.5rem] text-sm font-bold text-slate-900 outline-none focus:ring-4 ring-indigo-500/5 focus:bg-white transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <button className="hidden md:flex items-center gap-2 px-8 py-4 text-slate-400 hover:text-slate-900 transition-colors font-black text-[10px] uppercase tracking-widest">
                <Filter size={16} /> Filters
            </button>
        </div>

        {/* --- BOOKINGS LEDGER --- */}
        {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading System Ledger</p>
            </div>
        ) : filteredBookings.length === 0 ? (
            <div className="bg-white rounded-[3rem] border border-dashed border-slate-200 py-24 flex flex-col items-center text-center">
                <CalendarDays size={48} className="text-slate-200 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">No Bookings Found</h3>
                <p className="text-slate-400 text-sm font-medium">No activity records match the current parameters.</p>
            </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((b) => (
              <div 
                key={b._id} 
                className="group bg-white rounded-[2rem] border border-slate-100 p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  
                  {/* Service & ID */}
                  <div className="flex items-center gap-6 min-w-[250px]">
                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-inner">
                        <Activity size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none mb-2">{b.service?.name}</h3>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">Ref: {b._id.slice(-8)}</span>
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${getStatusStyle(b.status)}`}>
                                {b.status.replace("_", " ")}
                            </span>
                        </div>
                    </div>
                  </div>

                  {/* Flow: User -> Provider */}
                  <div className="flex-1 flex items-center justify-center gap-4 md:gap-12">
                    <div className="text-center">
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-2">Customer</p>
                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                            <User size={12} className="text-indigo-500" />
                            <span className="text-xs font-bold text-slate-700">{b.user?.name}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 font-medium">{b.user?.email}</p>
                    </div>

                    <div className="text-slate-200">
                        <ArrowRight size={20} />
                    </div>

                    <div className="text-center">
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-2">Service Provider</p>
                        <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl text-white shadow-lg shadow-slate-200">
                            <Wrench size={12} className="text-blue-400" />
                            <span className="text-xs font-bold">{b.provider?.user?.name || "Unassigned"}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 font-medium italic">Partner Account</p>
                    </div>
                  </div>

                  {/* Metadata & Timestamp */}
                  <div className="flex items-center gap-8 pl-8 border-l border-slate-50 min-w-[200px]">
                    <div className="space-y-1 text-right">
                        <div className="flex items-center justify-end gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                            <Clock size={12} className="text-blue-500" /> Booked At
                        </div>
                        <p className="text-xs font-bold text-slate-800 uppercase tracking-tighter">
                            {new Date(b.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-[10px] font-medium text-slate-400 uppercase">
                            {new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                    <button className="p-3 bg-slate-50 text-slate-300 rounded-xl hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                        <ChevronRight size={20} />
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Audit Chain Protocol v2.0 | Secured Session</p>
        </div>
      </main>
    </div>
  );
};

export default AdminBookings;