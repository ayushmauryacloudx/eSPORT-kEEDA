import React, { useState, useRef, useEffect } from 'react';
import { Skull, X, Send, Loader2 } from 'lucide-react';

interface Message {
  text: string;
  isAi: boolean;
  isError?: boolean;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Hello, soldier. Need intel on the best gear? Ask me anything.', isAi: true }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userText, isAi: false }]);
    setIsLoading(true);

    let apiKey = '';
    try {
      apiKey = localStorage.getItem('esport_gemini_key') || '';
    } catch (e) {
      console.warn("localStorage is blocked:", e);
    }
    
    if (!apiKey) {
      setMessages(prev => [...prev, { text: 'SYSTEM ERROR: No API Key found. Please add your Google AI Studio key in the Admin Panel.', isAi: true, isError: true }]);
      setIsLoading(false);
      return;
    }

    try {
      const prompt = `System Instruction: You are GEAR AI, a hardcore, aggressive, esport gaming expert for eSPORT kEEDA. Talk like a pro gamer or a futuristic soldier. Keep answers short, punchy, and recommend gaming gear (phones, earphones, fans, sleeves).\n\nUser Query: ${userText}`;
      
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'API request failed');
      
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
      setMessages(prev => [...prev, { text, isAi: true }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { text: `API Error: ${error.message || 'Network failure.'}`, isAi: true, isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="fixed bottom-8 right-8 z-[1000] flex flex-col items-end">
      {/* Chat Window */}
      <div className={`w-[350px] bg-[#12141d]/85 backdrop-blur-md border border-[var(--color-neon-orange)] rounded-xl shadow-[0_10px_40px_rgba(255,69,0,0.2)] overflow-hidden transition-all duration-300 transform origin-bottom-right mb-5 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none absolute bottom-16 right-0'}`}>
        <div className="bg-[rgba(255,69,0,0.15)] p-4 text-xl font-bold text-[var(--color-neon-orange)] flex justify-between items-center border-b border-[rgba(255,69,0,0.3)]">
          <span className="flex items-center gap-2"><Skull /> GEAR AI</span>
          <button onClick={() => setIsOpen(false)} className="hover:text-white hover:drop-shadow-[0_0_10px_#fff] transition-colors"><X size={24} /></button>
        </div>
        <div className="h-[400px] flex flex-col">
          <div className="flex-grow p-4 overflow-y-auto flex flex-col gap-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={`p-3 rounded text-base max-w-[80%] ${msg.isAi ? 'bg-[rgba(0,240,255,0.1)] border-l-2 border-[var(--color-neon-blue)] self-start text-white' : 'bg-[rgba(57,255,20,0.1)] border-r-2 border-[var(--color-neon-green)] self-end text-[var(--color-neon-green)]'}`}>
                {msg.isError ? <span className="text-red-500">{msg.text}</span> : msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="p-3 rounded text-base max-w-[80%] bg-[rgba(0,240,255,0.1)] border-l-2 border-[var(--color-neon-blue)] self-start text-white flex items-center gap-2">
                <Loader2 className="animate-spin" size={16} /> Processing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex p-3 border-t border-white/5 gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter query..."
              className="flex-grow bg-black/50 border border-[var(--color-border-color)] text-white p-3 font-main outline-none"
            />
            <button onClick={handleSend} className="bg-[var(--color-neon-blue)] border-none text-[var(--color-bg-dark)] px-4 cursor-pointer text-xl hover:shadow-[0_0_10px_var(--color-neon-blue)] transition-shadow">
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full bg-[var(--color-bg-card)] border-2 border-[var(--color-neon-orange)] text-[var(--color-neon-orange)] text-3xl cursor-pointer shadow-[0_0_20px_rgba(255,69,0,0.4)] flex justify-center items-center transition-all duration-300 hover:scale-110 hover:bg-[var(--color-neon-orange)] hover:text-white hover:shadow-[0_0_30px_var(--color-neon-orange)]"
      >
        <Skull size={32} />
      </button>
    </div>
  );
}
