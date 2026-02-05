import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { 
  AlertTriangle, 
  CheckCircle, 
  User, 
  Clock, 
  Flag, 
  ChevronRight, 
  ShieldAlert,
  Loader2,
  CheckCircle2,
  Inbox
} from "lucide-react";

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/reports");
      setReports(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const resolve = async (id) => {
    try {
      await api.put(`/admin/reports/resolve/${id}`);
      fetchReports();
    } catch (err) {
      alert("Resolution failed");
    }
  };

  const pendingCount = reports.filter(r => !r.resolved).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-6 pt-32 pb-20">
        
        {/* --- DASHBOARD HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <ShieldAlert className="text-rose-500" size={18} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Admin Control</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Resolution Center</h1>
            <p className="text-slate-500 text-sm font-medium mt-1">Review and manage community reports and grievances.</p>
          </div>

          <div className="flex items-center gap-4 bg-white p-2 pl-6 rounded-3xl border border-slate-100 shadow-sm">
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Pending Issues</span>
            <div className="bg-rose-500 text-white h-10 px-4 rounded-2xl flex items-center justify-center font-black text-sm shadow-lg shadow-rose-100">
                {pendingCount}
            </div>
          </div>
        </div>

        {/* --- REPORTS LIST --- */}
        {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accessing Logs</p>
            </div>
        ) : reports.length === 0 ? (
            <div className="bg-white rounded-[3rem] border border-dashed border-slate-200 py-24 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6 border border-slate-100">
                    <Inbox size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 uppercase tracking-tight">System Clear</h3>
                <p className="text-slate-400 text-sm font-medium max-w-xs">There are no reported issues that require your attention at this time.</p>
            </div>
        ) : (
          <div className="grid gap-6">
            {reports.map((r) => (
              <div 
                key={r._id} 
                className={`group bg-white rounded-[2.5rem] border transition-all duration-500 overflow-hidden ${
                    r.resolved ? "border-slate-50 opacity-60" : "border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
                }`}
              >
                <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
                  
                  {/* LEFT SIDE: REPORT INFO */}
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-inner ${
                        r.resolved ? "bg-slate-50 border-slate-100 text-slate-300" : "bg-rose-50 border-rose-100 text-rose-500"
                    }`}>
                        {r.resolved ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
                    </div>
                    
                    <div>
                        <div className="flex items-center gap-3 mb-1.5">
                            <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase">
                                Case #{r._id.slice(-6)}
                            </h3>
                            <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${
                                r.resolved ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                            }`}>
                                {r.resolved ? "Resolved" : "Awaiting Action"}
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                            <span className="flex items-center gap-1.5"><User size={14} className="text-blue-500" /> From: {r.user?.name || "Anonymous"}</span>
                            <span className="flex items-center gap-1.5"><Clock size={14} className="text-blue-500" /> {new Date(r.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                  </div>

                  {/* MIDDLE: REASON BOX */}
                  <div className="flex-1 bg-slate-50/50 p-5 rounded-3xl border border-slate-100 md:max-w-md">
                    <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">
                        <Flag size={12} className="text-rose-400" /> Reported Grievance
                    </div>
                    <p className="text-sm font-semibold text-slate-700 leading-relaxed italic">
                        "{r.reason}"
                    </p>
                  </div>

                  {/* RIGHT SIDE: ACTIONS */}
                  <div className="flex items-center justify-end">
                    {!r.resolved ? (
                      <button
                        onClick={() => resolve(r._id)}
                        className="bg-slate-900 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all transform active:scale-[0.98] flex items-center gap-2 shadow-xl shadow-slate-200"
                      >
                        Resolve Case <CheckCircle size={14} />
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
                        <CheckCircle size={18} /> Closed
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminReports;