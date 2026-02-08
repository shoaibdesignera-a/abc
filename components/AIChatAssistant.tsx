
import React, { useState, useRef, useEffect } from 'react';
import { chatWithAssistant } from '../services/geminiService';
import { ChatMessage } from '../types';

const AIChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: "Hello! I'm your MM&GG Luxury Advisor. Looking for a home in a specific area or need market insights?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await chatWithAssistant(messages.map(m => ({ role: m.role, content: m.content })), userMsg);
      setMessages(prev => [...prev, { role: 'model', content: response.text }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', content: "I'm sorry, I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-8 right-8 z-[100]">
        {!isOpen && (
          <button 
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
            </svg>
          </button>
        )}
      </div>

      {isOpen && (
        <div className="fixed bottom-8 right-8 z-[100] w-96 h-[600px] bg-white rounded-3xl shadow-2xl flex flex-col border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">M</div>
              <div>
                <h4 className="font-bold">Luxury Advisor</h4>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">Online</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-slate-900 text-white rounded-tr-none' 
                    : 'bg-white border border-slate-200 text-slate-700 shadow-sm rounded-tl-none'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none flex gap-1">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-slate-100">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about properties or trends..."
                className="w-full bg-slate-100 border-none rounded-2xl px-5 py-3 pr-12 focus:ring-2 focus:ring-slate-900 transition-all text-sm outline-none"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="absolute right-2 w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-slate-800 disabled:opacity-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </button>
            </div>
            <p className="text-[10px] text-center text-slate-400 mt-2">Powered by MM&GG AI Intelligence</p>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatAssistant;
