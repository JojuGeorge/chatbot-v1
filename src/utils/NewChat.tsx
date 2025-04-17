import React from "react";
// import { CURRENT_CHAT } from "./Utils";
import { newChat } from "../redux/slices/ChatBot";
import { useDispatch } from "react-redux";

function NewChat() {
  const handleNewChat = () => {
    dispatch(newChat());
  };

  const dispatch = useDispatch();

  return (
    <button className="btn btn-circle" onClick={handleNewChat} title="New Chat">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
    </button>
  );
}

export default NewChat;
