import React, { useState } from "react";
import { 
  Check, 
  X, 
  Sparkles, 
  Zap, 
  Shield, 
  Percent, 
  Sliders, 
  CreditCard,
  Crown,
  ShoppingBag,
  Briefcase
} from "lucide-react";

interface SaaSPricingProps {
  isPremiumVIP: boolean;
  onToggleVIP: (val: boolean) => void;
  isBuyerVIP: boolean;
  onToggleBuyerVIP: (val: boolean) => void;
  onAddActivity?: (
    actor: string, 
    role: "buyer" | "seller" | "system" | "developer", 
    category: "Checkout" | "Inventory" | "Subscription" | "LiveOps" | "Setting", 
    description: string, 
    details?: string
  ) => void;
}

export const SaaSPricing: React.FC<SaaSPricingProps> = ({
  isPremiumVIP,
  onToggleVIP,
  isBuyerVIP,
  onToggleBuyerVIP,
  onAddActivity
}) => {
  const [activeSegment, setActiveSegment] = useState<"all" | "buyer" | "seller">("all");

  return (
    <div id="saas-pricing-parent" className="space-y-8">
      {/* Intro section */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-mono font-bold tracking-wider text-purple-900 uppercase bg-purple-100 border border-purple-200 px-3 py-1 rounded-full">
          Growee Dual Premium Subscriptions
        </span>
        <h2 className="text-3xl font-extrabold font-display text-purple-950 tracking-tight">
          Pilih Keanggotaan Premium Sesuai Kebutuhan Anda
        </h2>
        <p className="text-sm text-purple-800 font-medium">
          Dapatkan keuntungan potongan harga instan untuk pembeli, atau kendalikan rasio keuntungan virtual, antrean bot prioritas & Webhook real-time untuk penjual.
        </p>

        {/* Filter Segment Buttons */}
        <div className="inline-flex items-center bg-purple-100 p-1 rounded-xl border border-purple-200 mt-2">
          <button
            id="filter-pricing-all"
            onClick={() => setActiveSegment("all")}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              activeSegment === "all" ? "bg-white text-purple-950 shadow-xs" : "text-purple-700 hover:text-purple-950"
            }`}
          >
            Semua Paket
          </button>
          <button
            id="filter-pricing-buyer"
            onClick={() => setActiveSegment("buyer")}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
              activeSegment === "buyer" ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xs" : "text-purple-700 hover:text-purple-950"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Paket Pembeli (VIP Player)
          </button>
          <button
            id="filter-pricing-seller"
            onClick={() => setActiveSegment("seller")}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
              activeSegment === "seller" ? "bg-purple-800 text-white shadow-xs" : "text-purple-700 hover:text-purple-950"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" /> Paket Penjual (SaaS Merchant)
          </button>
        </div>
      </div>

      {/* Grid of Tiers */}
      <div className="space-y-12">
        
        {/* BUYER SUBSCRIPTION SECTION */}
        {(activeSegment === "all" || activeSegment === "buyer") && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-purple-200 pb-2 max-w-4xl mx-auto">
              <ShoppingBag className="text-amber-600 w-5 h-5" />
              <h3 className="text-lg font-bold text-purple-950 font-display">Tingkat Pembeli (Buyer Subscription Gold)</h3>
              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold font-mono">Diskon & Prioritas Bot</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              
              {/* Buyer Regular Plan */}
              <div id="plan-buyer-regular" className="bg-white p-6 rounded-2xl border border-purple-100 flex flex-col justify-between relative shadow-sm">
                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-purple-650 uppercase font-bold tracking-wider">Tingkat Pembeli</span>
                    <h4 className="text-lg font-bold text-purple-950 mt-0.5">Regular Player (Free)</h4>
                    <p className="text-xs text-purple-800 mt-1 font-medium">Infrastruktur belanja umum untuk semua gamer.</p>
                  </div>

                  <div className="pt-3 border-t border-purple-100 font-mono">
                    <span className="text-xl font-bold text-purple-950">Rp 0</span>
                    <span className="text-xs text-purple-600"> / selamanya</span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-purple-900 font-medium">
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5" />
                      <span>Harga katalog standard (Tanpa diskon tambahan)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5" />
                      <span>Simulasi transfer bot normal 30 detik</span>
                    </li>
                    <li className="flex items-start gap-2 text-purple-400">
                      <X className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                      <span>Diskon Flat 10% untuk Semua Item Catalog</span>
                    </li>
                    <li className="flex items-start gap-2 text-purple-400">
                      <X className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                      <span>Crown Badge Emas di Nama Profil Roblox</span>
                    </li>
                    <li className="flex items-start gap-2 text-purple-400">
                      <X className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                      <span>Extreme Express Line (&lt; 15s Bot Transfer)</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-4">
                  <button
                    id="btn-select-buyer-regular"
                    disabled={!isBuyerVIP}
                    onClick={() => onToggleBuyerVIP(false)}
                    className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all ${
                      !isBuyerVIP 
                        ? "bg-purple-100 text-purple-500 border border-purple-200 cursor-not-allowed" 
                        : "bg-purple-800 text-white hover:bg-purple-900 shadow-sm"
                    }`}
                  >
                    {!isBuyerVIP ? "Akun Standar Aktif" : "Ubah ke Player Biasa"}
                  </button>
                </div>
              </div>

              {/* Buyer VIP Gold Premium Plan */}
              <div 
                id="plan-buyer-vip" 
                className={`bg-white p-6 rounded-2xl border-2 flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${
                  isBuyerVIP 
                    ? "border-amber-400 shadow-[0_0_20px_rgba(212,175,55,0.15)]" 
                    : "border-purple-200 hover:border-amber-300"
                }`}
              >
                {/* Crown Badge */}
                <div className="absolute top-0 right-0 bg-gradient-to-l from-[#d49a00] to-[#ffd700] text-black text-[9px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-bl-xl flex items-center gap-0.5 shadow-sm border-l border-b border-amber-300">
                  <Crown className="w-3 h-3 fill-black text-black" />
                  VIP PLAYER
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-amber-700 uppercase font-extrabold tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-600 fill-amber-300" />
                      BUYER VIP GOLDEN PASS
                    </span>
                    <h4 className="text-lg font-bold text-purple-950 mt-0.5">Buyer VIP Gold Premium</h4>
                    <p className="text-xs text-purple-800 mt-1 font-medium">
                      Keistimewaan eksklusif potongan harga belanja & bot deliver prioritas super kilat.
                    </p>
                  </div>

                  <div className="pt-2 border-t border-purple-100 font-mono">
                    <span className="text-xl font-bold text-purple-950">Rp 49.000</span>
                    <span className="text-xs text-purple-600"> / bulan</span>
                    <span className="block text-[9px] text-amber-800 mt-0.5 italic font-sans font-bold">Auto-debet instan via E-wallet atau QRIS</span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-purple-950 font-medium">
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5 font-bold" />
                      <span>
                        <strong className="text-purple-950 font-bold">Flat 10% Cashless Discount:</strong> Potongan harga 10% otomatis terpangkas pada katalog pembelian Robux maupun item Fisch.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5 font-bold" />
                      <span>
                        <strong className="text-purple-950 font-bold">Extreme Express Line:</strong> Prioritas bypass bot delivery. Jaminan penyerahan item langsung masuk game di bawah <span className="text-amber-805 font-mono font-bold">&lt; 15 detik</span>!
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5 font-bold" />
                      <span>
                        <strong className="text-purple-950 font-bold">VIP Gold Crown Badge:</strong> Muncul mahkota emas megah di samping username Roblox Anda dalam simulator proses transaksi.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5 font-bold" />
                      <span>
                        <strong className="text-purple-950 font-bold">Free Weekly Lucky Loot:</strong> Dapatkan bait pancing langka "Nuclear Bait" di game Fisch cuma-cuma tiap minggu.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-4">
                  <button
                    id="btn-select-buyer-vip"
                    onClick={() => {
                      const nextState = !isBuyerVIP;
                      onToggleBuyerVIP(nextState);
                      if (nextState) {
                        onAddActivity?.(
                          "Buyer",
                          "buyer",
                          "Subscription",
                          "Mengaktifkan VIP Buyer Gold Pass (Rp 49.000)",
                          "Golden Pass diaktivasi lewat halaman Pricing. Diskon flat 10% aktif."
                        );
                      } else {
                        onAddActivity?.(
                          "Buyer",
                          "buyer",
                          "Subscription",
                          "Membatalkan kepemilikan VIP Buyer Gold Pass",
                          "Paket dihentikan sepihak; akun ditransfer ke reguler."
                        );
                      }
                    }}
                    className={`w-full py-2.5 rounded-lg text-xs font-extrabold transition-transform active:scale-95 flex items-center justify-center gap-1.5 ${
                      isBuyerVIP 
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30" 
                        : "bg-gradient-to-r from-[#d49a00] to-[#ffd700] text-black shadow border border-amber-300 hover:brightness-105"
                    }`}
                  >
                    <Crown className="w-3.5 h-3.5 shrink-0 fill-current" />
                    {isBuyerVIP ? "VIP Gold Pembeli Aktif (Batal Langganan)" : "Beli Golden Pass - Rp 49.000/Bulan"}
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* SELLER SUBSCRIPTION SECTION */}
        {(activeSegment === "all" || activeSegment === "seller") && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-purple-200 pb-2 max-w-4xl mx-auto">
              <Briefcase className="text-purple-700 w-5 h-5" />
              <h3 className="text-lg font-bold text-purple-950 font-display">Tingkat Penjual (SaaS Merchant Tiers)</h3>
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold font-mono">Bagi Merchant & Pemilik Toko</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              
              {/* Regular Seller Plan */}
              <div id="plan-seller-regular" className="bg-white p-6 rounded-2xl border border-purple-100 flex flex-col justify-between relative shadow-sm">
                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-purple-650 uppercase font-bold tracking-wider">Tingkat Penjual</span>
                    <h4 className="text-lg font-bold text-purple-950 mt-0.5">Regular Shop (Free)</h4>
                    <p className="text-xs text-purple-800 mt-1 font-medium">Infrastruktur standar untuk UMKM digital pemula.</p>
                  </div>

                  <div className="pt-3 border-t border-purple-100 font-mono">
                    <span className="text-xl font-bold text-purple-950">Rp 0</span>
                    <span className="text-xs text-purple-600"> / selamanya</span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-purple-900 font-medium">
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5" />
                      <span>Pencatatan sales reguler standar</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5" />
                      <span>Simulasi Webhook QRIS instan</span>
                    </li>
                    <li className="flex items-start gap-2 text-purple-400">
                      <X className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                      <span>Priority Bot Queue (Antrean Normal &lt; 30d)</span>
                    </li>
                    <li className="flex items-start gap-2 text-purple-400">
                      <X className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                      <span>Priority Featured Booster (Item Standar)</span>
                    </li>
                    <li className="flex items-start gap-2 text-purple-400">
                      <X className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                      <span>Potongan Admin Withdraw Saldo (Rp 2.500)</span>
                    </li>
                    <li className="flex items-start gap-2 text-purple-400">
                      <X className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                      <span>Dynamic Robux Rate Slider (Kunci Rasio)</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-4">
                  <button
                    id="btn-select-seller-regular"
                    disabled={!isPremiumVIP}
                    onClick={() => onToggleVIP(false)}
                    className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all ${
                      !isPremiumVIP 
                        ? "bg-purple-100 text-purple-500 border border-purple-200 cursor-not-allowed" 
                        : "bg-purple-800 text-white hover:bg-purple-900 shadow-sm"
                    }`}
                  >
                    {!isPremiumVIP ? "Paket Standar Aktif" : "Downgrade ke Regular Merchant"}
                  </button>
                </div>
              </div>

              {/* Seller SaaS Premium VIP Plan */}
              <div 
                id="plan-seller-vip" 
                className={`bg-white p-6 rounded-2xl border-2 flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${
                  isPremiumVIP 
                    ? "border-amber-400 shadow-[0_0_20px_rgba(212,175,55,0.15)]" 
                    : "border-purple-200 hover:border-amber-300"
                }`}
              >
                {/* Premium Icon Badge */}
                <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-800 to-purple-950 text-white text-[9px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-bl-xl flex items-center gap-0.5 shadow-sm border-l border-b border-purple-700">
                  <Shield className="w-3 h-3 text-amber-400 fill-amber-400" />
                  SAAS PRO
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-purple-600 uppercase font-extrabold tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-purple-600 fill-purple-300 animate-pulse" />
                      SAAS PREMIUM MERCHANT
                    </span>
                    <h4 className="text-lg font-bold text-purple-950 mt-0.5">SaaS Premium VIP Store Account</h4>
                    <p className="text-xs text-purple-800 mt-1 font-medium">
                      Infrastruktur robotik mandiri untuk optimalisasi laba dagang virtual game otomatis.
                    </p>
                  </div>

                  <div className="pt-2 border-t border-purple-100 font-mono">
                    <span className="text-xl font-bold text-purple-950">Rp 249.000</span>
                    <span className="text-xs text-purple-600"> / bulan</span>
                    <span className="block text-[9px] text-purple-700 mt-0.5 italic font-sans font-bold">Auto-debet bulanan rekening merchant</span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-purple-950 font-medium">
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-purple-950 font-bold">Featured Products Booster:</strong> Menaruh produk Anda pada slot promo baris teratas buyer portal untuk menjangkau 12.000+ kustomer.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-purple-950 font-bold">Prioritized Bot Delivery:</strong> Akses antrean premium bypass log. Pelanggan toko Anda menerima bot transfer dalam <span className="text-amber-800 font-mono font-bold">&lt; 30 detik</span>.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-purple-950 font-bold">Zero Withdrawal Fees:</strong> Batalkan biaya withdraw admin Rp 2.500. Setiap pengajuan tarik keuntungan ke bank terbayar bersih Rp 0 admin fee.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-purple-950 font-bold">Dynamic Exchange Rate Slider:</strong> Atur multiplier harga pasar kustom (0.5x ke 1.8x) secara live untuk menyesuaikan grosir.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-4">
                  <button
                    id="btn-select-seller-vip"
                    onClick={() => {
                      const nextState = !isPremiumVIP;
                      onToggleVIP(nextState);
                      if (nextState) {
                        onAddActivity?.(
                          "Seller",
                          "seller",
                          "Subscription",
                          "Sukses Berlangganan SaaS Pro Merchant VIP (Rp 249.000)",
                          "Akses LiveOps, Robux Exchange Rate Slider, dan prioritas Bot Delivery aktif."
                        );
                      } else {
                        onAddActivity?.(
                          "Seller",
                          "seller",
                          "Subscription",
                          "Membatalkan Berlangganan SaaS Pro Merchant",
                          "Akun toko diturunkan ke Free Tier reguler."
                        );
                      }
                    }}
                    className={`w-full py-2.5 rounded-lg text-xs font-extrabold transition-transform active:scale-95 flex items-center justify-center gap-1.5 ${
                      isPremiumVIP 
                        ? "bg-emerald-650 text-white shadow-md shadow-emerald-600/30" 
                        : "bg-gradient-to-r from-[#d49a00] to-[#ffd700] text-black shadow border border-amber-300 hover:brightness-105"
                    }`}
                  >
                    <Crown className="w-3.5 h-3.5 shrink-0 fill-current" />
                    {isPremiumVIP ? "Shop VIP Terlanggan (Batal Berlangganan)" : "Berlangganan SaaS VIP - Rp 249.000/Bulan"}
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* Live notification feedback panel */}
      <div className="bg-white p-4 rounded-xl border border-purple-100 text-center max-w-sm mx-auto text-xs text-purple-700 font-medium shadow-xs">
        <CreditCard className="w-5 h-5 text-amber-600 fill-amber-200 mx-auto mb-2" />
        Upgrade dapat dibatalkan atau dikustomisasi sewaktu-waktu. Basis data Growee terupdate langsung per milidetik untuk memberikan keadilan bagi Buyer & Seller.
      </div>

    </div>
  );
};
