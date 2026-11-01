import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  X,
  Trash2,
  Copy,
  Check,
  Loader2,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { CelebrationEvent, ChatMessage } from '../types.ts';
import { sendChatMessageAPI } from '../services/api.ts';
import { FormattedMarkdown } from './FormattedMarkdown.tsx';

interface ChatAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  activeEvent: CelebrationEvent | null;
}

const SUGGESTED_PROMPTS = [
  'How can I plan a wedding under ₹5 lakh?',
  'Suggest a creative birthday theme for a 10-year-old.',
  'How can I reduce decoration costs?',
  'Suggest activities for a community event with 100 attendees.',
  'Create a last-minute event preparation checklist.',
  'Suggest a vegetarian menu for 200 guests.'
];

export const ChatAssistant: React.FC<ChatAssistantProps> = ({
  isOpen,
  onClose,
  activeEvent,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `Hello! I am **Celebra AI**, your personalized celebration architect.\n\n${
        activeEvent
          ? `I'm currently assisting with **${activeEvent.name}** in ${activeEvent.location} (Budget: ₹${activeEvent.budget.toLocaleString('en-IN')}).`
          : 'How can I assist you with your upcoming celebration today?'
      }\n\nAsk me about budget allocation, signature catering menus, decor hacks, or run-of-show schedules!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendChatMessageAPI({
        message: textToSend.trim(),
        eventContext: activeEvent
          ? {
              name: activeEvent.name,
              eventType: activeEvent.eventType,
              location: activeEvent.location,
              guestCount: activeEvent.guestCount,
              budget: activeEvent.budget,
              themePreference: activeEvent.themePreference,
              foodPreference: activeEvent.foodPreference
            }
          : null,
        history: messages.slice(-4)
      });

      if (!response.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: `asst-err-${Date.now()}`,
            role: 'assistant',
            content: response.error || 'Failed to generate response. Please try again.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isError: true
          }
        ]);
        return;
      }

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAiSource: response.source === 'featherless'
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `asst-err-${Date.now()}`,
          role: 'assistant',
          content: 'I experienced a connection hiccup while analyzing your request. Please try again!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (msg: ChatMessage) => {
    navigator.clipboard.writeText(msg.content);
    setCopiedId(msg.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear current assistant conversation?')) {
      setMessages([
        {
          id: 'welcome-msg-reset',
          role: 'assistant',
          content: 'Chat history cleared. What celebration question can I help you explore next?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl border-l border-stone-200 flex flex-col text-left animate-in slide-in-from-right duration-250">
      {/* Header */}
      <div className="p-4 border-b border-stone-100 bg-[#FAF8F5] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-700 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <h3 className="font-serif text-sm font-bold text-stone-900 flex items-center gap-1.5">
              <span>Celebra AI Assistant</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h3>
            <p className="text-[10px] text-stone-500 truncate max-w-[200px]">
              {activeEvent ? activeEvent.name : 'Context-Aware Event Advisor'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleClearHistory}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors cursor-pointer"
            title="Clear Chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors cursor-pointer"
            title="Close Assistant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Suggested Prompts Carousel */}
      <div className="p-3 bg-stone-50 border-b border-stone-100 overflow-x-auto">
        <div className="flex items-center gap-2 w-max">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-purple-600" />
            Quick Prompts:
          </span>
          {SUGGESTED_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              disabled={isLoading}
              className="text-[11px] font-medium bg-white hover:bg-purple-50 hover:text-purple-900 border border-stone-200/90 hover:border-purple-200 px-2.5 py-1 rounded-full whitespace-nowrap text-stone-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Message History */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed group relative ${
                  isUser
                    ? 'bg-stone-900 text-white rounded-br-xs'
                    : msg.isError
                      ? 'bg-red-50 text-red-800 border border-red-200/80 rounded-bl-xs'
                      : 'bg-[#FAF8F5] text-stone-800 border border-stone-200/80 rounded-bl-xs'
                }`}
              >
                <FormattedMarkdown content={msg.content} isUser={isUser} />

                {!isUser && !msg.isError && (
                  <div className="mt-2.5 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[10px] text-stone-500 font-medium">
                    <span className="flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${msg.isAiSource ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <span>{msg.isAiSource ? 'Featherless AI' : 'Curated Celebration Engine (Demo Mode)'}</span>
                    </span>
                  </div>
                )}

                {/* Micro copy button */}
                <button
                  onClick={() => handleCopyMessage(msg)}
                  className="absolute right-2 bottom-1.5 opacity-0 group-hover:opacity-100 text-stone-400 hover:text-stone-700 transition-opacity p-1 cursor-pointer"
                  title="Copy"
                >
                  {copiedId === msg.id ? (
                    <Check className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>

              <span className="text-[9px] text-stone-400 mt-1 px-1">
                {msg.timestamp}
              </span>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-stone-50 border border-stone-100 text-xs text-stone-600 w-fit">
            <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
            <span>Celebra AI is drafting thoughtful recommendations...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-3.5 border-t border-stone-100 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder={
              activeEvent
                ? `Ask anything about ${activeEvent.name}...`
                : 'Ask anything about celebration planning...'
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:bg-white focus:border-purple-600 outline-hidden transition-all"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 rounded-xl bg-purple-700 hover:bg-purple-800 text-white flex items-center justify-center transition-colors disabled:opacity-40 cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-stone-400 text-center mt-2">
          Requires valid FEATHERLESS_API_KEY • Contextually aware
        </p>
      </div>
    </div>
  );
};
