import { useEffect, useState } from "react";
import api from "../api/axios";
import AdminSidebar from "../components/AdminSidebar";
import Navbar from "../components/Navbar";
import { 
  ShieldAlert, 
  CheckCircle2, 
  User, 
  AlertTriangle, 
  Search, 
  Filter, 
  ArrowRight, 
  ExternalLink,
  Clock,
  History,
  Inbox,
  Loader2,
  Scale
} from "lucide-react";

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await api.get("/reports");
      setReports(res.data);
    } catch (err) {
      console.error("Fetch reports error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const resolveReport = async (id) => {
    try {
      await api.put(`/reports/${id}/resolve`);
      alert("Case resolved and closed successfully.");
      fetchReports();
    } catch (err) {
      alert("Action failed. System error.");
    }
  };

  const filteredReports = reports.filter(r => 
    r.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.reporter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.reportedUser.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingCases = reports.filter(r => r.status === "pending").length;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <AdminSidebar />

      <main className="ml-72 p-8 pt-32 transition-all duration-500">
        
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <ShieldAlert className="text-rose-600" size={18} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Security Operations</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Resolution_Center</h1>
            <p className="text-slate-500 text-sm font-medium mt-1">Grievance monitoring and platform integrity control.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Open Cases</p>
                    <p className="text-xl font-black text-rose-600">{pendingCases}</p>
                </div>
                <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 border border-rose-100">
                    <AlertTriangle size={20} />
                </div>
            </div>
          </div>
        </div>

        {/* --- SEARCH & FILTER BAR --- */}
        <div className="bg-white border border-slate-100 p-2 rounded-[2rem] shadow-sm flex items-center gap-2 mb-10">
            <div className="relative flex-1 group">
                <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                    type="text"
                    placeholder="Filter by reporter, reason or case ID..."
                    className="w-full bg-slate-50 border-none pl-14 pr-6 py-4 rounded-[1.5rem] text-sm font-bold text-slate-900 outline-none focus:ring-4 ring-indigo-500/5 focus:bg-white transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <button className="hidden md:flex items-center gap-2 px-8 py-4 text-slate-400 hover:text-slate-900 transition-colors font-black text-[10px] uppercase tracking-widest">
                <Filter size={16} /> Audit Trail
            </button>
        </div>

        {/* --- CASE LOG --- */}
        {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Synchronizing Incident Logs</p>
            </div>
        ) : filteredReports.length === 0 ? (
            <div className="bg-white rounded-[3rem] border border-dashed border-slate-200 py-24 flex flex-col items-center text-center">
                <Inbox size={48} className="text-slate-200 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 uppercase">Clear Records</h3>
                <p className="text-slate-400 text-sm font-medium max-w-xs">No active reports match your current filter or query.</p>
            </div>
        ) : (
          <div className="space-y-6">
            {filteredReports.map((r) => (
              <div 
                key={r._id} 
                className={`group bg-white rounded-[2.5rem] border transition-all duration-500 relative overflow-hidden ${
                    r.status === 'resolved' 
                    ? "opacity-60 border-slate-50 grayscale-[0.5]" 
                    : "border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
                }`}
              >
                <div className="p-8">
                  {/* Row 1: Case Identity & Status */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-50">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner border ${
                            r.status === 'pending' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                        }`}>
                            <Scale size={24} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Case_Ref: {r._id.slice(-8)}</h3>
                            <div className="flex items-center gap-3 mt-1">
                                <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-lg border ${
                                    r.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                }`}>
                                    {r.status}
                                </span>
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                                    <Clock size={12} /> {new Date(r.createdAt).toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Booking ID</span>
                        <span className="text-xs font-bold text-slate-900 italic">{r.booking._id}</span>
                        <ExternalLink size={12} className="text-blue-500 cursor-pointer hover:scale-110 transition-transform" />
                    </div>
                  </div>

                  {/* Row 2: Participants */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-3">
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] ml-1">Initiated By</p>
                        <div className="flex items-center gap-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-indigo-600 font-black shadow-sm border border-slate-100">
                                {r.reporter.name.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm font-black text-slate-800">{r.reporter.name}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{r.reporter.role}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] ml-1">Action Against</p>
                        <div className="flex items-center gap-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black shadow-sm">
                                {r.reportedUser.name.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm font-black text-slate-800">{r.reportedUser.name}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{r.reportedUser.role}</p>
                            </div>
                        </div>
                    </div>
                  </div>

                  {/* Row 3: Narrative & Actions */}
                  <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                    <div className="flex-1">
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-2 ml-1">Grievance Narrative</p>
                        <div className="bg-indigo-50/30 border border-indigo-100/50 p-5 rounded-[1.8rem]">
                            <p className="text-sm font-semibold text-slate-700 leading-relaxed">
                                "{r.reason}"
                            </p>
                        </div>
                    </div>

                    <div className="lg:shrink-0 pt-4 lg:pt-0">
                        {r.status === "pending" ? (
                            <button
                                onClick={async () => {
                                    await api.put(`/reports/${r._id}/resolve`);
                                    fetchReports();
                                }}
                                className="w-full lg:w-auto bg-slate-900 hover:bg-emerald-600 text-white px-8 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all transform active:scale-95 shadow-xl shadow-slate-200 flex items-center justify-center gap-3 group"
                            >
                                <CheckCircle2 size={16} className="group-hover:animate-bounce" />
                                Resolve & Close Case
                            </button>
                        ) : (
                            <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest bg-emerald-50 px-6 py-4 rounded-2xl border border-emerald-100">
                                <History size={16} /> Audit Record Closed
                            </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-20 py-10 border-t border-slate-100 text-center">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Hubly Security & Compliance Protocol Suite</p>
        </div>
      </main>
    </div>
  );
};

export default AdminReports;