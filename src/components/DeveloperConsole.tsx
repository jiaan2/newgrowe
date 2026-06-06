import React, { useState, useEffect } from "react";
import { 
  Terminal, 
  Cpu, 
  RefreshCw, 
  Database, 
  AlertOctagon, 
  Sliders, 
  CheckCircle2, 
  Zap, 
  Settings, 
  Activity,
  Play,
  Check,
  FileCode
} from "lucide-react";
import { MarketplaceItem, UserActivity } from "../types";

interface DeveloperConsoleProps {
  items: MarketplaceItem[];
  onUpdateItems: (newItems: MarketplaceItem[]) => void;
  isBotMaintenance: boolean;
  onToggleMaintenance: (val: boolean) => void;
  systemLogs: string[];
  onAddLog: (log: string) => void;
  webhookLatency: number;
  onSetLatency: (val: number) => void;
  botCount: number;
  onSetBotCount: (val: number) => void;
  activities?: UserActivity[];
  onAddActivity?: (
    actor: string, 
    role: "buyer" | "seller" | "system" | "developer", 
    category: "Checkout" | "Inventory" | "Subscription" | "LiveOps" | "Setting", 
    description: string, 
    details?: string
  ) => void;
}

export const DeveloperConsole: React.FC<DeveloperConsoleProps> = ({
  items,
  onUpdateItems,
  isBotMaintenance,
  onToggleMaintenance,
  systemLogs,
  onAddLog,
  webhookLatency,
  onSetLatency,
  botCount,
  onSetBotCount,
  activities = [],
  onAddActivity
}) => {
  const [activeTab, setActiveTab] = useState<"logs" | "items" | "api" | "activities">("activities");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<"all" | "buyer" | "seller" | "system">("all");
  const [editingItem, setEditingItem] = useState<MarketplaceItem | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);
  const [isCPUStressing, setIsCPUStressing] = useState(false);
  const [cpuUsage, setCpuUsage] = useState(34);
  const [ramUsage, setRamUsage] = useState(48);

  // Auto-simulate live metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Small fluctuation
      setCpuUsage(prev => {
        const delta = Math.floor(Math.random() * 7) - 3;
        const target = isCPUStressing ? 90 + delta : 32 + delta;
        return Math.max(10, Math.min(100, target));
      });
      setRamUsage(prev => {
        const delta = Math.floor(Math.random() * 3) - 1;
        const target = isCPUStressing ? 85 + delta : 46 + delta;
        return Math.max(20, Math.min(100, target));
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isCPUStressing]);

  // Edit product base parameters helper
  const handleStartEdit = (item: MarketplaceItem) => {
    setEditingItem(item);
    setEditPrice(item.priceBaseIDR);
    setEditStock(item.stock);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const updated = items.map(it => {
      if (it.id === editingItem.id) {
        return {
          ...it,
          priceBaseIDR: editPrice,
          stock: editStock
        };
      }
      return it;
    });

    onUpdateItems(updated);
    onAddLog(`[Developer] Edited baseline item ${editingItem.id} values in inventory: Price IDR ${editPrice}, Stock ${editStock}`);
    setEditingItem(null);
  };

  // Run database health sweep simulator
  const handleDatabaseSweep = () => {
    onAddLog("[SysAdmin] Starting PostgreSQL table consistency inspection...");
    setTimeout(() => onAddLog("[DrizzleORM] Schema mapped: 4 modules up to date. Direct sync confirmed."), 400);
    setTimeout(() => onAddLog("[SysAdmin] Verification successful: Index hashes match. 0 corrupt nodes found."), 800);
  };

  // Stress CPU test toggle
  const handleCpuStressToggle = () => {
    const nextVal = !isCPUStressing;
    setIsCPUStressing(nextVal);
    onAddLog(nextVal 
      ? "[System] ALERT: Initiated sandbox multi-threaded performance stress test!" 
      : "[System] Performance stress test terminated. Cores returning to idle states."
    );
  };

  // Simulated Webhook JSON Payload
  const sampleWebhookJSON = {
    event_id: "evt_9a42f883cd10eb2f440",
    event_type: "payment.qris.received",
    created_at: new Date().toISOString(),
    sandbox: true,
    data: {
      merchant_id: "GROWEE-M-9021",
      invoice_number: "INV-2026-XQ03",
      amount_paid: 45000,
      payment_method: "QRIS_GO_PAY",
      status: "SUCCESS_SETTLED",
      user_payload: {
        roblox_username: "GamerRoblox_99",
        checkout_item_id: "robux-1000",
        routing_port: 3000,
        delivery_bypass: isBotMaintenance ? "OFF_MAINTENANCE" : "BYPASS_QUEUE"
      }
    }
  };

  return (
    <div id="developer-console-parent" className="space-y-8">
      
      {/* Intro section with tech aesthetic banner */}
      <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-mono tracking-widest text-[#B494FF] uppercase font-bold bg-[#B494FF]/10 px-2.5 py-0.5 rounded">
              SysAdmin Engine Terminal
            </span>
          </div>
          <h2 className="text-2xl font-extrabold font-display tracking-tight flex items-center gap-2 text-white">
            <Terminal className="text-[#B494FF] w-6 h-6" />
            Growee Core Admin & Live Database Sync
          </h2>
          <p className="text-xs text-zinc-400 font-sans max-w-xl">
            Area administrasi sistem global. Gunakan panel ini untuk mengedit inventaris katalog, 
            menurunkan bot untuk pemeliharaan, memantau muatan Webhook QRIS, serta membaca log debug server secara real-time.
          </p>
        </div>

        {/* System Uptime / Stats Badges */}
        <div className="grid grid-cols-2 gap-3 shrink-0 font-mono w-full md:w-auto">
          <div className="p-3 bg-zinc-900 border border-zinc-850 rounded-xl text-center">
            <span className="text-[10px] text-zinc-500 block uppercase">Sys Uptime</span>
            <span className="text-xs font-bold text-emerald-400">99.98% / Stable</span>
          </div>
          <div className="p-3 bg-zinc-900 border border-zinc-850 rounded-xl text-center">
            <span className="text-[10px] text-zinc-500 block uppercase">Database Host</span>
            <span className="text-xs font-bold text-[#B494FF]">Vite Dev SQLite</span>
          </div>
        </div>
      </div>

      {/* Grid of Toggles + Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Interactive controls */}
        <div className="bg-white p-6 rounded-2xl border border-purple-200/85 space-y-6 shadow-sm">
          <h3 className="text-sm font-extrabold text-purple-950 uppercase tracking-wider flex items-center gap-1.5 border-b border-purple-100 pb-3">
            <Settings className="w-4.5 h-4.5 text-purple-600" />
            System Control Variables
          </h3>

          <div className="space-y-4 text-xs">
            {/* Maintenance Mode State Selector */}
            <div className="space-y-1.5">
              <label className="text-purple-900 font-bold block">Delivery Bot Maintenance Status:</label>
              <div id="maintenance-switcher" className="grid grid-cols-2 gap-2 p-1 bg-purple-100/70 rounded-lg border border-purple-200">
                <button
                  id="btn-m-active"
                  onClick={() => {
                    onToggleMaintenance(false);
                    onAddLog("[System] Bot Delivery ONLINE. All queues authorized to handle delivery payloads.");
                  }}
                  className={`py-1.5 rounded font-bold transition-all text-[11px] ${
                    !isBotMaintenance 
                      ? "bg-green-600 text-white shadow-xs" 
                      : "text-purple-800 hover:bg-purple-200/50"
                  }`}
                >
                  🟢 Ready Online
                </button>
                <button
                  id="btn-m-inactive"
                  onClick={() => {
                    onToggleMaintenance(true);
                    onAddLog("[System] WARNING: Bot Delivery has been put into MAINTENANCE mode by developer.");
                  }}
                  className={`py-1.5 rounded font-bold transition-all text-[11px] ${
                    isBotMaintenance 
                      ? "bg-amber-600 text-white shadow-xs" 
                      : "text-purple-800 hover:bg-purple-200/50"
                  }`}
                >
                  ⚠️ Maintenance
                </button>
              </div>
            </div>

            {/* Custom Latency Slider */}
            <div className="space-y-1.5 pt-2 border-t border-purple-100">
              <div className="flex justify-between font-mono">
                <span className="text-purple-900 font-bold">Simulated Webhook Lag:</span>
                <span className="text-amber-700 font-extrabold font-mono">{webhookLatency}s</span>
              </div>
              <input 
                type="range"
                id="webhook-latency-slider"
                min={0.5}
                max={15.0}
                step={0.5}
                value={webhookLatency}
                onChange={(e) => {
                  onSetLatency(parseFloat(e.target.value));
                  onAddLog(`[Developer] Simulating Webhook QRIS response lag threshold set to ${e.target.value} seconds.`);
                }}
                className="w-full h-1.5 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-850"
              />
              <div className="flex justify-between text-[10px] text-purple-600 font-mono">
                <span>Instan (0.5s)</span>
                <span>Normal (1.8s)</span>
                <span>Server Overload (15s)</span>
              </div>
            </div>

            {/* Simulated Bot count */}
            <div className="space-y-1.5 pt-2 border-t border-purple-100">
              <div className="flex justify-between font-mono">
                <span className="text-purple-900 font-bold">Bot Fleet in Queue Pool:</span>
                <span className="text-[#B494FF] font-extrabold font-mono bg-purple-950 text-white px-2 py-0.5 rounded text-[11px]">{botCount} Bots</span>
              </div>
              <input 
                type="range"
                id="bot-fleet-slider"
                min={5}
                max={150}
                value={botCount}
                onChange={(e) => {
                  onSetBotCount(parseInt(e.target.value));
                }}
                className="w-full h-1.5 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-850"
              />
            </div>

            <div className="pt-4 border-t border-purple-100 space-y-2">
              <h4 className="text-purple-900 font-bold">Diagnostic Commands:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  id="btn-sweep-db"
                  onClick={handleDatabaseSweep}
                  className="py-2 px-3 bg-purple-850 hover:bg-purple-900 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 text-[11px]"
                >
                  <Database className="w-3.5 h-3.5" /> Sweep DB Health
                </button>
                <button
                  id="btn-stress-cpu"
                  onClick={handleCpuStressToggle}
                  className={`py-2 px-3 font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 text-[11px] text-white ${
                    isCPUStressing 
                      ? "bg-red-650 hover:bg-red-700 shadow-inner" 
                      : "bg-[#2d1b4e] hover:bg-[#3d2568]"
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" /> {isCPUStressing ? "Stop Stress" : "Stress Test CPU"}
                </button>
              </div>
            </div>
            
          </div>
        </div>

        {/* Center Section: Tabs for Logs, Items, API */}
        <div className="lg:col-span-2 flex flex-col bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden shadow-xl text-zinc-300">
          
          {/* Tabs header */}
          <div className="bg-zinc-900 border-b border-zinc-800 p-2 flex items-center justify-between">
            <div className="flex bg-zinc-950/60 p-0.5 rounded-lg border border-zinc-800/80 items-center gap-1">
              <button
                id="btn-console-activities"
                onClick={() => setActiveTab("activities")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === "activities" ? "bg-zinc-850 text-white border border-zinc-750" : "hover:text-white"
                }`}
              >
                <Activity className="w-3.5 h-3.5 text-emerald-400 select-none" /> Buyer &amp; Seller Feed
              </button>
              <button
                id="btn-console-logs"
                onClick={() => setActiveTab("logs")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === "logs" ? "bg-zinc-850 text-white border border-zinc-750" : "hover:text-white"
                }`}
              >
                <Terminal className="w-3.5 h-3.5 text-purple-400 select-none" /> STDOUT Logs
              </button>
              <button
                id="btn-console-edit-items"
                onClick={() => setActiveTab("items")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === "items" ? "bg-zinc-850 text-white border border-zinc-750" : "hover:text-white"
                }`}
              >
                <Sliders className="w-3.5 h-3.5 text-[#ffd700] select-none" /> Baseline Catalog
              </button>
              <button
                id="btn-console-api"
                onClick={() => setActiveTab("api")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === "api" ? "bg-zinc-850 text-white border border-zinc-750" : "hover:text-white"
                }`}
              >
                <FileCode className="w-3.5 h-3.5 text-emerald-400 select-none" /> Webhook Payloads
              </button>
            </div>

            {/* Quick status dots */}
            <div className="flex items-center gap-4 text-[10px] font-mono mr-2">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> CPU: {cpuUsage}%
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#B494FF]"></span> RAM: {ramUsage}%
              </span>
            </div>
          </div>

          {/* TAB 4: Buyer & Seller Activity Ledger */}
          {activeTab === "activities" && (
            <div id="activities-panel-container" className="p-4 flex-grow flex flex-col justify-between h-[360px] font-sans">
              <div className="space-y-3 flex-grow flex flex-col justify-between overflow-hidden">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 border-b border-zinc-800 pb-2 shrink-0">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase font-mono flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-emerald-400 select-none animate-pulse" />
                      Live Buyer &amp; Seller Activity Ledger
                    </h4>
                    <span className="text-[10px] text-zinc-500 font-mono block">Logs captured live from routing gateways, store checks, and checkout tunnels.</span>
                  </div>

                  {/* Simulasi Trigger custom action quickly right inside the dev workspace */}
                  <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0 select-none">
                    <button
                      id="sim-buyer-buy-btn"
                      onClick={() => {
                        const buyersList = ["GamerPro_88", "fisch_lover", "NoobRobloxian", "Valkyrie_Legend"];
                        const randomBuyer = buyersList[Math.floor(Math.random() * buyersList.length)];
                        const itemsList = ["1,000 Robux (Instan Bot)", "Kraken Claw", "Magma Rod", "Fast Boats Gamepass"];
                        const randomItem = itemsList[Math.floor(Math.random() * itemsList.length)];
                        const price = Math.floor(Math.random() * 100000) + 15000;
                        onAddActivity?.(
                          `Buyer: ${randomBuyer}`,
                          "buyer",
                          "Checkout",
                          `Scan QRIS Simulasi - Membeli "${randomItem}"`,
                          `Selesai memproses transfer payload senilai Rp ${price.toLocaleString()}`
                        );
                        onAddLog(`[Simulator] Simulated checkout action for ${randomBuyer}`);
                      }}
                      className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 font-mono text-[9px] rounded font-bold transition-all"
                    >
                      + Simulasikan Buyer
                    </button>
                    <button
                      id="sim-seller-rate-btn"
                      onClick={() => {
                        const randomRate = (0.5 + Math.random() * 1.3).toFixed(1);
                        onAddActivity?.(
                          `Seller: Admin-Shop`,
                          "seller",
                          "Setting",
                          `Melakukan penataan ulang VIP Robux rate ke ${randomRate}x`,
                          `Disinkronisasikan ke multi-tenant database.`
                        );
                        onAddLog(`[Simulator] Simulated rate adjustment to ${randomRate}x price`);
                      }}
                      className="px-2 py-1 bg-purple-500/10 hover:bg-purple-500/25 border border-purple-500/30 text-[#B494FF] font-mono text-[9px] rounded font-bold transition-all"
                    >
                      + Simulasikan Seller
                    </button>
                  </div>
                </div>

                {/* Filter roles pill list */}
                <div className="flex flex-wrap items-center justify-between gap-2 shrink-0 select-none">
                  <div className="flex bg-zinc-90 w-auto border border-zinc-900 bg-zinc-900 p-0.5 rounded-lg">
                    {(["all", "buyer", "seller", "system"] as const).map((role) => (
                      <button
                        key={role}
                        onClick={() => setSelectedRoleFilter(role)}
                        className={`px-3 py-1 text-[10px] uppercase font-mono rounded-md font-bold transition-all ${
                          selectedRoleFilter === role
                            ? "bg-zinc-800 text-emerald-400 shadow border border-zinc-700/50"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        {role === "all" ? "Semua" : role}
                      </button>
                    ))}
                  </div>
                  
                  <span className="text-[10px] text-zinc-500 font-mono">
                    Total: <strong className="text-zinc-300 font-bold">{activities.length}</strong> peristiwa terlacak
                  </span>
                </div>

                {/* Scroller timeline area */}
                <div className="flex-grow overflow-y-auto max-h-[190px] space-y-2 pr-2.5 custom-scrollbar pb-2 text-[11px] font-sans">
                  {activities.length === 0 ? (
                    <div className="text-center py-8 text-zinc-500 font-mono">
                      Belum ada aktivitas yang direkam dalam Ledger.
                    </div>
                  ) : (
                    activities
                      .filter(act => selectedRoleFilter === "all" || act.role === selectedRoleFilter)
                      .map((act) => {
                        const roleColor = 
                          act.role === "buyer" ? "border-emerald-500/25 bg-emerald-500/5 text-emerald-400" :
                          act.role === "seller" ? "border-purple-500/25 bg-purple-500/5 text-[#B494FF]" :
                          act.role === "system" ? "border-cyan-500/25 bg-cyan-500/5 text-cyan-400" :
                          "border-amber-500/25 bg-amber-500/5 text-amber-400";
                        
                        const catColor = 
                          act.category === "Checkout" ? "bg-emerald-950 text-emerald-300 border border-emerald-800" :
                          act.category === "Inventory" ? "bg-blue-950 text-blue-300 border border-blue-800" :
                          act.category === "Subscription" ? "bg-[#2d1b4e] text-[#ffd700] border border-amber-800" :
                          act.category === "LiveOps" ? "bg-pink-950 text-pink-300 border border-pink-800" :
                          "bg-zinc-900 text-zinc-300 border border-zinc-800";

                        return (
                          <div key={act.id} className="p-2.5 bg-zinc-900/60 rounded-xl border border-zinc-850 flex items-start gap-3 hover:bg-zinc-900 transition-all font-sans leading-relaxed">
                            <span className="text-zinc-600 font-mono font-medium shrink-0 pt-0.5">{act.timestamp}</span>
                            
                            <div className="flex-grow space-y-1">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className={`text-[9px] font-bold uppercase rounded px-1.5 py-0.5 border ${roleColor}`}>
                                  {act.role}
                                </span>
                                <span className={`text-[9px] font-mono font-semibold rounded px-1.5 py-0.5 ${catColor}`}>
                                  {act.category}
                                </span>
                                <strong className="text-zinc-200 text-[11px] font-bold">
                                  {act.actor}
                                </strong>
                              </div>
                              <p className="text-zinc-300 text-xs font-semibold">
                                {act.description}
                              </p>
                              {act.details && (
                                <p className="text-[10px] text-zinc-500 font-mono">
                                  {act.details}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: Real-Time Debug Terminal logs */}
          {activeTab === "logs" && (
            <div id="logs-container" className="p-4 flex-grow flex flex-col justify-between h-[360px] font-mono text-[11px] leading-relaxed select-text space-y-3">
              <div className="overflow-y-auto max-h-[300px] space-y-1.5 pr-2 custom-scrollbar">
                {systemLogs.map((log, i) => (
                  <div key={i} className="flex gap-2.5 hover:bg-zinc-900/50 p-0.5 rounded">
                    <span className="text-zinc-600 font-light font-mono shrink-0 select-none">[{13 * i + 85}ms]</span>
                    <span className={
                      log.includes("ALERT") || log.includes("WARNING") ? "text-amber-400 font-bold" :
                      log.includes("[Developer]") ? "text-[#B494FF] font-semibold" :
                      log.includes("Engine") || log.includes("[Drizzle") ? "text-cyan-400" :
                      log.includes("success") || log.includes("verified") ? "text-emerald-400" : "text-zinc-300"
                    }>
                      {log}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-zinc-900 flex items-center justify-between">
                <span className="text-[10px] text-zinc-500 animate-pulse">● Listening on port 3000... Webhook listeners active.</span>
                <button
                  id="btn-clear-logs"
                  onClick={() => onAddLog(`[Developer] Shell cleared raw buffer. System state logs reset initialized at ${new Date().toLocaleTimeString()}`)}
                  className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-840 text-[10px] px-2 py-1 rounded text-zinc-400 hover:text-white"
                >
                  Clear Terminal Stream
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Live Stock & IDR Catalog Variable overriding */}
          {activeTab === "items" && (
            <div id="edit-items-container" className="p-4 flex-grow h-[360px] overflow-y-auto space-y-4">
              <span className="text-xs text-zinc-400 block font-sans">
                Override baseline prices & stock untuk mengamati respons re-render seketika di view Buyer & Seller.
              </span>

              {editingItem ? (
                <form id="dev-edit-form" onSubmit={handleSaveEdit} className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-4 font-sans">
                  <h4 className="text-xs font-bold text-white uppercase flex items-center gap-1">
                    Editing: <span className="text-[#B494FF] font-mono text-xs">{editingItem.name}</span>
                  </h4>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="text-zinc-400 block">Baseline Price (IDR):</label>
                      <input 
                        type="number" 
                        required
                        value={editPrice}
                        onChange={(e) => setEditPrice(parseInt(e.target.value))}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-zinc-400 block">Available Baseline Stock:</label>
                      <input 
                        type="number" 
                        required
                        value={editStock}
                        onChange={(e) => setEditStock(parseInt(e.target.value))}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-2 text-xs">
                    <button 
                      type="button"
                      id="cancel-item-edit"
                      onClick={() => setEditingItem(null)}
                      className="px-3 py-1.5 bg-zinc-800 text-zinc-400 rounded hover:text-white"
                    >
                      Batal
                    </button>
                    <button 
                      type="submit"
                      id="submit-item-edit"
                      className="px-4 py-1.5 bg-gradient-to-r from-purple-500 to-[#B494FF] text-black font-extrabold rounded flex items-center gap-1"
                    >
                      <Check className="w-4 h-4 shrink-0" /> Simpan Override
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-2 text-xs font-sans">
                  {items.map(item => (
                    <div key={item.id} className="p-3 bg-zinc-900 rounded-xl border border-zinc-850 flex items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] text-[#B494FF] font-semibold">{item.category}</span>
                        <h4 className="text-sm font-bold text-white mt-0.5">{item.name}</h4>
                        <div className="flex gap-4 text-[11px] text-zinc-500 font-mono mt-1">
                          <span>Price: Rp {item.priceBaseIDR.toLocaleString()}</span>
                          <span>Stock: {item.stock.toLocaleString()} units</span>
                        </div>
                      </div>

                      <button
                        id={`btn-dev-edit-${item.id}`}
                        onClick={() => handleStartEdit(item)}
                        className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded text-[11px]"
                      >
                        Edit Vars
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Webhook API format visualizer */}
          {activeTab === "api" && (
            <div id="api-payload-container" className="p-4 flex-grow h-[360px] overflow-y-auto space-y-3 font-mono text-[11px]">
              <span className="text-xs text-zinc-400 font-sans block leading-relaxed mb-1">
                Struktur JSON payload yang dikirimkan oleh webhook QRIS instan ke endpoint virtual `/api/qris-webhook` milik Growee server.
              </span>
              
              <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800 select-all overflow-x-auto text-[#e2d9f3]">
                <pre>{JSON.stringify(sampleWebhookJSON, null, 2)}</pre>
              </div>

              <div className="bg-zinc-900 border border-zinc-850 p-3.5 rounded-xl flex items-center gap-2.5 font-sans">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <p className="text-[11px] text-zinc-400">
                  Integrasi REST API siap dihubungkan ke penyedia e-payment gerbang QRIS asli. Payload menyertakan bypass log sesuai prioritas subscription pembeli / penjual.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
