import { ChatBotState } from "../types/ChatBotState.type";
import { CHAT_HISTORY } from "../utils/Utils";

type ChatHistoryProps = {
  item: ChatBotState;
};

function ChatHistory({ item }: ChatHistoryProps) {
  const handleItemDelete = () => {
    const history = localStorage.getItem(CHAT_HISTORY);
    const id = item.id;
    if (history) {
      const parsedHistory = JSON.parse(history);
      const filteredHistory = parsedHistory.filter(
        (item: ChatBotState) => item.id !== id
      );
      localStorage.setItem(CHAT_HISTORY, JSON.stringify(filteredHistory));

      // Dispatch storage event to trigger re-render
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: CHAT_HISTORY,
          newValue: JSON.stringify(filteredHistory),
        })
      );
    }
  };
  return (
    <>
      <li>
        <span>
          {item.title}
          <span>
            <button className="btn btn-circle" onClick={handleItemDelete}>
              Del
            </button>
          </span>
        </span>
      </li>
    </>
  );
}

export default ChatHistory;
