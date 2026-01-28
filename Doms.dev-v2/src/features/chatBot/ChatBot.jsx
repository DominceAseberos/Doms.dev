import React, { useRef } from "react";
import { useChat } from "./hooks/useChat";
import { usePortfolioData } from "../../hooks/usePortfolioData";
import { Send, Bot, Sparkles } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const ChatBot = () => {
  const { chatbotConfig } = usePortfolioData();
  const { messages, input, setInput, sendMessage, isTyping, chatContainerRef, suggestions } = useChat();
  const componentRef = useRef(null);

  const { contextSafe } = useGSAP({ scope: componentRef });

  const onChipEnter = contextSafe((e) => {
    gsap.to(e.currentTarget, {
      scale: 1.1,
      rotate: -3,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      color: "#ffffff",
      duration: 0.3,
      ease: "power2.out"
    });
  });

  const onChipLeave = contextSafe((e) => {
    gsap.to(e.currentTarget, {
      scale: 1,
      rotate: 0,
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      color: "rgba(156, 163, 175, 1)", // gray-300
      duration: 0.3,
      ease: "power2.out"
    });
  });

  const onSendEnter = contextSafe((e) => {
    gsap.to(e.currentTarget, { scale: 1.1, duration: 0.3, ease: "power2.out" });
  });

  const onSendLeave = contextSafe((e) => {
    gsap.to(e.currentTarget, { scale: 1, duration: 0.3, ease: "power2.out" });
  });

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      ref={componentRef}
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
      <div className="p-4 border-b border-white/10 bg-black/20 backdrop-blur-md flex-none animate-item">
        <p className="text-white font-black tracking-tight font-playfair text-xl flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-400" /> {chatbotConfig.botName}
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
              className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-300 ${msg.sender === "user"
                ? "bg-[rgba(var(--contrast-rgb))] text-black rounded-br-none"
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
      <div className="bg-black/20 backdrop-blur-md border-t border-white/10 flex-none flex flex-col animate-item">

        {/* Chips Row - Horizontal Scroll */}
        <div className="flex gap-2 p-2 overflow-x-auto no-scrollbar mask-gradient">
          {suggestions.map((chip) => (
            <button
              key={chip}
              onClick={() => sendMessage(chip)}
              onMouseEnter={onChipEnter}
              onMouseLeave={onChipLeave}
              disabled={isTyping}
              className="flex-none px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-wider uppercase text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Row */}
        <div className="p-3 pt-2 flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
            placeholder={isTyping ? "Waiting for response..." : "Ask about my projects..."}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white font-inter text-sm placeholder-white/40 focus:outline-none focus:ring-1 transition-all duration-200 focus:ring-[rgba(var(--contrast-rgb))] disabled:opacity-50"
          />
          <button
            onClick={() => sendMessage()}
            onMouseEnter={onSendEnter}
            onMouseLeave={onSendLeave}
            disabled={!input.trim() || isTyping}
            className="p-2 bg-[rgba(var(--contrast-rgb))] text-black rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;