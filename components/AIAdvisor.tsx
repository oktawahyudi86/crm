import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, Sparkles, User, Loader2 } from 'lucide-react';
import { generateStrategicAdvice } from '../services/geminiService';
import { ChatMessage } from '../types';
import { SUGGESTED_QUESTIONS } from '../constants';

interface AIAdvisorProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "Hello. I am your NexusAI Strategic Advisor. I have analyzed your current metrics (Revenue, Churn, LTV:CAC). How can I assist with your strategic decisions today?",
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Prepare history for API
    const historyForApi = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const responseText = await generateStrategicAdvice(text, historyForApi);

    const botMsg: ChatMessage = { role: 'model', text: responseText, timestamp: new Date() };
    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl border-l border-slate-200 z-50 flex flex-col transform transition-transform duration-300 ease-in-out">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-indigo-600 text-white flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          <h2 className="font-semibold">Strategic AI Advisor</h2>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-indigo-700 rounded-full transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'
            }`}>
              <div className="flex items-center gap-2 mb-1 opacity-70 text-xs">
                 {msg.role === 'user' ? <User size={12}/> : <Bot size={12}/>}
                 <span>{msg.role === 'user' ? 'You' : 'NexusAI'}</span>
              </div>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
           <div className="flex justify-start">
             <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                <span className="text-xs text-slate-500">Thinking...</span>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions (only if history is short) */}
      {messages.length < 3 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-slate-400 mb-2 font-medium">QUICK INSIGHTS</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.map((q, i) => (
              <button 
                key={i} 
                onClick={() => handleSend(q)}
                className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors border border-indigo-100"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about retention, CAC, growth..."
            className="flex-1 px-4 py-2 bg-slate-100 border-none rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
          />
          <button 
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAdvisor;