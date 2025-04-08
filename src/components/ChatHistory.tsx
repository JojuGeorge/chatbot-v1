import React from "react";
import { ChatBotState } from "../types/ChatBotState.type";

type ChatHistoryProps = {
  item: ChatBotState;
};

function ChatHistory({ item }: ChatHistoryProps) {
  const handleItemDelete = () => {
    console.log(item.id, item.query);
  };
  return (
    <>
      <li>
        <span>
          {item.query}
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
