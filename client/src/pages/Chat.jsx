import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { io } from "socket.io-client";
import { 
  Send, 
  User, 
  ChevronLeft,
  ShieldCheck,
  MoreVertical,
  MessageCircle
} from "lucide-react";

const socket = io("http://localhost:5000");

const Chat = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/chats/${chatId}`);
      setMessages(res.data);
    } catch (err) {
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!text.trim() || sending) return;
    try {
      setSending(true);
      await api.post("/chats/message", { chat: chatId, text });
      setText("");
    } catch (err) {
      alert("Failed to send");
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (!chatId) return;
    fetchMessages();
    socket.emit("joinChat", chatId);
    socket.on("newMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => socket.off("newMessage");
  }, [chatId]);

  return (
    <div className="flex flex-col h-screen bg-white">
      <Navbar />

      <div className="flex-1 max-w-5xl w-full mx-auto flex flex-col pt-20 md:pt-24 pb-4 px-4 overflow-hidden">
        
        {/* --- HEADER --- */}
        <div className="flex items-center justify-between py-4 border-b border-slate-50 mb-4 px-2">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-blue-600 transition-colors">
              <ChevronLeft size={28} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                <User size={20} />
              </div>
              <div>
                <h2 className="text-sm font-black text-slate-800 tracking-tight">Support Conversation</h2>
                <div className="flex items-center gap-1 text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                    <ShieldCheck size={12} /> Secure Portal
                </div>
              </div>
            </div>
          </div>
          <button className="text-slate-300 hover:text-slate-600 transition-colors"><MoreVertical size={20} /></button>
        </div>

        {/* --- MESSAGES AREA (Refined Image Format) --- */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-2 md:px-4 py-4 space-y-8 no-scrollbar"
        >
          {loading ? (
             <div className="flex flex-col items-center justify-center h-full gap-3">
                <div className="w-6 h-6 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Encrypting Session</p>
             </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center opacity-30">
                <MessageCircle size={48} className="text-slate-400 mb-2" />
                <p className="text-xs font-black uppercase tracking-widest">No Activity Yet</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender?._id === user?._id;
              const senderName = msg.sender?.username || msg.sender?.name || msg.sender?.email || "User";
              const senderRole = msg.sender?.role || "user"; // "user" or "provider"
              const roleLabel = senderRole === "provider" ? "Provider" : "Customer";
              
              return (
                <div key={msg._id} className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}>
                  
                  {/* Container: Avatar + Bubble */}
                  <div className={`flex items-end gap-2.5 max-w-[85%] md:max-w-[70%] ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                    
                    {/* AVATAR - Only show for received messages */}
                    {!isMe && (
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        senderRole === "provider"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-400 text-white"
                      }`}>
                        {senderName.charAt(0).toUpperCase()}
                      </div>
                    )}

                    {/* BUBBLE + METADATA COLUMN */}
                    <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                      
                      {/* SENDER INFO - Name and Role */}
                      <p className="text-[11px] font-bold mb-1 px-3">
                        <span className="text-slate-700">{senderName}</span>
                        <span className={`ml-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          senderRole === "provider" 
                          ? "bg-blue-100 text-blue-700" 
                          : "bg-slate-200 text-slate-700"
                        }`}>
                          {roleLabel}
                        </span>
                      </p>
                      
                      {/* THE MESSAGE BUBBLE */}
                      <div className={`px-5 py-3 rounded-2xl shadow-sm ${
                        isMe 
                        ? "bg-blue-600 text-white rounded-br-md" // BLUE for MY messages (right)
                        : "bg-white text-slate-900 border border-slate-100 rounded-bl-md" // WHITE for received (left)
                      }`}>
                        <p className="text-[14px] font-medium leading-relaxed">
                            {msg.text}
                        </p>
                      </div>

                      {/* TIMESTAMP */}
                      <p className="text-[10px] text-slate-400 font-medium mt-1 px-3">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()}
                      </p>
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* --- INPUT AREA --- */}
        <div className="mt-4 px-2">
          <div className="bg-slate-50 p-2 rounded-[2.5rem] flex items-center gap-2 border border-slate-100 shadow-inner">
            <input
              type="text"
              className="flex-1 bg-transparent pl-6 pr-2 py-3 outline-none text-sm font-bold text-slate-700 placeholder:text-slate-400"
              placeholder="Type your message..."
              value={text}
              disabled={sending}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              disabled={sending || !text.trim()}
              className={`h-12 w-12 rounded-full flex items-center justify-center transition-all ${
                text.trim() ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-slate-200 text-slate-400"
              }`}
            >
              <Send size={18} className={text.trim() ? "translate-x-0.5" : ""} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Chat;