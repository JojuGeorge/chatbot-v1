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
    setChatHistory(chats);
    handleHistoryGrouping(chats);
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
    <div className="p-2">
      <div className="flex flex-row items-center gap-4 p-2">
        <h4 className="text-xl font-bold">Chat History</h4>
        <button
          onClick={handleClearChatHistory}
          className="btn btn-outline btn-secondary btn-sm"
        >
          ❌
        </button>
      </div>
      {/* <ul className="space-y-2">
        {chatHistory.length > 0 &&
          chats.map((chat) => (
            <li
              key={chat.chatId}
              className={`flex flex-row items-center gap-2 p-2 rounded-lg   ${
                chat.chatId === currentChatId && "selected"
              }`}
            >
              <div
                onClick={() => handleChatHistorySelection(chat.chatId)}
                className="flex-1 min-w-0 hover:bg-transparent active:!bg-transparent"
              >
                <p className="text-sm truncate">{chat.title}</p>
              </div>
              <button
                className="btn btn-outline btn-secondary btn-sm shrink-0"
                onClick={() => handleItemDelete(chat.chatId)}
              >
                Del
              </button>
            </li>
          ))}
      </ul> */}

      <ul className="space-y-2">
        {chatGrouping &&
          Object.entries(chatGrouping).map(([group, chats]) => {
            return (
              <div key={group}>
                {group}
                {chats.map((chat) => (
                  <li
                    key={chat.chatId}
                    className={`flex flex-row items-center gap-2 p-2 rounded-lg   ${
                      chat.chatId === currentChatId && "selected"
                    }`}
                  >
                    <div
                      onClick={() => handleChatHistorySelection(chat.chatId)}
                      className="flex-1 min-w-0 hover:bg-transparent active:!bg-transparent"
                    >
                      <p className="text-sm truncate">{chat.title}</p>
                    </div>
                    <button
                      className="btn btn-outline btn-secondary btn-sm shrink-0"
                      onClick={() => handleItemDelete(chat.chatId)}
                    >
                      Del
                    </button>
                  </li>
                ))}
              </div>
            );
          })}
      </ul>
    </div>
  );
}

export default ChatHistory;
