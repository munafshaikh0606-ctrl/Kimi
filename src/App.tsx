/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Cpu, MemoryStick as Ram, Network, Activity, Shield, User, Bot } from 'lucide-react';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [sysStatus, setSysStatus] = useState({
    cpu: '12%',
    ram: '4.2GB',
    network: '14ms',
    threatLevel: 'MINIMAL',
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initial sequence
    const initSequence = async () => {
      setIsTyping(true);
      await new Promise(r => setTimeout(r, 1000));
      setMessages([
        {
          id: '1',
          sender: 'ai',
          text: '[Initiating data stream...] Greetings, Operator. I am the core interface for Project: Kami-Hime. [Analyzing threat level...] System status is optimal. CPU at 12%, RAM at 4.2GB, Network latency 14ms. [Smiling softly] I await your first command.',
          timestamp: new Date().toLocaleTimeString(),
        }
      ]);
      setIsTyping(false);
    };
    initSequence();
  }, []);

  // Update status randomly
  useEffect(() => {
    const interval = setInterval(() => {
      setSysStatus({
        cpu: `${Math.floor(Math.random() * 30 + 5)}%`,
        ram: `${(Math.random() * 2 + 3).toFixed(1)}GB`,
        network: `${Math.floor(Math.random() * 20 + 5)}ms`,
        threatLevel: Math.random() > 0.9 ? 'ELEVATED' : 'MINIMAL',
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString(),
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // AI API Request
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text, history: messages }),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.reply || '[System Error...] Core logic returned empty data.',
        timestamp: new Date().toLocaleTimeString(),
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
       const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `[System Error...] Failed to communicate with core logic. [Frowning] Please check the connection.`,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const parseMessage = (text: string) => {
    if (!text) return null;
    // Split by brackets to style actions differently
    const parts = text.split(/(\[.*?\])/g);
    return parts.map((part, index) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        return (
          <span key={index} className="text-cyan-400 font-mono text-sm mx-1">
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col md:flex-row overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Left Panel: Character & Stats */}
      <div className="relative z-10 w-full md:w-1/3 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-950/80 backdrop-blur-md flex flex-col">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="text-cyan-500 w-5 h-5 animate-pulse" />
            <h1 className="font-mono text-cyan-500 font-bold tracking-widest text-lg">PROJECT: KAMI-HIME</h1>
          </div>
          <div className="px-2 py-1 bg-cyan-950/50 border border-cyan-800/50 rounded text-xs font-mono text-cyan-400">
            v1.0.4 ONLINE
          </div>
        </div>

        {/* Character Display */}
        <div className="flex-1 relative overflow-hidden flex items-center justify-center p-6">
           <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-full max-w-[280px] aspect-[3/4] rounded-2xl border border-slate-800 bg-slate-900 shadow-[0_0_40px_rgba(6,182,212,0.1)] overflow-hidden flex items-center justify-center group"
           >
              {/* Anime Character Image */}
              <img 
                src="https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop" 
                alt="Kami-Hime Core"
                className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
           </motion.div>

           {/* Holographic scanning effect */}
           <motion.div 
             animate={{ top: ['-10%', '110%'] }}
             transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
             className="absolute left-0 right-0 h-1 bg-cyan-400/20 shadow-[0_0_20px_rgba(6,182,212,0.5)] z-20 pointer-events-none"
           />
        </div>

        {/* System Stats */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/50">
          <h2 className="text-xs font-mono text-slate-500 mb-4 tracking-wider flex items-center gap-2">
            <Bot className="w-4 h-4" /> CORE METRICS
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <StatBox icon={Cpu} label="CPU LOAD" value={sysStatus.cpu} />
            <StatBox icon={Ram} label="MEM ALLOC" value={sysStatus.ram} />
            <StatBox icon={Network} label="LATENCY" value={sysStatus.network} />
            <StatBox icon={Shield} label="THREAT" value={sysStatus.threatLevel} alert={sysStatus.threatLevel !== 'MINIMAL'} />
          </div>
        </div>
      </div>

      {/* Right Panel: Terminal / Chat */}
      <div className="relative z-10 flex-1 flex flex-col bg-slate-950/90 backdrop-blur-sm">
        
        {/* Terminal Header */}
        <div className="h-12 border-b border-slate-800 flex items-center px-4 gap-2 bg-slate-900/50 shrink-0">
          <Terminal className="w-4 h-4 text-slate-500" />
          <span className="font-mono text-sm text-slate-400">/sys/logs/communication.log</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {msg.sender === 'ai' ? (
                    <><Bot className="w-3 h-3 text-cyan-500" /><span className="text-xs font-mono text-cyan-500">KAMI-HIME</span></>
                  ) : (
                    <><span className="text-xs font-mono text-slate-500">OPERATOR</span><User className="w-3 h-3 text-slate-500" /></>
                  )}
                  <span className="text-[10px] font-mono text-slate-700">{msg.timestamp}</span>
                </div>
                <div 
                  className={`max-w-[85%] p-4 rounded-xl font-mono text-sm leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-slate-800 text-slate-200 rounded-tr-sm border border-slate-700' 
                      : 'bg-cyan-950/20 text-cyan-50 rounded-tl-sm border border-cyan-900/50 shadow-[0_0_15px_rgba(6,182,212,0.05)]'
                  }`}
                >
                  {parseMessage(msg.text)}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-cyan-500 animate-pulse" />
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 shrink-0">
          <form onSubmit={handleSend} className="relative flex items-center">
            <span className="absolute left-4 text-cyan-500 font-mono">{'>'}</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter command..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg py-3 pl-8 pr-4 font-mono text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-700"
              autoFocus
              disabled={isTyping}
            />
          </form>
        </div>

      </div>
    </div>
  );
}

function StatBox({ icon: Icon, label, value, alert = false }: { icon: any, label: string, value: string, alert?: boolean }) {
  return (
    <div className={`p-3 rounded-lg border ${alert ? 'bg-red-950/20 border-red-900/50' : 'bg-slate-950 border-slate-800'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-[10px] font-mono ${alert ? 'text-red-400' : 'text-slate-500'}`}>{label}</span>
        <Icon className={`w-3 h-3 ${alert ? 'text-red-500 animate-pulse' : 'text-slate-600'}`} />
      </div>
      <div className={`font-mono text-lg ${alert ? 'text-red-500' : 'text-slate-200'}`}>{value}</div>
    </div>
  );
}
