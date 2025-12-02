
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Loader2, ThumbsUp, ThumbsDown, Trash2, Volume2, MessageSquare, StopCircle } from 'lucide-react';
import { createTechSupportChat } from '../services/geminiService';
import { GenerateContentResponse, Content } from "@google/genai";

// Declaration for Web Speech API
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  feedback?: 'up' | 'down';
}

const LOCAL_STORAGE_KEY = 'par_sanat_ai_chat_history_v4';

const AiSupport: React.FC = () => {
  // Load messages from local storage or default
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    }
    return [
      { id: 1, text: 'سلام! من «نوا» هستم، دستیار هوشمند فنی پار صنعت. می‌تونم در مورد کاتالوگ‌ها، رفع خرابی آسانسور و تنظیمات درایو کمکت کنم. صدای شما رو هم می‌شنوم! 🎙️', sender: 'ai' }
    ];
  });

  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<number | null>(null);
  
  const chatRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Chat with History
  useEffect(() => {
    // Convert current messages to GenAI Content format for history
    const history: Content[] = messages
      .filter(m => m.id !== 1) // Skip the default greeting
      .map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

    chatRef.current = createTechSupportChat(history);
    scrollToBottom();
  }, []); 

  // Save to Local Storage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now(), text: text, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsProcessing(true);

    try {
      const result: GenerateContentResponse = await chatRef.current.sendMessage({ message: text });
      const aiResponse = result.text || "متوجه نشدم، لطفا دوباره بپرسید.";

      const aiMsg: Message = { id: Date.now() + 1, text: aiResponse, sender: 'ai' };
      setMessages(prev => [...prev, aiMsg]);
      
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: "مشکلی در ارتباط با سرور پیش آمده است.", sender: 'ai' }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFeedback = (messageId: number, type: 'up' | 'down') => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, feedback: type } : msg
    ));
  };

  const clearHistory = () => {
    if (window.confirm("آیا از پاک کردن تاریخچه گفتگو مطمئن هستید؟")) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      const defaultMsg: Message = { id: Date.now(), text: 'سلام! من «نوا» هستم. چطور می‌توانم کمک کنم؟', sender: 'ai' };
      setMessages([defaultMsg]);
      chatRef.current = createTechSupportChat([]); 
    }
  };

  // --- Voice Logic ---
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("مرورگر شما از قابلیت تشخیص گفتار پشتیبانی نمی‌کند.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'fa-IR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => handleSendMessage(event.results[0][0].transcript);
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const speakText = (text: string, id: number) => {
    if (!('speechSynthesis' in window)) return;

    // If already speaking this message, stop it
    if (isSpeaking && speakingMessageId === id) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fa-IR';
    
    // Try to find a Persian voice
    const voices = window.speechSynthesis.getVoices();
    const persianVoice = voices.find(v => v.lang.includes('fa'));
    if (persianVoice) {
      utterance.voice = persianVoice;
    }

    utterance.rate = 1.0;
    
    utterance.onstart = () => {
      setIsSpeaking(true);
      setSpeakingMessageId(id);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingMessageId(null);
    };
    
    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeakingMessageId(null);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] animate-fade-in relative bg-gradient-to-b from-slate-900 to-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-2xl font-sans text-right">
      
      {/* --- Header / Robot Avatar Area --- */}
      <div className="relative h-64 flex items-center justify-center shrink-0 border-b border-slate-700/50 shadow-lg overflow-hidden">
        
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-slate-900"></div>
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        
        {/* Status Indicators */}
        <div className="absolute top-4 left-4 bg-slate-800/80 backdrop-blur text-blue-400 px-3 py-1.5 rounded-full text-xs font-bold border border-blue-500/30 flex items-center gap-1.5 z-20 shadow-lg">
           <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]"></span>
           دستیار هوشمند نوا
        </div>

        <button 
          onClick={clearHistory}
          className="absolute top-4 right-4 text-slate-500 hover:text-red-400 hover:bg-slate-800 p-2 rounded-lg transition-colors z-20 tooltip"
          title="پاک کردن تاریخچه"
        >
          <Trash2 size={18} />
        </button>

        {/* --- Modern CSS Robot Avatar --- */}
        <div className="relative z-10 transform scale-100 transition-transform duration-500 ease-out mt-4">
           
           {/* Glow Effect behind head */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-blue-500 rounded-full blur-[60px] opacity-20 animate-pulse"></div>

           {/* Floating Animation Wrapper */}
           <div className="animate-[bounce_3s_infinite_ease-in-out]">
               
               {/* Robot Head Container */}
               <div className="relative w-32 h-28 bg-white rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.3)] border-[3px] border-white/90 flex flex-col items-center justify-center p-1.5 overflow-hidden">
                   
                   {/* Face Screen (Black Glass) */}
                   <div className="w-full h-full bg-slate-900 rounded-[1.7rem] relative overflow-hidden flex items-center justify-center shadow-inner ring-1 ring-white/10">
                        
                        {/* Scanlines Effect */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20"></div>

                        {/* Eyes Container */}
                        <div className="flex gap-4 items-center z-20">
                            {/* Left Eye */}
                            <div className={`bg-cyan-400 rounded-full shadow-[0_0_15px_#22d3ee] transition-all duration-300 ${isProcessing ? 'w-8 h-2 animate-pulse' : 'w-3 h-8'}`}></div>
                            
                            {/* Right Eye */}
                            <div className={`bg-cyan-400 rounded-full shadow-[0_0_15px_#22d3ee] transition-all duration-300 ${isProcessing ? 'w-8 h-2 animate-pulse' : 'w-3 h-8'}`}></div>
                        </div>

                        {/* Mouth / Voice Visualizer */}
                        {(isSpeaking || isListening) && (
                            <div className="absolute bottom-5 flex gap-1 z-20">
                                <div className="w-1 h-2 bg-cyan-500 rounded-full animate-[bounce_0.8s_infinite]"></div>
                                <div className="w-1 h-4 bg-cyan-500 rounded-full animate-[bounce_0.6s_infinite]"></div>
                                <div className="w-1 h-3 bg-cyan-500 rounded-full animate-[bounce_0.9s_infinite]"></div>
                                <div className="w-1 h-4 bg-cyan-500 rounded-full animate-[bounce_0.7s_infinite]"></div>
                                <div className="w-1 h-2 bg-cyan-500 rounded-full animate-[bounce_0.8s_infinite]"></div>
                            </div>
                        )}
                   </div>

                   {/* Reflection/Gloss on head */}
                   <div className="absolute top-2 left-4 w-8 h-4 bg-white opacity-40 rounded-full blur-[2px] z-30"></div>
               </div>

               {/* Antenna */}
               <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-1 h-4 bg-gray-400 -z-10"></div>
               <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_#ef4444] animate-ping"></div>
           </div>
        </div>
      </div>

      {/* --- Chat History --- */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex flex-col ${msg.sender === 'user' ? 'items-start' : 'items-end'} animate-fade-in-up`}
          >
            <div 
              className={`max-w-[85%] rounded-2xl px-5 py-3 text-sm leading-7 shadow-sm relative ${
                msg.sender === 'user' 
                  ? 'bg-white text-gray-800 rounded-tr-none border border-gray-200' 
                  : 'bg-blue-600 text-white rounded-tl-none shadow-blue-200'
              }`}
            >
              {msg.text}
            </div>

            {/* Actions Bar for AI Messages */}
            {msg.sender === 'ai' && (
              <div className="flex gap-2 mt-1 px-1 items-center opacity-80 hover:opacity-100 transition-opacity">
                 
                 {/* Read Aloud Button */}
                <button 
                  onClick={() => speakText(msg.text, msg.id)}
                  className={`p-1.5 rounded-lg transition-all duration-200 flex items-center gap-1.5 text-[10px] font-medium border shadow-sm ${
                    speakingMessageId === msg.id
                      ? 'bg-red-50 text-red-600 border-red-200' 
                      : 'bg-white text-gray-500 border-gray-200 hover:text-blue-600 hover:border-blue-200'
                  }`}
                  title={speakingMessageId === msg.id ? "توقف خواندن" : "خواندن متن"}
                >
                  {speakingMessageId === msg.id ? <StopCircle size={12} className="animate-pulse" /> : <Volume2 size={12} />}
                  <span>{speakingMessageId === msg.id ? 'توقف' : 'پخش صوتی'}</span>
                </button>
                
                <div className="h-3 w-px bg-gray-300 mx-1 opacity-50"></div>

                {/* Feedback Buttons */}
                <button 
                  onClick={() => handleFeedback(msg.id, 'up')}
                  className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 text-[10px] ${
                    msg.feedback === 'up' 
                      ? 'text-green-600 bg-green-50 font-bold' 
                      : 'text-gray-400 hover:text-green-600 hover:bg-white'
                  }`}
                >
                  <ThumbsUp size={12} />
                </button>
                <button 
                  onClick={() => handleFeedback(msg.id, 'down')}
                  className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 text-[10px] ${
                    msg.feedback === 'down' 
                      ? 'text-red-600 bg-red-50 font-bold' 
                      : 'text-gray-400 hover:text-red-600 hover:bg-white'
                  }`}
                >
                  <ThumbsDown size={12} />
                </button>
              </div>
            )}
          </div>
        ))}
        
        {isProcessing && (
          <div className="flex justify-end">
             <div className="bg-white text-blue-600 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2 shadow-sm border border-blue-100">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-xs font-medium">نوا در حال تایپ...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* --- Input Area --- */}
      <div className="bg-white p-4 border-t border-gray-200">
        <div className="flex gap-3 items-center">
            
            <button
                onClick={isListening ? () => {} : startListening}
                className={`w-14 h-12 rounded-xl flex items-center justify-center transition-all duration-300 relative group ${
                    isListening 
                    ? 'bg-red-500 text-white shadow-lg shadow-red-200' 
                    : 'bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-600'
                }`}
                title="پرسش صوتی (میکروفن)"
            >
                {isListening && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                )}
                {isListening ? <MicOff size={24} /> : <Mic size={24} />}
            </button>

            <div className="flex-1 relative">
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
                    placeholder="سوال خود را بنویسید یا دکمه میکروفن را بزنید..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm text-gray-800 placeholder-gray-400 pl-10"
                />
                <MessageSquare size={16} className="absolute left-3 top-3.5 text-gray-400" />
            </div>

            <button 
                onClick={() => handleSendMessage(inputText)}
                disabled={!inputText.trim() || isProcessing}
                className="bg-blue-600 text-white w-12 h-12 rounded-xl flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-lg shadow-blue-200"
            >
                <Send size={20} className={document.dir === 'rtl' ? 'rotate-180' : ''} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default AiSupport;
