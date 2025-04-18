# AI Chatbot in React + Gemini API -

This AI-powered chatbot offers a seamless conversational experience with intuitive chat organization. Users can start a New Chat, with each conversation title is generated based on their query. The sidebar provides collapsible chat history, grouped by time periods like Today, Yesterday, Previous 7/30 Days, Month, and Year for easy navigation.

Key features include:

- Chat history tracking with per-day logs
- Flexible clearing options (individual chats or full history)- Auto-sorting to show latest chats first
- Light/Dark theme for user preference
- LocalStorage support to save chats between sessions

Designed for efficiency, it ensures quick access to past conversations while maintaining a clean, user-friendly interface.

## Features

- AI Chatbot
- New Chat
- Chat title based on the user query
- Chat Grouping based on creation Today | Yesterday | Previous 7 days | Previous 30 days | Month... | Year...
- Collapsible Side bar
- Chat history
  - History of each chat / day
- Clear All chat history
- Clear Individual Chats
- Show latest Chats using Sorting
- Light and Dark Theme
- Chats are saved to localStorage

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

#### Conversation && Sorted chats

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
