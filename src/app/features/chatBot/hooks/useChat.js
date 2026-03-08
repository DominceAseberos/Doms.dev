import { useState, useRef, useEffect } from "react";
import { generatePortfolioContext } from "../utils/contextHelper";
import { usePortfolioData } from "@shared/hooks/usePortfolioData";

// Secure: API keys are now stored server-side in Supabase Edge Function
const EDGE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-ai`;

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

    const isSubmittingRef = useRef(false);

    const sendMessage = async (textOverride = null) => {
        // Prevent double submission via Ref (synchronous)
        if (isSubmittingRef.current || isTyping) return;

        const messageText = (typeof textOverride === "string" ? textOverride : input).trim();
        if (!messageText) return;

        // Lock immediately
        isSubmittingRef.current = true;
        setIsTyping(true);

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
        historyRef.current.push({ role: "user", content: messageText });

        // --- 3-LEVEL WATERFALL FALLBACK ---
        try {
            if (import.meta.env.DEV) console.log("🚀 Level 1: Attempting Gemini...");
            const botResponse = await tryGemini(messageText);
            addBotMessage(botResponse);
        }
        catch (_geminiError) {
            console.warn("⚠️ Gemini failed, attempting fallback:", _geminiError);
            if (import.meta.env.DEV) console.warn("⚠️ Gemini failed. Switching to Level 2: Mistral...");
            try {
                const mistralResponse = await tryOpenRouter("mistralai/devstral-2512:free");
                addBotMessage(mistralResponse);
            }
            catch (_mistralError) {
                if (import.meta.env.DEV) console.warn("⚠️ Mistral failed. Switching to Level 3: DeepSeek R1...");
                try {
                    const r1Response = await tryOpenRouter("deepseek/deepseek-r1-0528:free");
                    addBotMessage(r1Response);
                }
                catch (_r1Error) {
                    if (import.meta.env.DEV) console.error("❌ All models failed.");
                    addBotMessage("I'm currently resting my brain. Please try again in a minute!");
                }
            }
        } finally {
            setIsTyping(false);
            isSubmittingRef.current = false;
        }
    };


    // Helper: Gemini Call via Edge Function (Secure)
    const tryGemini = async (text) => {
        const response = await fetch(EDGE_FUNCTION_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({
                model: "gemini",
                message: text,
                context: PORTFOLIO_CONTEXT
            })
        });
        if (!response.ok) throw new Error(`Gemini ${response.status}`);
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    };


    // Helper: OpenRouter Call via Edge Function (Secure)
    const tryOpenRouter = async (modelId) => {
        const response = await fetch(EDGE_FUNCTION_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({
                model: modelId,
                history: historyRef.current
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
