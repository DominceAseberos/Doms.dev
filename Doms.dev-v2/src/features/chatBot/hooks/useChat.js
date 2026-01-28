import { useState, useRef, useEffect } from "react";
import { generatePortfolioContext } from "../utils/contextHelper";
import { usePortfolioData } from "../../../hooks/usePortfolioData";

const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const OPENROUTER_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

export const useChat = () => {
  const { chatbotConfig, chatSuggestions: ALL_SUGGESTIONS } = usePortfolioData();
  const PORTFOLIO_CONTEXT = generatePortfolioContext();

  const [messages, setMessages] = useState([
    { id: "init", text: `Hi! I'm ${chatbotConfig.botName}. Ask me anything about Doms!`, sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);

  // Suggestion logic
  const suggestionsList = Array.isArray(ALL_SUGGESTIONS) ? ALL_SUGGESTIONS : [];
  const [displayedSuggestions, setDisplayedSuggestions] = useState(suggestionsList.slice(0, 4));
  const [nextSuggestionIndex, setNextSuggestionIndex] = useState(4);


  // History for OpenRouter models
  const historyRef = useRef([{ role: "system", content: PORTFOLIO_CONTEXT }]);

  const sendMessage = async (textOverride = null) => {
    if (isTyping) return;
    const messageText = (typeof textOverride === "string" ? textOverride : input).trim();
    if (!messageText) return;

    // Suggestion logic replacement
    if (displayedSuggestions.includes(messageText)) {
      setDisplayedSuggestions((prev) => {
        const remaining = prev.filter((s) => s !== messageText);
        if (nextSuggestionIndex < ALL_SUGGESTIONS.length) {
          const nextItem = ALL_SUGGESTIONS[nextSuggestionIndex];
          setNextSuggestionIndex((i) => i + 1);
          return [...remaining, nextItem];
        }
        return remaining;
      });
    }


    setMessages((prev) => [...prev, { id: Date.now().toString(), text: messageText, sender: "user" }]);
    setInput("");
    setIsTyping(true);
    historyRef.current.push({ role: "user", content: messageText });

    // --- 3-LEVEL WATERFALL FALLBACK ---
    try {
      console.log("🚀 Level 1: Attempting Gemini...");
      const botResponse = await tryGemini(messageText);
      addBotMessage(botResponse);
    }
    catch (_geminiError) {
      console.warn("⚠️ Gemini failed. Switching to Level 2: Mistral...");
      try {
        const mistralResponse = await tryOpenRouter("mistralai/devstral-2512:free");
        addBotMessage(mistralResponse);
      }
      catch (_mistralError) {
        console.warn("⚠️ Mistral failed. Switching to Level 3: DeepSeek R1...");
        try {
          const r1Response = await tryOpenRouter("deepseek/deepseek-r1-0528:free");
          addBotMessage(r1Response);
        }
        catch (_r1Error) {
          console.error("❌ All models failed.");
          addBotMessage("I'm currently resting my brain. Please try again in a minute!");
        }
      }
    } finally {
      setIsTyping(false);
    }
  };


  // Helper: Gemini Call (Fastest)
  const tryGemini = async (text) => {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: PORTFOLIO_CONTEXT + "\n\nUser: " + text }] }]
      })
    });
    if (!response.ok) throw new Error(`Gemini ${response.status}`);
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  };


  // Helper: OpenRouter Call (Mistral or DeepSeek)
  const tryOpenRouter = async (modelId) => {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_KEY}`,
        "Content-Type": "application/json",
        "X-Title": "Portfolio Assistant"
      },
      body: JSON.stringify({
        "model": modelId,
        "messages": historyRef.current
      })
    });
    if (!response.ok) throw new Error(`OpenRouter ${response.status}`);
    const data = await response.json();
    return data.choices[0].message.content;
  };

  const addBotMessage = (text) => {
    setMessages((prev) => [...prev, { id: Date.now().toString(), text, sender: "bot" }]);
    historyRef.current.push({ role: "assistant", content: text });
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isTyping]);

  return { messages, input, setInput, sendMessage, isTyping, chatContainerRef, suggestions: displayedSuggestions };
};