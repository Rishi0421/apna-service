import { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Menu, X, Bell, User, Key, 
  HelpCircle, LogOut, ChevronDown, 
  Search, MessageSquare, Clock, ShieldCheck,
  LayoutGrid, Settings
} from "lucide-react";
import { io } from "socket.io-client";

const LOGO_URL = "https://res.cloudinary.com/duapy4aje/image/upload/v1770234081/cad83f04-35b6-492d-9f9a-31292d578213.png"; 

const SERVICES = {
  "Home Services": ["Plumber", "Electrician", "Carpenter", "Painter"],
  "Cleaning Services": ["Home Cleaning", "Sofa Cleaning", "Bathroom Cleaning"],
  "Events & Media": ["Photographer", "Videographer"],
  "Beauty & Wellness": ["Salon at Home", "Massage", "Makeup Artist"],
  "Business Services": ["Web Development", "Digital Marketing", "Accounting"],
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState([]);
  const [openNotif, setOpenNotif] = useState(false);
  const [openServices, setOpenServices] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const servicesRef = useRef(null);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Notifications & Socket logic
  useEffect(() => {
    if (user) {
      fetchNotifications();
      const socket = io("http://localhost:5000");
      socket.on("connect", () => socket.emit("joinUserRoom", user._id));
      socket.on("notificationReceived", (n) => setNotifications((prev) => [n, ...prev]));
      return () => socket.disconnect();
    }
  }, [user]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setOpenNotif(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setOpenProfile(false);
      if (servicesRef.current && !servicesRef.current.contains(e.target)) setOpenServices(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
    } catch (err) { console.error(err); }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleNotificationClick = async (n) => {
    if (!n.isRead) {
      await api.put(`/notifications/${n._id}/read`);
      setNotifications(prev => prev.map(item => item._id === n._id ? { ...item, isRead: true } : item));
    }
    setOpenNotif(false);
    if (n.link) navigate(n.link);
  };

  const markAllAsRead = async () => {
    await api.put("/notifications/read-all");
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleServiceClick = (service) => {
    navigate(`/search?service=${service}`);
    setOpenServices(false);
    setIsMobileMenuOpen(false);
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && search.trim()) {
      navigate(`/search?service=${search}`);
      setSearch("");
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = () => { logout(); navigate("/login"); };
  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 px-4 md:px-8 py-3 ${
      scrolled 
      ? "bg-white/90 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] border-b border-slate-100" 
      : "bg-white border-b border-slate-50"
    }`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* --- 1. LOGO --- */}
        <Link to="/" className="flex items-center gap-2 shrink-0 group">
          <img 
            src={LOGO_URL} 
            alt="Logo" 
            className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* --- 2. DESKTOP NAV --- */}
        <div className="hidden lg:flex items-center gap-1 xl:gap-4">
          {user?.role === "user" && (
            <>
              <Link to="/home" className={`px-4 py-2 rounded-xl text-[13px] font-black uppercase tracking-widest transition-all ${isActive('/home') ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:text-blue-600 hover:bg-slate-50'}`}>
                Home
              </Link>
              
              <div className="relative" ref={servicesRef}>
                <button
                  onMouseEnter={() => setOpenServices(true)}
                  className={`flex items-center gap-1 px-4 py-2 rounded-xl text-[13px] font-black uppercase tracking-widest transition-all ${openServices ? 'text-blue-600 bg-slate-50' : 'text-slate-500 hover:text-blue-600'}`}
                >
                  Services <ChevronDown size={14} className={`transition-transform duration-300 ${openServices ? 'rotate-180' : ''}`} />
                </button>

                {openServices && (
                  <div 
                    onMouseLeave={() => setOpenServices(false)}
                    className="absolute top-full -left-20 mt-2 bg-white text-slate-800 shadow-2xl rounded-[2rem] p-10 grid grid-cols-3 gap-x-12 gap-y-8 z-50 min-w-[800px] border border-slate-100 animate-in fade-in slide-in-from-top-2"
                  >
                    {Object.entries(SERVICES).map(([category, items]) => (
                      <div key={category}>
                        <p className="font-black text-blue-600 uppercase tracking-[0.2em] text-[10px] mb-4">{category}</p>
                        <div className="space-y-2">
                          {items.map((s) => (
                            <p key={s} onClick={() => handleServiceClick(s)} className="text-sm font-bold text-slate-500 cursor-pointer hover:text-blue-600 hover:translate-x-1 transition-all">
                              {s}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Link to="/bookings" className={`px-4 py-2 rounded-xl text-[13px] font-black uppercase tracking-widest transition-all ${isActive('/bookings') ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:text-blue-600 hover:bg-slate-50'}`}>
                Bookings
              </Link>

              {/* SEARCH BOX */}
              <div className="relative ml-2 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-11 pr-4 py-2.5 rounded-xl w-48 xl:w-60 text-xs font-bold bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleSearch}
                />
              </div>
            </>
          )}

          {user?.role === "provider" && (
            <div className="flex bg-slate-100/50 p-1.5 rounded-2xl border border-slate-100">
              <Link to="/provider" className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${isActive('/provider') ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-blue-600'}`}>Dashboard</Link>
              <Link to="/provider/profile" className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${isActive('/provider/profile') ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-blue-600'}`}>Settings</Link>
            </div>
          )}
        </div>

        {/* --- 3. RIGHT TOOLS --- */}
        <div className="flex items-center gap-2 md:gap-4">
          {user ? (
            <>
              {/* NOTIFICATION HUB */}
              <div className="relative" ref={notifRef}>
                <button onClick={() => setOpenNotif(!openNotif)} className={`p-2.5 rounded-xl transition-all relative ${openNotif ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}>
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 bg-rose-500 text-white text-[9px] font-black h-4 w-4 flex items-center justify-center rounded-full ring-2 ring-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {openNotif && (
                  <div className="absolute right-0 mt-4 w-80 md:w-[400px] bg-white text-slate-800 shadow-2xl rounded-[2rem] z-50 overflow-hidden border border-slate-100 animate-in slide-in-from-top-2 zoom-in-95">
                    <div className="flex justify-between items-center px-6 py-5 border-b border-slate-50 bg-white sticky top-0 z-10">
                        <div>
                            <h3 className="font-black text-sm text-slate-900 leading-none">Notifications</h3>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">{unreadCount} New Messages</p>
                        </div>
                        {unreadCount > 0 && (
                            <button onClick={markAllAsRead} className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 bg-blue-50 px-3 py-2 rounded-lg transition-all">Mark read</button>
                        )}
                    </div>
                    <div className="max-h-[380px] overflow-y-auto no-scrollbar">
                      {notifications.length === 0 ? (
                        <div className="py-16 text-center flex flex-col items-center">
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mb-4"><Bell size={24}/></div>
                            <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest">Inbox Empty</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-50">
                          {notifications.map((n) => (
                            <div key={n._id} onClick={() => handleNotificationClick(n)} className={`px-6 py-5 cursor-pointer transition-all flex gap-4 relative ${!n.isRead ? "bg-blue-50/30" : "hover:bg-slate-50"}`}>
                              {!n.isRead && <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full"></div>}
                              <div className={`w-10 h-10 shrink-0 rounded-2xl flex items-center justify-center border transition-colors ${!n.isRead ? 'bg-white border-blue-100 text-blue-600 shadow-sm' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                                 <MessageSquare size={18} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-[12px] leading-relaxed mb-1.5 ${!n.isRead ? "font-bold text-slate-900" : "font-medium text-slate-500"}`}>{n.message || n.text}</p>
                                <div className="flex items-center gap-2"><Clock size={10} className="text-slate-300"/><span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">{new Date(n.createdAt).toLocaleDateString()}</span></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* PROFILE DROPDOWN */}
              {(user?.role === "user" || user?.role === "provider") && (
                <div className="relative hidden md:block" ref={profileRef}>
                  <button onClick={() => setOpenProfile(!openProfile)} className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl hover:bg-slate-50 transition-all border border-slate-100">
                    <div className="h-9 w-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-100">
                      {user.name.charAt(0)}
                    </div>
                    <div className="text-left">
                      <p className="text-[12px] font-black text-slate-900 leading-none">{user.name.split(' ')[0]}</p>
                      <p className="text-[9px] font-bold text-blue-500 uppercase tracking-tighter mt-1">{user.role}</p>
                    </div>
                  </button>

                  {openProfile && (
                    <div className="absolute right-0 mt-4 w-60 bg-white text-slate-800 shadow-2xl rounded-[2rem] z-50 overflow-hidden border border-slate-100 animate-in slide-in-from-top-2 zoom-in-95">
                      <div className="p-6 bg-slate-50 border-b">
                        <p className="text-sm font-black text-slate-900 truncate">{user.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 truncate tracking-tight">{user.email}</p>
                      </div>
                      <div className="p-3 space-y-1">
                        <Link to={user?.role === "user" ? "/profile" : "/provider/profile"} onClick={() => setOpenProfile(false)} className="flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all tracking-widest"><User size={16}/> Account</Link>
                        <Link to="/change-password" onClick={() => setOpenProfile(false)} className="flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all tracking-widest"><Key size={16}/> Security</Link>
                        <Link to="/help-support" onClick={() => setOpenProfile(false)} className="flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all tracking-widest border-t border-slate-50 pt-4 mt-2"><HelpCircle size={16}/> Support</Link>
                        <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-[11px] font-black uppercase text-rose-500 hover:bg-rose-50 rounded-xl transition-all tracking-widest mt-2"><LogOut size={16}/> Logout</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ADMIN ACTION */}
              {user?.role === "admin" && (
                <button onClick={handleLogout} className="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-rose-500 text-white shadow-lg shadow-rose-200 hover:bg-rose-600 transition-all">Logout</button>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-6 py-3 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition">Log in</Link>
              <Link to="/register" className="px-6 py-3 text-[11px] font-black uppercase tracking-widest bg-blue-600 text-white rounded-2xl hover:bg-slate-900 transition-all shadow-xl shadow-blue-100">Sign Up</Link>
            </div>
          )}

          {/* MOBILE TOGGLE */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2.5 bg-slate-50 rounded-xl text-slate-600">
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* --- 4. MOBILE DRAWER --- */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[72px] bg-white z-[90] p-6 flex flex-col gap-8 animate-in slide-in-from-right-full duration-300">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="What are you looking for?"
              className="w-full pl-12 pr-4 py-4 rounded-[1.5rem] bg-slate-50 border-none outline-none font-bold text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Link to="/home" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 px-6 py-4 bg-slate-50 rounded-2xl text-[12px] font-black uppercase tracking-widest text-slate-900"><LayoutGrid size={18}/> Home Dashboard</Link>
            <Link to="/bookings" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 px-6 py-4 bg-slate-50 rounded-2xl text-[12px] font-black uppercase tracking-widest text-slate-900"><Clock size={18}/> Activity Center</Link>
            
            <div className="mt-4 pt-6 border-t border-slate-100">
              <p className="px-6 text-[10px] font-black uppercase text-blue-500 tracking-[0.2em] mb-4">Our Marketplace</p>
              <div className="grid grid-cols-2 gap-3 px-2">
                {["Plumber", "Electrician", "Cleaning", "Salon"].map(s => (
                  <button key={s} onClick={() => handleServiceClick(s)} className="text-left px-5 py-3 rounded-xl bg-slate-50 text-[11px] font-bold text-slate-600">{s}</button>
                ))}
              </div>
            </div>

            {user && (
              <div className="mt-auto pb-10 flex flex-col gap-3">
                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-3 py-4 rounded-2xl border border-slate-100 text-[11px] font-black uppercase tracking-widest text-slate-900"><User size={16}/> View Profile</Link>
                <button onClick={handleLogout} className="py-4 rounded-2xl bg-rose-50 text-rose-500 text-[11px] font-black uppercase tracking-widest">Logout System</button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;