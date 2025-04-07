export type ChatBotState = {
  id: number;
  isLoading: boolean;
  query: string;
  result: string;
  timeStamp: string;
  error: string | null;
};
