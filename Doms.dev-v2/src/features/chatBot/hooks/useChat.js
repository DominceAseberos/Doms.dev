// src/features/chat/useChat.js
import { useState, useRef, useEffect } from "react";
import { getBotResponse } from "../data/portfolioData";

export const useChat = () => {
  // Initial bot welcome message
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm an AI assistant. Ask me anything about my portfolio.",
      sender: "bot",
    },
  ]);
  
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // Ref to automatically scroll to the bottom
  const endRef = useRef(null);

  const sendMessage = () => {
    if (!input.trim()) return;

    // 1. Add User Message
    const userMessage = {
      id: Date.now(),
      text: input,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // 2. Simulate AI Delay & Response
    setTimeout(() => {
      const responseText = getBotResponse(userMessage.text);
      
      const botMessage = {
        id: Date.now() + 1,
        text: responseText,
        sender: "bot",
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000); // 1 second delay for realism
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return {
    messages,
    input,
    setInput,
    sendMessage,
    isTyping,
    endRef,
  };
};