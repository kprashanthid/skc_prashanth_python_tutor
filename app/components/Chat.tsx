"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

type Message = { text: string; sender: "user" | "ai" | "system" };

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    scrollToBottom();
    return () => {
      isMounted.current = false;
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // ... other imports and code

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const newMessages: Message[] = [
      ...messages,
      { text: input, sender: "user" },
      { text: "⏳ Thinking...", sender: "system" },
    ];

    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await axios.post<{ response: string }>("/api/chat", {
        message: input,
      });

      // Add the AI message with fallback here
      const aiMessage: Message = {
        text:
          res.data.response ||
          "I'm not sure how to answer that. Could you ask differently?",
        sender: "ai",
      };

      if (isMounted.current) {
        setMessages((prev) => [
          ...prev.filter((msg) => msg.sender !== "system"),
          aiMessage, // Use the defined message here
        ]);
        scrollToBottom();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // ... rest of the component

  return (
    <div className="max-w-lg mx-auto mt-6 p-4 border rounded-lg shadow-md bg-white">
      <div className="h-64 overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 my-2 rounded ${
              msg.sender === "user"
                ? "bg-blue-100 ml-8 text-right"
                : msg.sender === "ai"
                ? "bg-gray-100 mr-8"
                : "bg-yellow-100 italic"
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 p-2 border rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a Python question..."
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          disabled={isLoading}
        />
        <button
          className={`px-4 py-2 rounded ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
          onClick={sendMessage}
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
