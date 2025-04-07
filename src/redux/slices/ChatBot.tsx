import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { URL } from "../../utils/Utils";
import { ChatBotState } from "../../types/ChatBotState.type";

const initialState = {
  id: 0,
  isLoading: false,
  query: "",
  result: "",
  timeStamp: "",
  error: null,
};

// Create payload for URL Options
const createPayload = (userQuery: string) => ({
  contents: [
    {
      parts: [{ text: userQuery }],
    },
  ],
});

export const fetchQuery = createAsyncThunk(
  "chatbot/fetchQuery",
  async (query: string) => {
    // try {
    const result = await axios.post(URL, createPayload(query), {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(result.data);
    const responseText = result.data.candidates[0].content.parts[0].text;
    console.log(responseText);
    return responseText;
    // } catch (err) {
    //   const error = err as AxiosError;
    //   return error.message || "An error occurred";
    // }
  }
);

// interface ChatBotState {
//   id: number;
//   isLoading: boolean;
//   query: string;
//   result: string;
//   timeStamp: string;
//   error: string | null;
// }

interface PayloadAction<T> {
  payload: T;
  type: string;
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
        (state: ChatBotState, action: PayloadAction<string>) => {
          state.isLoading = false;
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
