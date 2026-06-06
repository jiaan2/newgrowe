import React, { useState } from "react";
import { 
  Lock, 
  User, 
  LogIn, 
  Eye, 
  EyeOff, 
  ShoppingBag, 
  Sliders, 
  Terminal, 
  Sparkles, 
  ShieldCheck,
  Crown
} from "lucide-react";

interface LoginPageProps {
  onLogin: (username: string, role: "buyer" | "seller" | "developer") => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<"buyer" | "seller" | "developer">("buyer");
  const [username, setUsername] = useState("fisch_enjoyer");
  const [password, setPassword] = useState("roblox123");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Preset accounts for frictionless testing & beautiful walkthrough
  const presetAccounts = {
    buyer: {
      username: "fisch_enjoyer",
      label: "Fisch Collector Account",
      badge: "Buyer: VIP Gold Member",
      desc: "Simulasikan belanja kraken claw, rod, gamepasses, serta integrasi instant bot delivery.",
      avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&q=80"
    },
    seller: {
      username: "Merchant_Pro_9021",
      label: "Growee Storefront SaaS",
      badge: "Seller: SaaS Premium Pro",
      desc: "Manajemen katalog, monitoring churn rate, simulasi pergerakan inflasi koin, & setel live exchange rate.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
    },
    developer: {
      username: "SysAdmin_Console",
      label: "Systems Administrator Dev",
      badge: "Developer: System Controller",
      desc: "Monitoring webhook payloads, menyunting status maintenance, simulasi latency, & monitoring live logs.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
    }
  };

  const handleRoleChange = (role: "buyer" | "seller" | "developer") => {
    setSelectedRole(role);
    setUsername(presetAccounts[role].username);
    setPassword("roblox123");
    setErrorMsg("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMsg("Username tidak boleh kosong");
      return;
    }
    if (password.length < 4) {
      setErrorMsg("Password minimum harus terdiri dari 4 karakter");
      return;
    }

    setIsSubmitting(true);
    // Add brief satisfying transition effect
    setTimeout(() => {
      setIsSubmitting(false);
      onLogin(username, selectedRole);
    }, 750);
  };

  // Dynamic color configuration based on active preset role selection
  const activeStyles = {
    buyer: {
      accentColor: "text-amber-500",
      focusRing: "focus:ring-amber-500/50 focus:border-amber-500",
      bgGradient: "from-[#d49a00] to-[#ffd700]",
      glowShadow: "shadow-amber-500/20",
      btnClass: "bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-semibold text-black",
      cardBorder: "border-amber-200/50 bg-[#faf8ff]"
    },
    seller: {
      accentColor: "text-purple-400",
      focusRing: "focus:ring-purple-500/50 focus:border-purple-500",
      bgGradient: "from-purple-800 to-indigo-700",
      glowShadow: "shadow-purple-500/20",
      btnClass: "bg-gradient-to-r from-purple-800 to-indigo-700 hover:from-purple-900 hover:to-indigo-800 text-white",
      cardBorder: "border-purple-800/40 bg-[#0d071a]"
    },
    developer: {
      accentColor: "text-emerald-400",
      focusRing: "focus:ring-emerald-500/50 focus:border-emerald-500",
      bgGradient: "from-emerald-600 to-teal-500",
      glowShadow: "shadow-emerald-500/20",
      btnClass: "bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white",
      cardBorder: "border-emerald-800/40 bg-[#07090f]"
    }
  }[selectedRole];

  return (
    <div id="login-container-root" className="min-h-screen bg-[#07030e] text-[#f4f1f8] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Absolute Ambient Background Lights */}
      <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-cyan-900/20 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Main Login Envelope Container */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-6 bg-[#110b24]/90 border border-purple-900/40 rounded-3xl p-6 md:p-8 shadow-2xl shadow-black/80 backdrop-blur-xl relative z-10">
        
        {/* LEFT COMPONENT: branding and credentials info (span 5) */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-8 pr-0 md:pr-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-amber-500 flex items-center justify-center shadow-lg shadow-purple-900/40">
                <Crown className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <h1 className="text-lg font-extrabold tracking-tight font-display bg-gradient-to-r from-white via-purple-100 to-amber-300 bg-clip-text text-transparent">
                  Growee Platform
                </h1>
                <p className="text-[10px] font-mono uppercase tracking-widest text-purple-400">
                  UGC Virtual Trade Bridge
                </p>
              </div>
            </div>

            <p className="text-xs text-purple-300 leading-relaxed font-sans">
              Portal tepercaya multiguna untuk ekosistem transaksi, logistik automation bot, instan top-up QRIS, dan analitika retensi koin.
            </p>
          </div>

          {/* Persona quick switch selection panel */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
              PILIH PERSPEKTIF AKSES:
            </h3>

            <div className="space-y-2">
              <button
                type="button"
                id="role-select-buyer-shortcut"
                onClick={() => handleRoleChange("buyer")}
                className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center gap-3 ${
                  selectedRole === "buyer" 
                    ? "bg-amber-500/10 border-amber-500/50 shadow-md shadow-amber-500/5" 
                    : "bg-[#181030]/50 border-purple-950 hover:bg-[#1f163b]/70"
                }`}
              >
                <div className={`p-2 rounded-lg ${selectedRole === "buyer" ? "bg-amber-500/20 text-amber-300" : "bg-purple-950 text-purple-400"}`}>
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Buyer Marketplace</span>
                    {selectedRole === "buyer" && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                  </div>
                  <span className="text-[10px] text-zinc-400 truncate block">Belanja & instan delivery gamepass</span>
                </div>
              </button>

              <button
                type="button"
                id="role-select-seller-shortcut"
                onClick={() => handleRoleChange("seller")}
                className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center gap-3 ${
                  selectedRole === "seller" 
                    ? "bg-purple-500/10 border-purple-500/50 shadow-md shadow-purple-500/5" 
                    : "bg-[#181030]/50 border-purple-950 hover:bg-[#1f163b]/70"
                }`}
              >
                <div className={`p-2 rounded-lg ${selectedRole === "seller" ? "bg-purple-500/20 text-purple-300" : "bg-purple-950 text-purple-400"}`}>
                  <Sliders className="w-4 h-4" />
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Seller Dashboard</span>
                    {selectedRole === "seller" && <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />}
                  </div>
                  <span className="text-[10px] text-zinc-400 truncate block">Kelola koin, margin & VIP tools</span>
                </div>
              </button>

              <button
                type="button"
                id="role-select-developer-shortcut"
                onClick={() => handleRoleChange("developer")}
                className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center gap-3 ${
                  selectedRole === "developer" 
                    ? "bg-emerald-500/10 border-emerald-500/50 shadow-md shadow-emerald-500/5" 
                    : "bg-[#181030]/50 border-purple-950 hover:bg-[#1f163b]/70"
                }`}
              >
                <div className={`p-2 rounded-lg ${selectedRole === "developer" ? "bg-emerald-500/20 text-emerald-300" : "bg-purple-950 text-purple-400"}`}>
                  <Terminal className="w-4 h-4" />
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Developer SysAdmin</span>
                    {selectedRole === "developer" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                  </div>
                  <span className="text-[10px] text-zinc-400 truncate block">Pantau live logs & QRIS webhook</span>
                </div>
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-purple-950 text-[10px] text-purple-400 flex items-center gap-1.5 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>Secure Endpoints Active (v3.0)</span>
          </div>

        </div>

        {/* RIGHT COMPONENT: Actual login form & dynamic description card (span 7) */}
        <div className={`md:col-span-7 border rounded-2xl p-5 md:p-6 transition-all duration-500 shadow-lg ${activeStyles.glowShadow} ${activeStyles.cardBorder} flex flex-col justify-between space-y-6`}>
          
          {/* Header banner showing current selected persona details */}
          <div className="flex gap-4 items-center p-3.5 bg-black/45 rounded-xl border border-white/5 relative overflow-hidden">
            <img 
              src={presetAccounts[selectedRole].avatar} 
              alt={presetAccounts[selectedRole].label}
              className="w-11 h-11 rounded-full object-cover shrink-0 border border-purple-600/30"
              referrerPolicy="no-referrer"
            />
            <div className="space-y-0.5 min-w-0">
              <span className={`text-[9px] font-mono uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-white/10 ${activeStyles.accentColor}`}>
                {presetAccounts[selectedRole].badge}
              </span>
              <h2 className="text-xs font-extrabold text-white truncate leading-tight">
                {presetAccounts[selectedRole].label}
              </h2>
              <p className="text-[10px] text-purple-300 leading-normal line-clamp-2">
                {presetAccounts[selectedRole].desc}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold font-mono tracking-wider text-purple-300 flex items-center gap-1">
                <User className="w-3 h-3 text-purple-400" /> Username / Roblox ID
              </label>

              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-purple-400 pointer-events-none">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  id="login-username-input"
                  required
                  placeholder="Masukkan nama pengguna..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full pl-9 pr-4 py-2.5 bg-black/40 border border-purple-900/50 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-offset-0 transition-all font-medium ${activeStyles.focusRing}`}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold font-mono tracking-wider text-purple-300 flex items-center gap-1">
                <Lock className="w-3 h-3 text-purple-400" /> Kata Sandi (Password)
              </label>

              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-purple-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </span>
                
                <input
                  type={showPassword ? "text" : "password"}
                  id="login-password-input"
                  required
                  placeholder="Masukkan kata sandi..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-9 pr-10 py-2.5 bg-black/40 border border-purple-900/50 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-offset-0 transition-all font-medium ${activeStyles.focusRing}`}
                />

                <button
                  type="button"
                  id="toggle-login-password-visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-purple-400 hover:text-white transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <span className="text-[9px] text-[#8670bc] font-mono tracking-tight block">Password tes preset adalah "roblox123"</span>
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-900 text-red-200 text-[10px] font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Instant Login Click Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              id="submit-login-credentials-btn"
              className={`w-full py-3 px-4 rounded-xl text-xs font-black uppercase flex items-center justify-center gap-2 transition-all active:scale-98 select-none shadow-md ${activeStyles.btnClass}`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Membuka Gate...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Masuk Sebagai {presetAccounts[selectedRole].label.split(" ")[0]} 
                </>
              )}
            </button>
          </form>

          {/* Quick Sandbox Credentials Bypass Area */}
          <div className="bg-black/30 p-3 rounded-xl border border-white/5 space-y-1.5">
            <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400 uppercase font-mono tracking-tight">
              <Sparkles className="w-3.5 h-3.5" /> Instant Workspace Demo Shortcuts
            </div>
            <p className="text-[10px] text-purple-300 leading-normal">
              Lewati formulir manual dan gunakan profil uji di bawah ini untuk berpindah modul secara instan:
            </p>
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              <button
                type="button"
                id="quick-login-buyer"
                onClick={() => {
                  setUsername("fisch_enjoyer");
                  setSelectedRole("buyer");
                  onLogin("fisch_enjoyer", "buyer");
                }}
                className="py-1 px-2 border border-amber-500/20 hover:border-amber-500 bg-amber-500/5 text-amber-300 text-[9px] font-bold rounded-lg truncate transition"
              >
                🎮 Buyer Account
              </button>
              <button
                type="button"
                id="quick-login-seller"
                onClick={() => {
                  setUsername("Merchant_Pro_9021");
                  setSelectedRole("seller");
                  onLogin("Merchant_Pro_9021", "seller");
                }}
                className="py-1 px-2 border border-purple-500/20 hover:border-purple-500 bg-purple-500/5 text-purple-300 text-[9px] font-bold rounded-lg truncate transition"
              >
                💎 Creator SaaS
              </button>
              <button
                type="button"
                id="quick-login-developer"
                onClick={() => {
                  setUsername("SysAdmin_Console");
                  setSelectedRole("developer");
                  onLogin("SysAdmin_Console", "developer");
                }}
                className="py-1 px-2 border border-emerald-500/20 hover:border-emerald-505 bg-emerald-500/5 text-emerald-300 text-[9px] font-bold rounded-lg truncate transition"
              >
                💻 System Dev
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
