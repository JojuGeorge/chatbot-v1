import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { deleteChat } from "../redux/slices/ChatBot";

function ChatHistory() {
  const { chats } = useSelector((state: RootState) => state.chatBot);
  const [chatHistory, setChatHistory] = useState(chats);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    setChatHistory(chats);
  }, [chats]);

  const handleItemDelete = (chatId: string) => {
    dispatch(deleteChat(chatId));
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold">Chat History</h2>
      </div>
      <ul className="space-y-2">
        {chatHistory.length > 0 &&
          chats.map((chat) => (
            <li
              key={chat.chatId}
              className="flex flex-row items-center gap-2 p-2 hover:bg-base-200 rounded-lg cursor-pointer"
            >
              <div className="flex-1 min-w-0">
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
      </ul>
    </div>
  );
}

export default ChatHistory;
