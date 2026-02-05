import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import ProviderCard from "../components/ProviderCard";
import ProviderModal from "../components/ProviderModal";
import EmptyState from "../components/EmptyState";
import { SkeletonBox } from "../components/Skeleton";
import { 
  MapPin, 
  Wrench, 
  SlidersHorizontal, 
  Star, 
  IndianRupee, 
  Zap, 
  Search, 
  ChevronLeft,
  ArrowUpDown,
  Filter
} from "lucide-react";

const SearchResults = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const pincode = params.get("pincode");
  const service = params.get("service");

  const [allProviders, setAllProviders] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("rating");
  const [selectedProvider, setSelectedProvider] = useState(null);

  useEffect(() => {
    fetchProviders();
  }, [pincode, service]);

  useEffect(() => {
    sortProviders();
  }, [sortBy, allProviders]);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/providers/search?pincode=${pincode}&service=${service}`
      );
      setAllProviders(res.data);
    } catch (err) {
      setAllProviders([]);
    } finally {
      setLoading(false);
    }
  };

  const sortProviders = () => {
    let sorted = [...allProviders];
    if (sortBy === "rating") {
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "price") {
      sorted.sort((a, b) => {
        const priceA = a.services?.find(s => s.name?.toLowerCase() === service?.toLowerCase())?.price || Infinity;
        const priceB = b.services?.find(s => s.name?.toLowerCase() === service?.toLowerCase())?.price || Infinity;
        return priceA - priceB;
      });
    } else if (sortBy === "online") {
      sorted.sort((a, b) => (b.isOnline ? -1 : 1));
    }
    setProviders(sorted);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-32 pb-20">
        
        {/* --- HEADER: BREADCRUMBS & SEARCH INFO --- */}
        <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
            <button 
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors mb-6 group"
            >
                <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Modify Search</span>
            </button>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="px-2.5 py-1 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-600">
                            <Search size={14} strokeWidth={3} />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                            {service} <span className="text-slate-400 font-medium text-2xl md:text-3xl">near</span> {pincode}
                        </h1>
                    </div>
                    <p className="text-slate-500 font-bold text-sm ml-1">
                        Found {providers.length} verified professionals ready to help.
                    </p>
                </div>

                {/* --- SORT CONTROLS (Pills) --- */}
                {!loading && providers.length > 0 && (
                    <div className="flex items-center gap-2 bg-slate-200/50 p-1.5 rounded-2xl border border-slate-200/50">
                        <div className="px-3 text-[10px] font-black uppercase text-slate-400 border-r border-slate-200">Sort By</div>
                        {[
                            { id: "rating", label: "Top Rated", icon: <Star size={12} /> },
                            { id: "price", label: "Lowest Price", icon: <IndianRupee size={12} /> },
                            { id: "online", label: "Online Now", icon: <Zap size={12} /> }
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setSortBy(item.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                    sortBy === item.id 
                                    ? "bg-white text-indigo-600 shadow-sm ring-1 ring-black/5" 
                                    : "text-slate-500 hover:bg-white/50 hover:text-slate-800"
                                }`}
                            >
                                {item.icon}
                                {item.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>

        {/* --- RESULTS GRID --- */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm">
                <SkeletonBox className="h-48 w-full rounded-3xl mb-6" />
                <SkeletonBox className="h-6 w-1/2 mb-4" />
                <SkeletonBox className="h-4 w-full mb-2" />
                <SkeletonBox className="h-4 w-3/4 mb-6" />
                <div className="flex justify-between">
                    <SkeletonBox className="h-10 w-24 rounded-xl" />
                    <SkeletonBox className="h-10 w-24 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : providers.length === 0 ? (
          <div className="bg-white rounded-[3rem] border border-dashed border-slate-200 py-32 flex flex-col items-center text-center px-6">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-8 border border-slate-100">
                <Filter size={32} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">No results in this area</h3>
            <p className="text-slate-400 text-sm font-medium max-w-sm leading-relaxed mb-10">
                We couldn't find any {service.toLowerCase()} experts in {pincode}. Try checking a nearby pincode or a different service category.
            </p>
            <button 
                onClick={() => navigate("/")}
                className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200"
            >
                Start New Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {providers.map((p) => (
              <ProviderCard 
                key={p._id} 
                provider={p} 
                service={service} 
                pincode={pincode} 
                onView={() => setSelectedProvider(p)} 
              />
            ))}
          </div>
        )}
      </main>

      {/* --- PROVIDER MODAL --- */}
      {selectedProvider && (
        <ProviderModal 
            provider={selectedProvider} 
            service={service} 
            pincode={pincode} 
            onClose={() => setSelectedProvider(null)} 
        />
      )}
    </div>
  );
};

export default SearchResults;