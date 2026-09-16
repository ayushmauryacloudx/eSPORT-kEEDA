import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Loader2, Sparkles, MessageSquare } from 'lucide-react';

interface Message {
  text: string;
  isAi: boolean;
  isError?: boolean;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Arena Tactical Intel Online. Need recommendations on 240Hz monitors, rapid trigger keyboards, or tournament phones? Ask away.', isAi: true }
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
    const updatedMessages = [...messages, { text: userText, isAi: false }];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: updatedMessages.slice(-6)
        })
      });

      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      
      const replyText = data.reply || 'Analysis complete. Gear calibrated.';
      setMessages(prev => [...prev, { text: replyText, isAi: true }]);
    } catch (error: any) {
      console.warn("Chatbot server request fallback:", error);
      setMessages(prev => [...prev, { 
        text: `Arena match for "${userText}": For maximum clutch performance, pair a 240Hz Fast IPS monitor with a sub-60g wireless mouse and rapid-trigger magnetic keyboard for instant counter-strafing.`, 
        isAi: true 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="fixed bottom-16 md:bottom-8 right-4 md:right-8 z-50 flex flex-col items-end">
      {/* Chat Window */}
      <div 
        className={`w-[340px] sm:w-[380px] bg-[#0D1220]/95 backdrop-blur-md border border-[#1E293B] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-300 transform origin-bottom-right mb-4 ${
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none absolute bottom-14 right-0'
        }`}
      >
        {/* Header */}
        <div className="bg-[#111827] px-4 py-3 text-sm font-['Chakra_Petch'] font-bold text-white flex justify-between items-center border-b border-[#1E293B]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#A3FF12] animate-pulse"></div>
            <span className="text-white tracking-wider flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-[#00E5FF]" />
              ARENA INTEL AI
            </span>
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="text-[#94A3B8] hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Message Log */}
        <div className="h-[360px] flex flex-col">
          <div className="flex-grow p-4 overflow-y-auto space-y-3">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`p-3 rounded-lg text-xs leading-relaxed max-w-[85%] ${
                  msg.isAi 
                    ? 'bg-[#111827] border border-[#00E5FF]/30 self-start text-[#F8FAFC]' 
                    : 'bg-[#00E5FF]/15 border border-[#00E5FF]/50 self-end text-white ml-auto'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="p-3 rounded-lg text-xs max-w-[85%] bg-[#111827] border border-[#00E5FF]/30 text-white flex items-center gap-2">
                <Loader2 className="animate-spin text-[#00E5FF]" size={14} /> 
                <span className="font-mono text-[#94A3B8]">Analyzing tournament meta...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-3 border-t border-[#1E293B] bg-[#070A12] flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about 240Hz, low latency mice, cooling..."
              className="flex-grow bg-[#111827] border border-[#1E293B] text-white px-3 py-2 rounded text-xs outline-none focus:border-[#00E5FF] transition-colors"
            />
            <button 
              onClick={handleSend} 
              className="bg-[#00E5FF] text-[#070A12] px-3.5 py-2 rounded hover:bg-[#00E5FF]/90 transition-all font-bold"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-13 h-13 rounded-full bg-[#111827] border border-[#00E5FF] text-[#00E5FF] shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.6)] flex justify-center items-center transition-all duration-300 hover:scale-105"
        title="Tactical AI Gear Intel"
      >
        <Bot size={24} />
      </button>
    </div>
  );
}
