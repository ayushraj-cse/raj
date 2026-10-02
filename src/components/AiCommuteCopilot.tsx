import React from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Lightbulb, 
  RotateCcw, 
  ShieldCheck, 
  Compass, 
  Clock, 
  CloudRain,
  BookOpen
} from 'lucide-react';

interface Message {
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

export const AiCommuteCopilot: React.FC = () => {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      sender: 'ai',
      text: "Hey! I'm your Campus Commute Copilot. Whether you need the fastest route around rainy morning traffic, peak-hour crowd bypasses, or commute revision tips, ask me anything!",
      time: 'Just now',
    },
  ]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const samplePrompts = [
    { title: 'Rainy Day Travel', prompt: 'Heavy rain predicted this morning. How should I plan my college commute and what gear is essential?' },
    { title: 'Bypass Rush Hour', prompt: 'Which coaches or routes have the least morning crowd around 8:15 AM?' },
    { title: 'Study on the Bus', prompt: 'How can I productively review formulas during my 35-min bumpy bus ride without getting motion sick?' },
    { title: 'Cheapest Monthly Pass', prompt: 'What is the most cost-effective pass combination for a college student using both bus and metro?' },
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: Message = {
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/commute-copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          transitMode: 'Metro & Campus Bus',
          origin: 'Student Neighborhood',
          destination: 'University Main Campus',
          weather: 'Morning commuter hours',
        }),
      });

      const data = await res.json();
      const aiReply = data.reply || data.fallback || "Leave at least 20 minutes earlier than usual to navigate gate queues comfortably!";

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: aiReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: "Here's your quick day scholar tip: Keep your student ID & metro card in a reachable lanyard slot, and board the rear carriage of Metro Line 1 for fastest exit to Gate 2!",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              AI Commute Copilot
            </h1>
            <span className="p-1 bg-amber-100 text-amber-800 rounded-lg text-xs font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Gemini 3.8
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Personalized transit advisor for day scholars: weather routing, study hacks during commute, and rush hour strategies.
          </p>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p.prompt)}
            className="text-left p-3 bg-white hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-300 rounded-2xl shadow-xs transition-all flex flex-col justify-between"
          >
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              {p.title}
            </span>
            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
              {p.prompt}
            </p>
          </button>
        ))}
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[520px]">
        {/* Messages scroll area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((msg, index) => {
            const isAi = msg.sender === 'ai';
            return (
              <div
                key={index}
                className={`flex items-start gap-3 ${isAi ? '' : 'flex-row-reverse'}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isAi
                      ? 'bg-gradient-to-tr from-indigo-600 to-indigo-800 text-white shadow-sm'
                      : 'bg-slate-900 text-white'
                  }`}
                >
                  {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-xl rounded-2xl p-4 text-xs leading-relaxed ${
                    isAi
                      ? 'bg-slate-50 border border-slate-200/80 text-slate-800'
                      : 'bg-indigo-600 text-white font-medium'
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.text}</div>
                  <span
                    className={`block text-[10px] mt-2 font-mono ${
                      isAi ? 'text-slate-400' : 'text-indigo-200 text-right'
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                <span>Consulting campus transit maps and weather advisory...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input box */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about bus timings, bad weather routes, study on train hacks..."
              className="flex-1 px-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 shadow-xs text-slate-800 placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-all shadow-sm shrink-0"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
