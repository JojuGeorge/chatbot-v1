import { useState, useRef, useEffect } from "react";
import { URL } from "../utils/Utils";
import axios from "axios";
import { CurrentResultType } from "../Types/ChatResult.type";
import { CHAT_HISTORY } from "../utils/Utils";

type ChatProps = {
  handleHistoryUpdate: () => void;
};

function Chat({ handleHistoryUpdate }: ChatProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState<string>("");
  const [currentResult, setCurrentResult] = useState<
    CurrentResultType | undefined
  >();
  const [savedResults, setSavedResults] = useState<CurrentResultType[]>([]);

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

  // Create payload for URL Options
  const createPayload = (userQuery: string) => ({
    contents: [
      {
        parts: [{ text: userQuery }],
      },
    ],
  });

  // On clicking send button
  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setQuery("");

    try {
      const result = await axios.post(
        URL,
        JSON.stringify(createPayload(query)),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // const result = await axios.get("/data/data.json");
      const response = result.data;
      console.log(response);
      console.log(response.candidates[0].content.parts[0].text);
      const queryResult = {
        id: Date.now(),
        query,
        result: response.candidates[0].content.parts[0].text,
        timeStamp: new Date().toISOString(),
      };
      setCurrentResult(queryResult);
      setSavedResults((prev) => [...prev, queryResult]);
      handleHistoryUpdate();
      // Trigger storage event for other tabs
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: CHAT_HISTORY,
          newValue: JSON.stringify(savedResults),
        })
      );
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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
