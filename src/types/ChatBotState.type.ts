export type ChatBotState = {
  id: number;
  isLoading: boolean;
  query: string;
  title: string;
  result: string;
  timeStamp: string;
  error: string | null;
};
