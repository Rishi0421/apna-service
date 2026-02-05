import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { 
  ShieldCheck, 
  ShieldAlert, 
  MapPin, 
  Plus, 
  Trash2, 
  IndianRupee, 
  Globe, 
  Clock, 
  CheckCircle2, 
  X, 
  Save, 
  Image as ImageIcon,
  Loader2,
  Settings
} from "lucide-react";

const ProviderProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [serviceName, setServiceName] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [pincodes, setPincodes] = useState("");
  const [image, setImage] = useState(null);
  const [savingLocation, setSavingLocation] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      setCity(profile.city || "");
      setPincodes(profile.pincodes?.join(", ") || "");
    }
  }, [profile]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get("/providers/me");
      setProfile(res.data);
    } finally {
      setLoading(false);
    }
  };

  const saveLocation = async () => {
    try {
      setSavingLocation(true);
      await api.put("/providers/me", {
        city,
        pincodes: pincodes.split(",").map((p) => p.trim()).filter(Boolean),
      });
      alert("Location updated successfully ✅");
      fetchProfile();
    } finally {
      setSavingLocation(false);
    }
  };

  const addService = async () => {
    if (!serviceName || !category) return alert("Service name and category required");

    const formData = new FormData();
    formData.append("name", serviceName);
    formData.append("category", category);
    if (image) formData.append("image", image);

    try {
      await api.post("/providers/add-service", formData);
      setServiceName(""); setCategory(""); setImage(null); setShowModal(false);
      fetchProfile();
      alert("Service added! Awaiting admin approval.");
    } catch (err) {
      alert("Failed to add service");
    }
  };

  const deleteService = async (serviceId) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      await api.delete(`/providers/service/${serviceId}`);
      fetchProfile();
    } catch (err) { alert("Delete failed"); }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
    </div>
  );

  const approvedServices = profile.services?.filter((s) => s.isApproved) || [];
  const pendingServices = profile.services?.filter((s) => !s.isApproved) || [];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 pt-32 pb-20">
        
        {/* --- PROFILE HEADER --- */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-blue-100">
                {profile.user?.name?.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">{profile.user?.name}</h1>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    profile.isVerified ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
                }`}>
                    {profile.isVerified ? <ShieldCheck size={12}/> : <ShieldAlert size={12}/>}
                    {profile.isVerified ? "Verified Partner" : "Verification Pending"}
                </div>
              </div>
              <p className="text-slate-500 font-bold text-sm">{profile.user?.email}</p>
            </div>
          </div>
          
          <button 
            onClick={() => setShowModal(true)}
            className="bg-slate-900 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-200 flex items-center gap-2"
          >
            <Plus size={16} /> Add New Service
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* --- LEFT: LOCATION SETTINGS --- */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 mb-8">
                    <MapPin className="text-blue-600" size={20} />
                    <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">Service Area</h2>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Base City</label>
                        <div className="relative group">
                            <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="e.g. Kolkata"
                                className="w-full bg-slate-50 border-none pl-12 pr-4 py-4 rounded-2xl text-sm font-bold text-slate-900 outline-none ring-2 ring-transparent focus:ring-blue-500/10 focus:bg-white transition-all"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Operating Pincodes</label>
                        <textarea
                            placeholder="700001, 700002..."
                            className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm font-bold text-slate-900 outline-none ring-2 ring-transparent focus:ring-blue-500/10 focus:bg-white transition-all resize-none"
                            rows="3"
                            value={pincodes}
                            onChange={(e) => setPincodes(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={saveLocation}
                        disabled={savingLocation}
                        className="w-full bg-blue-600 hover:bg-slate-900 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                    >
                        {savingLocation ? <Loader2 className="animate-spin" size={14}/> : <Save size={14}/>}
                        Update Location
                    </button>
                </div>
            </div>
          </div>

          {/* --- RIGHT: SERVICE MANAGEMENT --- */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* APPROVED SECTION */}
            <div>
              <div className="flex items-center justify-between mb-6 px-2">
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="text-emerald-500" size={20} />
                    <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">Approved Services</h2>
                </div>
                <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-full">{approvedServices.length} Active</span>
              </div>

              {approvedServices.length === 0 && (
                <div className="bg-slate-100/50 border-2 border-dashed border-slate-200 rounded-[2.5rem] py-16 text-center">
                    <p className="text-slate-400 text-sm font-bold">No services active yet.</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {approvedServices.map((service) => (
                  <div key={service._id} className="group bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-base font-black text-slate-900 tracking-tight">{service.name}</h3>
                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">{service.category}</p>
                        </div>
                        <button onClick={() => deleteService(service._id)} className="text-slate-300 hover:text-rose-600 transition-colors">
                            <Trash2 size={18} />
                        </button>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                        <div className="flex-1 flex items-center px-3 gap-2">
                            <IndianRupee size={14} className="text-slate-400" />
                            <input
                                type="number"
                                className="bg-transparent w-full outline-none font-black text-slate-900 text-sm"
                                value={service.price || ""}
                                onChange={(e) => setProfile({
                                    ...profile,
                                    services: profile.services.map((s) => s._id === service._id ? { ...s, price: Number(e.target.value) } : s)
                                })}
                            />
                        </div>
                        <button 
                            onClick={async () => {
                                try {
                                    await api.put("/providers/service-price", { serviceId: service._id, price: Number(service.price) });
                                    alert("Price Saved");
                                } catch { alert("Error"); }
                            }}
                            className="bg-slate-900 text-white p-3 rounded-xl hover:bg-blue-600 transition-colors"
                        >
                            <Save size={16} />
                        </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PENDING SECTION */}
            {pendingServices.length > 0 && (
              <div className="pt-8 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-6 px-2">
                    <Clock className="text-amber-500" size={20} />
                    <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">Awaiting Approval</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-70">
                    {pendingServices.map((service) => (
                        <div key={service._id} className="bg-amber-50/50 p-6 rounded-[2.5rem] border border-amber-100 border-dashed">
                            <h3 className="text-base font-black text-slate-900 tracking-tight">{service.name}</h3>
                            <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mt-1">Reviewing Category: {service.category}</p>
                        </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* --- ADD SERVICE MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-[3rem] p-8 md:p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-slate-300 hover:text-slate-900 transition-colors"><X size={24} /></button>
            
            <div className="flex flex-col items-center mb-10">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4 border border-blue-100">
                    <Settings size={32} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">New Service</h2>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">Request approval</p>
            </div>

            <div className="space-y-5">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Display Name</label>
                    <input className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:ring-2 ring-blue-500/10" placeholder="e.g. Premium Deep Cleaning" value={serviceName} onChange={(e) => setServiceName(e.target.value)} />
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Market Category</label>
                    <select className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm font-bold text-slate-900 outline-none appearance-none cursor-pointer" value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="">Choose Industry</option>
                        <option value="plumber">Plumber</option>
                        <option value="electrician">Electrician</option>
                        <option value="carpenter">Carpenter</option>
                        <option value="cleaning">Cleaning</option>
                    </select>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Service Portfolio Image</label>
                    <label className="w-full h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-all">
                        <ImageIcon size={24} className="text-slate-300 mb-2" />
                        <span className="text-xs font-bold text-slate-400">Click to upload photo</span>
                        <input type="file" hidden accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
                    </label>
                </div>

                <button onClick={addService} className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-blue-600 transition-all mt-4">
                    Submit Request
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderProfile;