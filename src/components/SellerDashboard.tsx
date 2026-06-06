import React, { useState } from "react";
import { 
  BarChart, 
  TrendingUp, 
  Users, 
  Coins, 
  Percent, 
  Sliders, 
  Send, 
  Bot, 
  RefreshCw, 
  AlertTriangle,
  Lock,
  ArrowRight,
  Sparkles,
  Info,
  Gift,
  Package,
  Search,
  Plus,
  Minus
} from "lucide-react";
import { ChurnUser, INITIAL_CHURN_USERS, MarketplaceItem } from "../types";

interface SellerDashboardProps {
  isPremiumVIP: boolean;
  vipExchangeRate: number; // Robux per IDR scale
  onSetVipExchangeRate: (rate: number) => void;
  isResellerMode: boolean;
  items: MarketplaceItem[];
  onUpdateItems: (items: MarketplaceItem[]) => void;
  onAddActivity?: (
    actor: string, 
    role: "buyer" | "seller" | "system" | "developer", 
    category: "Checkout" | "Inventory" | "Subscription" | "LiveOps" | "Setting", 
    description: string, 
    details?: string
  ) => void;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({
  isPremiumVIP,
  vipExchangeRate,
  onSetVipExchangeRate,
  isResellerMode,
  items,
  onUpdateItems,
  onAddActivity
}) => {
  // Churn list state
  const [churnUsers, setChurnUsers] = useState<ChurnUser[]>(INITIAL_CHURN_USERS);

  // Search states for display products live preview
  const [productSearch, setProductSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const handleAdjustStock = (itemId: string, increment: number) => {
    const targetItem = items.find(it => it.id === itemId);
    const updated = items.map(item => {
      if (item.id === itemId) {
        const newStock = Math.max(0, item.stock + increment);
        return { ...item, stock: newStock };
      }
      return item;
    });
    onUpdateItems(updated);
    
    if (targetItem) {
      onAddActivity?.(
        "Seller", 
        "seller", 
        "Inventory", 
        `Mengubah stok katalog untuk "${targetItem.name}"`, 
        `Perubahan stok: ${increment > 0 ? "+" : ""}${increment} units. Stok baru: ${(Math.max(0, targetItem.stock + increment)).toLocaleString()} units.`
      );
    }
  };
  
  // Economy Simulator values
  const [coinsSink, setCoinsSink] = useState(1200000);   // Sink coins
  const [coinsSource, setCoinsSource] = useState(1850000); // Source coins
  const [isFlashSaleActive, setIsFlashSaleActive] = useState(false);

  // Calculate internal inflation index
  const getInflationIndex = (sink: number, source: number) => {
    if (sink === 0) return 0;
    return parseFloat(((source / sink) * 100).toFixed(1));
  };

  const inflationIndex = getInflationIndex(coinsSink, coinsSource);

  // Handler for Flash Sale / LiveOps activation
  const handleToggleFlashSale = () => {
    const nextState = !isFlashSaleActive;
    setIsFlashSaleActive(nextState);
    if (nextState) {
      // Flash sale triggers coin circulation balance
      // Sink goes up (users spend coins on flash items) and Source cools down
      setCoinsSink(1550000);
      setCoinsSource(1750000);
      onAddActivity?.(
        "Seller: LiveOps System",
        "seller",
        "LiveOps",
        "Mengaktifkan Kampanye Flash Sale & Promosi Terjadwal",
        "Nilai sirkulasi sink bertambah menjadi Rp 1.55M untuk menyeimbangkan inflasi pasar."
      );
    } else {
      // Revert to initial state
      setCoinsSink(1200000);
      setCoinsSource(1850000);
      onAddActivity?.(
        "Seller: LiveOps System",
        "seller",
        "LiveOps",
        "Menonaktifkan Kampanye Flash Sale & Promosi Terjadwal",
        "Sirkulasi koin dan tatanan inflasi pasar dikembalikan ke rasio standar 1.0x."
      );
    }
  };

  // Handler for sending discount coupons
  const handleSendCoupon = (id: string) => {
    const targetUser = churnUsers.find(u => u.id === id);
    setChurnUsers(prev => 
      prev.map(user => 
        user.id === id ? { ...user, couponSent: true } : user
      )
    );
    if (targetUser) {
      onAddActivity?.(
        "Seller: Churn Agent",
        "seller",
        "LiveOps",
        `Mengirim Kupon Diskon Loyalitas 15% ke "${targetUser.username}"`,
        `Kategori Game: ${targetUser.gamePreference}. Target interaksi aktif kembali di estimasi.`
      );
    }
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div id="seller-dashboard-parent" className="space-y-8">
      
      {/* Top Welcome Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-purple-950 tracking-tight flex items-center gap-2">
            <Sliders className="text-amber-600 w-6 h-6" />
            Seller & SaaS Automation Console
          </h2>
          <p className="text-sm text-purple-800 font-medium">
            Pantau performa konversi QRIS, turnover koin internal, dan kelola retensi pelanggan Anda secara real-time.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-purple-100 border border-purple-200 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-purple-800">
          <span className="text-purple-600 font-mono">ID Merchant:</span>
          <span className="text-purple-950 font-mono font-bold">GROWEE-M-9021</span>
          <span className="h-4 w-px bg-purple-200 mx-1"></span>
          <span className="text-green-700 font-extrabold font-mono font-mono">ONLINE</span>
        </div>
      </div>

      {/* CORE PLATFORM HEALTH METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Metric 1 */}
        <div id="metric-revenue" className="bg-white p-4 rounded-xl border border-purple-100 flex flex-col justify-between shadow-xs">
          <span className="text-xs text-purple-500 font-mono font-bold block">Gross Revenue / Bln</span>
          <div className="mt-2.5">
            <span className="text-lg font-bold text-purple-950 block font-mono">Rp 24.580.000</span>
            <span className="text-[10px] text-green-600 font-semibold flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +14.2% dari bln lalu
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div id="metric-users" className="bg-white p-4 rounded-xl border border-purple-100 flex flex-col justify-between shadow-xs">
          <span className="text-xs text-purple-500 font-mono font-bold block">Total Active Users</span>
          <div className="mt-2.5">
            <span className="text-lg font-bold text-purple-950 block font-mono">12,000 Players</span>
            <span className="text-[10px] text-purple-600 font-mono block mt-0.5">Lalu lintas bulanan</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div id="metric-arpu" className="bg-white p-4 rounded-xl border border-purple-100 flex flex-col justify-between shadow-xs">
          <span className="text-xs text-purple-500 font-mono font-bold block">ARPU (Average Revenue Per User)</span>
          <div className="mt-2.5">
            <span className="text-lg font-bold text-amber-800 block font-mono">Rp 2.042</span>
            <span className="text-[10px] text-purple-600 font-mono block mt-0.5">Nilai per pengunjung</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div id="metric-arppu" className="bg-white p-4 rounded-xl border border-purple-100 flex flex-col justify-between shadow-xs">
          <span className="text-xs text-purple-500 font-mono font-bold block">ARPPU (Per Paying User)</span>
          <div className="mt-2.5">
            <span className="text-lg font-bold text-purple-800 block font-mono">Rp 29.167</span>
            <span className="text-[10px] text-amber-850 font-bold block mt-0.5">Tingkat spending pembeli</span>
          </div>
        </div>

        {/* Metric 5 */}
        <div id="metric-conversion" className="bg-white p-4 rounded-xl border border-purple-100 flex flex-col justify-between shadow-xs">
          <span className="text-xs text-purple-500 font-mono font-bold block">Overall Conversion</span>
          <div className="mt-2.5">
            <span className="text-lg font-bold text-purple-950 block font-mono">7.8%</span>
            <span className="text-[10px] text-green-600 font-bold block mt-0.5">Sangat tinggi &lt;30s Bot</span>
          </div>
        </div>

      </div>

      {/* MID SECTION: FUNNEL VS EXCHANGE REGULATOR */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Live Funnel Analytics Section */}
        <div className="bg-white p-6 rounded-2xl border border-purple-100 space-y-6 shadow-xs">
          <div>
            <h3 className="text-base font-bold text-purple-950 font-display flex items-center gap-2">
              <Percent className="text-purple-600 w-5 h-5" />
              Live Funnel Analytics
            </h3>
            <p className="text-xs text-purple-700 font-medium mt-0.5">
              Visualisasi alur konversi pengunjung website hingga pembayaran sukses di Growee Store.
            </p>
          </div>

          {/* Graphical Funnel Visualization blocks */}
          <div className="space-y-3 pt-2">
            
            {/* Step 1 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-purple-900 font-bold">
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-4 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center font-mono text-[10px] border border-purple-200">1</span>
                  Lalu Lintas Pengunjung (12,000 Visitors)
                </span>
                <span className="font-mono">100%</span>
              </div>
              <div className="w-full bg-purple-50 rounded-lg overflow-hidden h-7 relative flex items-center border border-purple-100">
                <div className="bg-purple-200 h-full rounded-l-lg" style={{ width: "100%" }}></div>
                <span className="absolute left-3 text-xs text-purple-955 font-bold font-mono">12,000 Players</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-purple-900 font-bold">
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-4 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center font-mono text-[10px] border border-purple-200">2</span>
                  Mengkonfigurasi Order Game (45% Configurator)
                </span>
                <span className="font-mono text-purple-700">45% Konversi</span>
              </div>
              <div className="w-full bg-purple-50 rounded-lg overflow-hidden h-7 relative flex items-center border border-purple-100">
                <div className="bg-purple-300 h-full rounded-l-lg border-r border-purple-400" style={{ width: "45%" }}></div>
                <span className="absolute left-3 text-xs text-purple-955 font-bold font-mono">5,400 Users</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-purple-900 font-bold">
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-4 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center font-mono text-[10px] border border-purple-200">3</span>
                  Mengeluarkan Code QRIS (22% Generated)
                </span>
                <span className="font-mono text-purple-700">22% Konversi</span>
              </div>
              <div className="w-full bg-purple-50 rounded-lg overflow-hidden h-7 relative flex items-center border border-purple-100">
                <div className="bg-amber-200 h-full rounded-l-lg border-r border-amber-300" style={{ width: "22%" }}></div>
                <span className="absolute left-3 text-xs text-purple-955 font-bold font-mono">2,640 Users</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-purple-900 font-bold">
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-4 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-mono text-[10px] border border-green-200">4</span>
                  Webhook QRIS Sukses Terbayar (7% Final conversion)
                </span>
                <span className="font-mono text-green-700 font-bold">7% Net Conversion</span>
              </div>
              <div className="w-full bg-purple-50 rounded-lg overflow-hidden h-7 relative flex items-center border border-purple-100">
                <div className="bg-green-500/30 h-full rounded-l-lg border-r border-green-500" style={{ width: "7%" }}></div>
                <span className="absolute left-3 text-xs text-green-800 font-bold font-mono">840 Users (Completed)</span>
              </div>
            </div>

          </div>

          <div className="bg-purple-50 p-3.5 rounded-xl border border-purple-100 flex items-center gap-3">
            <Info className="w-5 h-5 text-amber-700 shrink-0" />
            <p className="text-[11px] text-purple-900 leading-relaxed font-semibold">
              <strong>Analitis Insight:</strong> 7% Conversion rate berada jauh di atas rata-rata industri (<strong className="text-purple-950">2.1%</strong>). Layanan bot pengiriman kurang dari 30 detik memotong waktu tunggu dan meningkatkan kepercayaan pembeli Roblox.
            </p>
          </div>
        </div>

        {/* Dynamic Exchange Rate Slider (VIP PERK REGULATOR) */}
        <div className="bg-white p-6 rounded-2xl border border-purple-100 flex flex-col justify-between shadow-xs">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-purple-950 font-display flex items-center gap-2">
                  <Sliders className="text-purple-600 w-5 h-5" />
                  Robux Exchange Rate Slider
                </h3>
                <p className="text-xs text-purple-700 font-medium mt-0.5">
                  Sesuaikan nilai tukar Robux Anda terhadap IDR secara fleksibel mengikuti fluktuasi pasar grosir.
                </p>
              </div>

              {!isPremiumVIP && (
                <span className="bg-purple-100 border border-purple-200 text-[10px] text-purple-700 tracking-wider font-bold uppercase py-0.5 px-2 rounded-full flex items-center gap-1 font-mono">
                  <Lock className="w-3 h-3 text-purple-600" /> Lock
                </span>
              )}
            </div>

            {/* Slider visual representation */}
            <div className={`p-5 rounded-xl transition-all ${
              isPremiumVIP 
                ? "bg-amber-50/50 border border-amber-300" 
                : "bg-purple-50/30 border border-purple-100 opacity-60"
            }`}>
              
              <div className="flex justify-between items-center text-xs font-mono mb-2">
                <span className="text-purple-855 font-medium">Rasio Pengali Robux : IDR</span>
                <span className="text-amber-850 font-extrabold text-sm bg-amber-100 px-2.5 py-0.5 rounded border border-amber-200">
                  {vipExchangeRate}x Price
                </span>
              </div>

              <input 
                type="range"
                min="0.5"
                max="1.8"
                step="0.1"
                id="exchange-rate-slider-input"
                disabled={!isPremiumVIP}
                value={vipExchangeRate}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onSetVipExchangeRate(val);
                  onAddActivity?.(
                    "Seller",
                    "seller",
                    "Setting",
                    `Mengubah Rasio Pengali Harga Robux : IDR menjadi ${val}x`,
                    `Perubahan diaplikasikan live ke seluruh item kategori Robux.`
                  );
                }}
                className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-800"
              />

              <div className="flex justify-between text-[10px] text-purple-500 font-mono mt-1 font-medium">
                <span>0.5x (Harga Termurah)</span>
                <span>Normal (1.0x)</span>
                <span>1.8x (Harga Premium)</span>
              </div>

              {/* Live Preview Calculation with layout */}
              <div className="mt-5 pt-4 border-t border-purple-100 text-xs text-purple-700 space-y-1.5 font-medium">
                <span className="font-mono text-[10px] text-purple-500 uppercase block font-bold">Live Preview Store Catalog</span>
                <div className="flex justify-between text-xs text-purple-900 border-b border-purple-50/50 pb-1">
                  <span>1,000 Robux Normal: <span className="text-purple-400 line-through">Rp 45.000</span></span>
                  <span>Menjadi: &nbsp;
                    <strong className="text-amber-800 font-mono font-bold">
                      {formatRupiah(Math.round(45000 * vipExchangeRate))}
                    </strong>
                  </span>
                </div>
                <div className="flex justify-between text-xs text-purple-900">
                  <span>5,000 Robux Normal: <span className="text-purple-400 line-through">Rp 215.000</span></span>
                  <span>Menjadi: &nbsp;
                    <strong className="text-amber-800 font-mono font-bold">
                      {formatRupiah(Math.round(215000 * vipExchangeRate))}
                    </strong>
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Unlock action or current state */}
          <div className="mt-6">
            {!isPremiumVIP ? (
              <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <div className="text-[11px] text-purple-900 leading-snug font-medium">
                  Fitur <strong>Dynamic Slider Regulator</strong> terkunci pada Free tier. Silakan berlangganan <span className="text-amber-800 font-bold">SaaS Premium VIP Plan</span> untuk mengatur margin laba virtual toko Anda.
                </div>
              </div>
            ) : (
              <div className="p-3 bg-green-50/55 border border-green-200 rounded-xl flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-2 text-xs text-green-700 font-bold">
                  <Sparkles className="w-4 h-4 text-green-600" />
                  VIP Slider Regulator Aktif. Katalog Toko terupdate otomatis.
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 🏷️ LIVE PRODUCTS DISPLAY & STOCK CONTROL INTEGRATION */}
      <div className="bg-white p-6 rounded-2xl border border-purple-200/80 space-y-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-purple-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-purple-950 font-display flex items-center gap-2">
              <Package className="text-purple-600 w-5 h-5 pointer-events-none" />
              Live Catalog & Inventory Display
            </h3>
            <p className="text-xs text-purple-700 font-medium mt-0.5">
              Pantau produk yang saat ini ditampilkan di marketplace Anda. Setel ketersediaan stok, pantau harga display, dan optimalkan layout etalase secara dinamis.
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-purple-400">
                <Search className="w-3.5 h-3.5" />
              </span>
              <input
                type="text"
                placeholder="Cari produk..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-purple-50/50 border border-purple-200 rounded-lg text-purple-955 focus:outline-none focus:ring-1 focus:ring-purple-500 w-44 font-medium transition-all"
              />
            </div>

            <div className="flex bg-purple-100 p-0.5 rounded-lg border border-purple-200">
              {["All", "Robux", "Fisch", "Roblox Gamepasses"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
                    selectedCategory === cat
                      ? "bg-purple-800 text-white shadow-xs"
                      : "text-purple-800 hover:text-purple-950"
                  }`}
                >
                  {cat === "All" ? "Semua" : cat === "Roblox Gamepasses" ? "Gamepass" : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {items
            .filter((item) => {
              const matchesSearch = item.name.toLowerCase().includes(productSearch.toLowerCase());
              const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
              return matchesSearch && matchesCategory;
            })
            .map((item) => {
              // Calculate dynamic price based on isPremiumVIP and vipExchangeRate
              const isRobux = item.category === "Robux";
              const currentPrice = isRobux 
                ? Math.round(item.priceBaseIDR * vipExchangeRate) 
                : item.priceBaseIDR;

              return (
                <div 
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                    item.stock === 0 
                      ? "border-red-200 bg-red-50/10 opacity-80" 
                      : isPremiumVIP 
                        ? "border-amber-200 hover:border-amber-300 shadow-xs bg-gradient-to-br from-white to-amber-50/10" 
                        : "border-purple-100 hover:border-purple-250 bg-white"
                  }`}
                >
                  <div className="flex gap-3">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className={`w-12 h-12 rounded-lg object-cover shrink-0 border ${
                        item.stock === 0 ? "border-red-300 grayscale" : "border-purple-200"
                      }`}
                      referrerPolicy="no-referrer"
                    />

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded bg-purple-100 text-purple-750 uppercase">
                          {item.category === "Roblox Gamepasses" ? "Gamepass" : item.category}
                        </span>
                        {isPremiumVIP && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-850 border border-amber-300 flex items-center gap-0.5">
                            ✨ Boosted
                          </span>
                        )}
                        {item.stock === 0 && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-105 text-red-750 border border-red-200">
                            Stok Habis
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-purple-955 font-sans leading-tight line-clamp-1">
                        {item.name}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="text-purple-600 text-xs">Sales: {item.sales}</span>
                        <span className="text-purple-300">•</span>
                        <span className="text-purple-600 text-xs">Rating: ⭐{item.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price Comparison Row */}
                  <div className="bg-purple-50/20 p-2.5 rounded-lg border border-purple-100/50 space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-medium text-purple-500">
                      <span>Harga Dasar (Base)</span>
                      <span className="font-mono text-purple-900">{formatRupiah(item.priceBaseIDR)}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-purple-900 flex items-center gap-0.5 text-[10px]">
                        Harga Display Live {isRobux && isPremiumVIP && <span className="text-amber-700 font-mono">({vipExchangeRate}x)</span>}
                      </span>
                      <span className="text-purple-950 font-mono text-xs">
                        {formatRupiah(currentPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Stock Controls */}
                  <div className="flex items-center justify-between pt-1 border-t border-purple-100/50">
                    <div className="flex items-center gap-1.5 text-xs text-purple-800 font-medium">
                      <span>Stok:</span>
                      <strong className={`font-mono transition-all ${item.stock === 0 ? "text-red-650 font-bold" : "text-purple-950"}`}>
                        {item.stock.toLocaleString()}
                      </strong>
                    </div>

                    {/* Stock Adjustment Buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        title="Kurangi stok 50"
                        onClick={() => handleAdjustStock(item.id, -50)}
                        className="p-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-200/60 text-purple-700 transition active:scale-95 flex items-center justify-center"
                      >
                        <Minus className="w-3" />
                      </button>
                      <button
                        title="Tambah stok 100"
                        onClick={() => handleAdjustStock(item.id, 100)}
                        className="p-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-200/60 text-purple-700 transition active:scale-95 flex items-center justify-center"
                      >
                        <Plus className="w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* LOWER SECTION: TURNOVER COINS & SMART CHURN SYSTEMS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Economy Turnover Ratio (Sink vs Source Simulator) */}
        <div className="bg-white p-6 rounded-2xl border border-purple-100 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-purple-950 font-display flex items-center gap-2">
                <Coins className="text-purple-600 w-5 h-5" />
                Economy Coins Turnover (Sink vs Source)
              </h3>
              <p className="text-xs text-purple-700 font-medium mt-0.5">
                Keseimbangan perputaran koin virtual (Source = koin tercipta | Sink = koin dihancurkan/dihabiskan).
              </p>
            </div>

            {/* Flash sale live toggle */}
            <div className="flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-100 h-fit self-start sm:self-auto font-bold text-purple-900 text-xs">
              <span>LiveOps Flash Sale</span>
              <button
                id="toggle-flash-sale"
                onClick={handleToggleFlashSale}
                className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none ${
                  isFlashSaleActive ? "bg-purple-800" : "bg-purple-200"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                    isFlashSaleActive ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            
            {/* Source Display */}
            <div className="bg-purple-50/50 border border-purple-100 p-4 rounded-xl space-y-1">
              <span className="text-xs text-purple-500 block font-mono font-bold">Source Coins (Pengeluaran Item)</span>
              <span className="text-lg font-bold text-purple-900 font-mono block">
                {coinsSource.toLocaleString()} Coins
              </span>
              <p className="text-[10px] text-purple-600 font-medium">Pemberian quest & drop</p>
            </div>

            {/* Sink Display */}
            <div className="bg-purple-50/50 border border-purple-100 p-4 rounded-xl space-y-1">
              <span className="text-[10px] text-purple-550 block font-mono font-bold">Sink Coins (Pembelian Token)</span>
              <span className="text-lg font-bold text-amber-700 font-mono block">
                {coinsSink.toLocaleString()} Coins
              </span>
              <p className="text-[10px] text-purple-600 font-medium">Diinvestasikan / dibakar</p>
            </div>

          </div>

          {/* Inflation Index Result display */}
          <div className="bg-purple-100/30 border border-purple-150 p-4 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs text-purple-750 block font-bold">Indeks Inflasi Koin Internal</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className={`text-xl font-bold font-mono ${
                  inflationIndex > 150 ? "text-amber-800" : "text-green-700"
                }`}>
                  {inflationIndex}%
                </span>
                <span className="text-[10px] text-purple-900 font-bold">
                  {inflationIndex > 150 ? "Tinggi / Defisit Sirkulasi (?)" : "Seimbang / Stabil (Aman)"}
                </span>
              </div>
            </div>

            {/* Info based on LiveOps tool */}
            <div className="text-right">
              {isFlashSaleActive ? (
                <div className="text-left bg-green-50 text-green-800 text-[10px] p-2 rounded border border-green-200 leading-snug font-semibold">
                  ✨ <strong>Flash Sale ON:</strong> Sirkulasi koin diseimbangkan. Defisit inflasi berkurang otomatis!
                </div>
              ) : (
                <div className="text-left bg-amber-50 text-purple-900 text-[10px] p-2 rounded border border-amber-200 leading-snug font-semibold">
                  ⚠️ <strong>Rekomendasi:</strong> Nyalakan Flash Sale di atas untuk merangsang sirkulasi pembakaran koin.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Smart Retention & Churn System Panel */}
        <div className="bg-white p-6 rounded-2xl border border-purple-100 space-y-4 shadow-xs">
          <div>
            <h3 className="text-base font-bold text-purple-950 font-display flex items-center gap-1.5">
              <AlertTriangle className="text-amber-700 w-5 h-5" />
              Smart Retention & Anti-Churn Panel
            </h3>
            <p className="text-xs text-purple-700 font-medium mt-0.5">
              Deteksi otomatis konsumen berisiko tinggi beralih (Tidak aktif berturut-turut &gt; 7 Hari).
            </p>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {churnUsers.map((user) => (
              <div 
                key={user.id}
                className="bg-purple-50/50 p-3 rounded-lg border border-purple-100 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-purple-955 font-mono">{user.username}</span>
                    <span className={`text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded ${
                      user.churnRisk === "High" ? "bg-red-50 text-red-600 border border-red-200" : "bg-amber-50 text-amber-800 border border-amber-200"
                    }`}>
                      {user.churnRisk} Churn
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-[10px] text-purple-700 mt-1 font-medium">
                    <span>Inaktif: <strong className="text-purple-900">{user.lastActiveDays} hari</strong></span>
                    <span>Preferensi: <strong className="text-purple-900">{user.gamePreference}</strong></span>
                    <span>Investasi: <strong className="text-purple-900 font-bold">{formatRupiah(user.totalSpent)}</strong></span>
                  </div>
                </div>

                <button
                  id={`btn-coupon-${user.id}`}
                  disabled={user.couponSent}
                  onClick={() => handleSendCoupon(user.id)}
                  className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all flex items-center gap-1 px-3 py-1.5 rounded text-[10px] font-bold transition-all flex items-center gap-1 border border-amber-300 ${
                    user.couponSent 
                      ? "bg-purple-100 text-purple-400 cursor-default" 
                      : "bg-gradient-to-r from-[#d49a00] to-[#ffd700] hover:brightness-105 text-black shadow-xs"
                  }`}
                >
                  <Gift className="w-3.5 h-3.5" />
                  {user.couponSent ? "Kupon Terkirim" : "Reaktivasi Diskon"}
                </button>
              </div>
            ))}
          </div>

          <div className="bg-purple-50 p-2 text-[10px] text-purple-600 text-center font-mono rounded border border-purple-100 font-medium">
            *Kupon diskon merespons riwayat game Roblox & Fisch favorit pemain otomatis.
          </div>
        </div>

      </div>

    </div>
  );
};
