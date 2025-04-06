import { useState } from "react";
import { URL } from "../utils/Utils";
import axios from "axios";

function Chat() {
  const [query, setQuery] = useState<string>("");

  const createPayload = (userQuery: string) => ({
    contents: [
      {
        parts: [{ text: userQuery }],
      },
    ],
  });

  const handleChatReq = async () => {
    try {
      const result = await axios.post(
        URL,
        JSON.stringify(createPayload(query)),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const response = result.data;
      console.log(response);
      console.log(response.candidates[0].content.parts[0].text);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleChatReq}> Send</button>
      </div>
    </div>
  );
}

export default Chat;
