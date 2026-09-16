export interface PerformanceSpecs {
  display?: string;
  response?: string;
  memory?: string;
  storage?: string;
  connectivity?: string;
  sensorOrSwitch?: string;
  battery?: string;
  audio?: string;
  weight?: string;
}

export type ProductBadge = 'HOT DEAL' | 'BESTSELLER' | 'NEW' | 'LOW STOCK' | 'PRO PICK';

export interface Product {
  id: number | string;
  name: string;
  category: string;
  image: string;
  gallery?: string[];
  originalPrice: string | number;
  price: string | number;
  rating?: number;
  reviewsCount?: number;
  badge?: ProductBadge;
  specs?: string[];
  performanceSpecs?: PerformanceSpecs;
  compatibility?: string[];
  esportsGames?: string[];
  setupCategory?: 'Starter Setup' | 'Competitive Setup' | 'Streamer Setup' | 'Pro Setup';
  isFlashDeal?: boolean;
  dealExpiresAt?: string;
  description?: string;
  stock?: number;
  seller?: string;
  sellerId?: string;
  warranty?: string;
  link?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export const GAMING_CATEGORIES = [
  { id: 'Gaming Phones', name: 'Gaming Phones', icon: 'Gamepad2', count: '14 Models' },
  { id: 'Gaming Monitors', name: 'Gaming Monitors', icon: 'Monitor', count: '18 Displays' },
  { id: 'Gaming Mouse', name: 'Gaming Mouse', icon: 'Mouse', count: '22 Mice' },
  { id: 'Mechanical Keyboards', name: 'Mechanical Keyboards', icon: 'Keyboard', count: '16 Boards' },
  { id: 'Gaming Headsets', name: 'Gaming Headsets', icon: 'Headphones', count: '20 Headsets' },
  { id: 'Controllers', name: 'Controllers', icon: 'Gamepad', count: '12 Gamepads' },
  { id: 'Gaming Chairs', name: 'Gaming Chairs', icon: 'Armchair', count: '8 Chairs' },
  { id: 'Cooling', name: 'Cooling', icon: 'Fan', count: '15 Chillers' },
  { id: 'Accessories', name: 'Accessories', icon: 'Cpu', count: '30+ Gear' }
];

export const CATEGORIES = GAMING_CATEGORIES.map(c => c.name);

export const ESPORTS_GAMES = [
  {
    id: 'BGMI',
    name: 'BGMI',
    genre: 'Battle Royale',
    recommendedGear: 'High Refresh Phones & Trigger Sleeves',
    gradient: 'from-amber-500/20 to-orange-600/20',
    accentColor: '#F59E0B'
  },
  {
    id: 'PUBG MOBILE',
    name: 'PUBG MOBILE',
    genre: 'Global Battle Royale',
    recommendedGear: 'Gyro Chillers & 90FPS Displays',
    gradient: 'from-yellow-500/20 to-amber-700/20',
    accentColor: '#EAB308'
  },
  {
    id: 'FREE FIRE',
    name: 'FREE FIRE',
    genre: 'Fast Battle Royale',
    recommendedGear: 'Ultra-Touch Phones & Earbuds',
    gradient: 'from-orange-500/20 to-red-600/20',
    accentColor: '#F97316'
  },
  {
    id: 'VALORANT',
    name: 'VALORANT',
    genre: 'Tactical Shooter',
    recommendedGear: '240Hz+ Monitors & Low Latency Mice',
    gradient: 'from-red-500/20 to-rose-700/20',
    accentColor: '#EF4444'
  },
  {
    id: 'CS2',
    name: 'CS2',
    genre: 'Competitive FPS',
    recommendedGear: '1ms Tactical Monitors & Rapid Trigger',
    gradient: 'from-cyan-500/20 to-blue-700/20',
    accentColor: '#00E5FF'
  },
  {
    id: 'COD',
    name: 'CALL OF DUTY',
    genre: 'Fast-Paced FPS',
    recommendedGear: 'Spatial Audio Headsets & Controllers',
    gradient: 'from-emerald-500/20 to-green-700/20',
    accentColor: '#10B981'
  },
  {
    id: 'FORTNITE',
    name: 'FORTNITE',
    genre: 'Competitive Build & Battle',
    recommendedGear: 'Mechanical Keyboards & Lightweight Mice',
    gradient: 'from-purple-500/20 to-indigo-700/20',
    accentColor: '#8B5CF6'
  },
  {
    id: 'APEX LEGENDS',
    name: 'APEX LEGENDS',
    genre: 'Movement Hero Shooter',
    recommendedGear: 'High DPI Mice & 165Hz Curved Panels',
    gradient: 'from-rose-500/20 to-pink-700/20',
    accentColor: '#F43F5E'
  }
];

export const SETUP_BUNDLES = [
  {
    id: 'Starter Setup',
    title: 'Starter Setup',
    subtitle: 'Entry Competitive Essentials',
    priceEstimate: '₹29,999+',
    features: ['144Hz Monitor', 'Mechanical Keyboard', 'Ergonomic Gaming Mouse'],
    color: '#00E5FF'
  },
  {
    id: 'Competitive Setup',
    title: 'Competitive Setup',
    subtitle: 'Rank Grinder Hardware (1ms, 240Hz)',
    priceEstimate: '₹79,999+',
    features: ['240Hz Fast IPS', 'Rapid Trigger Magnetic Board', 'Wireless 4K Polling Mouse'],
    color: '#A3FF12'
  },
  {
    id: 'Streamer Setup',
    title: 'Streamer Setup',
    subtitle: 'Broadcasting & Tournament Tier',
    priceEstimate: '₹1,49,999+',
    features: ['Dual 165Hz Displays', 'Studio 7.1 Spatial Headset', 'Chroma Ergonomic Chair'],
    color: '#7C3AED'
  },
  {
    id: 'Pro Setup',
    title: 'Pro Setup',
    subtitle: 'Tier 1 Esports Arena Rig',
    priceEstimate: '₹2,49,999+',
    features: ['360Hz OLED Display', 'Liquid Peltzer Active Chiller', 'Titanium Frame Audio'],
    color: '#00E5FF'
  }
];
