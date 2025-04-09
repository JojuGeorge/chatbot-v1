export interface Message {
  msgId: string;
  isLoading: boolean;
  query: string;
  result: string;
  error: null | string;
}

export interface Chat {
  chatId: string;
  title: string;
  createdAt: string;
  messages: Message[];
}

export interface ChatState {
  chats: Chat[];
  currentChatId: string | null;
}
