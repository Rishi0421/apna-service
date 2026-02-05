import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ReviewModal from "../components/ReviewModal";
import ReportModal from "../components/ReportModal";
import EmptyState from "../components/EmptyState";
import { SkeletonBox } from "../components/Skeleton";
import { 
  Calendar, 
  MapPin, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Star, 
  Truck, 
  MoreHorizontal, 
  ChevronRight, 
  MessageCircle,
  Wrench,
  XCircle,
  ClipboardList
} from "lucide-react";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();
  const { user } = useAuth();

  const [showReport, setShowReport] = useState(false);
  const [reportBookingId, setReportBookingId] = useState(null);
  const [showReview, setShowReview] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    if (user) fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get("/bookings/user");
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredBookings = () => {
    if (activeTab === "all") return bookings;
    if (activeTab === "pending") return bookings.filter(b => b.status === "pending");
    if (activeTab === "accepted") return bookings.filter(b => ["accepted", "on_the_way"].includes(b.status));
    if (activeTab === "completed") return bookings.filter(b => b.status === "completed");
    if (activeTab === "rejected") return bookings.filter(b => b.status === "rejected");
    return bookings;
  };

  const filteredBookings = getFilteredBookings();

  const tabs = [
    { id: "all", label: "All Bookings", count: bookings.length },
    { id: "pending", label: "Pending", count: bookings.filter(b => b.status === "pending").length },
    { id: "accepted", label: "Active", count: bookings.filter(b => ["accepted", "on_the_way"].includes(b.status)).length },
    { id: "completed", label: "Completed", count: bookings.filter(b => b.status === "completed").length },
    { id: "rejected", label: "Cancelled", count: bookings.filter(b => b.status === "rejected").length },
  ];

  const getStatusUI = (status) => {
    switch(status) {
      case "pending": return { color: "bg-amber-50 text-amber-600 border-amber-100", icon: <Clock size={14} /> };
      case "accepted": return { color: "bg-blue-50 text-blue-600 border-blue-100", icon: <CheckCircle2 size={14} /> };
      case "on_the_way": return { color: "bg-indigo-50 text-indigo-600 border-indigo-100", icon: <Truck size={14} />, pulse: true };
      case "completed": return { color: "bg-emerald-50 text-emerald-600 border-emerald-100", icon: <CheckCircle2 size={14} /> };
      case "rejected": return { color: "bg-rose-50 text-rose-600 border-rose-100", icon: <XCircle size={14} /> };
      default: return { color: "bg-slate-50 text-slate-600 border-slate-100", icon: <MoreHorizontal size={14} /> };
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-6 pt-32 pb-20">
        
        {/* --- PAGE HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Customer Activity Center</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Booking History</h1>
            <p className="text-slate-500 text-sm font-medium mt-1">Track, manage and review your service requests.</p>
          </div>

          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200"
          >
            Find a Professional <ChevronRight size={14} />
          </button>
        </div>

        {/* --- TAB NAVIGATION (Segmented Pill Style) --- */}
        {!loading && (
          <div className="flex items-center gap-2 bg-slate-200/40 p-1.5 rounded-2xl mb-10 w-fit max-w-full overflow-x-auto no-scrollbar border border-slate-200/50">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-white text-blue-600 shadow-sm ring-1 ring-black/5"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab.label}
                <span className={`px-2 py-0.5 rounded-md text-[9px] ${activeTab === tab.id ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-500'}`}>
                    {tab.count}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* --- BOOKINGS LIST --- */}
        {loading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-[2.5rem] p-8 border border-slate-100">
                <SkeletonBox className="h-6 w-1/4 mb-4" />
                <SkeletonBox className="h-20 w-full rounded-2xl" />
              </div>
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
            <div className="bg-white rounded-[3rem] border border-dashed border-slate-200 py-24 flex flex-col items-center text-center">
                 <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6 border border-slate-100">
                    <ClipboardList size={32} />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-2 uppercase tracking-tight">No Results Found</h3>
                 <p className="text-slate-400 text-sm font-medium mb-8">You don't have any bookings in this category.</p>
                 <button onClick={() => navigate("/")} className="text-blue-600 font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all">Discover Services <ArrowRight size={14}/></button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredBookings.map((booking) => {
                const statusStyle = getStatusUI(booking.status);
                return (
                  <div key={booking._id} className="group bg-white rounded-[2.5rem] border border-slate-100 p-2 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all duration-500">
                    <div className="p-6 md:p-8">
                      {/* Top Header: Service & Status */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner border border-blue-100/50">
                                <Wrench size={28} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                                    {typeof booking.service === "string" ? booking.service : booking.service?.name}
                                </h3>
                                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">
                                    Provider: <span className="text-blue-600">{booking.provider?.user?.name || booking.provider?.name || "Expert Pro"}</span>
                                </p>
                            </div>
                        </div>

                        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-[0.2em] ${statusStyle.color}`}>
                            {statusStyle.pulse && (
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
                                </span>
                            )}
                            {statusStyle.icon}
                            {booking.status.replaceAll("_", " ")}
                        </div>
                      </div>

                      {/* Info Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-8 border-y border-slate-50">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                            <Calendar size={12} className="text-blue-500" /> Appointment
                          </div>
                          <p className="font-bold text-slate-800 text-sm">{new Date(booking.preferredDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}</p>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                            <MapPin size={12} className="text-blue-500" /> Location
                          </div>
                          <p className="font-bold text-slate-800 text-sm truncate max-w-[180px]">{booking.address}</p>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                            <MessageSquare size={12} className="text-blue-500" /> Note
                          </div>
                          <p className="font-bold text-slate-800 text-sm line-clamp-1 italic text-slate-500">"{booking.description}"</p>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                            <Clock size={12} className="text-blue-500" /> Booked On
                          </div>
                          <p className="font-bold text-slate-800 text-sm">{new Date(booking.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-8">
                        <div className="flex items-center gap-3">
                            {["accepted", "on_the_way"].includes(booking.status) && booking.chat && (
                                <button
                                onClick={() => navigate(`/chat/${booking.chat._id}`)}
                                className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-blue-100"
                                >
                                <MessageCircle size={16} /> Open Messenger
                                </button>
                            )}

                            {booking.status === "completed" && !booking.reviewed && (
                                <button
                                onClick={() => { setSelectedBooking(booking._id); setShowReview(true); }}
                                className="flex items-center gap-2 bg-amber-500 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-amber-100"
                                >
                                <Star size={16} /> Rate Experience
                                </button>
                            )}
                        </div>

                        <div className="flex items-center gap-6">
                            {["accepted", "on_the_way", "completed"].includes(booking.status) && (
                                <button
                                onClick={() => { setReportBookingId(booking._id); setShowReport(true); }}
                                className="flex items-center gap-2 text-[10px] font-black text-rose-500 uppercase tracking-widest hover:text-rose-700 transition-colors group/report"
                                >
                                <AlertCircle size={16} className="group-hover/report:animate-shake" /> Report Issue
                                </button>
                            )}

                            {booking.status === "pending" && (
                                <div className="flex items-center gap-2 text-[10px] font-black text-amber-500 uppercase tracking-widest">
                                    <Clock size={16} className="animate-spin-slow" /> Waiting for confirmation
                                </div>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        {/* MODALS */}
        {showReview && (
          <ReviewModal bookingId={selectedBooking} onClose={() => setShowReview(false)} onSuccess={fetchBookings} />
        )}
        {showReport && (
          <ReportModal bookingId={reportBookingId} onClose={() => setShowReport(false)} />
        )}
      </main>
    </div>
  );
};

export default MyBookings;