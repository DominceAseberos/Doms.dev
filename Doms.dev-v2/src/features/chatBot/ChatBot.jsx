// src/features/chat/ChatBot.jsx
import React from "react";
import { useChat } from "./hooks/useChat"; 
import { Send, Bot } from "lucide-react"; 

const ChatBot = () => {
  const { messages, input, setInput, sendMessage, isTyping, endRef } = useChat();

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div
      className="rounded-2xl w-full h-full flex flex-col overflow-hidden shadow-xl border border-white/20"
      style={{
        background: `linear-gradient(
             to bottom,
             rgba(var(--box-Linear-1-rgb)),
             rgba(var(--box-Linear-2-rgb))
        )`,
      }}
    >
      <div className="p-4 border-b border-white/10 bg-black/20 backdrop-blur-md flex-none">
        <p className="text-white font-bold flex items-center gap-2">
          <Bot className="w-5 h-5" /> Portfolio AI
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 scroll-smooth custom-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-white/10 text-gray-100 backdrop-blur-sm rounded-bl-none border border-white/10"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/10 p-3 rounded-2xl rounded-bl-none animate-pulse">
              <span className="text-xs text-gray-300">Thinking...</span>
            </div>
          </div>
        )}
        
        {/* Invisible anchor for auto-scroll */}
        <div ref={endRef} />
      </div>

      <div className="p-3 bg-black/20 backdrop-blur-md border-t border-white/10 flex-none">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about my projects..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;