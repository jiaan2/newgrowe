import React, { useState } from "react";
import { 
  ShoppingBag, 
  User, 
  Lock, 
  Zap, 
  Shield, 
  QrCode, 
  CheckCircle2, 
  Progress, 
  Clock, 
  Info,
  TrendingDown,
  Sparkles,
  ArrowRight,
  Cpu,
  AlertTriangle,
  Crown
} from "lucide-react";
import { MarketplaceItem } from "../types";

interface BuyerMarketplaceProps {
  isPremiumVIP: boolean;
  vipExchangeRate: number; // Robux per IDR multiplier scale (default 1.0x)
  isResellerMode: boolean;
  onSetResellerMode: (val: boolean) => void;
  isBuyerVIP: boolean;
  onToggleBuyerVIP: (val: boolean) => void;
  isBotMaintenance: boolean;
  items: MarketplaceItem[];
  webhookLatency: number;
  onAddActivity?: (
    actor: string, 
    role: "buyer" | "seller" | "system" | "developer", 
    category: "Checkout" | "Inventory" | "Subscription" | "LiveOps" | "Setting", 
    description: string, 
    details?: string
  ) => void;
}

export const BuyerMarketplace: React.FC<BuyerMarketplaceProps> = ({
  isPremiumVIP,
  vipExchangeRate,
  isResellerMode,
  onSetResellerMode,
  isBuyerVIP,
  onToggleBuyerVIP,
  isBotMaintenance,
  items,
  webhookLatency,
  onAddActivity
}) => {
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
  
  // Checkout states
  const [robloxUsername, setRobloxUsername] = useState("");
  const [selectedEwallet, setSelectedEwallet] = useState<"QRIS" | "GoPay" | "OVO" | "DANA">("QRIS");
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"username" | "payment" | "webhook" | "delivery">("username");
  
  // Simulated parameters
  const [isPaymentSimulated, setIsPaymentSimulated] = useState(false);
  const [deliveryStep, setDeliveryStep] = useState(0); // 0 to 4 steps
  const [deliveryLogs, setDeliveryLogs] = useState<string[]>([]);
  
  // Helper to adjust prices based on Reseller mode or VIP dynamic rate slider
  const getAdjustedPrice = (item: MarketplaceItem) => {
    let finalPrice = item.priceBaseIDR;
    
    // Apply VIP exchange rate for Robux items
    if (item.category === "Robux" && item.robuxAmount) {
      // If VIP has configured rate, use the multiplier rate
      // Lower vipExchangeRate slider increases prices or decreases them - let's make it a multiplier
      // If normal rate produces base price, VIP slider can discount or markup Robux exchange cost
      finalPrice = Math.round(item.priceBaseIDR * vipExchangeRate);
    }
    
    // Reseller Mode automatically discounts everything by 15% wholesale rate
    if (isResellerMode) {
      finalPrice = Math.round(finalPrice * 0.85);
    }

    // Buyer VIP Gold Subscription grants flat 10% discount on all store purchases
    if (isBuyerVIP) {
      finalPrice = Math.round(finalPrice * 0.90);
    }
    
    return finalPrice;
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(val);
  };

  // Start checkout procedure
  const handleOpenCheckout = (item: MarketplaceItem) => {
    setSelectedItem(item);
    setRobloxUsername("");
    setCheckoutStep("username");
    setIsPaymentSimulated(false);
    setDeliveryStep(0);
    setDeliveryLogs([]);
  };

  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!robloxUsername.trim()) return;
    setCheckoutStep("payment");
    onAddActivity?.(
      `Buyer: ${robloxUsername}`, 
      "buyer", 
      "Checkout", 
      `Memulai pengisian ID Roblox & memilih item ${selectedItem?.name}`, 
      `Menunggu pembayaran Rp ${selectedItem ? getAdjustedPrice(selectedItem).toLocaleString() : 0}. ID Terverifikasi: "${robloxUsername}"`
    );
  };

  // Webhook action simulator using dynamic latency set by Developer Console
  const handleSimulatePayment = () => {
    setIsProcessingCheckout(true);
    setCheckoutStep("webhook");
    onAddActivity?.(
      `Buyer: ${robloxUsername}`, 
      "buyer", 
      "Checkout", 
      `Scan QRIS selesai - Mengirim callback Webhook`, 
      `Tunda respons simulasi gerbang QRIS: ${webhookLatency}s`
    );
    
    // Simulate webhook instant notification
    setTimeout(() => {
      setIsProcessingCheckout(false);
      setIsPaymentSimulated(true);
      onAddActivity?.(
        `Gate QRIS Server`, 
        "system", 
        "Checkout", 
        `QRIS Webhook settled status: SUCCESS untuk ${selectedItem?.name}`, 
        `Harga: Rp ${selectedItem ? getAdjustedPrice(selectedItem).toLocaleString() : 0}. username: ${robloxUsername}`
      );
      // Move to delivery immediately
      handleStartDelivery();
    }, webhookLatency * 1000);
  };

  // Delivery simulation (Bot Delivery Network < 30 seconds, or < 15 seconds for VIP buyers)
  const handleStartDelivery = () => {
    setCheckoutStep("delivery");
    
    // Check if bots are in maintenance (Set by Developer view)
    if (isBotMaintenance) {
      setDeliveryStep(1);
      setDeliveryLogs([
        "[System] Membuka koneksi aman ke Bot Delivery #48...",
        "🔴 [ERROR_CODE_503] CRITICAL FAILURE: Target bot server is reporting OFFLINE for maintenance.",
        "Mohon hubungi administrator melalui Developer Console atau coba lagi setelah masa pemeliharaan dicabut."
      ]);
      onAddActivity?.(
        `System Delivery Bot`, 
        "system", 
        "Checkout", 
        `Pengiriman virtual gagal ke id: "${robloxUsername}"`, 
        `Mentransfer ${selectedItem?.name} ditunda karena BOT MAINTENANCE MODE`
      );
      return;
    }

    setDeliveryStep(1);
    setDeliveryLogs([
      isBuyerVIP 
        ? "[Buyer VIP] 🌟 Priority express delivery line bypass authorized!" 
        : "[System] Membuka koneksi aman ke Bot Delivery #48...",
      "Webhook terverifikasi! Pembayaran dikonfirmasi."
    ]);
    onAddActivity?.(
      `Bot Deliverer #48`, 
      "system", 
      "Checkout", 
      `Mempersiapkan router pengerjaan ${selectedItem?.name}`, 
      `Target: "${robloxUsername}". Express priority bypass: ${isBuyerVIP ? "ACTIVE (Buyer VIP)" : "OFF"}`
    );
    
    // VIP buyers receive faster trading speeds
    const speedMultiplier = isBuyerVIP ? 0.35 : 1.0;

    setTimeout(() => {
      setDeliveryStep(2);
      setDeliveryLogs(prev => [...prev, `[Bot-Engine] Mencari pemain Roblox "${robloxUsername}" pada game instance...`, "Username Roblox ditemukan! Status: Online."]);
      onAddActivity?.(
        `Bot Deliverer #48`, 
        "system", 
        "Checkout", 
        `Akun Roblox "${robloxUsername}" ditemukan di dalam server game`, 
        `Instance session ping: 38ms`
      );
    }, 1500 * speedMultiplier);

    setTimeout(() => {
      setDeliveryStep(3);
      if (selectedItem?.category === "Robux") {
        setDeliveryLogs(prev => [...prev, "[Bot-Engine] Mentransfer Robux lewat Gamepass API automatisasi...", "Metode Gamepass: Bypass verifikasi manual."]);
      } else {
        setDeliveryLogs(prev => [...prev, `[Bot-Engine] Bot pengirim Roblox menyerahkan item "${selectedItem?.name}" dalam Game Fisch...`, "In-Game Trade Bot: Terhubung otomatis di Server Utama."]);
      }
      onAddActivity?.(
        `Bot Deliverer #48`, 
        "system", 
        "Checkout", 
        `Mentransfer aset dalam game ke Roblox ID: "${robloxUsername}"`, 
        `Menyelesaikan trade payload...`
      );
    }, 3200 * speedMultiplier);

    setTimeout(() => {
      setDeliveryStep(4);
      setDeliveryLogs(prev => [
        ...prev, 
        isBuyerVIP 
          ? `[Buyer VIP] ✨ Selesai! Pengiriman EXPRESS sukses diselesaikan dalam ${Math.round(24 * speedMultiplier)} detik.`
          : "[System] Selesai! Pengiriman sukses dalam 24 detik.", 
        "Transaksi ditandai Berhasil di basis data."
      ]);
      onAddActivity?.(
        `Bot Deliverer #48`, 
        "system", 
        "Checkout", 
        `Pengiriman selesai untuk Roblox ID: "${robloxUsername}"`, 
        `Aset "${selectedItem?.name}" terkirim dengan jaminan instan`
      );
    }, 5000 * speedMultiplier);
  };

  // Sorting items based on VIP Store Booster Perks
  // If isPremiumVIP is enabled, "VIP Store Boosted" items should appear FIRST pinned on top
  const sortedItems = [...items].sort((a, b) => {
    if (isPremiumVIP) {
      if (a.category === "Robux" && b.category !== "Robux") return -1;
      if (b.category === "Robux" && a.category !== "Robux") return 1;
    }
    return 0;
  });

  return (
    <div id="buyer-marketplace-parent" className="space-y-8">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-purple-200/80 shadow-xs">
        <div>
          <h2 className="text-2xl font-bold font-display text-purple-950 tracking-tight flex items-center gap-2">
            <ShoppingBag className="text-amber-500 w-6 h-6 fill-amber-300" />
            Growee Marketplace
          </h2>
          <p className="text-sm text-purple-800 mt-1 max-w-xl">
            Toko otomatisasi item Roblox, Gamepass Fisch, dan Robux instan tanpa scam. Pengiriman instan melalui bot game khusus.
          </p>
        </div>

        {/* Target Segments / Mode Selector */}
        <div className="flex items-center gap-2 bg-purple-100 p-1.5 rounded-xl border border-purple-200 self-start md:self-auto">
          <button
            id="toggle-buyer-mode"
            onClick={() => onSetResellerMode(false)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              !isResellerMode 
                ? "bg-gradient-to-r from-[#d49a00] to-[#ffd700] text-black shadow-sm font-bold border border-amber-300" 
                : "text-purple-700 hover:text-purple-950"
            }`}
          >
            Buyer / Player Mode
          </button>
          <button
            id="toggle-reseller-mode"
            onClick={() => onSetResellerMode(true)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              isResellerMode 
                ? "bg-purple-800 text-white font-bold shadow-sm border border-purple-900" 
                : "text-purple-700 hover:text-purple-950"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Reseller Wholesaler (Diskon 15%)
          </button>
        </div>
      </div>

      {/* Grid Layout containing Marketplace Listings left & Live status right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Marketplace listings panel (2 cols in normal spacing) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-purple-950 flex items-center gap-2 font-display">
              Catalog Produk Pilihan
              {isResellerMode && <span className="text-xs text-amber-700 font-mono font-bold">[Harga Grosir Aktif]</span>}
            </h3>
            
            {isPremiumVIP && (
              <span className="text-xs bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full border border-amber-300 flex items-center gap-1 font-semibold">
                <Sparkles className="w-3 h-3 text-amber-600 fill-amber-500 animate-pulse" /> VIP Store Booster Prioritas Aktif
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sortedItems.map((item) => {
              const adjustedPrice = getAdjustedPrice(item);
              const hasVIPBoost = isPremiumVIP && item.category === "Robux";

              return (
                <div 
                  key={item.id}
                  id={`item-card-${item.id}`}
                  className={`bg-white p-4 rounded-xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                    hasVIPBoost 
                      ? "border-amber-400 shadow-[0_0_15px_rgba(212,175,55,0.15)] ring-1 ring-amber-400/20" 
                      : "border-purple-100 hover:border-amber-300 hover:shadow-md"
                  }`}
                >
                  {/* Priority indicator or premium tag */}
                  {hasVIPBoost && (
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-[#d49a00] to-[#ffd700] text-black text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-bl-lg flex items-center gap-1 shadow-sm border-l border-b border-amber-500/20">
                      <Sparkles className="w-2.5 h-2.5 text-black" /> Pinned priority (SaaS VIP)
                    </div>
                  )}

                  <div>
                    {/* Image and Tag section */}
                    <div className="relative rounded-lg overflow-hidden h-32 bg-purple-50 flex items-center justify-center border border-purple-200/40">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <span className={`absolute bottom-2 left-2 text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded ${
                        item.rarity === "Legendary" ? "bg-amber-100 text-amber-800 border border-amber-300 font-bold" :
                        item.rarity === "Epic" ? "bg-purple-100 text-purple-800 border border-purple-300 font-bold" :
                        "bg-purple-100/80 text-purple-900 border border-purple-200"
                      }`}>
                        {item.rarity || "Common"}
                      </span>
                    </div>

                    {/* Meta info */}
                    <div className="mt-3">
                      <span className="text-xs text-purple-700 font-mono font-medium">{item.category}</span>
                      <h4 className="text-sm font-bold text-purple-950 mt-0.5 line-clamp-1">{item.name}</h4>
                    </div>
                  </div>

                  {/* Pricing and checkout action */}
                  <div className="mt-4 pt-3 border-t border-purple-100 flex items-end justify-between">
                    <div>
                      {isResellerMode && (
                        <span className="text-[10px] text-purple-400 line-through block leading-none mb-0.5">
                          {formatRupiah(item.priceBaseIDR)}
                        </span>
                      )}
                      <span className="text-amber-800 font-bold text-base block font-mono">
                        {formatRupiah(adjustedPrice)}
                      </span>
                      <span className="text-[10px] text-purple-600 block mt-0.5">Stok: {item.stock.toLocaleString()}</span>
                    </div>

                    <button
                      id={`btn-buy-${item.id}`}
                      onClick={() => handleOpenCheckout(item)}
                      className="px-3 py-1.5 bg-gradient-to-r from-[#d49a00] to-[#ffd700] text-black text-xs font-bold rounded-lg transition-transform active:scale-95 flex items-center gap-1 shadow-sm border border-amber-300"
                    >
                      Beli Instan
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar right: automated Bot Delivery Network live status widget */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-purple-200/80 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-purple-950 font-display flex items-center gap-2">
                <Cpu className="text-amber-600 w-4.5 h-4.5" />
                Live Bot Delivery Status
              </h3>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
            </div>

            <div className="bg-purple-50 p-3 rounded-xl border border-purple-100/60 flex items-center justify-between">
              <div>
                <span className="text-xs text-purple-700 block font-mono">Rata-Rata Pengiriman</span>
                <span className="text-lg font-bold text-purple-950 font-mono flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-4.5 h-4.5 text-green-600" />
                  &lt; 28 Detik
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-purple-700 block font-mono">Aktif Pengirim Bot</span>
                <span className="text-sm font-extrabold text-amber-700 font-mono block mt-0.5">32 Terhubung</span>
              </div>
            </div>

            {/* Simulated Bot Network Metrics */}
            <div className="space-y-2.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-purple-800">Penyaluran Roblox API</span>
                <span className="text-green-600 font-mono font-bold">100% Stabil</span>
              </div>
              <div className="w-full bg-purple-100 rounded-full h-1.5">
                <div className="bg-gradient-to-r from-purple-500 to-green-500 h-1.5 rounded-full" style={{ width: "95%" }}></div>
              </div>

              <div className="flex justify-between text-xs pt-1 font-medium">
                <span className="text-purple-800">Queue Delivery Bot</span>
                <span className="text-[#a47b19] font-mono font-bold">0 Antrean (Lancar)</span>
              </div>
            </div>

            {/* Anti Scam Info Panel */}
            <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl space-y-2">
              <h4 className="text-xs font-bold text-amber-850 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-amber-600 fill-amber-300" />
                Solusi Anti-Scam Virtual
              </h4>
              <p className="text-[11px] text-purple-900 leading-relaxed font-medium">
                Growee menghilangkan pertukaran manual P2P yang rawan penipuan. Item Anda dikirimkan instan melalui Bot internal secara aman di server Game Roblox.
              </p>
            </div>
          </div>

          {/* Dual subscription status visualisation */}
          <div className="space-y-4">
            
            {/* Seller status */}
            <div className="bg-white p-5 rounded-2xl border border-purple-200/80 text-center space-y-3 shadow-xs">
              <h4 className="text-xs text-purple-600 font-mono font-bold uppercase tracking-wider">Status Akun VIP Seller Toko Ini</h4>
              {isPremiumVIP ? (
                <div className="bg-gradient-to-br from-amber-50 to-purple-50 p-4 rounded-xl border border-amber-300">
                  <span className="text-amber-800 font-extrabold text-sm block">✨ VIP SaaS Plan Aktif</span>
                  <p className="text-[11px] text-purple-900 mt-1 font-medium leading-relaxed">
                    100% Produk ditandai Featured, Antrean Bot Utama (&lt;30s), dan Penyaluran Tarik Saldo Tanpa Potongan Admin Rp 0!
                  </p>
                  <div className="mt-3 bg-white p-2 rounded border border-amber-250 text-xs text-amber-800 font-mono font-bold">
                    Exchange Rate VIP: {vipExchangeRate}x Price
                  </div>
                </div>
              ) : (
                <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 text-purple-700">
                  <span className="text-purple-950 font-bold text-sm block">Free Plan / Regular Shop</span>
                  <p className="text-[11px] mt-1 font-medium text-purple-800">
                    Standard queue bot delivery + biaya penarikan Rp 2.500 per transaksi.
                  </p>
                </div>
              )}
            </div>

            {/* Buyer status */}
            <div className="bg-white p-5 rounded-2xl border border-purple-200/80 text-center space-y-3 shadow-xs">
              <h4 className="text-xs text-purple-600 font-mono font-bold uppercase tracking-wider">Status Keanggotaan Buyer Anda</h4>
              {isBuyerVIP ? (
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-4 rounded-xl border border-amber-300 shadow-sm relative overflow-hidden">
                  <div className="absolute -right-6 -top-6 w-12 h-12 bg-amber-200 rounded-full opacity-20 blur-xs"></div>
                  <span className="text-amber-800 font-extrabold text-sm flex items-center justify-center gap-1">
                    <Crown className="w-4 h-4 fill-amber-500 text-amber-600 animate-bounce" />
                    VIP Gold Pass Aktif
                  </span>
                  <p className="text-[11px] text-purple-900 mt-1 font-medium leading-relaxed">
                    Diskon Flat <strong className="text-amber-850">10% Off</strong> Otomatis Terpasang! Antrean Delivery Bot Kilat prioritas khusus (&lt;15s).
                  </p>
                </div>
              ) : (
                <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100/85">
                  <span className="text-purple-950 font-bold text-sm block">Regular Gamer Account</span>
                  <p className="text-[11px] mt-1 text-purple-800 font-medium leading-relaxed">
                    Belum menikmati diskon atau antrean express. Cari menu <strong className="text-[#3b2568]">SaaS Pricing</strong> atau klik tombol di bawah untuk bergabung!
                  </p>
                  <button
                    id="quick-upgrade-buyer-vip"
                    onClick={() => {
                      onToggleBuyerVIP(true);
                      onAddActivity?.(
                        "Buyer: VIP Gold upgrade",
                        "buyer",
                        "Subscription",
                        "Membeli VIP Buyer Gold Pass (Rp 49.000)",
                        "Aktivasi via Marketplace sidebar, diskon flat 10% diaktifkan otomatis."
                      );
                    }}
                    className="mt-3 w-full py-1.5 bg-gradient-to-r from-[#d49a00] to-[#ffd700] hover:brightness-105 rounded text-[10px] font-extrabold text-black uppercase flex items-center justify-center gap-1 shadow-sm border border-amber-300 transition-all active:scale-95"
                  >
                    <Crown className="w-3 h-3 fill-current" /> Aktifkan VIP Buyer (Rp 49.000)
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>      {/* Embedded Checkout / Interactive Simulation Modal overlay */}
      {selectedItem && (
        <div id="checkout-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white border-2 border-amber-400 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="bg-[#f0e7ff] p-4 border-b border-purple-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
                  <ShoppingBag className="w-4 h-4 text-amber-600 fill-amber-300" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-purple-950">Instan Checkout Simulator</h3>
                  <p className="text-[10px] text-purple-700 font-semibold">Sistem Otomatisasi Terverifikasi Webhook</p>
                </div>
              </div>
              <button 
                id="close-checkout-btn"
                onClick={() => setSelectedItem(null)} 
                className="text-purple-700 hover:text-purple-950 font-bold p-1 bg-purple-200 rounded-md text-xs px-2.5"
              >
                Tutup [X]
              </button>
            </div>

            {/* Modal Content container based on Checkout steps */}
            <div className="p-6 space-y-6">
              
              {/* Checkout Progress Bar */}
              <div className="flex items-center justify-between text-[11px] font-mono text-purple-600">
                <span className={checkoutStep === "username" ? "text-amber-700 font-bold" : "text-purple-900 font-semibold"}>1. Roblox ID</span>
                <span className="text-purple-300">|</span>
                <span className={checkoutStep === "payment" ? "text-amber-700 font-bold" : checkoutStep !== "username" ? "text-purple-900 font-semibold" : ""}>2. E-Wallet</span>
                <span className="text-purple-300">|</span>
                <span className={checkoutStep === "webhook" ? "text-amber-700 font-bold" : checkoutStep === "delivery" ? "text-purple-900 font-semibold" : ""}>3. QRIS Webhook</span>
                <span className="text-purple-300">|</span>
                <span className={checkoutStep === "delivery" ? "text-green-600 font-bold" : ""}>4. Delivery Bot</span>
              </div>

              {/* Progress Slider graphical */}
              <div className="w-full bg-purple-100 rounded-full h-1.5">
                <div className={`bg-gradient-to-r from-amber-500 to-green-500 h-1.5 rounded-full transition-all duration-300 ${
                  checkoutStep === "username" ? "w-[15%]" :
                  checkoutStep === "payment" ? "w-[50%]" :
                  checkoutStep === "webhook" ? "w-[75%]" : "w-[100%]"
                }`}></div>
              </div>

              {/* Product Info Displayed */}
              <div className="bg-purple-50 p-3.5 rounded-lg border border-purple-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-purple-600 font-mono">Produk terpilih:</span>
                  <h4 className="text-sm font-bold text-purple-950 mt-0.5">{selectedItem.name}</h4>
                </div>
                <div className="text-right">
                  <span className="text-sm text-amber-800 font-bold font-mono block">
                    {formatRupiah(getAdjustedPrice(selectedItem))}
                  </span>
                  <span className="text-[9px] text-purple-500 block font-mono">Tanpa biaya admin</span>
                </div>
              </div>

              {/* STEP 1: Roblox ID Only */}
              {checkoutStep === "username" && (
                <form id="form-roblox-username" onSubmit={handleNextToPayment} className="space-y-4">
                  {/* Privacy / Anti password leak notification */}
                  <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-lg flex gap-3">
                    <Lock className="text-amber-600 w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-amber-900">100% Privacy Gateway (Anti-Credential Leak)</span>
                      <p className="text-[11px] text-purple-950 mt-0.5 font-sans leading-relaxed">
                        Kami hanya memerlukan <strong className="text-purple-905 font-mono">Roblox Username (Publik)</strong> untuk memproses pesanan Anda lewat bot. Kami <span className="text-amber-700 underline font-semibold">TIDAK PERNAH</span> meminta password Roblox Anda!
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-purple-900 block">Masukkan Username Roblox Anda:</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 text-purple-400 w-4.5 h-4.5" />
                      <input 
                        type="text"
                        id="input-roblox-username"
                        required
                        value={robloxUsername}
                        onChange={(e) => setRobloxUsername(e.target.value)}
                        placeholder="Contoh: GamerRobloxActive_99"
                        className="w-full bg-white border border-purple-200 rounded-lg py-2.5 pl-10 pr-4 text-sm text-purple-950 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                    <span className="text-[10px] text-purple-500 block font-medium">Pastikan ID Roblox Anda ejaannya sudah benar agar bot tidak salah kirim.</span>
                  </div>

                  <button
                    type="submit"
                    id="submit-username-btn"
                    className="w-full bg-gradient-to-r from-[#d49a00] to-[#ffd700] text-black font-extrabold py-2.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-1 shadow-sm border border-amber-300"
                  >
                    Lanjutkan Ke Pembayaran
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* STEP 2: E-Wallet and Payment Simulator */}
              {checkoutStep === "payment" && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-purple-900 block">Pilih Penyedia Pembayaran:</span>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "QRIS", name: "QRIS (Semua E-Wallet)", extra: "Instan validasi" },
                        { id: "GoPay", name: "GoPay / Gojek", extra: "Saldo E-Wallet" },
                        { id: "OVO", name: "OVO Cash", extra: "Validasi otomatis" },
                        { id: "DANA", name: "DANA Dompet", extra: "Biaya Rp 0" }
                      ].map((pay) => (
                        <button
                          key={pay.id}
                          id={`pay-method-${pay.id}`}
                          onClick={() => setSelectedEwallet(pay.id as any)}
                          className={`p-3 rounded-lg border text-left flex flex-col transition-all ${
                            selectedEwallet === pay.id 
                              ? "bg-amber-100/50 border-amber-500 shadow-xs" 
                              : "bg-purple-50/50 border-purple-100 hover:border-purple-200"
                          }`}
                        >
                          <span className={`text-xs font-extrabold ${selectedEwallet === pay.id ? "text-amber-800" : "text-purple-950"}`}>
                            {pay.name}
                          </span>
                          <span className="text-[9px] text-[#715d91] font-semibold mt-0.5">{pay.extra}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* QRIS Sandbox Payment Simulator */}
                  <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100 space-y-3 text-center">
                    <span className="text-xs text-purple-950 block font-bold">Simulasi Pembayaran QRIS Digital</span>
                    
                    <div className="inline-block bg-white p-2 rounded-lg relative border border-purple-100 shadow-xs">
                      <QrCode className="w-28 h-28 text-black" />
                      <div className="absolute inset-0 bg-amber-500/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <span className="bg-amber-500 text-black font-semibold text-[10px] px-2 py-1 rounded">GROWEE QRIS</span>
                      </div>
                    </div>

                    <div className="text-xs text-purple-800 space-y-1">
                      <p className="font-medium">Roblox Username: <span className="font-mono text-purple-950 font-bold text-xs bg-purple-100 px-1.5 py-0.5 rounded">{robloxUsername}</span></p>
                      <p className="font-medium">Metode Pembayaran: <strong className="text-purple-950 bg-amber-100 px-1.5 py-0.5 rounded">{selectedEwallet}</strong></p>
                      <p className="text-amber-800 font-extrabold text-base mt-2">{formatRupiah(getAdjustedPrice(selectedItem))}</p>
                    </div>

                    <div className="bg-amber-50 p-2.5 rounded border border-amber-200 text-[10px] text-amber-900 flex items-start gap-1.5 text-left">
                      <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                      <span className="font-medium">Klik tombol simulasi di bawah ini untuk mensimulasikan Pembayaran QRIS Sukses dan memicu Webhook Validasi instan kami.</span>
                    </div>
                  </div>

                  <button
                    id="simulate-payment-btn"
                    onClick={handleSimulatePayment}
                    className="w-full bg-gradient-to-r from-[#d49a00] to-[#ffd700] hover:opacity-95 text-black font-extrabold py-3 rounded-lg text-xs transition-opacity flex items-center justify-center gap-1.5 shadow-sm border border-amber-300"
                  >
                    Simulasikan Pembayaran & Trigger Webhook
                    <Zap className="w-4 h-4 text-black fill-amber-300" />
                  </button>
                </div>
              )}

              {/* STEP 3: Webhook Verification Log Screen */}
              {checkoutStep === "webhook" && (
                <div className="space-y-4 py-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto"></div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-purple-950">Menempa Validasi Webhook Real-time...</h4>
                    <p className="text-xs text-purple-700 font-medium">QRIS E-wallet Simulator mengirim callback token...</p>
                  </div>
                  
                  <div className="bg-purple-950 p-4 rounded-lg border border-purple-900 text-left font-mono text-[10px] text-purple-200 space-y-1.5 shadow-inner">
                    <p className="text-purple-400">// GROWEE WEBHOOK ENDPOINT SIMULATOR</p>
                    <p>POST /api/webhook/qris-payment HTTP/1.1</p>
                    <p>Host: gateway.groweestore.com</p>
                    <p>Payload: &#123; "status": "COMPLETED", "amount": {getAdjustedPrice(selectedItem)}, "username": "{robloxUsername}" &#125;</p>
                    <p className="text-amber-400 animate-pulse font-semibold">&gt;&gt;&gt; Webhook signature verified. Triggering delivery bot...</p>
                  </div>
                </div>
              )}

              {/* STEP 4: Real-time Bot Delivery System Tracker */}
              {checkoutStep === "delivery" && (
                <div className="space-y-5">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center text-green-600 mx-auto">
                      <Zap className="w-6 h-6 fill-green-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-purple-950">Bot Delivery Terdepan Sedang Beroperasi</h4>
                      <p className="text-xs text-purple-700 font-semibold">Dijamin terkirim di bawah 30 detik secara otomatis</p>
                    </div>
                  </div>

                  {/* Delivery Status Timeline visually */}
                  <div className="relative pl-6 space-y-4 border-l border-purple-200">
                    <div className="relative">
                      <span className={`absolute -left-[31px] top-0.5 rounded-full w-4 h-4 flex items-center justify-center text-[10px] ${
                        deliveryStep >= 1 ? "bg-green-500 text-black font-bold" : "bg-purple-100 text-purple-500"
                      }`}>
                        {deliveryStep >= 1 ? "✓" : "1"}
                      </span>
                      <h5 className={`text-xs font-bold ${deliveryStep >= 1 ? "text-green-600" : "text-purple-650"}`}>1. Validasi Webhook Instan</h5>
                      <p className="text-[10px] text-purple-600 leading-none mt-0.5 font-medium">Callback QRIS terkonfirmasi sukses.</p>
                    </div>

                    <div className="relative">
                      <span className={`absolute -left-[31px] top-0.5 rounded-full w-4 h-4 flex items-center justify-center text-[10px] ${
                        deliveryStep >= 2 ? "bg-green-500 text-black font-bold" : "bg-purple-100 text-purple-500"
                      }`}>
                        {deliveryStep >= 2 ? "✓" : "2"}
                      </span>
                      <h5 className={`text-xs font-bold ${deliveryStep >= 2 ? "text-green-600" : "text-purple-650"}`}>2. Autentikasi Roblox Username</h5>
                      <p className="text-[10px] text-purple-600 leading-none mt-0.5 font-medium">Memvalidasi keberadaan ID {robloxUsername} secara aman.</p>
                    </div>

                    <div className="relative">
                      <span className={`absolute -left-[31px] top-0.5 rounded-full w-4 h-4 flex items-center justify-center text-[10px] ${
                        deliveryStep >= 3 ? "bg-green-500 text-black font-bold" : "bg-purple-100 text-purple-500"
                      }`}>
                        {deliveryStep >= 3 ? "✓" : "3"}
                      </span>
                      <h5 className={`text-xs font-bold ${deliveryStep >= 3 ? "text-green-600" : "text-purple-650"}`}>3. Transaksi Transfer Otomatis</h5>
                      <p className="text-[10px] text-purple-600 leading-none mt-0.5 font-medium">Mengaktifkan Bot Roblox Server / Gamepass API.</p>
                    </div>

                    <div className="relative">
                      <span className={`absolute -left-[31px] top-0.5 rounded-full w-4 h-4 flex items-center justify-center text-[10px] ${
                        deliveryStep >= 4 ? "bg-green-500 text-black font-bold" : "bg-purple-100 text-purple-500"
                      }`}>
                        {deliveryStep >= 4 ? "✓" : "4"}
                      </span>
                      <h5 className={`text-xs font-bold ${deliveryStep >= 4 ? "text-green-600" : "text-purple-650"}`}>4. Selesai Ditransaksikan</h5>
                      <p className="text-[10px] text-purple-600 leading-none mt-0.5 font-medium">Item terkirim otomatis & pencatatan keuangan tuntas.</p>
                    </div>
                  </div>

                  {/* System logs in console format */}
                  <div className="bg-purple-950 p-3 rounded-lg border border-purple-900 font-mono text-[9px] text-purple-200 space-y-1 max-h-36 overflow-y-auto">
                    {deliveryLogs.map((log, i) => (
                      <p key={i} className={log.includes("Selesai!") || log.includes("terverifikasi") ? "text-amber-300 font-bold" : ""}>
                        {log}
                      </p>
                    ))}
                  </div>

                  {deliveryStep < 4 ? (
                    <div className="flex items-center justify-center gap-2 text-xs text-amber-700 font-mono italic animate-pulse">
                      <Clock className="w-4 h-4 text-amber-600" />
                      Memproses pengiriman bot virtual... &nbsp;&lt; {30 - deliveryStep * 7}s tersisa
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="bg-green-50 border border-green-300 p-3 rounded-lg text-center text-xs text-green-800 font-bold">
                        🎉 Pengiriman Berhasil! Silakan periksa akun Roblox Anda atau login kembali.
                      </div>
                      <button
                        id="finish-checkout-btn"
                        onClick={() => setSelectedItem(null)}
                        className="w-full bg-purple-900 hover:bg-purple-950 text-white font-extrabold py-2.5 rounded-lg text-xs transition-colors"
                      >
                        Selesai & Tutup Jendela
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
