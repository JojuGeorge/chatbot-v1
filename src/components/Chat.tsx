import { useState, useRef, useEffect } from "react";
import { ChatBotState } from "../types/ChatBotState.type";
import { CHAT_HISTORY, CURRENT_CHAT } from "../utils/Utils";
import { useSelector, useDispatch } from "react-redux";
import { fetchQuery } from "../redux/slices/ChatBot";
import { RootState, AppDispatch } from "../redux/store";

type ChatProps = {
  handleHistoryUpdate: () => void;
};

function Chat({ handleHistoryUpdate }: ChatProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [userQuery, setUserQuery] = useState<string>("");
  const [currentResult, setCurrentResult] = useState<
    ChatBotState | undefined
  >();
  const [currentChat, setCurrentChat] = useState<ChatBotState[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatBotState[]>([]);

  const { id, isLoading, query, result, timeStamp, error } = useSelector(
    (state: RootState) => state.chatBot
  );
  const dispatch = useDispatch<AppDispatch>();

  // called on mounting and when any storage change event
  const handleStorage = () => {
    try {
      const savedCurrentChat = localStorage.getItem(CURRENT_CHAT);
      if (savedCurrentChat) {
        const parsedChat = JSON.parse(savedCurrentChat);
        setCurrentChat(Array.isArray(parsedChat) ? parsedChat : [parsedChat]);
      }

      const savedChatHistory = localStorage.getItem(CHAT_HISTORY);
      if (savedChatHistory) {
        const parsedHistory = JSON.parse(savedChatHistory);
        setChatHistory(
          Array.isArray(parsedHistory) ? parsedHistory : [parsedHistory]
        );
      }
    } catch (error) {
      console.error("Error loading chat data:", error);
    }
  };
  // On mount
  useEffect(() => {
    inputRef.current?.focus();

    // Load saved results on mount
    handleStorage();
  }, []);

  useEffect(() => {
    console.log("Changes----------");
    if (currentChat.length > 0 && chatHistory.length > 0) {
      localStorage.setItem(CURRENT_CHAT, JSON.stringify(currentChat));
      localStorage.setItem(CHAT_HISTORY, JSON.stringify(chatHistory));
    }
  }, [currentChat, chatHistory]);

  // Add this effect to listen for new chat events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // when we click on new chat we clear local storage; to set in state we use this
      if (e.key === CURRENT_CHAT) {
        handleStorage();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // On clicking send button
  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      dispatch(fetchQuery(userQuery));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (result && !isLoading) {
      setUserQuery("");
      const queryResult = {
        id,
        isLoading,
        query,
        result,
        timeStamp,
        error,
      };
      setCurrentResult(queryResult);
      setCurrentChat((prev) => [...prev, queryResult]);
      setChatHistory((prev) => [...prev, queryResult]);
      handleHistoryUpdate();
      // Trigger storage event for other tabs
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: CHAT_HISTORY,
          newValue: JSON.stringify([result]),
        })
      );
    }
  }, [isLoading, result]);

  return (
    <div>
      <div>
        {currentChat.length > 0 && (
          <div>
            {currentChat.map((item) => (
              <div key={item.id}>
                <div>{item.query}</div>
                <div>{item.result}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <form onSubmit={handleSend}>
          <input
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            ref={inputRef}
            className="input"
            placeholder="Ask anything"
          />
          <button
            type="submit"
            className="btn btn-success"
            disabled={isLoading}
          >
            {isLoading ? "..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
