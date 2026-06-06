export interface MarketplaceItem {
  id: string;
  name: string;
  category: "Robux" | "Fisch" | "Roblox Gamepasses";
  priceBaseIDR: number; // base price in IDR
  robuxAmount?: number;
  stock: number;
  rating: number;
  sales: number;
  rarity?: "Common" | "Rare" | "Epic" | "Legendary";
  image: string;
}

export interface UserActivity {
  id: string;
  timestamp: string;
  actor: string;
  role: "buyer" | "seller" | "system" | "developer";
  category: "Checkout" | "Inventory" | "Subscription" | "LiveOps" | "Setting";
  description: string;
  details?: string;
}

export interface BuyerCartItem {
  item: MarketplaceItem;
  quantity: number;
}

export interface BotDeliveryStep {
  label: string;
  status: "pending" | "processing" | "success" | "failed";
  timestamp?: string;
}

export interface ChurnUser {
  id: string;
  username: string;
  lastActiveDays: number;
  churnRisk: "High" | "Medium";
  totalSpent: number;
  gamePreference: string;
  couponSent?: boolean;
}

export interface ChatMessage {
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
}

// Initial Marketplace Catalog
export const INITIAL_ITEMS: MarketplaceItem[] = [
  {
    id: "robux-1000",
    name: "1,000 Robux (Instan Bot)",
    category: "Robux",
    priceBaseIDR: 45000,
    robuxAmount: 1000,
    stock: 25400,
    rating: 4.9,
    sales: 1420,
    rarity: "Epic",
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: "robux-5000",
    name: "5,000 Robux (Grosir Paket)",
    category: "Robux",
    priceBaseIDR: 215000,
    robuxAmount: 5000,
    stock: 8900,
    rating: 5.0,
    sales: 420,
    rarity: "Legendary",
    image: "https://images.unsplash.com/photo-1592155998243-9ab7f644d37b?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: "fisch-kraken-claw",
    name: "Kraken Claw (Fisch Legendary Item)",
    category: "Fisch",
    priceBaseIDR: 120000,
    stock: 12,
    rating: 4.8,
    sales: 85,
    rarity: "Legendary",
    image: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: "fisch-magma-rod",
    name: "Magma Rod (Fisch Rod)",
    category: "Fisch",
    priceBaseIDR: 75000,
    stock: 35,
    rating: 4.7,
    sales: 231,
    rarity: "Epic",
    image: "https://images.unsplash.com/photo-1615678815958-5910c6811c25?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: "fisch-nuclear-structure",
    name: "Nuclear Bait (Fisch Bait Pack)",
    category: "Fisch",
    priceBaseIDR: 35000,
    stock: 150,
    rating: 4.6,
    sales: 644,
    rarity: "Rare",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: "pass-bloxfruits",
    name: "Fast Boats Gamepass (Blox Fruits)",
    category: "Roblox Gamepasses",
    priceBaseIDR: 98000,
    stock: 99,
    rating: 4.9,
    sales: 912,
    rarity: "Rare",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  }
];

// Initial Customer Segments High Churn Risk Users
export const INITIAL_CHURN_USERS: ChurnUser[] = [
  {
    id: "u-101",
    username: "RobloxLover99",
    lastActiveDays: 9,
    churnRisk: "High",
    totalSpent: 450000,
    gamePreference: "Fisch",
    couponSent: false
  },
  {
    id: "u-102",
    username: "Valkyrie_Merchant",
    lastActiveDays: 8,
    churnRisk: "High",
    totalSpent: 1200000,
    gamePreference: "Robux Bulk",
    couponSent: false
  },
  {
    id: "u-103",
    username: "NoobProGamer",
    lastActiveDays: 7,
    churnRisk: "Medium",
    totalSpent: 180000,
    gamePreference: "Blox Fruits",
    couponSent: false
  },
  {
    id: "u-104",
    username: "fisch_enjoyer_x",
    lastActiveDays: 12,
    churnRisk: "High",
    totalSpent: 350000,
    gamePreference: "Fisch",
    couponSent: false
  }
];
