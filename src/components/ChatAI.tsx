import { useState, useRef, useEffect } from "react";
import { CHAT_HISTORY } from "../utils/Utils";
import { useSelector, useDispatch } from "react-redux";
import { fetchQuery } from "../redux/slices/ChatBot";
import { RootState, AppDispatch } from "../redux/store";

function ChatAI() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [userQuery, setUserQuery] = useState<string>("");

  const { chats, currentChatId, isLoading } = useSelector(
    (state: RootState) => state.chatBot
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    try {
      localStorage.setItem(CHAT_HISTORY, JSON.stringify(chats));
      console.log("Chat history saved to localStorage:", chats);
    } catch (error) {
      console.error('Error setting localStorage key "CHAT_HISTORY":', error);
    }
  }, [chats]);

  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    dispatch(fetchQuery(userQuery));
    setUserQuery("");
  };

  const currentChatDetails = chats.find(
    (chat) => chat.chatId === currentChatId
  );

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex-1 overflow-y-auto mb-4 p-2">
        {currentChatDetails ? (
          currentChatDetails.messages.map((msg) => (
            <div key={msg.msgId} className="mb-4">
              <div className="font-bold text-blue-600">You:</div>
              <div className="mb-1">{msg.query}</div>
              {msg.result && (
                <>
                  <div className="font-bold text-green-600">AI:</div>
                  <div>{msg.result}</div>
                </>
              )}
              {msg.error && (
                <>
                  <div className="font-bold text-red-600">Error:</div>
                  <div>{msg.error}</div>
                </>
              )}
            </div>
          ))
        ) : (
          <p>No chat selected or history is empty.</p>
        )}
        {isLoading && (
          <div className="flex justify-center items-center">
            <span className="loading loading-dots loading-md"></span>
          </div>
        )}
      </div>

      <div className="mt-auto">
        <form onSubmit={handleSend} className="flex items-center">
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

export default ChatAI;
