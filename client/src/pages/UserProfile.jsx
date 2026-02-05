import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { 
  User, Mail, Phone, MapPin, 
  Globe, Hash, Home as HomeIcon, 
  Camera, Check, X, Edit3, Save, 
  ShieldCheck, Loader2
} from "lucide-react";

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});
  const [avatarLoading, setAvatarLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/users/profile");
      setProfile(res.data);
      setForm(res.data);
    } catch (err) {
      console.error("Failed to fetch profile");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    try {
      await api.put("/users/profile", form);
      setEdit(false);
      fetchProfile();
      alert("✅ Profile updated successfully!");
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setAvatarLoading(true);
      const res = await api.put("/users/upload-avatar", formData);
      setProfile((prev) => ({ ...prev, avatar: res.data.avatar }));
      alert("✅ Photo updated!");
    } catch (err) {
      alert("Upload failed");
    } finally {
      setAvatarLoading(false);
    }
  };

  if (!profile) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-6 pt-32 pb-20">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Account Settings</h1>
            <p className="text-slate-500 text-sm font-medium mt-1">Manage your personal information and location preferences.</p>
          </div>

          <div className="flex items-center gap-3">
            {!edit ? (
              <button 
                onClick={() => setEdit(true)} 
                className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200"
              >
                <Edit3 size={14} /> Edit Profile
              </button>
            ) : (
              <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4">
                <button 
                  onClick={() => { setForm(profile); setEdit(false); }} 
                  className="px-6 py-3 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={saveProfile} 
                  className="flex items-center gap-2 bg-emerald-500 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-100"
                >
                  <Save size={14} /> Save Changes
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- LEFT COLUMN: AVATAR & STATUS --- */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex flex-col items-center text-center">
              <div className="relative group">
                <div className="h-32 w-32 rounded-[2.5rem] overflow-hidden ring-4 ring-slate-50 shadow-inner bg-slate-100">
                  <img
                    src={profile.avatar ? `http://localhost:5000${profile.avatar}` : "/default-avatar.jpg"}
                    className="h-full w-full object-cover"
                    alt="profile"
                  />
                </div>
                {edit && (
                  <label className="absolute inset-0 flex items-center justify-center bg-slate-900/60 rounded-[2.5rem] cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity animate-in fade-in">
                    <div className="text-white flex flex-col items-center gap-1">
                      <Camera size={20} />
                      <span className="text-[10px] font-black uppercase">Change</span>
                    </div>
                    <input type="file" hidden accept="image/*" onChange={handleAvatarUpload} />
                  </label>
                )}
                {avatarLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-[2.5rem]">
                    <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                  </div>
                )}
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">{profile.name}</h2>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mt-1">Standard Account</p>
              </div>

              <div className="w-full mt-8 pt-8 border-t border-slate-50 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-widest">Account Status</span>
                  <span className="flex items-center gap-1.5 font-black text-emerald-500 uppercase">
                    <ShieldCheck size={14} /> Verified
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: DETAILED FORM --- */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[3rem] p-8 md:p-12 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Info Section */}
                <div className="md:col-span-2">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 border-b border-slate-50 pb-2">Personal Information</h3>
                </div>

                <FormField 
                  icon={<User size={16} />} 
                  label="Full Name" 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange} 
                  edit={edit} 
                />

                <FormField 
                  icon={<Mail size={16} />} 
                  label="Email Address" 
                  value={profile.email} 
                  disabled={true} 
                />

                <FormField 
                  icon={<Phone size={16} />} 
                  label="Phone Number" 
                  name="phone" 
                  value={form.phone} 
                  onChange={handleChange} 
                  edit={edit} 
                />

                {/* Location Section */}
                <div className="md:col-span-2 mt-4">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 border-b border-slate-50 pb-2">Location & Address</h3>
                </div>

                <FormField 
                  icon={<Globe size={16} />} 
                  label="State" 
                  name="state" 
                  value={form.state} 
                  onChange={handleChange} 
                  edit={edit} 
                />

                <FormField 
                  icon={<HomeIcon size={16} />} 
                  label="City" 
                  name="city" 
                  value={form.city} 
                  onChange={handleChange} 
                  edit={edit} 
                />

                <FormField 
                  icon={<Hash size={16} />} 
                  label="Pincode" 
                  name="pincode" 
                  value={form.pincode} 
                  onChange={handleChange} 
                  edit={edit} 
                />

                <div className="md:col-span-2 space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                    <MapPin size={14} className="text-blue-500" /> Full Address
                  </label>
                  <textarea
                    name="address"
                    disabled={!edit}
                    className={`w-full p-4 rounded-2xl text-sm font-bold outline-none transition-all resize-none ${
                      edit ? "bg-slate-50 ring-2 ring-blue-500/5 focus:ring-blue-500/20 text-slate-900" : "bg-transparent text-slate-500"
                    }`}
                    rows="3"
                    value={form.address || ""}
                    onChange={handleChange}
                    placeholder="Enter your complete house address..."
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

/* --- REUSABLE FORM COMPONENT --- */
const FormField = ({ label, value, onChange, edit, disabled, name, icon }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
      <span className="text-blue-500">{icon}</span> {label}
    </label>
    <input
      name={name}
      disabled={disabled || !edit}
      onChange={onChange}
      value={value || ""}
      className={`w-full p-4 rounded-2xl text-sm font-bold outline-none transition-all ${
        disabled 
          ? "bg-transparent text-slate-400" 
          : edit 
            ? "bg-slate-50 ring-2 ring-blue-500/5 focus:ring-blue-500/20 text-slate-900" 
            : "bg-transparent text-slate-600"
      }`}
    />
  </div>
);

export default UserProfile;