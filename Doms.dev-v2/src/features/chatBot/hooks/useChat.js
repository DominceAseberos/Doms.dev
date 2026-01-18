// src/features/chat/hooks/useChat.js
import { useState, useRef, useEffect } from "react";
import { PORTFOLIO_CONTEXT } from "../data/portfolioData";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// 1. Define the Master List of all possible suggestions
const ALL_SUGGESTIONS = [
  "Tech Stack",
  "Show Projects",
  "Contact Info",
  "About You",
  "Education",      // New
  "GitHub Link",    // New
  "Work Experience",// New
  "Soft Skills"     // New
];

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
  
  // 2. State for visible suggestions (Start with first 4)
  const [displayedSuggestions, setDisplayedSuggestions] = useState(ALL_SUGGESTIONS.slice(0, 4));
  // 3. Keep track of the next available index in the Master List
  const [nextSuggestionIndex, setNextSuggestionIndex] = useState(4);

  const chatContainerRef = useRef(null);
  const historyRef = useRef([]);

  const sendMessage = async (textOverride = null) => {
    if (isTyping) return;

    const messageText = (typeof textOverride === "string" ? textOverride : input).trim();
    if (!messageText) return;

    // --- NEW LOGIC: Suggestion Replacement ---
    // If the message sent matches a currently visible suggestion, replace it.
    if (displayedSuggestions.includes(messageText)) {
      setDisplayedSuggestions((prev) => {
        // Remove the clicked suggestion
        const remaining = prev.filter((s) => s !== messageText);
        
        // If there are more items in the master list, add the next one
        if (nextSuggestionIndex < ALL_SUGGESTIONS.length) {
          const nextItem = ALL_SUGGESTIONS[nextSuggestionIndex];
          setNextSuggestionIndex((i) => i + 1); // Increment index for next time
          return [...remaining, nextItem];
        }
        
        // If no more items in master list, just return the remaining ones
        return remaining;
      });
    }
    // -----------------------------------------

    const userMessage = {
      id: Date.now().toString(),
      text: messageText,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

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
      setIsTyping(false);
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

  return { 
    messages, 
    input, 
    setInput, 
    sendMessage, 
    isTyping, 
    chatContainerRef,
    suggestions: displayedSuggestions // Return the dynamic list
  };
};