import { useState, useEffect, useCallback } from "react";
import ChatAI from "./ChatAI";
import Navigation from "./Navigation";
import { CHAT_HISTORY } from "../utils/Utils";
import ChatHistory from "./ChatHistory";

function Dashboard() {
  return (
    <div className="min-h-screen">
      <div className="drawer">
        <input
          id="sidebar"
          type="checkbox"
          className="drawer-toggle peer"
          defaultChecked
        />

        <div className="drawer-content flex flex-col h-screen">
          <Navigation />
          <div className="flex-1 overflow-y-auto">
            <ChatAI />
          </div>
        </div>

        <div className="drawer-side peer-checked:pointer-events-auto peer-checked:visible peer-checked:sticky peer-checked:w-auto overflow-y-auto">
          <div className="menu h-full bg-base-200 w-56 rounded-r-lg">
            <ChatHistory />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
