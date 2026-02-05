import { useState } from "react";
import api from "../api/axios";
import { 
  X, Star, Calendar, MapPin, 
  MessageSquare, ShieldCheck, IndianRupee, 
  ChevronRight, CheckCircle2 
} from "lucide-react";

const ProviderModal = ({ provider, service, pincode, onClose }) => {
  const [description, setDescription] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Find the specific service match
  const matchedService = provider?.services?.find(
    (s) => s?.name?.toLowerCase().trim() === service?.toLowerCase().trim() && s.isApproved
  );

  const sendBookingRequest = async () => {
    if (!provider?._id) return alert("Provider not found");
    if (!matchedService) return alert("This service is not available");
    if (description.trim().length < 10) return alert("Please provide a more detailed description (min 10 chars)");
    if (!preferredDate || !address.trim()) return alert("Please fill all fields");

    try {
      setLoading(true);
      await api.post("/bookings", {
        providerId: provider._id,
        serviceId: matchedService._id,
        description,
        preferredDate: new Date(preferredDate),
        address,
      });
      setSuccessMessage("✅ Booking request sent successfully!");
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send booking request");
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      {/* --- BACKDROP --- */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      {/* --- MODAL CONTAINER --- */}
      <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 flex flex-col max-h-[90vh]">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition-all"
        >
          <X size={20} />
        </button>

        {/* --- HEADER --- */}
        <div className="p-8 pb-6 border-b border-slate-50">
          <div className="flex items-center gap-2 mb-4">
              <div className="px-2 py-0.5 bg-blue-50 border border-blue-100 rounded text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1">
                <ShieldCheck size={10} /> Verified Expert
              </div>
          </div>

          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                {provider?.user?.name}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded text-amber-600 font-bold text-xs">
                    <Star size={12} className="fill-amber-500 text-amber-500" />
                    {provider?.rating || 0}
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                    {provider?.totalReviews || 0} Reviews
                </span>
              </div>
            </div>

            <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                provider?.isOnline 
                  ? "bg-emerald-50 border-emerald-100 text-emerald-600" 
                  : "bg-slate-50 border-slate-100 text-slate-400"
            }`}>
              {provider?.isOnline ? "Online Now" : "Currently Offline"}
            </div>
          </div>
        </div>

        {/* --- CONTENT (SCROLLABLE) --- */}
        <div className="p-8 pt-6 overflow-y-auto space-y-6">
          
          {/* SERVICE SUMMARY TILE */}
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-2xl">
                    🔧
                </div>
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selected Service</p>
                    <p className="text-sm font-bold text-slate-800">{service}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Est. Price</p>
                <div className="flex items-center justify-end text-blue-600 font-black">
                    <IndianRupee size={14} className="stroke-[3]" />
                    <span className="text-xl tracking-tighter">{matchedService?.price || "—"}</span>
                </div>
            </div>
          </div>

          {/* FORM FIELDS */}
          <div className="space-y-5">
            {/* PROBLEM DESCRIPTION */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-500 ml-2">
                <MessageSquare size={14} className="text-blue-500" /> Problem Details
              </label>
              <textarea
                className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm font-semibold text-slate-900 outline-none focus:ring-2 ring-blue-500/10 transition-all resize-none"
                rows="3"
                placeholder="Briefly describe what needs fixing..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="flex justify-end">
                <span className={`text-[10px] font-bold ${description.length < 10 ? 'text-slate-400' : 'text-emerald-500'}`}>
                    {description.length} characters (min 10)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* PREFERRED DATE */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-500 ml-2">
                        <Calendar size={14} className="text-blue-500" /> Preferred Date
                    </label>
                    <input
                        type="date"
                        className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm font-semibold text-slate-900 outline-none focus:ring-2 ring-blue-500/10 transition-all cursor-pointer"
                        min={getMinDate()}
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                    />
                </div>

                {/* LOCATION INFO */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-500 ml-2">
                        <MapPin size={14} className="text-blue-500" /> Pincode Area
                    </label>
                    <div className="w-full bg-slate-100 border-none p-4 rounded-2xl text-sm font-bold text-slate-400">
                        {pincode || "Not Specified"}
                    </div>
                </div>
            </div>

            {/* FULL ADDRESS */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-500 ml-2">
                <CheckCircle2 size={14} className="text-blue-500" /> Complete Address
              </label>
              <textarea
                className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm font-semibold text-slate-900 outline-none focus:ring-2 ring-blue-500/10 transition-all resize-none"
                rows="2"
                placeholder="House no, Street name, Landmark..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* --- FOOTER (ACTIONS) --- */}
        <div className="p-8 bg-slate-50 flex items-center gap-4">
          {successMessage ? (
            <div className="w-full flex items-center justify-center py-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <p className="font-bold text-emerald-700">{successMessage}</p>
            </div>
          ) : (
            <>
              <button
                onClick={onClose}
                className="px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
              >
                Cancel
              </button>
              
              <button
                onClick={sendBookingRequest}
                disabled={loading || !matchedService}
                className="flex-1 bg-slate-900 hover:bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-slate-200 flex items-center justify-center gap-2"
              >
                {loading ? "Processing..." : "Confirm Booking"}
                <ChevronRight size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderModal;