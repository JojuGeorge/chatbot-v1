import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import {
  deleteChat,
  setCurrentChatId,
  clearChatHistory,
} from "../redux/slices/ChatBot";
import "../styles/chatHistory.css";
import {
  isSameDateMY,
  isSameMonthY,
  isSameYear,
  dateDiffFromToday,
} from "../utils/DateUtil";
import { Chat } from "../types/Chat.type";
import { GroupKey } from "../utils/ChatDateGrouping";
import { store } from "../redux/store";

function ChatHistory() {
  const { chats, currentChatId } = useSelector(
    (state: RootState) => state.chatBot
  );
  const [chatHistory, setChatHistory] = useState(chats);
  const [chatGrouping, setChatGrouping] = useState<{ [key: string]: Chat[] }>(
    {}
  );

  const dispatch = useDispatch<AppDispatch>();

  const handleHistoryGrouping = (chats: Chat[]) => {
    const group: { [key: string]: Chat[] } = {};

    chats.forEach((chat) => {
      const chatDate: Date = new Date(chat.createdAt);

      const groupKey = GroupKey(chatDate) ?? "Old Chats";

      if (!group[groupKey]) {
        group[groupKey] = [];
      }
      group[groupKey].push(chat);
    });
    console.log(group);
    setChatGrouping(group);
  };

  useEffect(() => {
    // setChatHistory(chats);
    // handleHistoryGrouping(chats);
    const sortedChats = [...chats].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setChatHistory(sortedChats);
    handleHistoryGrouping(sortedChats);
  }, [chats]);

  const handleChatHistorySelection = (chatId: string) => {
    console.log("setter is called......");

    dispatch(setCurrentChatId(chatId));
  };

  const handleItemDelete = (chatId: string) => {
    dispatch(deleteChat(chatId));
  };

  const handleClearChatHistory = () => {
    dispatch(clearChatHistory());
  };

  return (
    <div className="p-2 h-full flex flex-col">
      <div className="flex flex-row items-center justify-between gap-4 p-2 mb-2">
        <h4 className="text-lg font-semibold">Chat History</h4>
        <button
          onClick={handleClearChatHistory}
          className="btn btn-outline btn-error btn-xs"
          title="Clear All History"
        >
          🗑️
        </button>
      </div>

      <ul className="space-y-4 flex-1 overflow-y-auto pr-1">
        {chatGrouping && Object.keys(chatGrouping).length > 0 ? (
          Object.entries(chatGrouping).map(([group, chatsInGroup]) => {
            return (
              <div key={group}>
                <h5 className="text-xs font-semibold text-gray-500 uppercase px-2 mb-1">
                  {group}
                </h5>
                {chatsInGroup.map((chat) => (
                  <li
                    key={chat.chatId}
                    className={`
                      flex flex-row items-center gap-2 p-2 rounded-md cursor-pointer 
                      transition-colors duration-150 ease-in-out 
                      hover:bg-base-300 
                      ${
                      chat.chatId === currentChatId 
                        ? 'bg-base-300' 
                        : 'bg-base-100 hover:bg-base-100'
                    }`}
                    onClick={() => handleChatHistorySelection(chat.chatId)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate font-medium">
                        {chat.title || `Chat from ${new Date(chat.createdAt).toLocaleTimeString()}`}
                      </p>
                    </div>
                    <button
                      className={`btn btn-ghost btn-xs shrink-0 ${
                        chat.chatId === currentChatId ? 'text-primary-content hover:bg-red-500/50' : 'text-gray-400 hover:text-error hover:bg-error/10'
                      }`}
                      onClick={(e) => { 
                        e.stopPropagation();
                        handleItemDelete(chat.chatId); 
                      }}
                      title="Delete Chat"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 mt-4">No chat history yet.</p>
        )}
      </ul>
    </div>
  );
}

export default ChatHistory;
