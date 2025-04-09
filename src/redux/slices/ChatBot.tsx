import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { URL } from "../../utils/Utils";
import { Message, Chat, ChatState } from "../../types/Chat.type";

const initialState = {
  chats: [
    {
      chatId: "chat_" + crypto.randomUUID(),
      title: "",
      createdAt: new Date().toISOString(),
      messages: [],
    },
  ],
  currentChatId: "",
};

// Create payload for URL Options
const createPayload = (userQuery: string) => ({
  contents: [
    {
      parts: [
        {
          text: userQuery,
        },
      ],
    },
  ],
});

export const fetchQuery = createAsyncThunk(
  "chatbot/fetchQuery",
  async (query: string) => {
    try {
      const result = await axios.post(URL, createPayload(query), {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Raw response:", result.data);
      const responseText = result.data.candidates[0].content.parts[0].text;
      return responseText;
    } catch (error) {
      console.error("Fetch query error:", error);
      throw error;
    }
  }
);

const chatBotSlice = createSlice({
  name: "chatBot",
  initialState: initialState as ChatState,
  reducers: {
    newChat: (state) => {
      const newChat: Chat = {
        chatId: "chat_" + crypto.randomUUID(),
        title: "",
        createdAt: new Date().toISOString(),
        messages: [],
      };
      state.chats.push(newChat);
      state.currentChatId = newChat.chatId;
    },
    deleChat: (state, action) => {
      const idToDelete = action.payload;
      state.chats = state.chats.filter((chat) => chat.chatId !== idToDelete);

      if (state.currentChatId == idToDelete) {
        state.currentChatId = null;
      }
    },
    clearChatHistory: (state) => {
      state.chats = [];
      state.currentChatId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuery.pending, (state, action) => {
        if (state.currentChatId) {
          const currentChat = state.chats.find(
            (chat) => chat.chatId === state.currentChatId
          );
          if (currentChat) {
            const newMessage = {
              msgId: "msg_" + crypto.randomUUID(),
              isLoading: true,
              query: action.meta.arg,
              result: "",
              error: null,
            };

            currentChat.messages.push(newMessage);
          }
        }
      })
      .addCase(fetchQuery.fulfilled, (state, action) => {
        if (state.currentChatId) {
          const currentChat = state.chats.find(
            (chat) => chat.chatId === state.currentChatId
          );

          if (currentChat && currentChat.messages.length > 0) {
            const lastMessage =
              currentChat.messages[currentChat.messages.length - 1];
            lastMessage.isLoading = false;
            lastMessage.result = action.payload;
          }
        }
      })
      .addCase(fetchQuery.rejected, (state, action) => {
        if (state.currentChatId) {
          const currentChat = state.chats.find(
            (chat) => chat.chatId === state.currentChatId
          );

          if (currentChat && currentChat.messages.length > 0) {
            const lastMessage =
              currentChat.messages[currentChat.messages.length - 1];
            lastMessage.isLoading = false;
            lastMessage.result = "";
            lastMessage.error = action.error.message || "An error occured";
          }
        }
      });
  },
});

export default chatBotSlice.reducer;
