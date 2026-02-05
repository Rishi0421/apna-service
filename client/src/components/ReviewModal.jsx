import { useState } from "react";
import api from "../api/axios";
import { Star, X, MessageSquare, Send, Award, Loader2 } from "lucide-react";

const ReviewModal = ({ bookingId, onClose, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const getRatingLabel = (val) => {
    switch (val) {
      case 1: return "Poor";
      case 2: return "Fair";
      case 3: return "Good";
      case 4: return "Very Good";
      case 5: return "Excellent";
      default: return "Select your rating";
    }
  };

  const submitReview = async () => {
    if (rating < 1) {
      alert("Please select a rating before submitting.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/reviews", {
        bookingId,
        rating,
        comment,
      });
      onSuccess();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Review failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* --- BACKDROP --- */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      {/* --- MODAL CONTAINER --- */}
      <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition-all z-10"
        >
          <X size={18} />
        </button>

        {/* --- HEADER --- */}
        <div className="p-8 pb-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 border border-blue-100 shadow-sm">
                <Award size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Rate Experience</h2>
            <p className="text-slate-400 text-sm font-medium mt-1">How was the service provided?</p>
        </div>

        {/* --- STAR SELECTOR --- */}
        <div className="px-8 pb-4 flex flex-col items-center">
            <div className="flex gap-2 mb-3">
            {[1, 2, 3, 4, 5].map((num) => (
                <button
                    key={num}
                    onMouseEnter={() => setHover(num)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRating(num)}
                    className="p-1 transition-transform active:scale-90"
                >
                <Star
                    size={36}
                    strokeWidth={1.5}
                    className={`transition-all duration-300 ${
                        (hover || rating) >= num 
                        ? "fill-amber-400 text-amber-400 scale-110 shadow-amber-100" 
                        : "text-slate-200"
                    }`}
                />
                </button>
            ))}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${rating > 0 ? 'text-blue-600' : 'text-slate-300'}`}>
                {getRatingLabel(hover || rating)}
            </span>
        </div>

        {/* --- COMMENT INPUT --- */}
        <div className="p-8 pt-4 space-y-4">
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                    <MessageSquare size={14} className="text-blue-500" /> Detailed Feedback
                </label>
                <textarea
                    className="w-full bg-slate-50 border-none p-5 rounded-[1.8rem] text-sm font-bold text-slate-900 outline-none focus:ring-4 ring-blue-500/5 placeholder:text-slate-300 transition-all resize-none"
                    rows="3"
                    placeholder="Tell us what you liked or what could be improved..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
            </div>

            {/* --- ACTION BUTTONS --- */}
            <div className="flex flex-col gap-3 pt-2">
                <button
                    onClick={submitReview}
                    disabled={loading || rating === 0}
                    className="w-full bg-slate-900 hover:bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all transform active:scale-[0.98] disabled:opacity-30 flex items-center justify-center gap-3 shadow-xl shadow-slate-200"
                >
                    {loading ? (
                        <Loader2 className="animate-spin" size={16} />
                    ) : (
                        <>
                            Post Review <Send size={14} />
                        </>
                    )}
                </button>
                <button 
                    onClick={onClose} 
                    className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                >
                    Skip for now
                </button>
            </div>
        </div>

        {/* --- FOOTER TAG --- */}
        <div className="bg-slate-50 py-4 text-center">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Your feedback helps our community grow</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;