import React, { useState, useRef, useEffect } from "react";
import { CHAT_HISTORY } from "../utils/Utils";
import { useSelector, useDispatch } from "react-redux";
import { fetchQuery, setCurrentChatId } from "../redux/slices/ChatBot";
import { RootState, AppDispatch } from "../redux/store";
import { Chat } from "../types/Chat.type";
import { SortChat } from "../utils/SortChats";

function ChatAI() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [userQuery, setUserQuery] = useState<string>("");
  const [currentChatDetails, setCurrentChatDetails] = useState<
    Chat | undefined
  >();

  const { chats, currentChatId, isLoading } = useSelector(
    (state: RootState) => state.chatBot
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    inputRef.current?.focus();

    try {
      localStorage.setItem(CHAT_HISTORY, JSON.stringify(chats));
      console.log("Chat history saved to localStorage:", chats);
    } catch (error) {
      console.error('Error setting localStorage key "CHAT_HISTORY":', error);
    }
  }, [chats]);

  useEffect(() => {
    inputRef.current?.focus();
    setCurrentChatDetails(chats.find((chat) => chat.chatId === currentChatId));
  }, [chats, currentChatId]);

  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    dispatch(fetchQuery(userQuery));
    setUserQuery("");
  };

  return (
    <div className="flex flex-col h-full bg-base-100">
      {/* Check if messages exist and render different layouts */}
      {currentChatDetails && currentChatDetails.messages.length > 0 ? (
        // When messages exist - show regular layout with sticky input at bottom
        <>
          <div className="flex-1 overflow-visible mb-4 p-3 space-y-4 pb-16">
            {currentChatDetails.messages.map((msg) => (
              <React.Fragment key={msg.msgId}>
                <div className="text-right">
                  <div className="inline-block px-4 py-2 rounded-lg bg-base-300  max-w-xl break-words">
                    {msg.query}
                  </div>
                </div>

                {msg.result && (
                  <div className="text-left">
                    <div className="inline-block  py-2 max-w-3xl break-words">
                      {msg.result}
                    </div>
                  </div>
                )}
                {msg.error && (
                  <div className="text-left text-error">
                    <div className="inline-block px-4 py-2 max-w-xl break-words">
                      {msg.error}
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
            {isLoading && (
              <div className="text-left">
                <span className="loading loading-dots loading-sm"></span>
              </div>
            )}
          </div>

          <div className="fixed bottom-0 z-10 pt-2 py-10 border-t border-base-300 bg-base-100 w-full max-w-7xl mx-auto left-1/2 transform -translate-x-1/2 px-6">
            <form onSubmit={handleSend} className="flex items-center gap-2 max-w-5xl mx-auto">
              <input
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                ref={inputRef}
                className="input input-bordered flex-grow"
                placeholder="Ask anything..."
                disabled={isLoading}
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading || !userQuery.trim()}
              >
                {isLoading ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  "Send"
                )}
              </button>
            </form>
          </div>
        </>
      ) : (
        // When no messages - center the input in the page
        <div className="flex flex-col h-full justify-center items-center p-4">
          <div className="mb-8 text-center text-gray-500">
            <h2 className="text-xl font-medium mb-2">Start a New Conversation</h2>
            <p>Type a message below to begin chatting with the AI</p>
          </div>
          
          <div className="w-full max-w-2xl">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                ref={inputRef}
                className="input input-bordered flex-grow"
                placeholder="Ask anything..."
                disabled={isLoading}
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading || !userQuery.trim()}
              >
                {isLoading ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  "Send"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatAI;
