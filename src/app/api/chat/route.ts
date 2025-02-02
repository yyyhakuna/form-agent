import OpenAI from "openai";
import { createThread } from "@/lib/openai/createThread";
import { createAssistant } from "@/lib/openai/createAssistant";

const openai = new OpenAI();

export async function POST(req: Request) {
  try {
    const { message, threadId, assistantId } = await req.json();
    const client = new OpenAI({
      apiKey: "sk-d2a6a04db0404ff9bbfb16b158a4e3f5",
      dangerouslyAllowBrowser: true,
      baseURL: "https://api.deepseek.com",
    });
    // console.log(message, threadId, assistantId);
    const assistant = await createAssistant(client);
    console.log(assistant);

    // setAssistant(assistant);

    // 创建新的thread并发送消息

    // 创建run

    // const run = await openai.beta.threads.runs.create(threadId, {
    //   assistant_id: assistantId,
    // });

    // 等待run完成
    // let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
    // while (runStatus.status !== "completed") {
    //   await new Promise((resolve) => setTimeout(resolve, 1000));
    //   runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
    // }

    // 获取最新消息
    const messages = await openai.beta.threads.messages.list(threadId);
    const lastMessage = messages.data[0];
    console.log(lastMessage);

    return Response.json({
      // content: lastMessage.content[0].text.value,
    });
  } catch (error) {
    console.error("Chat error:", error);
    return Response.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}
