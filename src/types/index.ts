import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

export interface Tool {
  definition: {
    type: "function";
    function: {
      name: string;
      description: string;
      parameters: {
        type: "object";
        properties: Record<string, any>;
        required?: string[];
      };
    };
  };
  execute: (args: any) => Promise<any>;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}
