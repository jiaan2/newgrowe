import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { 
  ShoppingBag, 
  Sliders, 
  Crown, 
  Sparkles, 
  Clock, 
  FileText,
  Info,
  Layers,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  Terminal,
  Briefcase
} from "lucide-react";
import { BuyerMarketplace } from "./src/components/BuyerMarketplace";
import { SaaSPricing } from "./src/components/SaaSPricing";
import { SellerDashboard } from "./src/components/SellerDashboard";
import { ChatbotWidget } from "./src/components/ChatbotWidget";
import { DeveloperConsole } from "./src/components/DeveloperConsole";
import { LoginPage } from "./src/components/LoginPage";
import { INITIAL_ITEMS, UserActivity } from "./src/types";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState("");
  const [activeRole, setActiveRole] = useState<"buyer" | "seller" | "developer">("buyer");
  const [activeTab, setActiveTab] = useState<"marketplace" | "seller" | "pricing">("marketplace");
  
  // Dynamic subscription states
  const [isPremiumVIP, setIsPremiumVIP] = useState(false); // Seller SaaS premium vip
  const [isBuyerVIP, setIsBuyerVIP] = useState(false); // Buyer VIP Gold subscription

  // Live workspace activities ledger from both buyers and sellers
  const [activities, setActivities] = useState<UserActivity[]>([
    {
      id: "act-1",
      timestamp: new Date(Date.now() - 365 * 1000).toLocaleTimeString(),
      actor: "Buyer: fisch_enjoyer",
      role: "buyer",
      category: "Checkout",
      description: "Membeli Kraken Claw 1 unit dengan sukses",
      details: "Payment QRIS settled. Delivered by automation bot to Roblox ID"
    },
    {
      id: "act-2",
      timestamp: new Date(Date.now() - 280 * 1000).toLocaleTimeString(),
      actor: "Seller: Merchant Pro #9021",
      role: "seller",
      category: "Setting",
      description: "Mengubah baseline multiplier harga VIP Robux",
      details: "Setel faktor nilai tukar gamepass menjadi 1.15x"
    },
    {
      id: "act-3",
      timestamp: new Date(Date.now() - 145 * 1000).toLocaleTimeString(),
      actor: "Buyer: RobloxLover99",
      role: "buyer",
      category: "Subscription",
      description: "Mengaktifkan paket VIP Buyer Gold (Rp 49.000)",
      details: "Akses bypass queue bot dan diskon gamepass diaktifkan"
    },
    {
      id: "act-4",
      timestamp: new Date(Date.now() - 60 * 1000).toLocaleTimeString(),
      actor: "System Bot Deliverer #12",
      role: "system",
      category: "Checkout",
      description: "Automated Robux Delivery Gamepass API Success",
      details: "1,000 Robux berhasil dikrimkan ke GamerRoblox_99 dalam 12.4 detik"
    }
  ]);

  const addActivity = (
    actor: string, 
    role: "buyer" | "seller" | "system" | "developer", 
    category: "Checkout" | "Inventory" | "Subscription" | "LiveOps" | "Setting", 
    description: string, 
    details?: string
  ) => {
    const newAct: UserActivity = {
      id: `act-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      timestamp: new Date().toLocaleTimeString(),
      actor,
      role,
      category,
      description,
      details
    };
    setActivities(prev => [newAct, ...prev]);
  };
  
  // Shared platform settings
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [isBotMaintenance, setIsBotMaintenance] = useState(false);
  const [webhookLatency, setWebhookLatency] = useState(1.8);
  const [botCount, setBotCount] = useState(32);

  // Shared console logs for developers
  const [systemLogs, setSystemLogs] = useState<string[]>([
    "[System] Booting Go-Pay / QRIS virtual settlement routing endpoints...",
    "[System] DB loaded: growee_main_store initialized with WAL indexing active.",
    "[Bot-Network] 32 automated execution bots listening on game server web sockets...",
    "[QRIS-API] Sandbox webhook responder active on host environment port 3000."
  ]);

  const addSystemLog = (log: string) => {
    setSystemLogs(prev => [...prev.slice(-99), log]);
  };

  const handleLogin = (username: string, role: "buyer" | "seller" | "developer") => {
    setLoggedInUser(username);
    setActiveRole(role);
    if (role === "buyer") {
      setActiveTab("marketplace");
    } else if (role === "seller") {
      setActiveTab("seller");
    }
    setIsLoggedIn(true);

    const roleName = role.charAt(0).toUpperCase() + role.slice(1);
    addActivity(
      `User Session`,
      role,
      "Subscription",
      `Berhasil login sebagai ${roleName} ("${username}")`,
      `Sesi terverifikasi melalui gerbang otentikasi Growee.`
    );
    addSystemLog(`[Auth] User "${username}" successfully authorized for role "${role}".`);
  };

  const [vipExchangeRate, setVipExchangeRate] = useState(1.0); // Multiplier
  const [isResellerMode, setIsResellerMode] = useState(false);

  // Synchronize dynamic status
  useEffect(() => {
    // If VIP is disabled, always reset exchange rate to normal index
    if (!isPremiumVIP) {
      setVipExchangeRate(1.0);
    }
  }, [isPremiumVIP]);

  // Define persona-specific visual themes to isolate/separate workspaces
  const roleTheme = ({
    buyer: {
      bodyBg: "bg-[#f8f6fc]",
      textColor: "text-[#1e1233]",
      headerBg: "bg-white/95 border-purple-200/80 shadow-xs",
      headerTitle: "text-purple-950 font-display",
      subtitleText: "text-purple-700",
      accentGlow: "bg-gradient-to-br from-[#d49a00] to-[#ffd700] text-black shadow-md border border-amber-300",
      navBg: "bg-purple-100 border border-purple-200",
      footerBg: "bg-[#eae2f8] border-purple-200 text-purple-800",
      tabActive: "bg-gradient-to-r from-[#d49a00] to-[#ffd700] text-black font-extrabold shadow-sm border border-amber-300",
      tabInactive: "text-purple-800 hover:text-purple-950 hover:bg-purple-50/50"
    },
    seller: {
      bodyBg: "bg-[#0b0615]",
      textColor: "text-[#e9e3f8]",
      headerBg: "bg-[#140e24]/95 border-purple-900/60 shadow-lg shadow-black/20",
      headerTitle: "text-amber-400 font-mono tracking-tight",
      subtitleText: "text-purple-300 font-mono",
      accentGlow: "bg-[#422770] text-amber-300 shadow-md border border-purple-500/30",
      navBg: "bg-purple-950/60 border border-purple-900/60",
      footerBg: "bg-[#0c0716] border-purple-950 text-purple-400",
      tabActive: "bg-[#4a2e7c] text-white font-extrabold border border-purple-500/50 shadow-sm",
      tabInactive: "text-purple-300 hover:text-white hover:bg-white/5"
    },
    developer: {
      bodyBg: "bg-[#09090b]",
      textColor: "text-[#f4f4f5]",
      headerBg: "bg-[#18181b]/95 border-zinc-800 shadow-md",
      headerTitle: "text-emerald-400 font-mono font-bold tracking-widest",
      subtitleText: "text-zinc-500 font-mono",
      accentGlow: "bg-zinc-800 text-emerald-400 shadow-md border border-zinc-700",
      navBg: "bg-zinc-900/80 border border-zinc-800",
      footerBg: "bg-[#09090b] border-zinc-805 text-zinc-500",
      tabActive: "bg-zinc-800 text-emerald-400 border-zinc-700 font-bold",
      tabInactive: "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
    }
  })[activeRole];

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className={`min-h-screen ${roleTheme.bodyBg} ${roleTheme.textColor} flex flex-col justify-between transition-colors duration-500 selection:bg-[#ffd700]/30 selection:text-black`}>
      
      {/* Top Continuous Marquee Ticker */}
      <div className="bg-gradient-to-r from-purple-800 via-purple-950 to-purple-800 text-[11px] py-1.5 text-white overflow-hidden select-none border-b border-amber-500/20">
        <div className="whitespace-nowrap flex animate-marquee">
          <span className="mx-4 text-purple-200 font-mono">
            ⚡ BOT DELIVERY ACTIVE: <strong className="text-[#ffd700]">{botCount} Bots Online</strong>
          </span>
          <span className="mx-4 text-amber-200 font-mono">• &lt;{isBuyerVIP ? "15s" : "30s"} Guaranteed delivery via Gamepass API</span>
          <span className="mx-3 text-purple-200 font-mono">• QRIS Webhook response: <strong className="text-[#ffd700]">{webhookLatency}s Response Time</strong></span>
          <span className="mx-4 text-amber-200 font-mono">• SaaS VIP Premium features enabled for merchants</span>
          
          {/* Repeating */}
          <span className="mx-4 text-purple-200 font-mono">
            ⚡ BOT DELIVERY ACTIVE: <strong className="text-[#ffd700] font-bold">{botCount} Bots Online</strong>
          </span>
          <span className="mx-4 text-amber-200 font-mono">• &lt;{isBuyerVIP ? "15s" : "30s"} Guaranteed delivery via Gamepass API</span>
          <span className="mx-3 text-purple-200 font-mono">• QRIS Webhook response: <strong className="text-[#ffd700]">{webhookLatency}s Response Time</strong></span>
          <span className="mx-4 text-amber-200 font-mono">• SaaS VIP Premium features enabled for merchants</span>
        </div>
      </div>

      {/* Primary Role/View Selection Suite Bar */}
      <div className="bg-purple-950 text-white border-b border-purple-850 px-4 sm:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-[10px] font-mono tracking-wider text-purple-200 block uppercase">
              PERSPEKTIF RUANG KERJA (WORKSPACE ISOLATION):
            </span>
            <span className="bg-white/10 text-amber-300 border border-white/10 px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold tracking-wider">
              {activeRole} module
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-black/25 p-1 rounded-xl border border-white/5">
            <button
              id="role-switch-buyer"
              onClick={() => {
                setActiveRole("buyer");
                setActiveTab("marketplace");
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                activeRole === "buyer" 
                  ? "bg-gradient-to-r from-amber-50 to-amber-650 text-black font-bold shadow-sm" 
                  : "text-purple-200 hover:text-white hover:bg-white/5"
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              🛒 Buyer Marketplace (Catalog & VIP)
            </button>

            <button
              id="role-switch-seller"
              onClick={() => {
                setActiveRole("seller");
                setActiveTab("seller");
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                activeRole === "seller" 
                  ? "bg-purple-800 text-white font-bold border border-purple-700 shadow-sm" 
                  : "text-purple-200 hover:text-white hover:bg-white/5"
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              💼 Seller Portal (SaaS & LiveOps)
            </button>

            <button
              id="role-switch-developer"
              onClick={() => {
                setActiveRole("developer");
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                activeRole === "developer" 
                  ? "bg-zinc-800 text-emerald-400 border border-zinc-700 shadow-sm" 
                  : "text-purple-200 hover:text-white hover:bg-white/5"
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              👾 SysAdmin Developer (ORM & Logs)
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-3 text-[11px] font-mono">
            {isBuyerVIP ? (
              <span className="bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-500/30">
                ⭐ Buyer VIP Plan Active (Rp 49K)
              </span>
            ): (
              <span className="text-zinc-500 text-[10px]">Buyer Normal</span>
            )}
            {isPremiumVIP ? (
              <span className="bg-purple-500/20 text-purple-300 font-bold px-2 py-0.5 rounded border border-purple-500/30">
                🚀 SaaS Pro Merchant (Rp 249K)
              </span>
            ): (
              <span className="text-zinc-500 text-[10px]">Seller Free</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Header / Navigation */}
      <header className={`sticky top-0 z-40 px-4 sm:px-8 py-4 backdrop-blur-md border-b ${roleTheme.headerBg} transition-all duration-300`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2.5 animate-fade-in">
            <div className={`w-9 h-9 rounded-xl ${roleTheme.accentGlow} flex items-center justify-center font-extrabold text-lg transition-all duration-300`}>
              {activeRole === "buyer" ? "G" : activeRole === "seller" ? "S" : "D"}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className={`text-lg font-bold leading-none transition-colors ${roleTheme.headerTitle}`}>
                  {activeRole === "buyer" ? "Growee Store" : activeRole === "seller" ? "Growee SaaS Merchant" : "Growee SysAdmin Dev"}
                </h1>
                {isBuyerVIP && activeRole === "buyer" && (
                  <span className="bg-gradient-to-r from-[#d49a00] to-[#ffd700] text-black text-[9px] font-extrabold uppercase py-0.5 px-1.5 rounded-md flex items-center gap-0.5 border border-amber-350 shadow-sm animate-pulse">
                    <Crown className="w-2.5 h-2.5 fill-black" /> VIP Player
                  </span>
                )}
                {isPremiumVIP && activeRole === "seller" && (
                  <span className="bg-purple-700 text-white text-[9px] font-extrabold uppercase py-0.5 px-1.5 rounded-md flex items-center gap-0.5 shadow-sm border border-purple-600">
                    SaaS Merchant Pro
                  </span>
                )}
              </div>
              <p className={`text-[10px] mt-0.5 font-semibold transition-colors ${roleTheme.subtitleText}`}>
                {activeRole === "buyer" 
                  ? "Virtual Automation & Premium Gamer Marketplace" 
                  : activeRole === "seller" 
                    ? "Merchant SaaS Board, Conversion Stats & LiveOps Integration"
                    : "PostgreSQL ORM Tables, Console logs, Webhook Delay Regulator"
                }
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Single-View master routers - filtered based on Active Role) */}
          <nav className={`flex items-center p-1 rounded-xl border ${roleTheme.navBg} transition-all duration-300`}>
            {activeRole === "buyer" && (
              <>
                <button
                  id="tab-btn-marketplace"
                  onClick={() => setActiveTab("marketplace")}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
                    activeTab === "marketplace" 
                      ? roleTheme.tabActive
                      : roleTheme.tabInactive
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Marketplace Catalog
                </button>
                <button
                  id="tab-btn-pricing"
                  onClick={() => setActiveTab("pricing")}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
                    activeTab === "pricing" 
                      ? roleTheme.tabActive
                      : roleTheme.tabInactive
                  }`}
                >
                  <Crown className="w-3.5 h-3.5" />
                  Buyer VIP Pricing (Rp 49K)
                </button>
              </>
            )}

            {activeRole === "seller" && (
              <>
                <button
                  id="tab-btn-seller"
                  onClick={() => setActiveTab("seller")}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
                    activeTab === "seller" 
                      ? roleTheme.tabActive
                      : roleTheme.tabInactive
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  Automation Console
                </button>
                <button
                  id="tab-btn-pricing"
                  onClick={() => setActiveTab("pricing")}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
                    activeTab === "pricing" 
                      ? roleTheme.tabActive
                      : roleTheme.tabInactive
                  }`}
                >
                  <Crown className="w-3.5 h-3.5" />
                  Shop SaaS Plan (Rp 249K)
                </button>
              </>
            )}

            {activeRole === "developer" && (
              <span className="px-3.5 py-1 text-xs font-mono font-bold text-zinc-300 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center gap-1.5 animate-pulse">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> ORM & Logging overriders active
              </span>
            )}
          </nav>

          {/* Contact and client identity badge */}
          <div className="flex items-center gap-3 self-end sm:self-auto shrink-0 select-none">
            <span className="bg-amber-100/10 text-amber-500 text-[10px] font-mono font-bold py-1 px-2.5 rounded-md border border-amber-500/20 flex items-center gap-1 shrink-0">
              <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500/20" /> Webhook 2.5 Active
            </span>
            <div className="flex items-center gap-2 bg-black/30 border border-purple-900/40 p-1 rounded-xl shadow-xs">
              <span className="text-[10px] text-purple-300 font-bold font-mono px-2 truncate max-w-[150px]" title={loggedInUser || "MEMBER"}>
                👤 {loggedInUser || "User"}
              </span>
              <button
                id="btn-app-signout"
                onClick={() => {
                  addActivity(loggedInUser || "User", activeRole, "Subscription", `Melakukan Sign-Out dari Portal`, "Pengguna kembali dialihkan ke halaman log masuk primer.");
                  addSystemLog(`[Auth] User ${loggedInUser || "User"} signed out. Session destroyed.`);
                  setIsLoggedIn(false);
                  setLoggedInUser("");
                }}
                className="px-2.5 py-1 bg-red-500/10 hover:bg-red-500/30 border border-red-500/35 text-red-300 text-[9px] font-extrabold uppercase rounded-lg transition-all active:scale-95"
              >
                Keluar
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* Main Container body spacer */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 sm:p-8">
        
        {/* Render correct template based on tab & role state */}
        <div id="active-tab-content" className="animate-fade-in duration-300">
          
          {/* BUYER PORTAL ROLE */}
          {activeRole === "buyer" && (
            <>
              {activeTab === "marketplace" && (
                <BuyerMarketplace 
                  isPremiumVIP={isPremiumVIP}
                  vipExchangeRate={vipExchangeRate}
                  isResellerMode={isResellerMode}
                  onSetResellerMode={setIsResellerMode}
                  isBuyerVIP={isBuyerVIP}
                  onToggleBuyerVIP={setIsBuyerVIP}
                  isBotMaintenance={isBotMaintenance}
                  items={items}
                  webhookLatency={webhookLatency}
                  onAddActivity={addActivity}
                />
              )}

              {activeTab === "pricing" && (
                <SaaSPricing 
                  isPremiumVIP={isPremiumVIP}
                  onToggleVIP={setIsPremiumVIP}
                  isBuyerVIP={isBuyerVIP}
                  onToggleBuyerVIP={setIsBuyerVIP}
                  onAddActivity={addActivity}
                />
              )}
            </>
          )}

          {/* SELLER CONTROL ROLE */}
          {activeRole === "seller" && (
            <>
              {activeTab === "seller" && (
                <SellerDashboard 
                  isPremiumVIP={isPremiumVIP}
                  vipExchangeRate={vipExchangeRate}
                  onSetVipExchangeRate={setVipExchangeRate}
                  isResellerMode={isResellerMode}
                  items={items}
                  onUpdateItems={setItems}
                  onAddActivity={addActivity}
                />
              )}

              {activeTab === "pricing" && (
                <SaaSPricing 
                  isPremiumVIP={isPremiumVIP}
                  onToggleVIP={setIsPremiumVIP}
                  isBuyerVIP={isBuyerVIP}
                  onToggleBuyerVIP={setIsBuyerVIP}
                  onAddActivity={addActivity}
                />
              )}
            </>
          )}

          {/* DEVELOPER SYSADMIN ENGINE */}
          {activeRole === "developer" && (
            <DeveloperConsole 
              items={items}
              onUpdateItems={setItems}
              isBotMaintenance={isBotMaintenance}
              onToggleMaintenance={setIsBotMaintenance}
              systemLogs={systemLogs}
              onAddLog={addSystemLog}
              webhookLatency={webhookLatency}
              onSetLatency={setWebhookLatency}
              botCount={botCount}
              onSetBotCount={setBotCount}
              activities={activities}
              onAddActivity={addActivity}
            />
          )}

        </div>

      </main>

      {/* Footer copyright and description */}
      <footer className={`p-6 border-t text-center text-xs transition-colors duration-500 ${roleTheme.footerBg}`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="font-bold font-display block sm:inline">Growee Store & SaaS Platform</span>
            <span className="hidden sm:inline mx-1">|</span>
            <span className="text-[10px]">
              Cloud Computing Virtual Automation Gateway & Dual Subscriptions
            </span>
          </div>
          <div className="flex items-center justify-center gap-4 text-xs font-mono">
            <span>UGC Delivery Protocol v3.0</span>
            <span>•</span>
            <span className="text-amber-500 font-bold">● Multi-Role Separation Active</span>
          </div>
        </div>
      </footer>

      {/* FLOAT CHATBOT ASSISTANT */}
      <ChatbotWidget />

    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);
