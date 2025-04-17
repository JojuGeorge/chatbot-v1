import { GEMINI_API } from "./APIKey";

export const URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
  GEMINI_API;

export const CHAT_HISTORY = "chatHistory";

export const NEW_TITLE = "New Chat";
export const QUERY_OUTLINE = `
Task:
Return a JSON response with two properties:

1. title : 
If the query is ≤5 words, use the exact query as the title.
If the query is >5 words, summarize it in <5 words for the title.

2. explanation : 
Always provide a detailed explanation of the query in this property. 
Human like conversation.
Query: `;

export const TODAY = "Today";
export const YESTERDAY = "Yesterday";
export const PREV7DAYS = "Previous 7 Days";
export const PREV30DAYS = "Previous 30 Days";
