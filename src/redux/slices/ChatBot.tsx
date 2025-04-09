import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { URL } from "../../utils/Utils";
import { ChatBotState } from "../../types/ChatBotState.type";

const initialState = {
  id: 0,
  isLoading: false,
  query: "",
  title: "",
  result: "",
  timeStamp: "",
  error: null,
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

interface PayloadAction<T> {
  payload: T;
  type: string;
}

interface QueryResponse {
  title: string;
  explanation: string;
}

const chatBotSlice = createSlice({
  name: "chatBot",
  initialState: initialState as ChatBotState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuery.pending, (state: ChatBotState, action) => {
        state.isLoading = true;
        state.id = Date.now(); // Generate unique ID using timestamp
        state.timeStamp = new Date().toISOString();
        state.query = action.meta.arg;
        state.error = null;
      })
      .addCase(
        fetchQuery.fulfilled,
        (state: ChatBotState, action: PayloadAction<QueryResponse>) => {
          state.isLoading = false;
          // state.title = action.payload.title;
          state.result = action.payload;
        }
      )
      .addCase(fetchQuery.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "An error occurred";
      });
  },
});

export default chatBotSlice.reducer;
