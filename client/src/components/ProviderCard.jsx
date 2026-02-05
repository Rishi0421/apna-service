import { Star, MapPin, CheckCircle2, ArrowRight, ShieldCheck, IndianRupee } from "lucide-react";

const ProviderCard = ({ provider, service, pincode, onView }) => {
  // Case-insensitive service match
  const matchedService = provider.services?.find(
    (s) => s?.name?.toLowerCase().trim() === service.toLowerCase().trim(),
  );

  const imageUrl = matchedService?.image 
    ? `http://localhost:5000${matchedService.image}`
    : "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=400";

  return (
    <div className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden flex flex-col h-full border-b-4 hover:border-b-blue-600">
      
      {/* --- IMAGE SECTION --- */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={imageUrl}
          alt={`${service} by ${provider.user?.name}`}
          className="object-cover h-full w-full transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* OVERLAY GRADIENT */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* ONLINE STATUS BADGE */}
        <div className="absolute top-4 right-4">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border text-[10px] font-black uppercase tracking-widest ${
            provider.isOnline 
            ? "bg-emerald-500/90 border-emerald-400 text-white" 
            : "bg-slate-800/80 border-slate-700 text-slate-300"
          }`}>
            {provider.isOnline && (
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
            )}
            {provider.isOnline ? "Online" : "Offline"}
          </div>
        </div>

        {/* VERIFIED TAG */}
        <div className="absolute bottom-4 left-4">
            <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20">
                <ShieldCheck className="w-3 h-3 text-blue-600" />
                <span className="text-[10px] font-black text-slate-900 uppercase">Verified Pro</span>
            </div>
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="p-6 flex-1 flex flex-col">
        
        {/* CATEGORY & RATING */}
        <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] bg-blue-50 px-3 py-1 rounded-md">
                {service}
            </span>
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-md">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span className="text-xs font-black text-amber-700">{provider.rating || 0}</span>
                <span className="text-[10px] text-amber-600/70 font-bold">({provider.totalReviews || 0})</span>
            </div>
        </div>

        {/* NAME */}
        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
            {provider.user?.name}
        </h3>

        {/* DESCRIPTION */}
        <p className="text-xs font-medium text-slate-500 leading-relaxed line-clamp-2 mb-6">
            Providing professional and background-verified {service.toLowerCase()} services. Trusted by local residents in {pincode}.
        </p>

        {/* PRICE & LOCATION */}
        <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
            <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Starting from</p>
                <div className="flex items-center text-blue-600">
                    <IndianRupee className="w-4 h-4 stroke-[3px]" />
                    <span className="text-2xl font-black tracking-tighter">
                        {matchedService?.price ?? "—"}
                    </span>
                    <span className="text-xs font-bold text-slate-400 ml-1">/ Onwards</span>
                </div>
            </div>

            <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Location</p>
                <div className="flex items-center justify-end gap-1 text-slate-700 font-bold text-xs">
                    <MapPin className="w-3 h-3" />
                    {pincode}
                </div>
            </div>
        </div>

        {/* ACTION BUTTON */}
        <button
          onClick={() => onView(provider)}
          className="mt-6 w-full group/btn relative flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-600 text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-xl shadow-slate-200 hover:shadow-blue-200 overflow-hidden"
        >
          <span className="relative z-10">View Details & Book</span>
          <ArrowRight className="w-4 h-4 relative z-10 transition-transform group-hover/btn:translate-x-1" />
          
          {/* Subtle Button Shine Animation */}
          <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[45deg] -translate-x-full group-hover/btn:translate-x-[250%] transition-transform duration-1000"></div>
        </button>
      </div>
    </div>
  );
};

export default ProviderCard;