import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Lazy initialize Google Gemini SDK
  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI | null {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    if (!aiClient) {
      aiClient = new GoogleGenAI({ apiKey });
    }
    return aiClient;
  }

  // Health endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
      model: 'gemini-3.8-flash'
    });
  });

  // Verified esports category images
  const CATEGORY_IMAGES: Record<string, string> = {
    'Gaming Phones': 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80',
    'Gaming Monitors': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
    'Gaming Mouse': 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
    'Mechanical Keyboards': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    'Gaming Headsets': 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
    'Controllers': 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=800&auto=format&fit=crop&q=80',
    'Gaming Chairs': 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800&auto=format&fit=crop&q=80',
    'Cooling': 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80',
    'Accessories': 'https://images.unsplash.com/photo-1629429408209-1f912961dbd8?w=800&auto=format&fit=crop&q=80',
  };

  function getFallbackProduct(prompt?: string, category?: string) {
    const cat = category || 'Gaming Mouse';
    return {
      name: prompt ? `${prompt} Pro Esports Edition` : 'ZOWIE EC2-CW 8KHz Ultra Wireless Mouse',
      category: cat,
      originalPrice: 13999,
      price: 11499,
      stock: 14,
      badge: 'PRO PICK',
      specs: [
        '3395 Optical Sensor with true 8000Hz polling rate',
        'Sub-58g featherweight ergonomic tournament shell',
        'Zero debounce delay optical micro-switches',
        'Pure PTFE curved glides for frictionless micro-adjustments'
      ],
      compatibility: ['VALORANT', 'CS2', 'APEX LEGENDS'],
      description: 'Engineered for tournament claw and palm players requiring sub-millisecond click response and jitter-free tracking precision.',
      image: CATEGORY_IMAGES[cat] || CATEGORY_IMAGES['Gaming Mouse']
    };
  }

  function getFallbackCatalog() {
    return [
      {
        name: 'BenQ ZOWIE XL2566K 360Hz Fast TN Esports Monitor',
        category: 'Gaming Monitors',
        originalPrice: 64999,
        price: 54999,
        stock: 8,
        badge: 'PRO PICK',
        specs: ['360Hz Native Refresh Rate', 'DyAc⁺ Dynamic Accuracy', '0.5ms Response Time', 'Shield Flaps & S-Switch'],
        compatibility: ['VALORANT', 'CS2', 'OVERWATCH 2'],
        description: 'The global standard for professional Counter-Strike and Valorant tournaments with unmatched motion clarity.',
        image: CATEGORY_IMAGES['Gaming Monitors']
      },
      {
        name: 'Wooting 60HE+ Hall Effect Rapid Trigger Keyboard',
        category: 'Mechanical Keyboards',
        originalPrice: 22999,
        price: 19499,
        stock: 12,
        badge: 'BESTSELLER',
        specs: ['0.1mm to 4.0mm Adjustable Actuation', 'Rapid Trigger Dynamic Reset', 'Lekker Hall Effect Magnetic Switches', 'Full Aluminum Chassis'],
        compatibility: ['VALORANT', 'CS2', 'FORTNITE', 'APEX LEGENDS'],
        description: 'Analog magnetic switches that enable instant counter-strafing and instantaneous directional change.',
        image: CATEGORY_IMAGES['Mechanical Keyboards']
      },
      {
        name: 'Razer Viper V3 Pro Ultra-Lightweight Wireless',
        category: 'Gaming Mouse',
        originalPrice: 17999,
        price: 14999,
        stock: 15,
        badge: 'NEW',
        specs: ['Focus Pro 35K Gen-2 Optical Sensor', 'True 8000Hz Wireless Polling', '54g Ultra-light balanced mass', '95-hour battery life'],
        compatibility: ['VALORANT', 'CS2', 'BGMI', 'PUBG MOBILE'],
        description: 'Co-developed with tier-1 esports pros to provide the purest fingertip flick and micro-tracking stability.',
        image: CATEGORY_IMAGES['Gaming Mouse']
      },
      {
        name: 'Black Shark FunCooler 3 Pro 20W Active Peltier Cooler',
        category: 'Cooling',
        originalPrice: 4999,
        price: 3499,
        stock: 25,
        badge: 'HOT DEAL',
        specs: ['20W High-power semiconductor TEC chip', 'Drop up to 30°C in 60 seconds', 'RGB Speed telemetric indicator', 'Universal 67-88mm phone clamp'],
        compatibility: ['BGMI', 'PUBG MOBILE', 'FREE FIRE', 'COD Mobile'],
        description: 'Prevents CPU/GPU thermal throttling during high-stress tournament endzones in BGMI and PUBG Mobile.',
        image: CATEGORY_IMAGES['Cooling']
      }
    ];
  }

  // Server-side Gemini AI Auto-Fill Product endpoint
  app.post('/api/ai/auto-fill-product', async (req, res) => {
    try {
      const { prompt, category } = req.body;
      const userPrompt = prompt || category || 'Competitive 360Hz Fast IPS Esports Monitor';

      const ai = getGeminiClient();
      if (!ai) {
        return res.json({
          product: getFallbackProduct(userPrompt, category),
          source: 'local_tactical_cache'
        });
      }

      const systemInstruction = `You are a premier esports gaming gear catalog architect for eSPORT kEEDA.
Generate a realistic, tournament-tier gaming hardware specification based on the player's query or category.
Respond with ONLY a raw JSON object (no markdown, no backticks, no markdown fence).
JSON Format:
{
  "name": "Full Hardware Name with brand, edition and key spec",
  "category": "One of: Gaming Phones, Gaming Monitors, Gaming Mouse, Mechanical Keyboards, Gaming Headsets, Controllers, Gaming Chairs, Cooling, Accessories",
  "originalPrice": 14999,
  "price": 11999,
  "stock": 10,
  "badge": "One of: PRO PICK, HOT DEAL, BESTSELLER, NEW, LOW STOCK",
  "specs": ["spec 1", "spec 2", "spec 3", "spec 4"],
  "compatibility": ["VALORANT", "CS2", "BGMI"],
  "description": "Short technical competitive description emphasizing esports advantage and performance."
}`;

      const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
      let jsonText = '';

      for (const model of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: `Generate esports hardware catalog item for: "${userPrompt}". Suggested category: ${category || 'auto-detect'}.`,
            config: {
              systemInstruction,
              temperature: 0.4,
              responseMimeType: 'application/json'
            }
          });
          if (response.text) {
            jsonText = response.text;
            break;
          }
        } catch (err: any) {
          console.warn(`Gemini auto-fill error on ${model}:`, err?.status || err?.message);
        }
      }

      let parsed: any = null;
      if (jsonText) {
        try {
          const cleaned = jsonText.replace(/```json/gi, '').replace(/```/g, '').trim();
          parsed = JSON.parse(cleaned);
        } catch (e) {
          console.warn("JSON parse failed, falling back:", e);
        }
      }

      if (!parsed || !parsed.name) {
        parsed = getFallbackProduct(userPrompt, category);
      }

      // Ensure valid category and verified image
      const targetCategory = (parsed.category && CATEGORY_IMAGES[parsed.category]) ? parsed.category : (category || 'Gaming Mouse');
      parsed.category = targetCategory;
      parsed.image = CATEGORY_IMAGES[targetCategory] || CATEGORY_IMAGES['Gaming Mouse'];
      parsed.originalPrice = Number(parsed.originalPrice) || 12999;
      parsed.price = Number(parsed.price) || 9999;
      parsed.stock = Number(parsed.stock) || 12;

      return res.json({ product: parsed, source: 'google_ai_studio_gemini' });
    } catch (error: any) {
      console.error('Error auto-filling product:', error);
      return res.json({ product: getFallbackProduct(req.body?.prompt, req.body?.category), source: 'fallback' });
    }
  });

  // Server-side Gemini AI Auto-Generate Catalog Batch
  app.post('/api/ai/generate-catalog', async (req, res) => {
    try {
      const { count = 4 } = req.body;
      const ai = getGeminiClient();
      if (!ai) {
        return res.json({ products: getFallbackCatalog(), source: 'local_tactical_cache' });
      }

      const systemInstruction = `You are an elite esports hardware store architect. Generate ${count} different top-tier esports tournament hardware products for competitive games (BGMI, Valorant, CS2, etc.).
Reply with ONLY a valid raw JSON array of objects (no markdown, no backticks).
Each object:
{
  "name": "Hardware Name with specs",
  "category": "Gaming Monitors | Gaming Mouse | Mechanical Keyboards | Gaming Phones | Gaming Headsets | Cooling",
  "originalPrice": 16999,
  "price": 13999,
  "stock": 10,
  "badge": "PRO PICK | HOT DEAL | BESTSELLER | NEW | LOW STOCK",
  "specs": ["spec 1", "spec 2", "spec 3"],
  "compatibility": ["VALORANT", "CS2", "BGMI"],
  "description": "Short tactical description"
}`;

      let jsonText = '';
      const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
      for (const model of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: `Generate ${count} esports hardware units across different categories.`,
            config: {
              systemInstruction,
              temperature: 0.5,
              responseMimeType: 'application/json'
            }
          });
          if (response.text) {
            jsonText = response.text;
            break;
          }
        } catch (err: any) {
          console.warn(`Gemini catalog generation error on ${model}:`, err?.message);
        }
      }

      let parsed: any[] = [];
      if (jsonText) {
        try {
          const cleaned = jsonText.replace(/```json/gi, '').replace(/```/g, '').trim();
          parsed = JSON.parse(cleaned);
        } catch (e) {
          console.warn("JSON parse array failed:", e);
        }
      }

      if (!Array.isArray(parsed) || parsed.length === 0) {
        parsed = getFallbackCatalog();
      }

      const formatted = parsed.map((item) => {
        const cat = CATEGORY_IMAGES[item.category] ? item.category : 'Gaming Mouse';
        return {
          ...item,
          category: cat,
          image: CATEGORY_IMAGES[cat] || CATEGORY_IMAGES['Gaming Mouse'],
          originalPrice: Number(item.originalPrice) || 12999,
          price: Number(item.price) || 9999,
          stock: Number(item.stock) || 10,
          createdAt: new Date().toISOString()
        };
      });

      return res.json({ products: formatted, source: 'google_ai_studio_gemini' });
    } catch (err) {
      console.error('Error generating catalog:', err);
      return res.json({ products: getFallbackCatalog(), source: 'fallback' });
    }
  });

  // Server-side Gemini AI Chat endpoint
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message query is required' });
      }

      const ai = getGeminiClient();
      if (!ai) {
        return res.json({
          reply: `[ARENA TACTICAL INTEL] Tactical recommendation: For competitive shooters (BGMI, Valorant, CS2), equip a 240Hz/360Hz Fast IPS monitor, a sub-60g wireless mouse with 8000Hz polling rate, and a magnetic Hall-Effect keyboard (0.1mm Rapid Trigger) to maximize flick consistency and counter-strafing response.`,
          source: 'local_tactical_cache'
        });
      }

      const systemInstruction = `You are ARENA INTEL, the elite competitive esports hardware strategist for eSPORT kEEDA marketplace.
Advise players on the optimal gaming gear (240Hz/360Hz/540Hz Fast IPS/OLED monitors, magnetic hall-effect keyboards with 0.1mm Rapid Trigger, ultra-lightweight <60g wireless gaming mice with 8000Hz polling, Peltier active mobile coolers, and 7.1 planar audio headsets) for games like BGMI, PUBG Mobile, Valorant, CS2, Free Fire, Apex Legends, and Call of Duty.
Keep responses concise, technical, punchy, and confident in competitive gaming terminology. Include specific specs (polling rate, latency, actuation points, switch type, refresh rates).`;

      let promptText = message;
      if (Array.isArray(history) && history.length > 0) {
        const historyContext = history.slice(-4).map((h: any) => `${h.isAi ? 'Advisor' : 'Player'}: ${h.text}`).join('\n');
        promptText = `Previous conversation context:\n${historyContext}\n\nPlayer query: ${message}`;
      }

      // Try primary model (gemini-3.8-flash) and fallback to (gemini-3.1-flash-lite) if experiencing temporary demand spikes
      const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
      let reply = '';
      let usedModel = '';

      for (const model of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: promptText,
            config: {
              systemInstruction,
              temperature: 0.7,
            }
          });
          if (response.text) {
            reply = response.text;
            usedModel = model;
            break;
          }
        } catch (err: any) {
          console.warn(`Gemini model ${model} request error, trying alternate:`, err?.status || err?.message);
        }
      }

      if (!reply) {
        reply = `Tactical gear recommendation: For competitive shooters (BGMI, Valorant, CS2), equip a 240Hz/360Hz Fast IPS monitor, a sub-60g wireless mouse with 8000Hz polling rate, and a magnetic Hall-Effect keyboard (0.1mm Rapid Trigger) to maximize flick consistency and counter-strafing response.`;
        usedModel = 'arena_tactical_cache';
      }

      return res.json({ reply, model: usedModel, source: 'google_ai_studio_gemini' });
    } catch (error: any) {
      console.error('Error generating Gemini response:', error);
      return res.json({
        reply: `Tactical gear match: To maximize competitive advantage, pair an ultra-low latency magnetic keyboard with a 240Hz Fast IPS display and sub-60g gaming mouse for sub-millisecond response.`,
        source: 'fallback'
      });
    }
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Esports Arena Server running on port ${PORT}`);
  });
}

startServer();
