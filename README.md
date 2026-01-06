# Live Polling System

A real-time polling application built with React and Express.js, designed for interactive classroom environments where teachers can create polls and students can respond in real-time.

## 🚀 Live Demo

**Frontend (Netlify):** [https://golden-toffee-8368a9.netlify.app/](https://golden-toffee-8368a9.netlify.app/)

- **Teacher Dashboard:** [https://golden-toffee-8368a9.netlify.app/teacher](https://golden-toffee-8368a9.netlify.app/teacher)
- **Student Interface:** [https://golden-toffee-8368a9.netlify.app/student](https://golden-toffee-8368a9.netlify.app/student)

> **Note:** The backend is deployed separately. Make sure the backend is running for full functionality.

##  Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)
- [Usage Guide](#usage-guide)
- [Socket.IO Events](#socketio-events)
- [API Documentation](#api-documentation)
- [Key Features Explained](#key-features-explained)
- [Troubleshooting](#troubleshooting)
- [Future Enhancements](#future-enhancements)

##  Overview

The Live Polling System is a full-stack web application that enables real-time interaction between teachers and students. Teachers can create polls with multiple choice questions, set timers, and view live results. Students can join sessions, answer questions, and see results after submission or when the timer expires.

### Key Highlights

- **🌐 Live Deployment**: Frontend deployed on Netlify, backend on Railway/Render
- **Real-time Communication**: Powered by Socket.IO for instant updates
- **Responsive Design**: Modern UI built with Tailwind CSS following Figma design specifications
- **State Management**: Redux Toolkit for efficient state handling
- **Session-based**: Student names are stored per browser tab using sessionStorage
- **Live Results**: Real-time polling results visible to both teachers and students

##  Features

###  Teacher Features

- **Create Polls**: Create multiple-choice questions with customizable options
- **Set Timer**: Configure poll duration (15, 30, 45, 60, 90, or 120 seconds)
- **Mark Correct Answer**: Designate one option as the correct answer
- **Live Results**: View real-time polling results as students submit answers
- **Poll History**: Access history of all polls created in the current session
- **Student Management**: View all participants and kick out students if needed
- **Chat System**: Communicate with students through real-time chat
- **Validation**:
  - Ensures all options are unique
  - Only one option can be marked as correct
  - Prevents creating new polls while one is active

###  Student Features

- **Name Entry**: Enter name on first visit (unique per browser tab)
- **Join Polls**: Automatically receive active polls from teachers
- **Submit Answers**: Select and submit answers to poll questions
- **View Results**: See poll results after submission or when timer expires
- **Live Updates**: Real-time updates when polls are created or ended
- **Chat System**: Participate in real-time chat with teachers and other students
- **Auto-redirect**: Automatic redirection if kicked out by teacher

##  Technology Stack

### Frontend

- **React 19.2.0**: UI library for building user interfaces
- **Redux Toolkit 2.11.2**: State management
- **React Router DOM 7.11.0**: Client-side routing
- **Socket.IO Client 4.8.1**: Real-time communication
- **Tailwind CSS 4.1.18**: Utility-first CSS framework
- **Vite 7.2.4**: Build tool and development server

### Backend

- **Node.js**: JavaScript runtime
- **Express.js 5.2.1**: Web application framework
- **Socket.IO 4.8.1**: Real-time bidirectional event-based communication
- **CORS 2.8.5**: Cross-Origin Resource Sharing middleware
- **dotenv 17.2.3**: Environment variable management
- **nodemon 3.1.11**: Development server with auto-reload

##  Project Structure

```
Intervue.io_Assignment/
├── backend/
│   ├── index.js              # Main server file with Socket.IO logic
│   ├── package.json           # Backend dependencies
│   └── .env                   # Environment variables (create this)
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main app component with routing
│   │   ├── main.jsx           # Entry point
│   │   ├── index.css          # Global styles
│   │   │
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx    # Role selection page
│   │   │   ├── TeacherPage.jsx     # Teacher dashboard
│   │   │   ├── StudentPage.jsx    # Student interface
│   │   │   ├── HistoryPage.jsx    # Poll history view
│   │   │   └── KickedOutPage.jsx  # Kicked out notification
│   │   │
│   │   ├── components/
│   │   │   └── Chat.jsx           # Chat popup component
│   │   │
│   │   ├── store/
│   │   │   ├── index.js           # Redux store configuration
│   │   │   └── pollSlice.js       # Poll state slice
│   │   │
│   │   ├── services/
│   │   │   └── socket.js          # Socket.IO client service
│   │   │
│   │   ├── hooks/
│   │   │   └── usePoll.js         # Custom hook for poll operations
│   │   │
│   │   └── assets/
│   │       ├── logo.svg           # Intervue logo
│   │       ├── chat.svg           # Chat icon
│   │       ├── alarm.svg          # Timer icon
│   │       └── viewHistory.svg    # History icon
│   │
│   ├── package.json           # Frontend dependencies
│   ├── vite.config.js        # Vite configuration
│   ├── tailwind.config.js    # Tailwind CSS configuration
│   └── postcss.config.js     # PostCSS configuration
│
└── README.md                 # This file
```

##  Installation

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** (v7 or higher) or **yarn**

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd Intervue.io_Assignment
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 3: Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

##  Configuration

### Backend Configuration

1. Create a `.env` file in the `backend` directory:

```bash
cd backend
touch .env
```

2. Add the following environment variables:

**For MongoDB Atlas (Recommended):**

```env
PORT=3001
CORS_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/live-polling-system?retryWrites=true&w=majority
```

**For Local MongoDB:**

```env
PORT=3001
CORS_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/live-polling-system
```

** MongoDB Atlas Setup:**

- See `MONGODB_ATLAS_SETUP.md` for detailed MongoDB Atlas setup instructions
- See `backend/QUICK_START.md` for quick setup guide

**Test Database Connection:**

```bash
cd backend
npm run test-db
```

### Frontend Configuration

1. Create a `.env` file in the `frontend` directory (optional):

```bash
cd frontend
touch .env
```

2. Add the Socket.IO server URL (optional, defaults to `http://localhost:3001`):

```env
VITE_SOCKET_URL=http://localhost:3001
```

##  Running the Project

### Development Mode

#### Terminal 1: Start Backend Server

```bash
cd backend
npm start
```

The backend server will start on `http://localhost:3001`

#### Terminal 2: Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Production Build

#### Build Frontend

```bash
cd frontend
npm run build
```

The production build will be in the `frontend/dist` directory.

#### Preview Production Build

```bash
cd frontend
npm run preview
```

##  Usage Guide

### For Teachers

1. **Start the Application**: Open `http://localhost:5173` in your browser
2. **Select Role**: Click on "I'm a Teacher" card
3. **Create a Poll**:
   - Enter your question in the "Enter your question" field
   - Add at least 2 options (click "Add More Option" to add more)
   - Mark one option as correct using the checkbox
   - Set the timer duration (default: 60 seconds)
   - Click "Ask Question" to create the poll
4. **View Results**: Results appear in real-time as students submit answers
5. **View History**: Click "View Poll History" to see all previous polls
6. **Chat**: Click the chat icon to open the chat panel
7. **Manage Students**: In the chat panel, go to "Participants" tab to kick out students
8. **Create New Poll**: After a poll ends, click "Ask a new question" to create another poll

### For Students

1. **Start the Application**: Open `http://localhost:5173` in your browser
2. **Select Role**: Click on "I'm a Student" card
3. **Enter Name**: Enter your name and click "Continue"
4. **Wait for Poll**: You'll see a waiting screen until the teacher creates a poll
5. **Answer Poll**: When a poll appears:
   - Read the question
   - Select your answer
   - Click "Submit Answer"
6. **View Results**: After submission or when timer expires, view the results
7. **Chat**: Click the chat icon to participate in the chat

##  Socket.IO Events

### Client to Server Events

#### Teacher Events

- `joinAsTeacher`: Teacher joins the session

  ```javascript
  socket.emit("joinAsTeacher");
  ```

- `createPoll`: Create a new poll

  ```javascript
  socket.emit("createPoll", {
    question: "What is 2+2?",
    options: ["3", "4", "5", "6"],
    correctAnswer: "4",
    timer: 60,
  });
  ```

- `getResults`: Get current poll results

  ```javascript
  socket.emit("getResults");
  ```

- `getPollHistory`: Get poll history

  ```javascript
  socket.emit("getPollHistory");
  ```

- `sendMessage`: Send a chat message

  ```javascript
  socket.emit("sendMessage", {
    message: "Hello students!",
    userName: "Teacher",
    role: "teacher",
  });
  ```

- `getParticipants`: Get list of participants

  ```javascript
  socket.emit("getParticipants");
  ```

- `kickStudent`: Kick a student from the session
  ```javascript
  socket.emit("kickStudent", { socketId: "student-socket-id" });
  ```

#### Student Events

- `joinAsStudent`: Student joins the session

  ```javascript
  socket.emit("joinAsStudent", { studentName: "John Doe" });
  ```

- `submitAnswer`: Submit answer to current poll

  ```javascript
  socket.emit("submitAnswer", { answer: "Option 1" });
  ```

- `sendMessage`: Send a chat message
  ```javascript
  socket.emit("sendMessage", {
    message: "Hello!",
    userName: "John Doe",
    role: "student",
  });
  ```

### Server to Client Events

- `pollCreated`: Emitted when a new poll is created

  ```javascript
  {
    question: 'What is 2+2?',
    options: ['3', '4', '5', '6'],
    correctAnswer: '4',
    timer: 60,
    timeRemaining: 60,
    status: 'active'
  }
  ```

- `currentPoll`: Emitted when requesting current poll status

  ```javascript
  {
    question: 'What is 2+2?',
    options: ['3', '4', '5', '6'],
    correctAnswer: '4',
    timer: 60,
    timeRemaining: 45,
    status: 'active'
  }
  ```

- `pollEnded`: Emitted when poll ends

  ```javascript
  {
    results: {
      'Option 1': 5,
      'Option 2': 10,
      'Option 3': 2,
      'Option 4': 3
    },
    correctAnswer: '4',
    totalVotes: 20,
    totalStudents: 20,
    message: 'Poll ended'
  }
  ```

- `results`: Emitted when poll results are requested

  ```javascript
  {
    results: { 'Option 1': 5, 'Option 2': 10 },
    totalVotes: 15,
    totalStudents: 20
  }
  ```

- `pollHistory`: Emitted with poll history

  ```javascript
  [
    {
      question: "What is 2+2?",
      options: ["3", "4", "5", "6"],
      correctAnswer: "4",
      timer: 60,
      createdAt: 1234567890,
      endedAt: 1234567950,
      results: { 3: 2, 4: 15, 5: 2, 6: 1 },
      totalStudents: 20,
    },
  ];
  ```

- `kickedOut`: Emitted when a student is kicked out

  ```javascript
  {
    message: "You have been kicked out by the teacher";
  }
  ```

- `error`: Emitted when an error occurs
  ```javascript
  "Error message here";
  ```

##  Key Features Explained

### Real-time Polling

The system uses Socket.IO to broadcast poll creation, answer submissions, and results in real-time. When a teacher creates a poll, all connected students immediately receive it.

### Timer Management

Each poll has a configurable timer. When the timer expires:

- The poll automatically ends
- Results are broadcast to all clients
- The correct answer is highlighted

### Answer Validation

- **Unique Options**: All options must be unique (case-insensitive)
- **Single Correct Answer**: Only one option can be marked as correct
- **Minimum Options**: At least 2 options are required

### Session Management

- **Student Names**: Stored in `sessionStorage` (unique per browser tab)
- **Poll State**: Managed in-memory on the backend
- **Connection Tracking**: Socket IDs are used to track connected users

### Chat System

- **Real-time Messaging**: Messages are broadcast instantly
- **Participant List**: Shows all connected students
- **Teacher Controls**: Teachers can kick students from the session

### Poll History

- **Session-based**: History is stored in-memory for the current session
- **Complete Results**: Includes question, options, results, and correct answer
- **Chronological Order**: Most recent polls appear first

##  Troubleshooting

### Backend Issues

**Problem**: Backend server won't start

- **Solution**: Check if port 3001 is already in use
- **Solution**: Verify `.env` file exists with correct PORT value
- **Solution**: Run `npm install` again in the backend directory

**Problem**: Socket.IO connection fails

- **Solution**: Verify CORS_ORIGIN in `.env` matches frontend URL
- **Solution**: Check that backend server is running on correct port

### Frontend Issues

**Problem**: Frontend won't connect to backend

- **Solution**: Verify `VITE_SOCKET_URL` in frontend `.env` matches backend URL
- **Solution**: Check browser console for connection errors
- **Solution**: Ensure backend server is running

**Problem**: Styles not loading

- **Solution**: Verify Tailwind CSS is properly configured
- **Solution**: Check `postcss.config.js` and `tailwind.config.js`
- **Solution**: Restart the development server

**Problem**: Student name persists across sessions

- **Solution**: This is expected behavior (uses `sessionStorage`)
- **Solution**: Open a new tab for a new student session

### Common Issues

**Problem**: Poll not showing on student dashboard

- **Solution**: Check that student has entered their name
- **Solution**: Verify Socket.IO connection is established
- **Solution**: Check browser console for errors

**Problem**: Multiple correct answers showing

- **Solution**: Ensure only one option is marked as correct
- **Solution**: Check that all options have unique text
- **Solution**: Verify validation is working correctly

##  Future Enhancements

Potential improvements for the system:

- [ ] Persistent storage (database integration)
- [ ] User authentication and authorization
- [ ] Poll templates and saved questions
- [ ] Advanced analytics and reporting
- [ ] Export poll results to CSV/PDF
- [ ] Multiple choice (select multiple answers)
- [ ] Image support in questions and options
- [ ] Poll scheduling
- [ ] Anonymous polling option
- [ ] Mobile app support
- [ ] Push notifications
- [ ] Poll sharing via links
- [ ] Custom themes and branding

##  License

This project is created as an assignment submission. Please refer to the assignment guidelines for usage and distribution terms.
