// src/features/chat/ChatBot.jsx
import React from "react";
import { useChat } from "./hooks/useChat"; 
import { Send, Bot, Sparkles } from "lucide-react"; 

const ChatBot = () => {
  const { messages, input, setInput, sendMessage, isTyping, chatContainerRef } = useChat();

  const handleKeyDown = (e) => {
    // PREVENT DUPLICATE: Check isTyping before sending
    if (e.key === "Enter" && !isTyping) {
      sendMessage();
    }
  };

  // Suggestion Chips Data
  const suggestions = [
    "My Tech Stack",
    "Show Projects",
    "Contact Info",
    "About You"
  ];

  return (
    <div
      className="rounded-2xl w-full h-full max-h-full flex flex-col overflow-hidden shadow-xl border border-white/20"
      style={{
        background: `linear-gradient(
             to bottom,
             rgba(var(--box-Linear-1-rgb)),
             rgba(var(--box-Linear-2-rgb))
        )`,
      }}
    >
      {/* 1. Header */}
      <div className="p-4 border-b border-white/10 bg-black/20 backdrop-blur-md flex-none">
        <p className="text-white font-bold flex items-center gap-2">
          <Bot className="w-5 h-5" /> Portfolio AI
        </p>
      </div>

      {/* 2. Messages Area */}
      <div 
        ref={chatContainerRef} 
        className="flex-1 overflow-y-auto min-h-0 p-4 space-y-4 scroll-smooth scrollbar-custom"
        style={{ scrollbarColor: "rgb(var(--contrast-rgb)) transparent", scrollbarWidth: "thin" }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                msg.sender === "user"
                  ? "bg-[rgba(var(--contrast-rgb))] text-white rounded-br-none"
                  : "bg-white/10 text-gray-100 backdrop-blur-sm rounded-bl-none border border-white/10"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/10 p-3 rounded-2xl rounded-bl-none animate-pulse flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-xs text-gray-300">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* 3. Suggestion Chips & Input Area */}
      <div className="bg-black/20 backdrop-blur-md border-t border-white/10 flex-none flex flex-col">
        
        {/* Chips Row - Horizontal Scroll */}
        <div className="flex gap-2 p-2 overflow-x-auto no-scrollbar mask-gradient">
          {suggestions.map((chip) => (
            <button
              key={chip}
              onClick={() => sendMessage(chip)} // Click triggers immediate send
              disabled={isTyping} // Disable chips while thinking
              className="flex-none px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-200 hover:bg-white/20 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Row */}
        <div className="p-3 pt-0 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping} // Disable typing while thinking
            placeholder={isTyping ? "Waiting for response..." : "Ask about my projects..."}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isTyping} // Disable if empty OR typing
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