# AI Chatbot in React + Gemini API - V1

This AI-powered chatbot offers a seamless conversational experience with intuitive chat organization. Users can start a New Chat, with each conversation title is generated based on their query. The sidebar provides collapsible chat history, grouped by time periods like Today, Yesterday, Previous 7/30 Days, Month, and Year for easy navigation.

Key features include:

- Chat history tracking with per-day logs
- Flexible clearing options (individual chats or full history)- Auto-sorting to show latest chats first
- Light/Dark theme for user preference
- LocalStorage support to save chats between sessions

Designed for efficiency, it ensures quick access to past conversations while maintaining a clean, user-friendly interface.

## Features

- AI Chatbot with Gemini API
- Gemini API gemini-2.0-flash
- New Chat
  - Opens a new chat session
  - If a new chat is already present then no new chats are created
- User input
  - User send button is disabled until user enters a query
  - For a new chat user input is positioned in middle of the chat
  - For everything else user input is sticky to bottom
- Loading Indicators
  - Once user press on send the button is disable and a loading indicator is shown in button
  - Another loading indicator is shown in the chat window to let user know an API call is being made
- Collapsible Side bar
  - Chat title is generated based on the user query
  - Chat is Sorted with latest at the top of the sidebar
  - Chat Grouping based on creation Today | Yesterday | Previous 7 days | Previous 30 days | Month... | Year...
  - In an old chat if the user queries something then that chat is moved to the top with grouping as Today. Thus showing the latest chats at the top
- Chat history
  - History of each chat / day grouped
  - Whole chat history can be cleared
  - Individual chats can be deleted
- Light and Dark Theme
- Chats are saved to localStorage, for support between sessions

### Technologies Used

- React + vite
- TypeScript
- Tailwind CSS
- Daisy UI
- Gemini API

### How to Run the Application

- Download | Clone the Project
- Go inside the folder (Inside folder where Package.json file is present)
- Open terminal in above folder directory and run below commands inside the terminal

```typescript
npm install
```

- To run the application

```typescript
npm run dev
```

### Future

- Backend Node JS
- Mongo DB
- Authentication
- Sign Up && Login

### TODO

- Inside Utils.ts set URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=GEMINI_API_KEY"
  - Add your API key

### Screen Shots

#### New Chat

![New Chat](public/ScreenShots/1%20new%20chat.png)

#### Chat, Sorted & Grouped chat history on sidebar

![Conversation](public/ScreenShots/2%20convo.png)

#### Chat Grouping - Today | Yesterday | Previous 7 days | Previous 30 days | Month... | Year...

![Chat History Grouping](public/ScreenShots/9%20history%20grouping.png)

#### Send Button Active | Disable

![Button active](public/ScreenShots/7%20Active%20btn.png)

#### Clear Whole Chat History

![Clear Chat History](public/ScreenShots/3%20clear%20chat%20history.png)

#### Delete Individual Chat

![Delete Chat](public/ScreenShots/4%20delete%20chat.png)

#### Light || Dark Theme

![Light Theme](public/ScreenShots/5%20light%20theme.png)

#### Collapsible Sidebar && By default enabled

![Sidebar Collapse](public/ScreenShots/6%20sidebar%20collapse.png)

#### Loading Indicators

![Loading Indicators](public/ScreenShots/8%20Loading.png)
