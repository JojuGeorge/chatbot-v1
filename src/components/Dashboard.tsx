import { useState, useEffect, useCallback } from "react";
import Chat from "./Chat";
import Navigation from "./Navigation";
import { CurrentResultType } from "../Types/ChatResult.type";
import { CHAT_HISTORY } from "../utils/Utils";

function Dashboard() {
  const [history, setHistory] = useState<CurrentResultType[]>([]);

  const handleHistoryUpdate = useCallback(() => {
    console.log("update meth called....");
    try {
      const saved = localStorage.getItem(CHAT_HISTORY);
      if (saved) {
        const parsedHistory = JSON.parse(saved) as CurrentResultType[];
        setHistory(parsedHistory);
        console.log(parsedHistory);
      } else {
        setHistory([]);
      }
    } catch (error) {
      console.error("Failed to load chat history:", error);
      setHistory([]);
    }
  }, []);

  useEffect(() => {
    handleHistoryUpdate();
    // Listen for storage changes from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CHAT_HISTORY) {
        setTimeout(handleHistoryUpdate, 500);
      }
      console.log("storage event called");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [handleHistoryUpdate]);

  return (
    <div className="min-h-screen">
      <div className="drawer">
        <input id="sidebar" type="checkbox" className="drawer-toggle peer" />

        <div className="drawer-content flex flex-col h-screen">
          <Navigation />
          <div className="flex-1 overflow-y-auto">
            <Chat handleHistoryUpdate={handleHistoryUpdate} />
          </div>{" "}
        </div>

        <div className="drawer-side peer-checked:pointer-events-auto peer-checked:visible peer-checked:sticky peer-checked:w-auto overflow-y-auto">
          <div className="menu h-full bg-base-200 w-56 rounded-r-lg">
            <h1>Chat History</h1>
            <ul className="overflow-y-auto">
              {history.length >= 1 &&
                history.map((item) => <li key={item.id}>{item.query}</li>)}
              {/* {Array.from({ length: 100 }, (_, i) => (
                <li key={i}>alks</li>
              ))} */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
