import { Headset, Mail, Phone, Users, Instagram, Linkedin, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#090a0f]/95 border-t-2 border-[var(--color-neon-blue)] pt-16 px-[5%] pb-5 mt-12 shadow-[0_-10px_30px_rgba(0,240,255,0.1)] backdrop-blur-md">
      <div className="flex flex-col items-center gap-10 border-b border-white/10 pb-10">
        <h2 className="text-4xl text-white text-center tracking-widest drop-shadow-[0_0_15px_var(--color-neon-green)] max-w-4xl uppercase font-bold">
          DOMINATE THE LOBBY WITH THE BEST GEAR IN THE GAME. NEVER SETTLE FOR LESS!
        </h2>
        
        <div className="flex justify-around w-full flex-wrap gap-8">
          <div className="text-center">
            <h3 className="text-[var(--color-neon-orange)] text-2xl mb-4 uppercase drop-shadow-[0_0_10px_rgba(255,69,0,0.5)] font-bold flex items-center justify-center gap-2">
              <Headset /> COMM LINK
            </h3>
            <p className="text-[var(--color-text-muted)] text-lg mb-2 flex items-center justify-center gap-2">
              <Mail size={18} /> support@esportkeeda.com
            </p>
            <p className="text-[var(--color-text-muted)] text-lg mb-2 flex items-center justify-center gap-2">
              <Phone size={18} /> +91 98765 43210
            </p>
          </div>

          <div className="text-center">
            <h3 className="text-[var(--color-neon-orange)] text-2xl mb-4 uppercase drop-shadow-[0_0_10px_rgba(255,69,0,0.5)] font-bold flex items-center justify-center gap-2">
              <Users /> SQUAD UP
            </h3>
            <div className="flex gap-5 justify-center">
              <a href="#" className="clip-path-social flex items-center justify-center w-12 h-12 bg-[var(--color-bg-card)] border border-white/10 text-white text-2xl hover:-translate-y-1 hover:text-[#E1306C] hover:border-[#E1306C] hover:shadow-[0_0_15px_#E1306C] transition-all">
                <Instagram size={24} />
              </a>
              <a href="#" className="clip-path-social flex items-center justify-center w-12 h-12 bg-[var(--color-bg-card)] border border-white/10 text-white text-2xl hover:-translate-y-1 hover:text-[#0077b5] hover:border-[#0077b5] hover:shadow-[0_0_15px_#0077b5] transition-all">
                <Linkedin size={24} />
              </a>
              <a href="#" className="clip-path-social flex items-center justify-center w-12 h-12 bg-[var(--color-bg-card)] border border-white/10 text-white text-2xl hover:-translate-y-1 hover:text-[#FF0000] hover:border-[#FF0000] hover:shadow-[0_0_15px_#FF0000] transition-all">
                <Youtube size={24} />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center pt-5 text-[var(--color-text-muted)] text-base">
        <p>&copy; 2026 eSPORT kEEDA. All rights reserved. Play Hard.</p>
      </div>
    </footer>
  );
}
