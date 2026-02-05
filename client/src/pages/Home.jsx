import { useState, useEffect, useRef } from "react";
import { 
  Search, MapPin, Wrench, ChevronDown, 
  ShieldCheck, Clock, Star, ArrowRight, Zap 
} from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import ProviderModal from "../components/ProviderModal";
import ProviderCard from "../components/ProviderCard";
import Footer from "../components/Footer";

const CITIES = ["Kolkata", "Durgapur", "Asansol", "Howrah", "Siliguri"];

const Home = () => {
  const { user } = useAuth();
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState(user?.pincode || "");
  const [service, setService] = useState("");
  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const [cityOpen, setCityOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);

  const cityRef = useRef(null);
  const serviceRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cityRef.current && !cityRef.current.contains(event.target)) setCityOpen(false);
      if (serviceRef.current && !serviceRef.current.contains(event.target)) setServiceOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get("/providers/services");
        setServices(res.data);
      } catch (err) {
        setServices(["Plumber", "Electrician", "AC Repair", "Cleaning", "Painter"]);
      }
    };
    fetchServices();
  }, []);

  const searchProviders = async () => {
    if (!pincode || !service) return;
    setLoading(true); setSearched(true);
    try {
      const res = await api.get(`/providers/search?pincode=${pincode}&service=${service}`);
      setProviders(res.data);
    } catch { setProviders([]); }
    setLoading(false);
  };

  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans selection:bg-indigo-100 overflow-x-hidden">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32">
        {/* Visual Polish: Background Pattern & Glows */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-50"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-200/30 blur-[120px] rounded-full -mr-64 -mt-64"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/40 blur-[120px] rounded-full -ml-64 -mb-64"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
              <Zap size={14} className="text-indigo-600 fill-indigo-600" />
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">Premium Service Marketplace</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.05]">
                Expert help, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">at the click of a button.</span>
            </h1>
            
            <p className="text-slate-500 text-base md:text-lg mb-12 leading-relaxed max-w-2xl mx-auto">
                Connecting you with background-verified professionals for every home need. 
                Transparent pricing, trusted experts, and real-time booking.
            </p>

            {/* --- IMPROVED SEARCH BAR (Responsive & Fixes Dropdown Clipping) --- */}
            <div className="relative z-[60] w-full max-w-5xl mx-auto bg-white border border-slate-200 p-2 md:p-3 rounded-2xl md:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] flex flex-col md:flex-row items-stretch gap-1">
              
              {/* City Dropdown */}
              <div className="relative flex-1 group" ref={cityRef}>
                <button 
                  onClick={() => {setCityOpen(!cityOpen); setServiceOpen(false);}}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 rounded-xl transition-all"
                >
                  <div className="flex items-center gap-3">
                    <MapPin size={18} className="text-indigo-500" />
                    <span className={`text-[13px] font-bold ${city ? 'text-slate-900' : 'text-slate-400'}`}>
                      {city || "Select City"}
                    </span>
                  </div>
                  <ChevronDown size={14} className={`text-slate-300 transition-transform duration-300 ${cityOpen ? 'rotate-180' : ''}`} />
                </button>

                {cityOpen && (
                  <div className="absolute top-[105%] left-0 w-full bg-white border border-slate-100 shadow-2xl rounded-2xl p-2 z-[70] animate-in fade-in zoom-in-95 duration-200">
                    {CITIES.map(c => (
                      <div 
                        key={c} 
                        onClick={() => {setCity(c); setCityOpen(false);}}
                        className="px-4 py-3 text-[13px] font-semibold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl cursor-pointer transition-colors"
                      >
                        {c}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="hidden md:block w-px h-10 self-center bg-slate-100"></div>

              {/* Pincode Input */}
              <div className="flex-1 flex items-center px-5 py-4 md:py-0 border-y md:border-none border-slate-50">
                <input 
                  className="w-full bg-transparent outline-none text-[13px] font-bold text-slate-900 placeholder:text-slate-400"
                  placeholder="Enter Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                />
              </div>

              <div className="hidden md:block w-px h-10 self-center bg-slate-100"></div>

              {/* Service Dropdown (FIXED CLIPPING) */}
              <div className="relative flex-[1.5] group" ref={serviceRef}>
                <button 
                  onClick={() => {setServiceOpen(!serviceOpen); setCityOpen(false);}}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 rounded-xl transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Wrench size={18} className="text-indigo-500" />
                    <span className={`text-[13px] font-bold ${service ? 'text-slate-900' : 'text-slate-400'}`}>
                      {service || "What service do you need?"}
                    </span>
                  </div>
                  <ChevronDown size={14} className={`text-slate-300 transition-transform duration-300 ${serviceOpen ? 'rotate-180' : ''}`} />
                </button>

                {serviceOpen && (
                  <div className="absolute top-[105%] left-0 w-full bg-white border border-slate-100 shadow-2xl rounded-2xl p-2 z-[70] max-h-72 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                    {services.map(s => (
                      <div 
                        key={s} 
                        onClick={() => {setService(s); setServiceOpen(false);}}
                        className="px-4 py-3 text-[13px] font-semibold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl cursor-pointer transition-colors"
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button 
                onClick={searchProviders}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 md:py-2 rounded-xl md:rounded-2xl text-[13px] font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 mt-2 md:mt-0"
              >
                <Search size={18} />
                {loading ? "SEARCHING..." : "FIND EXPERTS"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- RESULTS SECTION (Shows immediately after search) --- */}
      {searched && (
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <span className="w-8 h-px bg-indigo-500"></span>
              Verified Specialists
            </h2>
            <button onClick={() => setSearched(false)} className="text-[10px] font-black text-slate-400 hover:text-indigo-600 transition tracking-widest uppercase border-b-2 border-transparent hover:border-indigo-600 pb-1">Reset</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {providers.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <p className="text-slate-500 text-lg font-semibold">No specialists found for this service in your area.</p>
              </div>
            ) : (
              providers.map((p) => (
                <ProviderCard key={p._id} provider={p} service={service} pincode={pincode} onView={() => setSelectedProvider(p)} />
              ))
            )}
          </div>
        </section>
      )}

      {/* --- QUICK CATEGORY SECTION (only shows when not searched) --- */}
      {!searched && (
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <p className="text-indigo-600 font-bold text-[10px] uppercase tracking-[0.3em] mb-3">Discovery</p>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Browse Services</h2>
              </div>
              <p className="text-slate-400 text-xs font-medium max-w-xs md:text-right leading-relaxed">
                Find exactly what you need from our catalog of background-verified specialists.
              </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {["Home Repairs", "Cleaning", "Beauty & Spa", "Electrical"].map((cat, i) => (
                <div key={i} className="group bg-white border border-slate-100 p-8 rounded-[2.5rem] hover:shadow-[0_30px_60px_rgba(0,0,0,0.04)] hover:border-indigo-100 transition-all cursor-pointer">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-indigo-50 transition-colors">
                    <ArrowRight size={20} className="text-slate-300 group-hover:text-indigo-600 -rotate-45 group-hover:rotate-0 transition-transform" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800 mb-2">{cat}</h3>
                  <p className="text-[11px] text-slate-400 font-bold leading-relaxed mb-6 uppercase tracking-wider">Verified Pros Available</p>
                  <div className="flex gap-2">
                     <div className="h-1.5 w-10 bg-slate-100 rounded-full group-hover:bg-indigo-500 transition-colors"></div>
                     <div className="h-1.5 w-3 bg-slate-100 rounded-full group-hover:bg-indigo-200 transition-colors"></div>
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* --- BROWSE BENTO SECTION --- */}
      {!searched && (
        <section className="py-24 px-6 bg-slate-950 rounded-[3rem] mx-6 mb-24 overflow-hidden relative">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 relative z-10">
            {[
                { title: "Safe & Verified", icon: <ShieldCheck />, desc: "Multi-step background checks for every pro." },
                { title: "On-Time Arrival", icon: <Clock />, desc: "Automated scheduling with real-time tracking." },
                { title: "Quality Control", icon: <Star />, desc: "Top 5% providers only. Satisfaction guaranteed." }
            ].map((item, idx) => (
                <div key={idx} className="flex flex-col gap-5 group">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                        {item.icon}
                    </div>
                    <h3 className="text-lg font-bold text-white tracking-tight">{item.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                </div>
            ))}
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full -mr-48 -mt-48"></div>
        </section>
      )}

      <Footer />
      {selectedProvider && <ProviderModal provider={selectedProvider} service={service} pincode={pincode} onClose={() => setSelectedProvider(null)} />}
    </div>
  );
};

export default Home;