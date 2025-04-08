import { useState, useRef, useEffect } from "react";
import { ChatBotState } from "../types/ChatBotState.type";
import { CHAT_HISTORY, CURRENT_CHAT } from "../utils/Utils";
import { useSelector, useDispatch } from "react-redux";
import { fetchQuery } from "../redux/slices/ChatBot";
import { RootState, AppDispatch } from "../redux/store";
import { usePersistedState } from "../hooks/usePersistedState";

function Chat({ handleHistoryUpdate }: ChatProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [userQuery, setUserQuery] = useState<string>("");
  const [currentResult, setCurrentResult] = useState<
    ChatBotState | undefined
  >();

  // Use custom hook for persisted state
  const [currentChat, setCurrentChat] = usePersistedState<ChatBotState[]>(
    CURRENT_CHAT,
    []
  );

  const [chatHistory, setChatHistory] = usePersistedState<ChatBotState[]>(
    CHAT_HISTORY,
    []
  );

  const { id, isLoading, query, result, timeStamp, error } = useSelector(
    (state: RootState) => state.chatBot
  );
  const dispatch = useDispatch<AppDispatch>();

  // Remove manual handleStorage - the custom hook handles this

  // Set up storage event listener for cross-tab sync
  useEffect(() => {
    inputRef.current?.focus();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CURRENT_CHAT) {
        console.log("new chat??----------");
        try {
          const newValue = e.newValue ? JSON.parse(e.newValue) : [];
          setCurrentChat(newValue);
        } catch (error) {
          console.error("Error parsing storage event data:", error);
        }
      }
      if (e.key === CHAT_HISTORY) {
        console.log("chathist----");
        try {
          const newValue = e.newValue ? JSON.parse(e.newValue) : [];
          setChatHistory(newValue);
        } catch (error) {
          console.error("Error parsing storage event data:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [setCurrentChat, setChatHistory]);

  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      dispatch(fetchQuery(userQuery));
    } catch (err) {
      console.log(err);
    }
  };

  // Handle new chat responses
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

      // Update both current chat and history
      const updatedChat = [...currentChat, queryResult];
      const updatedHistory = [...chatHistory, queryResult];

      console.log("----", updatedChat, updatedHistory);

      setCurrentChat(updatedChat);
      setChatHistory(updatedHistory);
      handleHistoryUpdate();

      // Trigger storage event for other tabs
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: CHAT_HISTORY,
          newValue: JSON.stringify(updatedHistory),
        })
      );
    }
  }, [isLoading, result]);

  return (
    <div>
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
    </div>
  );
}

export default Chat;
