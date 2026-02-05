import { 
  X, 
  User, 
  Calendar, 
  MapPin, 
  Briefcase, 
  CheckCircle2, 
  XCircle,
  Clock,
  MessageSquare
} from "lucide-react";

const BookingDetailsModal = ({ booking, onClose, onAccept, onReject }) => {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* --- BACKDROP --- */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      {/* --- MODAL CONTENT --- */}
      <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition-all z-10"
        >
          <X size={20} />
        </button>

        {/* --- HEADER SECTION --- */}
        <div className="p-8 pb-6 border-b border-slate-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
                <Briefcase size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-0.5">Incoming Request</p>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {booking.service?.name}
              </h2>
            </div>
          </div>
        </div>

        {/* --- DETAILS GRID --- */}
        <div className="p-8 space-y-6">
          
          {/* CUSTOMER & DATE INFO */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <User size={14} className="text-indigo-500" /> Customer
                </label>
                <p className="text-sm font-bold text-slate-900 pl-6">{booking.user?.name}</p>
            </div>

            <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <Calendar size={14} className="text-indigo-500" /> Preferred Date
                </label>
                <p className="text-sm font-bold text-slate-900 pl-6">
                    {new Date(booking.preferredDate).toLocaleDateString(undefined, { dateStyle: 'long' })}
                </p>
            </div>
          </div>

          {/* ADDRESS INFO */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <MapPin size={14} className="text-indigo-500" /> Service Location
            </label>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 ml-6">
                <p className="text-sm font-bold text-slate-700 leading-relaxed">
                    {booking.address}
                </p>
            </div>
          </div>

          {/* PROBLEM DESCRIPTION */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <MessageSquare size={14} className="text-indigo-500" /> Problem Description
            </label>
            <div className="bg-indigo-50/50 border border-indigo-100 p-5 rounded-3xl ml-6">
                <p className="text-sm font-semibold text-slate-700 leading-relaxed italic">
                    "{booking.description}"
                </p>
            </div>
          </div>
        </div>

        {/* --- ACTION FOOTER --- */}
        <div className="p-8 pt-4 bg-slate-50 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => onAccept(booking._id)}
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all transform active:scale-[0.98] shadow-lg shadow-emerald-100"
          >
            <CheckCircle2 size={16} />
            Accept Request
          </button>

          <button
            onClick={() => onReject(booking._id)}
            className="flex-1 flex items-center justify-center gap-2 bg-white border border-rose-100 text-rose-500 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-rose-500 hover:text-white transition-all transform active:scale-[0.98]"
          >
            <XCircle size={16} />
            Decline
          </button>
        </div>

        {/* TIME STAMP */}
        <div className="px-8 pb-6 bg-slate-50 flex justify-center">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                <Clock size={12} /> Received on {new Date(booking.createdAt).toLocaleString()}
            </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;