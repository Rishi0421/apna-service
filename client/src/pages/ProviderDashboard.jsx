import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import ProviderEmptyState from "../components/ProviderEmptyState";
import { SkeletonBox } from "../components/Skeleton";
import BookingDetailsModal from "../components/BookingDetailsModal";
import { 
  Activity, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  User, 
  MessageSquare, 
  MapPin, 
  ChevronRight,
  Power,
  Briefcase,
  PlayCircle,
  Truck,
  Inbox,
  AlertCircle,
  ClipboardList
} from "lucide-react";

const TABS = [
  { key: "new", label: "New Requests", icon: <Inbox size={16} /> },
  { key: "ongoing", label: "Ongoing Jobs", icon: <Activity size={16} /> },
  { key: "completed", label: "Completed", icon: <CheckCircle2 size={16} /> },
  { key: "cancelled", label: "Cancelled", icon: <XCircle size={16} /> },
];

const ProviderDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("new");
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchAvailability();
    fetchBookings();
  }, []);

  const fetchAvailability = async () => {
    try {
      const res = await api.get("/providers/me");
      setIsOnline(res.data.isOnline);
    } catch (err) { console.error(err); }
  };

  const toggleAvailability = async () => {
    try {
      const res = await api.put("/providers/availability");
      setIsOnline(res.data.isOnline);
    } catch (err) { console.error(err); }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get("/bookings/provider");
      setBookings(res.data);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    await api.put(`/bookings/${id}`, { status });
    fetchBookings();
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === "new") return b.status === "pending";
    if (activeTab === "ongoing") return ["accepted", "on_the_way", "started"].includes(b.status);
    if (activeTab === "completed") return b.status === "completed";
    if (activeTab === "cancelled") return b.status === "rejected";
    return false;
  });

  // PROFESSIONAL ICON-BASED EMPTY STATES
  const getEmptyStateContent = () => {
    const states = {
      new: { icon: <Inbox size={48} />, title: "No New Requests", desc: "Your inbox is clear. Incoming service requests will appear here." },
      ongoing: { icon: <Activity size={48} />, title: "No Active Jobs", desc: "Accepted bookings will appear here during the service phase." },
      completed: { icon: <CheckCircle2 size={48} />, title: "No History Found", desc: "Your successfully finished jobs will be archived here." },
      cancelled: { icon: <AlertCircle size={48} />, title: "No Cancellations", desc: "Rejected or cancelled service requests will appear here." },
    };
    return states[activeTab];
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-32 pb-20">
        
        {/* --- DASHBOARD HEADER & STATUS --- */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Workspace Management</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Provider Hub</h1>
          </div>

          <div className={`flex items-center gap-4 p-2 pl-6 rounded-2xl border transition-all duration-500 shadow-sm ${
            isOnline ? "bg-emerald-50 border-emerald-100" : "bg-white border-slate-200"
          }`}>
            <div className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-300'}`}></div>
                <span className={`text-[11px] font-black uppercase tracking-widest ${isOnline ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {isOnline ? "Marketplace Active" : "Currently Offline"}
                </span>
            </div>
            <button
              onClick={toggleAvailability}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                isOnline 
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700" 
                  : "bg-slate-900 text-white hover:bg-black"
              }`}
            >
              <Power size={14} strokeWidth={3} />
              {isOnline ? "Go Offline" : "Go Online"}
            </button>
          </div>
        </div>

        {/* --- TABS: SEGMENTED CONTROL --- */}
        <div className="flex items-center gap-1.5 bg-slate-200/50 p-1.5 rounded-2xl mb-10 w-fit max-w-full overflow-x-auto no-scrollbar border border-slate-200/50">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === t.key
                  ? "bg-white text-blue-600 shadow-sm ring-1 ring-black/5"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span className={activeTab === t.key ? "text-blue-600" : "text-slate-400"}>{t.icon}</span>
              {t.label}
              <span className={`ml-1 px-2 py-0.5 rounded-md text-[9px] ${activeTab === t.key ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-600'}`}>
                {bookings.filter(b => {
                    if (t.key === "new") return b.status === "pending";
                    if (t.key === "ongoing") return ["accepted", "on_the_way", "started"].includes(b.status);
                    if (t.key === "completed") return b.status === "completed";
                    if (t.key === "cancelled") return b.status === "rejected";
                    return false;
                }).length}
              </span>
            </button>
          ))}
        </div>

        {/* --- DASHBOARD CONTENT --- */}
        {loading ? (
          <div className="grid gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-[2rem] p-8 border border-slate-100 animate-pulse">
                <SkeletonBox className="h-6 w-1/4 mb-4" />
                <SkeletonBox className="h-20 w-full rounded-xl" />
              </div>
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-[3rem] border border-dashed border-slate-200 py-24 flex flex-col items-center text-center px-6">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6 border border-slate-100">
                {getEmptyStateContent().icon}
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-2 uppercase tracking-tight">{getEmptyStateContent().title}</h3>
             <p className="text-slate-400 text-sm font-medium max-w-xs leading-relaxed">{getEmptyStateContent().desc}</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredBookings.map((b) => (
              <div key={b._id} className="group bg-white rounded-[2rem] border border-slate-100 p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                  
                  {/* Service Information Block */}
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner border border-blue-100/50">
                        <Briefcase size={28} />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">{b.service?.name}</h3>
                            <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase tracking-widest">
                                {b.status.replace("_", " ")}
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <span className="flex items-center gap-1.5"><User size={14} className="text-blue-500" /> {b.user.name}</span>
                            <span className="flex items-center gap-1.5"><MapPin size={14} className="text-blue-500" /> {b.address}</span>
                            <span className="flex items-center gap-1.5"><Calendar size={14} className="text-blue-500" /> {new Date(b.preferredDate).toLocaleDateString()}</span>
                        </div>
                    </div>
                  </div>

                  {/* Actions Interaction Area */}
                  <div className="flex flex-wrap items-center gap-3 bg-slate-50 md:bg-transparent p-4 md:p-0 rounded-2xl">
                    
                    {/* CASE 1: PENDING REQUEST */}
                    {b.status === "pending" && (
                      <div className="flex items-center gap-2 w-full md:w-auto">
                        <button onClick={() => setSelectedBooking(b)} className="px-6 py-3 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:bg-slate-200 transition-all tracking-widest flex items-center gap-2">
                            <ClipboardList size={14}/> Details
                        </button>
                        <button onClick={() => updateStatus(b._id, "accepted")} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-100 flex items-center gap-2">
                            <CheckCircle2 size={14}/> Accept
                        </button>
                        <button onClick={() => updateStatus(b._id, "rejected")} className="bg-white text-rose-500 border border-rose-100 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">
                            Decline
                        </button>
                      </div>
                    )}

                    {/* CASE 2: ACCEPTED / LOGISTICS */}
                    {b.status === "accepted" && (
                      <div className="flex items-center gap-3">
                        <button onClick={() => navigate(`/chat/${b.chat._id}`)} className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-blue-100">
                            <MessageSquare size={16} /> Open Chat
                        </button>
                        <button onClick={() => updateStatus(b._id, "on_the_way")} className="flex items-center gap-2 bg-amber-500 text-white px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-amber-100">
                            <Truck size={16} /> On the Way
                        </button>
                      </div>
                    )}

                    {/* CASE 3: TRAVELING */}
                    {b.status === "on_the_way" && (
                      <div className="flex items-center gap-3">
                        <button onClick={() => navigate(`/chat/${b.chat}`)} className="p-4 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors">
                            <MessageSquare size={20} />
                        </button>
                        <button onClick={() => updateStatus(b._id, "started")} className="flex items-center gap-3 bg-slate-900 text-white px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">
                            <PlayCircle size={20} /> Initialize Job
                        </button>
                      </div>
                    )}

                    {/* CASE 4: WORK IN PROGRESS */}
                    {b.status === "started" && (
                      <button onClick={() => updateStatus(b._id, "completed")} className="bg-emerald-600 text-white px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 flex items-center gap-3">
                        <CheckCircle2 size={20} strokeWidth={3} /> Finalize & Bill Job
                      </button>
                    )}

                    {/* CASE 5: SUCCESS ARCHIVE */}
                    {b.status === "completed" && (
                      <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-[0.2em] bg-emerald-50 px-5 py-2.5 rounded-xl border border-emerald-100">
                        <CheckCircle2 size={16} /> Job Complete
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* DETAILS MODAL */}
        {selectedBooking && (
          <BookingDetailsModal
            booking={selectedBooking}
            onClose={() => setSelectedBooking(null)}
            onAccept={(id) => { updateStatus(id, "accepted"); setSelectedBooking(null); }}
            onReject={(id) => { updateStatus(id, "rejected"); setSelectedBooking(null); }}
          />
        )}
      </main>
    </div>
  );
};

export default ProviderDashboard;