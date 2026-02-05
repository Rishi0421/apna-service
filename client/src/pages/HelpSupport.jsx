import { useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import { 
  HelpCircle, 
  ChevronDown, 
  Mail, 
  MessageSquare, 
  Send, 
  Phone, 
  LifeBuoy,
  ShieldQuestion,
  Search
} from "lucide-react";

const faqs = [
  {
    q: "How do I book a service?",
    a: "Search for a service using the home search bar, select a provider from the results, and send a booking request with your details. You'll be notified once they accept.",
  },
  {
    q: "When can I chat with the provider?",
    a: "For security reasons, the real-time chat feature is enabled only after the provider officially accepts your booking request.",
  },
  {
    q: "What if a provider does not respond?",
    a: "If a provider is unresponsive, you can cancel your request and book another professional. We recommend checking the 'Online' status badge before booking.",
  },
  {
    q: "How do I report a provider?",
    a: "Navigate to 'My Bookings', find the specific service, and click on 'Report Issue'. Our safety team will review the request within 24 hours.",
  },
  {
    q: "Is online payment required?",
    a: "Currently, we operate on a 'Pay after Service' model. You can pay the provider directly via cash or UPI once the job is marked as completed.",
  },
];

const HelpSupport = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.message) return alert("Please describe your issue.");

    try {
      setLoading(true);
      await api.post("/reports/support", form);
      alert("✅ Your support ticket has been created. We'll contact you soon!");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      alert("Failed to send support request");
    } finally {
      setLoading(false);
    }
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="pt-40 pb-20 bg-slate-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[100px] rounded-full -mr-48 -mt-48"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
                <LifeBuoy size={14} className="text-blue-400" />
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Support Portal</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">
                How can we <span className="text-blue-500">help you?</span>
            </h1>
            <p className="text-slate-400 text-lg font-medium max-w-xl mx-auto leading-relaxed">
                Find answers to common questions or reach out to our dedicated support team for assistance.
            </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 -mt-12 relative z-20 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- LEFT: FAQ ACCORDION --- */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
                <div className="flex items-center gap-3 mb-8">
                    <ShieldQuestion className="text-blue-600" size={24} />
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h2>
                </div>

                <div className="space-y-4">
                    {faqs.map((item, index) => (
                        <div 
                            key={index} 
                            className={`border rounded-2xl transition-all duration-300 ${
                                activeFaq === index ? "bg-blue-50/50 border-blue-100" : "border-slate-100 bg-white"
                            }`}
                        >
                            <button 
                                onClick={() => toggleFaq(index)}
                                className="w-full flex items-center justify-between p-5 text-left"
                            >
                                <span className={`text-[15px] font-bold transition-colors ${activeFaq === index ? "text-blue-700" : "text-slate-700"}`}>
                                    {item.q}
                                </span>
                                <ChevronDown 
                                    size={18} 
                                    className={`text-slate-400 transition-transform duration-300 ${activeFaq === index ? "rotate-180" : ""}`} 
                                />
                            </button>
                            {activeFaq === index && (
                                <div className="px-5 pb-5 animate-in fade-in slide-in-from-top-2">
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                        {item.a}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
          </div>

          {/* --- RIGHT: CONTACT CARDS & FORM --- */}
          <div className="space-y-6">
            {/* Quick Contact Cards */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center text-center group cursor-pointer hover:border-blue-200 transition-colors">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-3 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <Mail size={18} />
                    </div>
                    <span className="text-[10px] font-black uppercase text-slate-400">Email</span>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center text-center group cursor-pointer hover:border-blue-200 transition-colors">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-3 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <Phone size={18} />
                    </div>
                    <span className="text-[10px] font-black uppercase text-slate-400">Call Us</span>
                </div>
            </div>

            {/* Support Form Card */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
                <h3 className="text-lg font-black text-slate-900 mb-6">Create a Ticket</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="John Doe"
                            className="w-full bg-slate-50 border-none p-4 rounded-xl text-sm font-bold text-slate-900 outline-none focus:ring-2 ring-blue-500/10 transition-all"
                            value={form.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="john@example.com"
                            className="w-full bg-slate-50 border-none p-4 rounded-xl text-sm font-bold text-slate-900 outline-none focus:ring-2 ring-blue-500/10 transition-all"
                            value={form.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Message</label>
                        <textarea
                            name="message"
                            rows="4"
                            placeholder="How can we help?"
                            className="w-full bg-slate-50 border-none p-4 rounded-xl text-sm font-bold text-slate-900 outline-none focus:ring-2 ring-blue-500/10 transition-all resize-none"
                            value={form.message}
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 hover:bg-blue-600 text-white py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 shadow-xl shadow-slate-200"
                    >
                        {loading ? "Sending..." : "Submit Ticket"}
                        <Send size={14} />
                    </button>
                </form>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default HelpSupport;