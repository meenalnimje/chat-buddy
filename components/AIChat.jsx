"use client";

import { ToastBar } from "react-hot-toast";
import TopBar from "./TopBar";
import { useState } from "react";

const AIChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message to chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", text: input },
    ]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chats/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Add AI model's response with formatted content
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "model", text: formatAIResponse(data.response) },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to format AI response (adding line breaks, bullet points, etc.)
  const formatAIResponse = (response) => {
    // Example formatting logic: Adding line breaks and bullet points
    return response
      .replace(/\* /g, "• ") // Replaces markdown-like bullet points with actual bullet points
      .replace(/\n/g, "<br>"); // Adds line breaks for better readability
  };

  return (
    <>
      <div className="fixed inset-1/4 h-3/4 bg-white border border-gray-300 shadow-lg flex flex-col  rounded-xl mx-auto  -mt-11 ">
        <div className="ai-chat-header bg-custom-green text-green-900 p-4 rounded-t-lg text-lg font-semibold">
          AI Chat
        </div>
        <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 ${
                msg.role === "user" ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block p-2 rounded-lg ${
                  msg.role === "user"
                    ? "bg-green-800 text-white"
                    : "bg-gray-200"
                }`}
                dangerouslySetInnerHTML={{ __html: msg.text }}
              />
            </div>
          ))}

          {loading && (
            <div className="text-center text-green-800 text-body-bold">
              AI is thinking....
            </div>
          )}
        </div>
        <div className="p-4 border-t border-gray-300 bg-white flex items-center rounded-br-lg rounded-bl-lg">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border border-gray-300 rounded-lg"
          />
          <button
            onClick={handleSendMessage}
            className="ml-2 px-4 py-2 bg-green-800 text-white rounded-lg hover:bg-green-900"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default AIChat;
