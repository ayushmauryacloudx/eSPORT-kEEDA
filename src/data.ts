import { Product } from './types';

export const defaultProducts: Product[] = [
  // Gaming Phones
  {
    id: 'phone-rog-7',
    name: 'ASUS ROG Phone 7 Ultimate',
    category: 'Gaming Phones',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80',
    originalPrice: '₹99,999',
    price: '₹89,999',
    rating: 4.9,
    reviewsCount: 142,
    badge: 'PRO PICK',
    isFlashDeal: true,
    dealExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 18).toISOString(),
    stock: 4,
    specs: [
      'Snapdragon 8 Gen 2 Overclocked with AeroActive Cooler 7',
      '165Hz Samsung AMOLED Display with 720Hz Touch Sampling',
      'AirTrigger Ultrasonic Shoulder Controls with Haptic Feedback',
      '6000mAh Dual-Cell Battery with 65W HyperCharge'
    ],
    performanceSpecs: {
      display: '165Hz AMOLED',
      response: '1ms Touch',
      memory: '16GB LPDDR5X',
      storage: '512GB UFS 4.0',
      connectivity: 'Wi-Fi 7 / 5G',
      battery: '6000mAh'
    },
    compatibility: ['BGMI', 'PUBG MOBILE', 'FREE FIRE', 'COD Mobile', 'Apex Mobile'],
    esportsGames: ['BGMI', 'PUBG MOBILE', 'FREE FIRE', 'COD'],
    setupCategory: 'Pro Setup',
    description: 'The pinnacle of competitive mobile esports engineering. Built specifically for marathon scrims and LAN tournament play with active Peltier thermoelectric cooling.',
    seller: 'ASUS ROG Esports Division',
    warranty: '2 Year Official Manufacturer Warranty'
  },
  {
    id: 'phone-redmagic-8',
    name: 'RedMagic 8 Pro Titanium',
    category: 'Gaming Phones',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
    originalPrice: '₹75,000',
    price: '₹67,999',
    rating: 4.8,
    reviewsCount: 98,
    badge: 'HOT DEAL',
    isFlashDeal: true,
    dealExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 14).toISOString(),
    stock: 3,
    specs: [
      'ICE 11 Multi-dimensional 20,000 RPM Turbofan Cooling System',
      'True Notch-less 120Hz AMOLED Under-Display Camera',
      '520Hz Dual Touch-Sensing Shoulder Triggers',
      'Dedicated Red Core 2 Gaming Chip for Audio and RGB'
    ],
    performanceSpecs: {
      display: '120Hz FHD+ UDC',
      response: '1.2ms Touch',
      memory: '16GB RAM',
      storage: '256GB SSD',
      connectivity: 'Wi-Fi 6E / 5G',
      battery: '6000mAh'
    },
    compatibility: ['BGMI', 'PUBG MOBILE', 'FREE FIRE', 'COD Mobile'],
    esportsGames: ['BGMI', 'PUBG MOBILE', 'FREE FIRE'],
    setupCategory: 'Competitive Setup',
    description: 'Square cyber frame with edge-to-edge bezel-less display and physical high-RPM internal turbo cooling for zero thermal throttling.',
    seller: 'Nubia RedMagic Store',
    warranty: '1 Year Full Replacement Warranty'
  },

  // Gaming Monitors
  {
    id: 'mon-zowie-xl2546k',
    name: 'BenQ ZOWIE XL2546K 240Hz Esports Monitor',
    category: 'Gaming Monitors',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
    originalPrice: '₹54,990',
    price: '₹47,990',
    rating: 4.95,
    reviewsCount: 312,
    badge: 'PRO PICK',
    stock: 8,
    specs: [
      '240Hz Native Refresh Rate with Fast Liquid Crystal TN Panel',
      'DyAc⁺ Technology for Extreme Dynamic Accuracy and Target Tracking',
      'Shield Wings & Compact Base for Keyboard Angling in Pro LANs',
      'Black eQualizer & Color Vibrance for Map Visibility'
    ],
    performanceSpecs: {
      display: '240Hz DyAc⁺',
      response: '0.5ms GtG',
      connectivity: 'DisplayPort 1.2 / HDMI 2.0',
      weight: '6.2 kg'
    },
    compatibility: ['VALORANT', 'CS2', 'APEX LEGENDS', 'FORTNITE', 'COD'],
    esportsGames: ['VALORANT', 'CS2', 'APEX LEGENDS'],
    setupCategory: 'Competitive Setup',
    description: 'The global standard for Tier 1 CS2 and VALORANT Majors. DyAc⁺ technology makes vigorous in-game spraying feel crisp and blur-free.',
    seller: 'ZOWIE Official Partner',
    warranty: '3 Year On-Site Service Warranty'
  },
  {
    id: 'mon-asus-pg27aqn',
    name: 'ROG Swift 360Hz 1ms Ultra-Fast IPS Display',
    category: 'Gaming Monitors',
    image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&auto=format&fit=crop&q=80',
    originalPrice: '₹98,000',
    price: '₹84,999',
    rating: 4.9,
    reviewsCount: 84,
    badge: 'BESTSELLER',
    isFlashDeal: true,
    dealExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 22).toISOString(),
    stock: 6,
    specs: [
      '360Hz Ultrafast IPS Panel with NVIDIA Reflex Latency Analyzer',
      'QHD 2560x1440 Esports Precision Res with Custom Heatsink',
      'NVIDIA G-SYNC Processor for Tear-Free High FPS Clutches',
      'Chroma Ambient Rear Aura Sync Lighting'
    ],
    performanceSpecs: {
      display: '360Hz QHD IPS',
      response: '1ms GtG',
      connectivity: 'DisplayPort 1.4 / HDMI 2.0',
      weight: '8.4 kg'
    },
    compatibility: ['VALORANT', 'CS2', 'FORTNITE', 'APEX LEGENDS'],
    esportsGames: ['VALORANT', 'CS2', 'FORTNITE'],
    setupCategory: 'Pro Setup',
    description: 'World fastest QHD competitive gaming monitor engineered for maximum pixel density and frame-perfect target acquisition.',
    seller: 'ROG Prime Direct',
    warranty: '3 Years Comprehensive Warranty'
  },

  // Gaming Mouse
  {
    id: 'mouse-superlight-2',
    name: 'Logitech G PRO X Superlight 2 DEX',
    category: 'Gaming Mouse',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
    originalPrice: '₹17,995',
    price: '₹14,495',
    rating: 4.9,
    reviewsCount: 540,
    badge: 'BESTSELLER',
    stock: 12,
    specs: [
      'LIGHTFORCE Hybrid Optical-Mechanical Switches for Instant Clicks',
      'HERO 2 32,000 DPI Sensor with Sub-Micron Tracking Precision',
      '60g Ultralight Tournament Chassis with Zero-Additive PTFE Glides',
      '4000Hz Polling Rate via LIGHTSPEED Wireless Dongle'
    ],
    performanceSpecs: {
      response: '0.25ms (4K Polling)',
      sensorOrSwitch: 'HERO 2 32K DPI',
      connectivity: '2.4GHz Wireless / USB-C',
      battery: '95 Hours Continuous Play',
      weight: '60 grams'
    },
    compatibility: ['PC', 'Mac', 'Tournament OS'],
    esportsGames: ['VALORANT', 'CS2', 'APEX LEGENDS', 'FORTNITE'],
    setupCategory: 'Competitive Setup',
    description: 'Engineered in collaboration with the world champions. 60-gram ergonomic esports icon with LIGHTSPEED wireless precision.',
    seller: 'Logitech G Certified',
    warranty: '2 Year Replacement Warranty'
  },
  {
    id: 'mouse-razer-viper-v3',
    name: 'Razer Viper V3 Pro Wireless 8000Hz',
    category: 'Gaming Mouse',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80',
    originalPrice: '₹18,999',
    price: '₹15,999',
    rating: 4.88,
    reviewsCount: 190,
    badge: 'PRO PICK',
    stock: 5,
    specs: [
      'True 8000Hz HyperPolling Wireless Technology for Real-Time Aim',
      'Focus Pro 35K Gen-2 Optical Sensor with 99.8% Resolution Accuracy',
      'Optical Mouse Switches Gen-3 Rated for 90 Million Clicks',
      '54g Symmetrical Esports Shape for Claw & Fingertip Grips'
    ],
    performanceSpecs: {
      response: '0.125ms (8K Polling)',
      sensorOrSwitch: 'Focus Pro 35K Gen-2',
      connectivity: 'HyperSpeed Wireless',
      battery: '80 Hours',
      weight: '54 grams'
    },
    compatibility: ['PC', 'Mac'],
    esportsGames: ['VALORANT', 'CS2', 'APEX LEGENDS'],
    setupCategory: 'Pro Setup',
    description: 'The choice of Sentinels and Fnatic pro rosters. Phenomenal 54g balance with true 8000Hz wireless polling frequency.',
    seller: 'Razer Arena Flagship',
    warranty: '2 Year International Warranty'
  },

  // Mechanical Keyboards
  {
    id: 'kb-wooting-60he',
    name: 'Wooting 60HE+ Rapid Trigger Magnetic Keyboard',
    category: 'Mechanical Keyboards',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    originalPrice: '₹24,999',
    price: '₹21,999',
    rating: 4.98,
    reviewsCount: 420,
    badge: 'PRO PICK',
    stock: 2,
    specs: [
      'Lekker Hall Effect Magnetic Switches with 0.1mm to 4.0mm Adjustable Actuation',
      'True Rapid Trigger for Instant Counter-Strafing and Jiggle Peeking',
      '0.1mm Reset Point for Frame-Perfect Movement In Tactical FPS',
      'Full RGB Per-Key Backlighting with Web-Based Wootility Customizer'
    ],
    performanceSpecs: {
      response: '0.1ms Rapid Trigger',
      sensorOrSwitch: 'Gateron Lekker Hall Effect',
      connectivity: 'Detachable Braided Type-C',
      weight: '620 grams'
    },
    compatibility: ['PC', 'Mac', 'Linux'],
    esportsGames: ['VALORANT', 'CS2', 'APEX LEGENDS', 'FORTNITE'],
    setupCategory: 'Pro Setup',
    description: 'The game-changing keyboard that revolutionized tactical FPS counter-strafing. True analog magnetic actuation.',
    seller: 'Wooting Global Partner',
    warranty: '2 Years Manufacturer Warranty'
  },
  {
    id: 'kb-apex-pro-tkl',
    name: 'SteelSeries Apex Pro TKL Wireless Gen 3',
    category: 'Mechanical Keyboards',
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&auto=format&fit=crop&q=80',
    originalPrice: '₹28,999',
    price: '₹23,499',
    rating: 4.85,
    reviewsCount: 165,
    badge: 'HOT DEAL',
    isFlashDeal: true,
    dealExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(),
    stock: 7,
    specs: [
      'OmniPoint 3.0 HyperMagnetic Adjustable Switches with Rapid Tap',
      'OLED Smart Display for Instant Profile Toggling and Discord Feeds',
      'Aircraft-Grade 5000 Series Aluminum Alloy Top Plate',
      'Quantum 2.0 Dual Wireless (2.4GHz & Bluetooth 5.0)'
    ],
    performanceSpecs: {
      response: '0.54ms Actuation',
      sensorOrSwitch: 'OmniPoint 3.0 Magnetic',
      connectivity: 'Quantum 2.0 Wireless / USB-C',
      battery: '40 Hours RGB Active'
    },
    compatibility: ['PC', 'PS5', 'Xbox', 'Mac'],
    esportsGames: ['VALORANT', 'CS2', 'FORTNITE', 'COD'],
    setupCategory: 'Competitive Setup',
    description: 'Premium TKL magnetic keyboard with integrated OLED telemetry HUD and custom dual-actuation macros.',
    seller: 'SteelSeries Official Store',
    warranty: '2 Year Direct Warranty'
  },

  // Gaming Headsets
  {
    id: 'audio-hyperx-cloud-alpha-w',
    name: 'HyperX Cloud Alpha Wireless 300-Hour Battery',
    category: 'Gaming Headsets',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    originalPrice: '₹21,990',
    price: '₹16,990',
    rating: 4.89,
    reviewsCount: 410,
    badge: 'BESTSELLER',
    stock: 15,
    specs: [
      'Mind-Blowing 300 Hours Battery Life on a Single USB-C Charge',
      'DTS Headphone:X Spatial Audio for Pinpoint Footstep Elevation',
      'HyperX Dual Chamber 50mm Drivers to Separate Bass from Mids & Highs',
      'Signature Memory Foam & Premium Leatherette Ear Cushions'
    ],
    performanceSpecs: {
      audio: 'DTS:X 7.1 Spatial Audio',
      response: '2.4GHz Zero-Lag Wireless',
      connectivity: '2.4GHz Ultra-Low Latency Dongle',
      battery: '300 Hours (World Record)',
      weight: '322 grams'
    },
    compatibility: ['PC', 'PS5', 'PS4'],
    esportsGames: ['VALORANT', 'CS2', 'PUBG MOBILE', 'BGMI', 'COD'],
    setupCategory: 'Competitive Setup',
    description: 'Play for weeks without plugging in. World-record 300 hour battery life with esports spatial audio tuning.',
    seller: 'HyperX India Official',
    warranty: '2 Year HyperX Care'
  },
  {
    id: 'audio-blackshark-v2-pro',
    name: 'Razer BlackShark V2 Pro (2024 Esports Edition)',
    category: 'Gaming Headsets',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
    originalPrice: '₹23,999',
    price: '₹19,499',
    rating: 4.92,
    reviewsCount: 298,
    badge: 'PRO PICK',
    stock: 9,
    specs: [
      'Razer HyperClear Super Wideband Mic for Broadcast-Grade Comms',
      'TriForce Titanium 50mm Drivers Tuned with Pro Esports Athletes',
      'On-Headset FPS Audio Profiles for Apex, CS2, Fortnite, and Valorant',
      'Ultra-Soft FlowKnit Memory Foam Ear Cushions for Passive Noise Cancelling'
    ],
    performanceSpecs: {
      audio: 'THX Spatial Audio 7.1',
      response: 'HyperSpeed Wireless',
      connectivity: '2.4GHz Wireless / Bluetooth 5.2 / 3.5mm',
      battery: '70 Hours with Quick Charge',
      weight: '320 grams'
    },
    compatibility: ['PC', 'PS5', 'Nintendo Switch', 'Mobile'],
    esportsGames: ['CS2', 'VALORANT', 'APEX LEGENDS', 'COD'],
    setupCategory: 'Pro Setup',
    description: 'Built for the roaring arena stage. Ultra wideband comms microphone with custom pro player sound equalization curves.',
    seller: 'Razer Flagship',
    warranty: '2 Year Razer Care'
  },

  // Controllers
  {
    id: 'ctrl-xbox-elite-2',
    name: 'Xbox Elite Wireless Controller Series 2 Core',
    category: 'Controllers',
    image: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=800&auto=format&fit=crop&q=80',
    originalPrice: '₹15,990',
    price: '₹12,490',
    rating: 4.78,
    reviewsCount: 220,
    badge: 'BESTSELLER',
    stock: 11,
    specs: [
      'Adjustable-Tension Thumbsticks with Shorter Hair Trigger Locks',
      'Wrap-Around Rubberized Diamond Grip for Zero Slip Under Pressure',
      'Save up to 3 Custom Button Profiles with Instant In-Match Switching',
      'Up to 40 Hours of Rechargeable Battery Life Per Charge'
    ],
    performanceSpecs: {
      response: 'Sub-3ms Latency',
      connectivity: 'Xbox Wireless / Bluetooth / USB-C',
      battery: '40 Hours Rechargeable',
      weight: '345 grams'
    },
    compatibility: ['PC', 'Xbox Series X|S', 'iOS', 'Android'],
    esportsGames: ['FORTNITE', 'APEX LEGENDS', 'COD'],
    setupCategory: 'Competitive Setup',
    description: 'Pro grade game mastery with mechanical hair triggers and adjustable thumbstick resistance.',
    seller: 'Microsoft Hardware Authorized',
    warranty: '1 Year Standard Warranty'
  },
  {
    id: 'ctrl-dualsense-edge',
    name: 'PlayStation DualSense Edge Wireless Pro Controller',
    category: 'Controllers',
    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&auto=format&fit=crop&q=80',
    originalPrice: '₹19,990',
    price: '₹17,490',
    rating: 4.82,
    reviewsCount: 140,
    badge: 'NEW',
    stock: 6,
    specs: [
      'Swappable Stick Modules & Changeable Stick Caps for Longevity',
      'Configurable Back Buttons (Half-Dome & Lever Styles Included)',
      'Adjustable Trigger Travel Stops & Stick Sensitivity Deadzones',
      'Haptic Feedback & Adaptive Triggers with Locked USB Braided Cable'
    ],
    performanceSpecs: {
      response: '1ms Direct USB Polling',
      connectivity: 'Direct Braided USB / Bluetooth',
      battery: '12 Hours',
      weight: '335 grams'
    },
    compatibility: ['PS5', 'PC'],
    esportsGames: ['COD', 'FORTNITE', 'APEX LEGENDS'],
    setupCategory: 'Pro Setup',
    description: 'Sony flagship competitive pad. Precision customizable back paddles and replaceable analog stick modules.',
    seller: 'Sony Interactive India',
    warranty: '1 Year Sony Warranty'
  },

  // Gaming Chairs
  {
    id: 'chair-secretlab-titan',
    name: 'Secretlab TITAN Evo Cyber Arena Esports Edition',
    category: 'Gaming Chairs',
    image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800&auto=format&fit=crop&q=80',
    originalPrice: '₹52,000',
    price: '₹44,999',
    rating: 4.96,
    reviewsCount: 380,
    badge: 'PRO PICK',
    stock: 4,
    specs: [
      '4-Way L-ADAPT 4-Directional Lumbar Spine Support System',
      'NEO Hybrid Leatherette 12x More Durable than Standard PU',
      'Magnetic Memory Foam Head Pillow with Cooling Gel Infusion',
      'Full-Metal 4D CloudSwap Armrest Mechanism with Magnetic Tops'
    ],
    performanceSpecs: {
      weight: 'Recline to 165°',
      connectivity: 'Ergonomic Certification',
      storage: 'Magnetic CloudSwap Ecosystem'
    },
    compatibility: ['All Setups', 'Studio', 'Arena'],
    esportsGames: ['VALORANT', 'CS2', 'BGMI', 'PUBG MOBILE', 'COD'],
    setupCategory: 'Pro Setup',
    description: 'The official chair of VALORANT Champions Tour and League of Legends Worlds. Ergonomics calibrated for 12+ hour scrims.',
    seller: 'Secretlab Direct',
    warranty: '5 Year Extended Warranty'
  },

  // Cooling & Chillers
  {
    id: 'cool-black-shark-mag',
    name: 'Black Shark Magnetic MagCooler 4 Pro 27W',
    category: 'Cooling',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80',
    originalPrice: '₹4,999',
    price: '₹3,499',
    rating: 4.88,
    reviewsCount: 310,
    badge: 'HOT DEAL',
    isFlashDeal: true,
    dealExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString(),
    stock: 22,
    specs: [
      '27W Peak Thermoelectric Peltier Cooling Plate with Frost Point Tech',
      'Rapid Drop of up to 35°C in Under 60 Seconds of Attachment',
      'Magnetic Snapping for iPhone MagSafe and Clamp included for Android',
      'Chroma RGB Circular Ambient Flow with Smart NTC Overheat Cutoff'
    ],
    performanceSpecs: {
      display: 'NTC Realtime Temp Display',
      response: 'Instant Drop in 60s',
      connectivity: 'USB-C 27W Power Delivery',
      weight: '82 grams'
    },
    compatibility: ['BGMI', 'PUBG MOBILE', 'FREE FIRE', 'COD Mobile'],
    esportsGames: ['BGMI', 'PUBG MOBILE', 'FREE FIRE'],
    setupCategory: 'Starter Setup',
    description: 'Eliminate FPS drops and screen dimming during competitive BGMI and Free Fire endzones. Drops chip temperatures by up to 35°C instantly.',
    seller: 'Black Shark Technologies',
    warranty: '1 Year Brand Warranty'
  },

  // Accessories
  {
    id: 'acc-spinbot-sleeves',
    name: 'SpinBot BattleGrip Carbon-Fiber Esports Finger Sleeves (4-Pack)',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    originalPrice: '₹799',
    price: '₹399',
    rating: 4.8,
    reviewsCount: 650,
    badge: 'BESTSELLER',
    stock: 45,
    specs: [
      'High-Density 24-Needle Dense Silver Conductive Fiber Weave',
      'Zero-Friction Sweatproof Gliding for Consistent Recoil Pull-Downs',
      'Ultra-Thin 0.25mm Breathable Fabric with Spandex Elastic Edges',
      'Official Tournament Legal Specification for Tier 1 BGMI LANs'
    ],
    performanceSpecs: {
      response: 'Zero Latency Touch',
      sensorOrSwitch: '24-Needle Silver Weave',
      weight: '3 grams'
    },
    compatibility: ['BGMI', 'PUBG MOBILE', 'FREE FIRE', 'COD Mobile'],
    esportsGames: ['BGMI', 'PUBG MOBILE', 'FREE FIRE'],
    setupCategory: 'Starter Setup',
    description: 'Essential gear for competitive touch players. Consistent low-friction spray control even under intense tournament heat.',
    seller: 'SpinBot Esports Gear',
    warranty: 'Replacement on Delivery Defect'
  },
  {
    id: 'acc-artisan-pad',
    name: 'Artisan Ninja FX Zero XSoft Esports Mousepad',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=800&auto=format&fit=crop&q=80',
    originalPrice: '₹7,999',
    price: '₹6,299',
    rating: 4.97,
    reviewsCount: 180,
    badge: 'PRO PICK',
    stock: 5,
    specs: [
      'Handcrafted in Japan with Micro-Knitted Polyester Control Surface',
      'Zero-Displacement Poron Sponge Base Snaps Firmly to Any Desk',
      'Precision Edge-Stitching Lower than Pad Surface for Zero Wrist Irritation',
      'Flawless Dynamic Friction Balance for Micro-Adjustments in Valorant'
    ],
    performanceSpecs: {
      response: 'Perfect Stopping Power',
      sensorOrSwitch: 'Japanese Poron Foam',
      weight: '490x420x4mm (XL)'
    },
    compatibility: ['VALORANT', 'CS2', 'APEX LEGENDS', 'FORTNITE'],
    esportsGames: ['VALORANT', 'CS2'],
    setupCategory: 'Competitive Setup',
    description: 'The definitive cloth control pad praised by tactical FPS professionals worldwide for unmatched stopping precision.',
    seller: 'Tokyo Esports Import',
    warranty: 'Genuine Japanese Import Guarantee'
  }
];
