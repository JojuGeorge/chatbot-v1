import React from "react";
import { CURRENT_CHAT } from "./Utils";
import { newChat } from "../redux/slices/ChatBot";
import { useDispatch, UseDispatch } from "react-redux";

function NewChat() {
  const handleNewChat = () => {
    dispatch(newChat());
  };

  const dispatch = useDispatch();

  return (
    <button className="btn btn-circle" onClick={handleNewChat} title="New Chat">
      NC
    </button>
  );
}

export default NewChat;
