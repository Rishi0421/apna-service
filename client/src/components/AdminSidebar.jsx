import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  LayoutDashboard, 
  Users, 
  Wrench, 
  ClipboardList, 
  CalendarDays, 
  ShieldAlert, 
  LogOut,
  ChevronRight,
  User,
  Activity
} from "lucide-react";

// NEW LOGO URL
const LOGO_URL = "https://res.cloudinary.com/duapy4aje/image/upload/v1770234081/cad83f04-35b6-492d-9f9a-31292d578213.png";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path) => {
    if (path === "/admin" && location.pathname === "/admin") return true;
    if (path !== "/admin" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const menuItems = [
    { path: "/admin", label: "System Overview", icon: <LayoutDashboard size={20} /> },
    { path: "/admin/users", label: "User Directory", icon: <Users size={20} /> },
    { path: "/admin/providers", label: "Service Partners", icon: <Wrench size={20} /> },
    { path: "/admin/services", label: "Service Catalog", icon: <ClipboardList size={20} /> },
    { path: "/admin/bookings", label: "Master Ledger", icon: <CalendarDays size={20} /> },
    { path: "/admin/reports", label: "Resolution Center", icon: <ShieldAlert size={20} /> },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-72 bg-zinc-950 text-white flex flex-col z-[110] border-r border-zinc-800">
      
      {/* --- BRANDING SECTION --- */}
      <div className="p-8">
        <div className="flex flex-col gap-4 group">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center p-1.5 shadow-[0_0_20px_rgba(255,255,255,0.1)] group-hover:rotate-3 transition-transform duration-300">
                <img 
                    src={LOGO_URL} 
                    alt="Hubly Logo" 
                    className="w-full h-full object-contain"
                />
             </div>
             <div>
                <h1 className="text-xl font-black tracking-tighter">Apna<span className="text-blue-500">Service</span></h1>
                <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Admin Console</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* --- NAVIGATION MENU --- */}
      <nav className="flex-1 px-4 py-4 space-y-1.5">
        <div className="px-4 mb-6">
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Main Registry</p>
        </div>
        
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl transition-all duration-300 group ${
                active
                  ? "bg-blue-600 text-white shadow-[0_10px_20px_rgba(37,99,235,0.3)]"
                  : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`${active ? "text-white" : "text-zinc-600 group-hover:text-blue-400"} transition-colors`}>
                  {item.icon}
                </span>
                <span className={`text-[13px] font-bold tracking-tight ${active ? "opacity-100" : "opacity-70 group-hover:opacity-100"}`}>
                  {item.label}
                </span>
              </div>
              {active && (
                <div className="bg-blue-400/30 p-1 rounded-lg">
                    <ChevronRight size={12} className="animate-in slide-in-from-left-2" />
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* --- FOOTER: SYSTEM STATUS & LOGOUT --- */}
      <div className="p-6 mt-auto">
        <div className="bg-zinc-900/50 rounded-[2rem] p-5 border border-zinc-800 mb-4 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center border border-zinc-700 shadow-inner">
                    <User size={18} className="text-zinc-400" />
                </div>
                <div className="min-w-0">
                    <p className="text-xs font-black text-white truncate uppercase tracking-tighter">Root_Admin</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <Activity size={10} className="text-emerald-500" />
                        <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Active</p>
                    </div>
                </div>
            </div>
            
            <button
              onClick={() => { logout(); navigate("/login"); }}
              className="w-full bg-zinc-800 hover:bg-rose-600 text-zinc-400 hover:text-white py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group shadow-sm border border-zinc-700 hover:border-rose-500"
            >
              <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
              Terminate Session
            </button>
        </div>

        <div className="text-center px-4">
            <div className="h-px w-full bg-zinc-900 mb-4"></div>
            <p className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.3em]">Environment: Production v2</p>
        </div>
      </div>

    </div>
  );
};

export default AdminSidebar;