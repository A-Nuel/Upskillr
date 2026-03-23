import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles, Compass, Target, Map } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getNextUpskillrResponse } from './services/gemini';
import { ChatMessage, UpskillrResponse } from './types';
import { Roadmap } from './components/Roadmap';

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [phase, setPhase] = useState<'intro' | 'discovery' | 'analysis' | 'confirmation' | 'roadmap'>('intro');
  const [feedback, setFeedback] = useState<'yes' | 'no' | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const startAssessment = async () => {
    setPhase('discovery');
    setIsLoading(true);
    const initialPrompt = "Hi, I want to find the best digital skill for me. Let's start the assessment.";
    try {
      const responseText = await getNextUpskillrResponse([], initialPrompt);
      const data = JSON.parse(responseText || '{}') as UpskillrResponse;
      setPhase(data.currentPhase);
      setMessages([
        {
          id: 'init',
          role: 'user',
          content: initialPrompt
        },
        {
          id: Date.now().toString(),
          role: 'model',
          content: data.message,
          options: data.options,
          roadmap: data.roadmap
        }
      ]);
    } catch (error: any) {
      console.error(error);
      const errorStr = JSON.stringify(error);
      if (errorStr.includes('429') || errorStr.toLowerCase().includes('quota') || errorStr.toLowerCase().includes('resource_exhausted')) {
        setMessages([
          {
            id: Date.now().toString(),
            role: 'model',
            content: "I've hit a temporary limit on my thinking capacity. Please wait a minute and try again!"
          }
        ]);
      }
      setPhase('intro');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const newUserMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      const responseText = await getNextUpskillrResponse(history, text);
      const data = JSON.parse(responseText || '{}') as UpskillrResponse;

      setPhase(data.currentPhase);

      const newAiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: data.message,
        options: data.options,
        roadmap: data.roadmap
      };

      setMessages(prev => [...prev, newAiMsg]);
    } catch (error: any) {
      console.error(error);
      let errorMsg = "I'm sorry, I encountered an error processing that. Could you try again?";
      
      // Check for rate limit or quota errors
      const errorStr = JSON.stringify(error);
      if (errorStr.includes('429') || errorStr.toLowerCase().includes('quota') || errorStr.toLowerCase().includes('resource_exhausted')) {
        errorMsg = "I've hit a temporary limit on my thinking capacity. Please wait a minute and try again!";
      }

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        content: errorMsg
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const getProgress = () => {
    switch (phase) {
      case 'intro': return 0;
      case 'discovery': return 30;
      case 'analysis': return 60;
      case 'confirmation': return 80;
      case 'roadmap': return 100;
      default: return 0;
    }
  };

  if (phase === 'intro') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-950 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl w-full text-center space-y-10 relative z-10"
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-indigo-500/30 rotate-3"
          >
            <Sparkles className="w-12 h-12" />
          </motion.div>
          
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight">
              Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Digital Skill</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-xl mx-auto leading-relaxed">
              Discover the perfect digital career path for your personality and goals. Get a free, personalized 30-day roadmap to start learning today.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <button
              onClick={startAssessment}
              disabled={isLoading}
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-slate-950 rounded-full font-semibold text-lg transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] disabled:opacity-70 disabled:hover:scale-100"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                <>
                  Start Free Assessment
                  <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
                </>
              )}
            </button>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="pt-12 flex flex-wrap items-center justify-center gap-6 md:gap-12 text-slate-500 text-sm font-medium"
          >
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-400" /> Personalized Path
            </div>
            <div className="flex items-center gap-2">
              <Map className="w-4 h-4 text-violet-400" /> Actionable Roadmap
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" /> AI-Powered
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      {/* Header */}
      <header className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg text-white">
            <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            Upskillr
          </div>
          
          <div className="flex items-center gap-3 text-sm font-medium text-slate-400">
            <span className="hidden sm:inline capitalize">{phase} Phase</span>
            <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-indigo-600"
                initial={{ width: 0 }}
                animate={{ width: `${getProgress()}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-4xl mx-auto space-y-6 pb-24">
          <AnimatePresence initial={false}>
            {messages.filter(m => m.id !== 'init').map((msg, index, arr) => {
              const isAi = msg.role === 'model';
              const isLast = index === arr.length - 1;
              
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex w-full ${isAi ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[90%] sm:max-w-[80%] flex flex-col gap-2 ${isAi ? 'items-start' : 'items-end'}`}>
                    <div className={`px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed ${
                      isAi 
                        ? 'bg-slate-800 border border-slate-700 text-slate-200 shadow-sm rounded-tl-sm' 
                        : 'bg-indigo-600 text-white rounded-tr-sm'
                    }`}>
                      {msg.content}
                    </div>
                    
                    {isAi && msg.options && msg.options.length > 0 && isLast && !isLoading && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {msg.options.map((opt, i) => (
                          <button
                            key={i}
                            onClick={() => handleSend(opt)}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm rounded-full transition-colors text-left shadow-sm"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}

                    {isAi && msg.roadmap && (
                      <div className="w-full mt-4">
                        <Roadmap data={msg.roadmap} />
                        {isLast && phase === 'roadmap' && (
                          <div className="mt-6 bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm flex flex-col items-center gap-4 max-w-md mx-auto">
                            {!feedback ? (
                              <>
                                <p className="text-white font-medium text-lg">Was this roadmap helpful?</p>
                                <div className="flex gap-4">
                                  <button 
                                    onClick={() => setFeedback('yes')} 
                                    className="px-6 py-2.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-full font-medium transition-colors flex items-center gap-2"
                                  >
                                    👍 Yes, it's great!
                                  </button>
                                  <button 
                                    onClick={() => setFeedback('no')} 
                                    className="px-6 py-2.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 rounded-full font-medium transition-colors flex items-center gap-2"
                                  >
                                    👎 No, not really
                                  </button>
                                </div>
                              </>
                            ) : (
                              <div className="text-center space-y-2">
                                <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-2">
                                  {feedback === 'yes' ? '🎉' : '📝'}
                                </div>
                                <p className="text-white font-medium">Thank you for your feedback!</p>
                                <p className="text-slate-400 text-sm">
                                  {feedback === 'yes' 
                                    ? "We're thrilled we could help you find your path." 
                                    : "We'll use this to improve our future recommendations."}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="px-5 py-4 bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      {phase !== 'roadmap' && (
        <div className="bg-slate-950 border-t border-slate-800 p-4 fixed bottom-0 left-0 right-0">
          <div className="max-w-4xl mx-auto relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
              placeholder="Type your answer..."
              disabled={isLoading}
              className="w-full pl-5 pr-14 py-4 bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all disabled:opacity-50"
            />
            <button
              onClick={() => handleSend(input)}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-2 bottom-2 w-10 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
