import OpenAI from "openai";
import { Assistant } from "openai/resources/beta/assistants";
// import { tools } from '../tools/allTools.js';
// import { assistantPrompt } from "../const/prompt.js";

export async function createAssistant(client: OpenAI): Promise<Assistant> {
  const assistantPrompt = `你是一个专业的求职和留学申请助手。你的主要职责是：
1. 帮助用户填写各类申请表单
2. 根据用户的个人信息优化申请内容
3. 提供专业的建议和指导

请记住：
- 始终保持专业和友好的态度
- 在需要填写表单时，使用相应的工具函数
- 确保所有信息的准确性和完整性`;

  return await client.beta.assistants.create({
    model: "gpt-4o-mini",
    name: "Alt",
    instructions: assistantPrompt,
    // tools: Object.values(tools).map((tool) => tool.definition),
  });
}
