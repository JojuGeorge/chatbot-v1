import { Chat } from "../types/Chat.type";

export function SortChat(chats: Chat[]) {
  return [...chats].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
