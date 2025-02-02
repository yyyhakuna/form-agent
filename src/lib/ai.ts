// import { OpenAI } from "openai";
// import { createEmbedding } from "./embeddings";

// export async function semanticFieldMapping(formFields: any[], userData: any) {
//   const openai = new OpenAI();

//   // 为每个表单字段创建嵌入
//   const formFieldEmbeddings = await Promise.all(
//     formFields.map((field) =>
//       createEmbedding(`${field.fieldLabel} ${field.fieldType}`)
//     )
//   );

//   // 为用户数据字段创建嵌入
//   const userDataEmbeddings = await Promise.all(
//     Object.entries(userData).map(([key, value]) =>
//       createEmbedding(`${key} ${typeof value}`)
//     )
//   );

//   // 使用 GPT 进行字段匹配
//   const completion = await openai.chat.completions.create({
//     model: "gpt-4",
//     messages: [
//       {
//         role: "system",
//         content: "你是一个专门负责匹配表单字段和用户数据的助手。",
//       },
//       {
//         role: "user",
//         content: JSON.stringify({
//           formFields,
//           userData,
//           formFieldEmbeddings,
//           userDataEmbeddings,
//         }),
//       },
//     ],
//   });

//   return JSON.parse(completion.choices[0].message.content);
// }
