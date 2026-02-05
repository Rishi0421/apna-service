import { useEffect, useState } from "react";
import api from "../api/axios";
import AdminSidebar from "../components/AdminSidebar";
import Navbar from "../components/Navbar";
import { 
  Users, 
  ShieldOff, 
  ShieldCheck, 
  Search, 
  Mail, 
  User as UserIcon,
  MoreHorizontal,
  Filter,
  Loader2,
  AlertCircle
} from "lucide-react";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleBlock = async (user) => {
    try {
      if (user.isBlocked) {
        await api.put(`/admin/unblock/${user._id}`);
      } else {
        await api.put(`/admin/block/${user._id}`);
      }
      fetchUsers();
    } catch (err) {
      alert("Action failed");
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const blockedCount = users.filter(u => u.isBlocked).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <AdminSidebar />

      <main className="ml-72 p-8 pt-32 transition-all duration-500">
        
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <Users className="text-indigo-600" size={18} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Management Console</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">User Directory</h1>
            <p className="text-slate-500 text-sm font-medium mt-1">Audit and manage access permissions for all platform members.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm text-center min-w-[120px]">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Total Members</p>
                <p className="text-xl font-black text-slate-900">{users.length}</p>
            </div>
            <div className="bg-rose-50 px-5 py-3 rounded-2xl border border-rose-100 shadow-sm text-center min-w-[120px]">
                <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest mb-0.5">Restricted</p>
                <p className="text-xl font-black text-rose-600">{blockedCount}</p>
            </div>
          </div>
        </div>

        {/* --- SEARCH & FILTER BAR --- */}
        <div className="bg-white border border-slate-100 p-2 rounded-[2rem] shadow-sm flex items-center gap-2 mb-8">
            <div className="relative flex-1 group">
                <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                    type="text"
                    placeholder="Search by name or email address..."
                    className="w-full bg-slate-50 border-none pl-14 pr-6 py-4 rounded-[1.5rem] text-sm font-bold text-slate-900 outline-none focus:ring-4 ring-indigo-500/5 focus:bg-white transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <button className="hidden md:flex items-center gap-2 px-6 py-4 text-slate-400 hover:text-slate-900 transition-colors font-black text-[10px] uppercase tracking-widest">
                <Filter size={16} /> Filter
            </button>
        </div>

        {/* --- USERS LIST --- */}
        {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Database</p>
            </div>
        ) : filteredUsers.length === 0 ? (
            <div className="bg-white rounded-[3rem] border border-dashed border-slate-200 py-24 flex flex-col items-center text-center">
                <AlertCircle size={48} className="text-slate-200 mb-4" />
                <h3 className="text-lg font-bold text-slate-900 uppercase">No Matches Found</h3>
                <p className="text-slate-400 text-sm font-medium">Try adjusting your search criteria.</p>
            </div>
        ) : (
            <div className="grid gap-4">
                {filteredUsers.map((u) => (
                    <div 
                        key={u._id} 
                        className={`group bg-white rounded-[2rem] border transition-all duration-300 flex items-center justify-between p-5 md:p-6 ${
                            u.isBlocked 
                            ? "border-rose-100 bg-rose-50/20 shadow-none opacity-80" 
                            : "border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
                        }`}
                    >
                        <div className="flex items-center gap-6">
                            {/* USER AVATAR */}
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner ${
                                u.isBlocked ? "bg-rose-100 text-rose-500" : "bg-indigo-50 text-indigo-600 border border-indigo-100"
                            }`}>
                                {u.name.charAt(0)}
                            </div>

                            {/* USER INFO */}
                            <div>
                                <h3 className={`text-base font-black tracking-tight ${u.isBlocked ? "text-rose-900 strike-through" : "text-slate-900"}`}>
                                    {u.name}
                                </h3>
                                <div className="flex items-center gap-4 mt-1">
                                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                                        <Mail size={12} className="text-indigo-400" />
                                        {u.email}
                                    </div>
                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                                        u.isBlocked ? "bg-rose-50 border-rose-100 text-rose-500" : "bg-emerald-50 border-emerald-100 text-emerald-600"
                                    }`}>
                                        {u.isBlocked ? "Restricted" : "Active"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => toggleBlock(u)}
                                className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all transform active:scale-[0.98] flex items-center gap-2 ${
                                    u.isBlocked 
                                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100 hover:bg-emerald-600" 
                                    : "bg-white border border-rose-100 text-rose-500 hover:bg-rose-500 hover:text-white shadow-sm"
                                }`}
                            >
                                {u.isBlocked ? (
                                    <><ShieldCheck size={14} /> Unblock Account</>
                                ) : (
                                    <><ShieldOff size={14} /> Restrict User</>
                                )}
                            </button>
                            
                            <button className="p-3 rounded-xl text-slate-300 hover:text-slate-600 hover:bg-slate-50 transition-all">
                                <MoreHorizontal size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}

        <div className="mt-12 text-center">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">End of Database Result</p>
        </div>
      </main>
    </div>
  );
};

export default AdminUsers;