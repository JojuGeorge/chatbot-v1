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
          <div className="flex-1 overflow-y-auto py-4 sm:py-6 px-6 sm:px-8 md:px-30 lg:px-60 xl:px-80">
            <ChatAI />
          </div>
        </div>

        <div className="drawer-side peer-checked:pointer-events-auto peer-checked:visible peer-checked:sticky peer-checked:w-auto overflow-y-auto border-r border-base-300">
          <div className="bg-base-200 w-64">
            <ChatHistory />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
