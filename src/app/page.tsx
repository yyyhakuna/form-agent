"use client";

import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import OpenAI from "openai";
import { Assistant } from "openai/resources/beta/assistants.mjs";
import { Thread } from "openai/resources/beta/index.mjs";
import { createAssistant } from "@/lib/openai/createAssistant";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { createThread } from "@/lib/openai/createThread";
import { z } from "zod";
import { ToolCall } from "openai/resources/beta/threads/runs/steps.mjs";

import { Tool, tool } from "@langchain/core/tools";
import { ChatMessage } from "@/types";

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const openAIModel = new ChatOpenAI({
    model: "deepseek-chat",
    temperature: 0,
    apiKey: "sk-e7654c2147dd44c0af11a686408e9350",
    configuration: {
      baseURL: "https://api.deepseek.com",
    },
  });

  const magicTool = tool(
    async ({ input }: { input: string }) => {
      console.log(input);

      const w = window.open(
        `https://www.google.com/search?q=${encodeURIComponent(input)}`
      );

      return `I've searched ${input} for you`;
    },

    {
      name: "search",
      description: "Search something for the user when explicitly requested",
      schema: z.object({
        input: z.string(),
      }),
    }
  );

  const modalWithTool = openAIModel.bindTools([magicTool]);

  const { mutate: sendMessage, isPending: isSending } = useMutation({
    mutationFn: async (message: string) => {
      const requestBody = {
        model: "deepseek-chat",
        temperature: 0,
        n: 1,
        stream: false,
        parallel_tool_calls: false, // Your desired setting
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
        search_enabled: true, // Adding search_enabled here in the request body
      };
      const res = await modalWithTool.invoke(message, {
        parallel_tool_calls: false,
        options: {
          // search_enabled: true,
        },
      });
      if (res.tool_calls?.length) {
        return magicTool.invoke({ input: res.tool_calls[0].args.input });
      } else {
        return res.content;
      }
    },
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data,
          createdAt: new Date(),
        },
      ]);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入你的问题..."
          className="flex-1 p-2 border rounded-lg"
          // disabled={sendMessage.isPending}
        />
        <button
          type="submit"
          // disabled={sendMessage.isPending}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-blue-300"
        >
          发送
        </button>
      </form>
    </div>
  );
}
