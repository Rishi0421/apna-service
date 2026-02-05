import { Link } from "react-router-dom";
import { 
  ShieldCheck, 
  Search, 
  Zap, 
  CheckCircle2, 
  Star, 
  ArrowRight, 
  Clock, 
  CreditCard,
  Briefcase,
  Users,
  Wrench,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone
} from "lucide-react";

const LOGO_URL = "https://res.cloudinary.com/duapy4aje/image/upload/v1770234081/cad83f04-35b6-492d-9f9a-31292d578213.png";

const Landing = () => {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-600 overflow-x-hidden">
      
      {/* --- PREMIUM NAV --- */}
      <nav className="fixed top-0 w-full z-[100] bg-white/90 backdrop-blur-xl border-b border-slate-100 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group transition-transform hover:scale-105">
             <img src={LOGO_URL} alt="Apna Service Logo" className="h-10 md:h-12 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-4 md:gap-8">
            <Link to="/login" className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-blue-600 transition-colors">Login</Link>
            <Link to="/signup" className="bg-slate-900 text-white px-6 md:px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-44 pb-24 px-6">
        <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-blue-50 blur-[120px] rounded-full -mr-64 -mt-64 opacity-70"></div>
        
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
            <ShieldCheck size={14} className="text-blue-600" />
            <span className="text-[10px] font-black text-blue-700 uppercase tracking-[0.2em]">India's Trusted Price Transparency Hub</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-10">
            Professional help, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">without the guesswork.</span>
          </h1>
          
          <p className="max-w-3xl mx-auto text-slate-500 text-lg md:text-xl font-medium mb-14 leading-relaxed">
            Stop overpaying for home services. Connect with background-verified experts at fixed, transparent prices. Book, chat, and track in real-time.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link to="/signup" className="w-full sm:w-auto flex items-center justify-center gap-3 bg-blue-600 text-white px-12 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-2xl shadow-blue-200 transform active:scale-95">
              Hire a Professional <ArrowRight size={18} />
            </Link>
            <Link to="/signup" className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white border-2 border-slate-100 text-slate-900 px-12 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:border-blue-600 hover:text-blue-600 transition-all">
              Become a Partner
            </Link>
          </div>

          {/* REAL TRUST STATS */}
          <div className="mt-28 grid grid-cols-2 lg:grid-cols-4 gap-12 border-t border-slate-100 pt-16">
            {[
              { label: "Verified Partners", val: "1,200+", icon: <Briefcase size={18}/> },
              { label: "Successful Jobs", val: "25k+", icon: <CheckCircle2 size={18}/> },
              { label: "Price Saved", val: "30%", icon: <Zap size={18}/> },
              { label: "Support", val: "24/7", icon: <Clock size={18}/> }
            ].map((s, i) => (
              <div key={i} className="text-center group">
                <div className="flex items-center justify-center gap-2 text-blue-600 mb-2 group-hover:scale-110 transition-transform">
                   {s.icon}
                   <span className="text-3xl font-black text-slate-900 tracking-tighter">{s.val}</span>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SERVICES / WHY US --- */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <p className="text-blue-600 font-black text-[10px] uppercase tracking-[0.5em] mb-4">The Standard</p>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Built for total clarity.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard 
              icon={<ShieldCheck size={32} strokeWidth={1.5} />}
              title="Identity Verified"
              desc="We perform multi-level background checks on every partner. Safety is our non-negotiable priority."
            />
            <FeatureCard 
              icon={<CreditCard size={32} strokeWidth={1.5} />}
              title="Fixed Pricing"
              desc="Our algorithm ensures fair market rates. No hidden commissions or surprise additions after the work."
            />
            <FeatureCard 
              icon={<Zap size={32} strokeWidth={1.5} />}
              title="Instant Booking"
              desc="Don't wait for callbacks. See real-time availability and confirm your appointment in under 60 seconds."
            />
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS (VISUAL STEPS) --- */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="relative order-2 lg:order-1">
                <div className="bg-slate-900 rounded-[4rem] p-12 text-white shadow-2xl relative z-10 border border-white/5">
                    <div className="flex items-center gap-3 mb-12">
                        <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    </div>
                    <div className="space-y-6">
                        <div className="p-5 bg-white/5 rounded-3xl border border-white/10 flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-xl">🔍</div>
                            <div className="space-y-2">
                                <div className="h-2 w-32 bg-white/20 rounded-full"></div>
                                <div className="h-1.5 w-20 bg-white/10 rounded-full"></div>
                            </div>
                        </div>
                        <div className="p-5 bg-blue-600 rounded-3xl shadow-xl shadow-blue-500/20 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-xl">✅</div>
                                <div className="space-y-2">
                                    <div className="h-2 w-32 bg-white/40 rounded-full"></div>
                                    <div className="h-1.5 w-20 bg-white/20 rounded-full"></div>
                                </div>
                            </div>
                            <div className="text-[10px] font-black uppercase bg-white text-blue-600 px-3 py-1.5 rounded-xl">Confirmed</div>
                        </div>
                    </div>
                </div>
                <div className="absolute -bottom-10 -left-10 w-full h-full bg-blue-50 border border-blue-100 rounded-[4rem] -z-0"></div>
            </div>

            <div className="order-1 lg:order-2">
              <p className="text-blue-600 font-black text-[10px] uppercase tracking-[0.5em] mb-6">Workflow</p>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-12 leading-tight">The smartest way to <br/> get things fixed.</h2>
              <div className="space-y-12">
                <Step num="01" title="Select Service" desc="Tell us what needs attention. We cover 40+ categories from plumbing to beauty." />
                <Step num="02" title="Pick an Expert" desc="Browse through transparent price lists and real customer ratings." />
                <Step num="03" title="Track & Solve" desc="Chat with your pro and track their arrival. Rate them once the job is finished." />
              </div>
            </div>
        </div>
      </section>

      {/* --- FOOTER SECTION --- */}
      <footer className="bg-white border-t border-slate-100 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
            {/* Column 1: Brand */}
            <div className="space-y-8">
              <img src={LOGO_URL} alt="Logo" className="h-10 w-auto" />
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Apna Service is India's premier marketplace for background-verified professionals and transparent price discovery.
              </p>
              <div className="flex items-center gap-4">
                <SocialIcon icon={<Facebook size={18} />} />
                <SocialIcon icon={<Twitter size={18} />} />
                <SocialIcon icon={<Instagram size={18} />} />
                <SocialIcon icon={<Linkedin size={18} />} />
              </div>
            </div>

            {/* Column 2: Platform */}
            <div>
              <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-8">Platform</h4>
              <ul className="space-y-4">
                <FooterLink to="/login">User Login</FooterLink>
                <FooterLink to="/signup">Partner Registration</FooterLink>
                <FooterLink to="/">Service Directory</FooterLink>
                <FooterLink to="/">Pricing Standards</FooterLink>
              </ul>
            </div>

            {/* Column 3: Company */}
            <div>
              <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-8">Company</h4>
              <ul className="space-y-4">
                <FooterLink to="/help-support">About Us</FooterLink>
                <FooterLink to="/help-support">Safety First</FooterLink>
                <FooterLink to="/help-support">Privacy Policy</FooterLink>
                <FooterLink to="/help-support">Terms of Service</FooterLink>
              </ul>
            </div>

            {/* Column 4: Contact */}
            <div>
              <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-8">Support</h4>
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-blue-600 border border-slate-100">
                    <Mail size={18} />
                  </div>
                  <span className="text-xs font-black text-slate-600 tracking-tight">hello@apnaservice.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-blue-600 border border-slate-100">
                    <Phone size={18} />
                  </div>
                  <span className="text-xs font-black text-slate-600 tracking-tight">+91 1800-SERVICE</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-50 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
              © 2024 APNA SERVICE MARKETPLACE TECHNOLOGIES PVT LTD.
            </p>
            <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-slate-200" />
                <p className="text-[10px] font-bold text-slate-200 uppercase tracking-widest italic">ISO 27001 SECURE PLATFORM</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

/* --- REUSABLE COMPONENTS --- */
const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.05)] transition-all group">
    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 border border-blue-100 shadow-inner text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
      {icon}
    </div>
    <h3 className="text-lg font-black text-slate-900 mb-4 uppercase tracking-widest">{title}</h3>
    <p className="text-slate-500 font-medium leading-relaxed text-sm">{desc}</p>
  </div>
);

const Step = ({ num, title, desc }) => (
  <div className="flex gap-8 group">
    <div className="text-4xl font-black text-slate-100 transition-colors group-hover:text-blue-600">{num}</div>
    <div className="pt-1">
      <h4 className="text-base font-black text-slate-900 mb-2 uppercase tracking-widest">{title}</h4>
      <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-sm">{desc}</p>
    </div>
  </div>
);

const SocialIcon = ({ icon }) => (
    <button className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
        {icon}
    </button>
);

const FooterLink = ({ to, children }) => (
    <li>
        <Link to={to} className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors">
            {children}
        </Link>
    </li>
);

export default Landing;