import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { URL, CHAT_HISTORY, NEW_TITLE, QUERY_OUTLINE } from "../../utils/Utils";
import { Message, Chat, ChatState } from "../../types/Chat.type";
import { isSameDate } from "../../utils/IsSameDate";

// Helper function to load initial state from localStorage
const loadState = (): ChatState => {
  try {
    const serializedState = localStorage.getItem(CHAT_HISTORY);
    if (serializedState === null) {
      // No state found, return default initial state
      return {
        chats: [],
        currentChatId: null,
        isLoading: false,
      };
    }
    const parsedState = JSON.parse(serializedState) as Chat[];
    // Set currentChatId to the latest chat or null if empty
    const currentChatId = parsedState.length > 0 ? parsedState[0].chatId : null;
    return {
      chats: parsedState,
      currentChatId: currentChatId, // Initialize currentChatId based on loaded state
      isLoading: false,
    };
  } catch (err) {
    console.error("Could not load state from localStorage", err);
    // Return default initial state in case of error
    return {
      chats: [],
      currentChatId: null,
      isLoading: false,
    };
  }
};

// Use loadState to initialize
const initialState = loadState();

// Create payload for URL Options
const createPayload = (userQuery: string) => ({
  contents: [
    {
      parts: [
        {
          text: QUERY_OUTLINE + userQuery,
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
      // Handle potential variations in response structure safely
      const candidates = result.data?.candidates;
      if (
        candidates &&
        candidates.length > 0 &&
        candidates[0].content?.parts?.length > 0
      ) {
        const response = candidates[0].content.parts[0].text;
        const responseText = response.substring(
          response.indexOf("{"),
          response.lastIndexOf("}") + 1
        );
        console.log(responseText);
        const parsedResponse = JSON.parse(responseText);
        console.log(parsedResponse);
        return parsedResponse;
      } else {
        console.error("Unexpected response structure:", result.data);
        throw new Error("Failed to parse response from API.");
      }
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
      // check if already a chat with empty msg[] present
      // to avoid infinite new chat creation
      if (state?.chats[0]?.messages.length > 0) {
        const newChat: Chat = {
          chatId: "chat_" + crypto.randomUUID(),
          title: NEW_TITLE,
          createdAt: new Date().toISOString(),
          messages: [],
        };
        state.chats.unshift(newChat);
        state.currentChatId = newChat.chatId;
        state.isLoading = false;
      } else {
        state.currentChatId = state?.chats[0]?.chatId;
      }
    },
    deleteChat: (state, action) => {
      const idToDelete = action.payload;
      state.chats = state.chats.filter((chat) => chat.chatId !== idToDelete);

      if (state.currentChatId === idToDelete) {
        state.currentChatId =
          state.chats.length > 0 ? state.chats[0].chatId : null;
      }
    },
    clearChatHistory: (state) => {
      state.chats = [];
      state.currentChatId = null;
      state.isLoading = false;
    },
    setCurrentChatId: (state, action) => {
      state.currentChatId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuery.pending, (state, action) => {
        state.isLoading = true;
        const today = new Date().toISOString();
        const userQuery = action.meta.arg;

        // Find if a chat for today already exists
        // let todayChat = state.chats.find(chat => isSameDate(chat.createdAt, today));

        let todayChat;
        if (state.currentChatId) {
          todayChat = state.chats.find(
            (chat) => chat.chatId === state.currentChatId
          );
        } else {
          todayChat = state.chats.find((chat) =>
            isSameDate(chat.createdAt, today)
          );
          todayChat = state.chats.find((chat) =>
            isSameDate(chat.createdAt, today)
          );
        }
        if (!todayChat) {
          // Create a new chat for today if none exists
          const newChatEntry: Chat = {
            chatId: "chat_" + crypto.randomUUID(),
            title: NEW_TITLE,
            createdAt: today,
            messages: [],
          };
          state.chats.push(newChatEntry);
          todayChat = newChatEntry; // Use the newly created chat
        }

        // Set currentChatId to today's chat
        state.currentChatId = todayChat.chatId;

        // Add the user message placeholder
        const newMessage: Message = {
          msgId: "msg_" + crypto.randomUUID(),
          query: userQuery,
          result: "", // Result will be filled in fulfilled/rejected
          error: null,
        };
        todayChat.messages.push(newMessage); // Add message to today's chat
      })
      .addCase(fetchQuery.fulfilled, (state, action) => {
        state.isLoading = false;
        // currentChatId should be set correctly by the pending reducer
        const currentChat = state.chats.find(
          (chat) => chat.chatId === state.currentChatId
        );

        if (currentChat) {
          if (currentChat.title === NEW_TITLE) {
            currentChat.title = action.payload.title;
          }
        }

        if (currentChat && currentChat.messages.length > 0) {
          // Update the last message (which was added in pending)
          const lastMessage =
            currentChat.messages[currentChat.messages.length - 1];
          lastMessage.result = action.payload.explanation;
          lastMessage.error = null; // Clear any previous error
        }
      })
      .addCase(fetchQuery.rejected, (state, action) => {
        state.isLoading = false;
        // currentChatId should be set correctly by the pending reducer
        const currentChat = state.chats.find(
          (chat) => chat.chatId === state.currentChatId
        );

        if (currentChat && currentChat.messages.length > 0) {
          // Update the last message (which was added in pending)
          const lastMessage =
            currentChat.messages[currentChat.messages.length - 1];
          lastMessage.result = ""; // Clear result on error
          lastMessage.error = action.error.message || "An error occured";
        }
      });
  },
});

export const { newChat, deleteChat, clearChatHistory, setCurrentChatId } =
  chatBotSlice.actions;

export default chatBotSlice.reducer;
