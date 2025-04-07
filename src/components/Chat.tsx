import { useState, useRef, useEffect } from "react";
import { ChatBotState } from "../types/ChatBotState.type";
import { CHAT_HISTORY } from "../utils/Utils";
import { useSelector, useDispatch } from "react-redux";
import { fetchQuery } from "../redux/slices/ChatBot";
import { RootState, AppDispatch } from "../redux/store";

type ChatProps = {
  handleHistoryUpdate: () => void;
};

function Chat({ handleHistoryUpdate }: ChatProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  // const [isLoading, setIsLoading] = useState(false);
  const [userQuery, setUserQuery] = useState<string>("");
  const [currentResult, setCurrentResult] = useState<
    ChatBotState | undefined
  >();
  const [savedResults, setSavedResults] = useState<ChatBotState[]>([]);

  const { id, isLoading, query, result, timeStamp, error } = useSelector(
    (state: RootState) => state.chatBot
  );
  const dispatch = useDispatch<AppDispatch>();

  // On mount
  useEffect(() => {
    inputRef.current?.focus();

    // Load saved results on mount
    const saved = localStorage.getItem(CHAT_HISTORY);
    if (saved) {
      setSavedResults(JSON.parse(saved));
    }
  }, []);

  // When saved  results changes add changes to localstorage
  useEffect(() => {
    if (savedResults.length > 0) {
      localStorage.setItem(CHAT_HISTORY, JSON.stringify(savedResults));
    }
  }, [savedResults]);

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
      setSavedResults((prev) => [...prev, queryResult]);
      handleHistoryUpdate();
      // Trigger storage event for other tabs
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: CHAT_HISTORY,
          newValue: JSON.stringify([...savedResults, result]),
        })
      );
    }
  }, [isLoading, result]);

  return (
    <div>
      <div>
        {savedResults.length > 0 && (
          <div>
            {savedResults.map((item) => (
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
