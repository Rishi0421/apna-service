import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { 
  Star, 
  User, 
  MessageSquare, 
  Calendar, 
  Quote, 
  CheckCircle2,
  TrendingUp,
  Loader2,
  Award
} from "lucide-react";

const ProviderReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get("/providers/reviews");
      setReviews(res.data);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats for the eye-catching summary
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-6 pt-32 pb-20">
        
        {/* --- DASHBOARD HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <Award className="text-indigo-600" size={18} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Reputation Management</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight italic">Feedback_Vault</h1>
            <p className="text-slate-500 text-sm font-medium mt-1">Review your performance based on customer experiences.</p>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-white border border-slate-100 p-2 pl-6 rounded-3xl shadow-sm flex items-center gap-6">
             <div className="text-right">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Global Rating</p>
                <div className="flex items-center justify-end gap-1">
                    <span className="text-xl font-black text-slate-900">{averageRating}</span>
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                </div>
             </div>
             <div className="h-10 w-px bg-slate-100"></div>
             <div className="pr-4">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">Total Reviews</p>
                <p className="text-xl font-black text-indigo-600 text-left">{reviews.length}</p>
             </div>
          </div>
        </div>

        {/* --- REVIEWS LIST --- */}
        {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Testimonials</p>
            </div>
        ) : reviews.length === 0 ? (
          <div className="bg-white rounded-[3rem] border border-dashed border-slate-200 py-24 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6 border border-slate-100">
                <MessageSquare size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 uppercase tracking-tight">No Feedback Yet</h3>
            <p className="text-slate-400 text-sm font-medium max-w-xs">Complete your first job to start receiving customer reviews.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {reviews.map((r) => (
              <div 
                key={r._id} 
                className="group bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500 relative overflow-hidden"
              >
                {/* Decorative Background Quote */}
                <Quote className="absolute -top-4 -right-4 w-32 h-32 text-slate-50 opacity-50 group-hover:text-indigo-50 transition-colors" />

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
                  <div className="flex items-center gap-5">
                    {/* User Avatar */}
                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-xl shadow-inner border border-indigo-100">
                      {r.user?.name?.charAt(0) || <User size={24}/>}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-black text-slate-900 tracking-tight">{r.user?.name || "Anonymous Client"}</h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                    key={star} 
                                    size={12} 
                                    className={`${star <= r.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} 
                                />
                            ))}
                        </div>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-2 flex items-center gap-1">
                            <CheckCircle2 size={10} className="text-emerald-500" /> Verified Booking
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                    <Calendar size={12} className="text-blue-500" />
                    {new Date(r.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                  </div>
                </div>

                {/* Review Body */}
                <div className="mt-8 pl-0 md:pl-20">
                    <div className="bg-slate-50/50 p-6 rounded-[1.8rem] border border-slate-100 relative">
                        <p className="text-slate-600 font-semibold leading-relaxed italic text-sm md:text-base">
                            "{r.comment || "The customer didn't leave a written review, but provided a high rating."}"
                        </p>
                    </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Meta */}
        <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full text-indigo-600">
                <TrendingUp size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Ratings contribute to platform visibility</span>
            </div>
        </div>
      </main>
    </div>
  );
};

export default ProviderReviews;