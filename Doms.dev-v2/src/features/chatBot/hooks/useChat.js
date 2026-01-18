// src/features/chat/hooks/useChat.js
import { useState, useRef, useEffect } from "react";
import { PORTFOLIO_CONTEXT } from "../data/portfolioData";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const useChat = () => {
  const [messages, setMessages] = useState([
    {
      id: "init",
      text: "Hi! I'm an AI assistant. Ask me anything about my portfolio.",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);
  const historyRef = useRef([]);

  // CHANGED: Accept 'textOverride' for the suggestion chips
  const sendMessage = async (textOverride = null) => {
    
    // 1. PREVENT DUPLICATES: If already waiting for AI, ignore clicks/enters
    if (isTyping) return;

    // Determine what text to send (Input field OR Chip text)
    const messageText = (typeof textOverride === "string" ? textOverride : input).trim();
    
    // If empty, do nothing
    if (!messageText) return;

    const userMessage = {
      id: Date.now().toString(),
      text: messageText,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput(""); // Clear input bar even if chip was clicked
    setIsTyping(true); // Lock the chat

    historyRef.current.push({ role: "user", parts: [{ text: messageText }] });

    try {
      const MODEL_NAME = "gemini-flash-latest"; 
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: PORTFOLIO_CONTEXT }] 
              },
              ...historyRef.current 
            ]
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || `API Error: ${response.status}`);
      }

      const botResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";

      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponseText,
        sender: "bot",
      };
      
      setMessages((prev) => [...prev, botMessage]);
      historyRef.current.push({ role: "model", parts: [{ text: botResponseText }] });

    } catch (error) {
      console.error("AI Detailed Error:", error);
      const isRateLimit = error.message.includes("429");
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: isRateLimit 
          ? "Please slow down, I'm thinking too fast!" 
          : "I'm having trouble connecting. Try again.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false); // Unlock the chat
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current;
      chatContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isTyping]);

  return { messages, input, setInput, sendMessage, isTyping, chatContainerRef };
};