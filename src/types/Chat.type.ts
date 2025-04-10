export interface Message {
  msgId: string;
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
  isLoading: boolean;
}

// const chatBot = {
//   chats: [
//     {
//       chatId: "",
//       title: "",
//       createdAt: "",
//       messages: [
//         {
//           msgId: "",
//           query: "",
//           resutl: "",
//           error: "",
//         },
//       ],
//     },
//   ],
//   currentChatId: "",
//   isLoading: false,
// };
