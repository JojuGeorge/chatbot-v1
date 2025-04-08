import React from "react";
import { CURRENT_CHAT } from "./Utils";

function NewChat() {
  const handleNewChat = () => {
    localStorage.setItem(CURRENT_CHAT, JSON.stringify([]));

    // Dispatch storage event to trigger re-render
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: CURRENT_CHAT,
        newValue: JSON.stringify([]),
      })
    );
  };

  return (
    <button className="btn btn-circle" onClick={handleNewChat} title="New Chat">
      NC
    </button>
  );
}

export default NewChat;
