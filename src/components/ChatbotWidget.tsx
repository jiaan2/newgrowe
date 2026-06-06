import React, { useState, useRef, useEffect } from "react";
import { 
  MessageSquare, 
  X, 
  Send, 
  Cpu, 
  BookOpen, 
  TrendingUp, 
  Sparkles,
  Bot
} from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

export const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "assistant",
      text: "Halo Gamer & Merchant! Saya Growee AI Assistant. Ada yang bisa saya bantu terkait otomatisasi marketplace, panduan top-up, atau simulasi bot virtual hari ini?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  // Pre-programmed smart interactive answers
  const handlePillClick = (key: "bot-delivery" | "top-up-guide" | "finance-demo") => {
    let userText = "";
    let assistantReply = "";

    if (key === "bot-delivery") {
      userText = "Bagaimana cara kerja pengiriman Bot Growee?";
      assistantReply = `⚡ **Sistem Pengiriman Otomatis Growee (< 30 Detik):**\n\n1. **Pembayaran Terverifikasi:** Sistem QRIS/E-Wallet memicu Webhook instan dalam waktu kurang dari 2 detik.\n2. **Alokasi Bot Virtual:** Webhook merutekan instruksi pengiriman ke Bot internal kami yang sedang online di server game Roblox.\n3. **Eksekusi In-Game:** Bot secara otomatis terhubung ke akun Anda menggunakan Gamepass API (tanpa mematikan sesi Anda) atau menyerahkan item secara instan dalam game (seperti di Fisch atau Blox Fruits).\n\n🔒 **100% Anti-Scam:** Menghilangkan campur tangan manusia manual yang lambat dan berisiko penipuan!`;
    } else if (key === "top-up-guide") {
      userText = "Panduan Langkah demi Langkah Melakukan Top-Up?";
      assistantReply = `📋 **Panduan Top-Up Mudah & Aman:**\n\n1. **Pilih Item Anda:** Pilih jumlah Robux atau Item Fisch dari catalog marketplace.\n2. **Isi Roblox Username:** Masukkan Username Roblox publik Anda (Kami **TIDAK** membutuhkan password Anda!).\n3. **Simulasi Bayar:** Klik *Beli Instan*, pilih QRIS / E-Wallet, lalu klik tombol simulasi untuk memicu sinyal pembayaran sukses.\n4. **Terima Item:** Pantau langsung Tracker Bot Pengiriman pada layar. Item akan masuk dalam game Roblox Anda dalam hitungan detik!`;
    } else if (key === "finance-demo") {
      userText = "Tunjukkan Demo Finansial & Potensi Keuntungan?";
      assistantReply = `📈 **Analisis Finansial & Validitas Model Bisnis Growee:**\n\n- **Gross Revenue:** Rp 24.580.000 / bulan dari sewa SaaS dan transaksi virtual.\n- **ARPPU (Paying User):** Rp 29.167 per pembeli berbayar.\n- **Laju Konversi Webhook:** 7.8% (Sangat tinggi berkat integrasi API QRIS yang instan).\n- **VIP SaaS Plan Perk:** Dengan menyewa sistem otomatisasi (Rp 29.000/bln), merchant berhak atas **0% Biaya Penarikan Saldo** dan penempatan item prioritas di halaman utama!`;
    }

    const timeStampNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages(prev => [
      ...prev,
      { sender: "user", text: userText, timestamp: timeStampNow },
      { sender: "assistant", text: assistantReply, timestamp: timeStampNow }
    ]);
  };

  // Standard user send text handler (combining Gemini API if available)
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userTextCopy = inputMsg;
    setInputMsg("");
    const timeStampNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages(prev => [
      ...prev,
      { sender: "user", text: userTextCopy, timestamp: timeStampNow }
    ]);

    setIsLoading(true);

    try {
      // Check if API KEY is available in defined process env
      const apiKey = process.env?.GEMINI_API_KEY;

      if (apiKey && apiKey !== "undefined" && apiKey.trim() !== "") {
        // Query Gemini
        const ai = new GoogleGenAI({ apiKey: apiKey });
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: `You are Growee AI Assistant, an expert virtual bot delivery manager and SaaS platform companion. The user is asking: "${userTextCopy}". Help them understand Roblox items, virtual currency economy, how bots automate delivery in < 30 seconds, or Growee's features. Focus on customer problems, solutions, cloud-computing automations, and e-wallets. Keep it informative, structured, professional, and friendly with some helpful game-related bullet points. Response language: Indonesian.`,
        });

        const reply = response.text || "Mohon maaf, saya belum bisa memformulasikan jawaban saat ini.";
        setMessages(prev => [
          ...prev,
          { sender: "assistant", text: reply, timestamp: timeStampNow }
        ]);
      } else {
        // Fallback simulate intelligence typing
        setTimeout(() => {
          let standardFallback = `Terima kasih atas pertanyaannya terkait "${userTextCopy}"!\n\nSebagai Growee AI, saya dapat menyampaikan bahwa platform kami mendukung otomatisasi penuh 100% menggunakan Gamepass API & Bot Delivery terpadu. \n\nSilakan coba mengklik salah satu tombol bantuan instan di bawah ini untuk panduan visual interaktif yang lebih mendalam!`;
          setMessages(prev => [
            ...prev,
            { sender: "assistant", text: standardFallback, timestamp: timeStampNow }
          ]);
        }, 1200);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        { 
          sender: "assistant", 
          text: "Terjadi kesalahan koneksi saat memanggil model cerdas AI. Berikut saran bantuan umum: Gunakan menu panduan instan atau periksa status Bot Delivery di panel utama.", 
          timestamp: timeStampNow 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      
      {/* Floating Toggle Bubble Purple */}
      {!isOpen && (
        <button
          id="toggle-chatbot-widget"
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-[#B494FF] rounded-full flex items-center justify-center text-black shadow-lg shadow-[#B494FF]/40 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer relative group"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-bounce">
            1
          </span>
          
          {/* Tooltip on hover */}
          <span className="absolute right-16 bg-zinc-900 border border-zinc-800 text-[#B494FF] text-[11px] font-semibold py-1 px-2.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
            Tanya Growee AI ⚡
          </span>
        </button>
      )}

      {/* Interactive Chat dialog panel */}
      {isOpen && (
        <div 
          id="chatbot-expanded"
          className="bg-zinc-950 border border-zinc-800 rounded-2xl w-80 sm:w-96 h-[500px] flex flex-col justify-between shadow-2xl overflow-hidden animate-fade-in"
        >
          {/* Panel Header */}
          <div className="bg-[#B494FF] p-4 text-black flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-black/10 p-1.5 rounded-lg">
                <Bot className="w-5 h-5 text-black" />
              </div>
              <div>
                <h3 className="text-xs font-bold font-display uppercase tracking-wider block">Growee AI Assistant</h3>
                <span className="text-[9px] opacity-75 font-mono block">Didukung oleh Gemini 3.5 Flash</span>
              </div>
            </div>

            <button 
              id="close-chatbot-widget"
              onClick={() => setIsOpen(false)}
              className="text-black hover:bg-black/10 rounded p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick interactive shortcut Pills for Instant answers */}
          <div className="bg-zinc-900/80 p-2 border-b border-zinc-800/60 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none">
            <button
              id="pill-bot-delivery"
              onClick={() => handlePillClick("bot-delivery")}
              className="px-2.5 py-1 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-[10px] font-medium rounded-full flex items-center gap-1 transition-all"
            >
              <Cpu className="w-3 h-3 text-[#B494FF]" />
              Cara Pengiriman Bot
            </button>
            <button
              id="pill-top-up-guide"
              onClick={() => handlePillClick("top-up-guide")}
              className="px-2.5 py-1 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-[10px] font-medium rounded-full flex items-center gap-1 transition-all"
            >
              <BookOpen className="w-3 h-3 text-[#B494FF]" />
              Langkah Top-up
            </button>
            <button
              id="pill-finance-demo"
              onClick={() => handlePillClick("finance-demo")}
              className="px-2.5 py-1 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-[10px] font-medium rounded-full flex items-center gap-1 transition-all"
            >
              <TrendingUp className="w-3 h-3 text-[#B494FF]" />
              Finansial & SaaS Demo
            </button>
          </div>

          {/* Chat Messages Log Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-zinc-950/40">
            {messages.map((msg, i) => (
              <div 
                key={i}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs inline-block leading-relaxed whitespace-pre-line ${
                  msg.sender === "user" 
                    ? "bg-purple-600 text-white rounded-br-none" 
                    : "bg-zinc-900 text-zinc-200 border border-zinc-850 rounded-bl-none"
                }`}>
                  {msg.text}
                </div>
                <span className="text-[8px] text-zinc-500 font-mono mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-[11px] text-[#B494FF] italic font-mono pl-1">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                Growee AI sedang mengetik...
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Chat Input form footer */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-zinc-900 bg-zinc-950 flex gap-2">
            <input 
              type="text"
              id="chatbot-text-input"
              value={inputMsg}
              required
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Ketik pertanyaan untuk AI..."
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#B494FF]"
            />
            <button
              type="submit"
              id="send-chatbot-btn"
              className="p-2 bg-[#B494FF] hover:bg-[#D6C4FF] text-black rounded-lg transition-transform active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
};
