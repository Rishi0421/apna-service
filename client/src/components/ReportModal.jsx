import { useState } from "react";
import api from "../api/axios";
import { 
  AlertTriangle, 
  X, 
  MessageSquare, 
  ShieldAlert, 
  Send, 
  Loader2 
} from "lucide-react";

const ReportModal = ({ bookingId, onClose }) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const submitReport = async () => {
    if (reason.trim().length < 10) {
      alert("Please describe the issue in more detail (min 10 characters)");
      return;
    }

    try {
      setLoading(true);
      await api.post("/reports", {
        bookingId,
        reason,
      });
      alert("✅ Your report has been submitted to our safety team.");
      onClose();
    } catch (err) {
      alert("Failed to submit report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
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
            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mb-6 border border-rose-100 shadow-sm">
                <ShieldAlert size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Report Issue</h2>
            <p className="text-slate-500 text-sm font-medium mt-1">Is something wrong with your booking? <br/>Our safety team is here to help.</p>
        </div>

        {/* --- INPUT AREA --- */}
        <div className="px-8 pb-8 space-y-6">
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                    <MessageSquare size={14} className="text-rose-500" /> Grievance Details
                </label>
                <textarea
                    className="w-full bg-slate-50 border-none p-5 rounded-[1.8rem] text-sm font-bold text-slate-900 outline-none focus:ring-4 ring-rose-500/5 placeholder:text-slate-300 transition-all resize-none"
                    rows="4"
                    placeholder="Describe the problem you faced in detail..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                />
                <div className="flex justify-between items-center px-2">
                    <span className={`text-[10px] font-black uppercase tracking-tighter ${reason.length < 10 ? 'text-slate-300' : 'text-emerald-500'}`}>
                        {reason.length} Characters
                    </span>
                    {reason.length < 10 && (
                        <span className="text-[9px] font-bold text-rose-400 uppercase tracking-tighter italic flex items-center gap-1">
                            <AlertTriangle size={10}/> 10 min.
                        </span>
                    )}
                </div>
            </div>

            {/* --- ACTION BUTTONS --- */}
            <div className="flex flex-col gap-3">
                <button
                    onClick={submitReport}
                    disabled={loading || reason.length < 10}
                    className="w-full bg-rose-600 hover:bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all transform active:scale-[0.98] disabled:opacity-30 flex items-center justify-center gap-3 shadow-xl shadow-rose-100"
                >
                    {loading ? (
                        <Loader2 className="animate-spin" size={16} />
                    ) : (
                        <>
                            Submit Report <Send size={14} />
                        </>
                    )}
                </button>
                <button 
                    onClick={onClose} 
                    className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                >
                    Cancel Request
                </button>
            </div>
        </div>

        {/* --- SAFETY FOOTER --- */}
        <div className="bg-rose-50/50 py-4 text-center border-t border-rose-100/50">
            <p className="text-[9px] font-bold text-rose-500 uppercase tracking-widest flex items-center justify-center gap-2">
                <ShieldAlert size={12} /> Priority Safety Review Enabled
            </p>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;