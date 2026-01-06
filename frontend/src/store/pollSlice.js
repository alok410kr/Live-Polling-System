import { createSlice } from "@reduxjs/toolkit";

// Load student name from sessionStorage if exists (unique per tab)
const getInitialStudentName = () => {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem("studentName") || null;
  }
  return null;
};

const initialState = {
  // Current poll state
  currentPoll: null, // { question, options, timer, status, createdAt }

  // Results
  results: null, // { results: {}, totalVotes, totalStudents }

  // Timer
  timeRemaining: 0,

  // User info
  userRole: null, // 'teacher' or 'student'
  studentName: getInitialStudentName(), // Student's name (stored in localStorage)

  // Socket connection
  isConnected: false,
  socketId: null,

  // Answer submission
  hasAnswered: false,
  submittedAnswer: null,

  // Poll history
  pollHistory: [], // Array of completed polls

  // Kicked out state
  isKickedOut: false,

  // Error messages
  error: null,
};

const pollSlice = createSlice({
  name: "poll",
  initialState,
  reducers: {
    // Set user role
    setUserRole: (state, action) => {
      state.userRole = action.payload;
    },

    // Set student name
    setStudentName: (state, action) => {
      state.studentName = action.payload;
      // Save to sessionStorage (unique per tab)
      if (action.payload) {
        sessionStorage.setItem("studentName", action.payload);
      } else {
        sessionStorage.removeItem("studentName");
      }
    },

    // Socket connection
    setSocketConnected: (state, action) => {
      state.isConnected = action.payload.connected;
      state.socketId = action.payload.socketId || null;
    },

    // Poll created/updated
    setCurrentPoll: (state, action) => {
      // Only reset hasAnswered and results if it's a new poll (different question or different _id)
      if (
        action.payload &&
        state.currentPoll &&
        (state.currentPoll.question !== action.payload.question ||
         state.currentPoll._id !== action.payload._id)
      ) {
        state.hasAnswered = false;
        state.submittedAnswer = null;
        // Only clear results if it's a completely new poll
        if (state.currentPoll._id !== action.payload._id) {
          state.results = null;
        }
      }
      state.currentPoll = action.payload;
      if (action.payload) {
        state.timeRemaining =
          action.payload.timeRemaining !== undefined
            ? action.payload.timeRemaining
            : action.payload.timer || 60;
      }
    },

    // Timer update
    updateTimer: (state, action) => {
      state.timeRemaining = action.payload;
    },

    // Poll ended
    setPollEnded: (state) => {
      if (state.currentPoll) {
        state.currentPoll.status = "ended";
      }
    },

    // Results updated
    setResults: (state, action) => {
      state.results = action.payload;
    },

    // Answer submitted
    setAnswerSubmitted: (state, action) => {
      state.hasAnswered = true;
      state.submittedAnswer = action.payload;
    },

    // Error handling
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },

    // Set poll history
    setPollHistory: (state, action) => {
      state.pollHistory = action.payload;
    },

    // Set kicked out state
    setKickedOut: (state, action) => {
      state.isKickedOut = action.payload;
    },

    // Reset poll state
    resetPoll: (state) => {
      state.currentPoll = null;
      state.results = null;
      state.timeRemaining = 0;
      state.hasAnswered = false;
      state.submittedAnswer = null;
      state.error = null;
      state.isKickedOut = false;
    },
  },
});

export const {
  setUserRole,
  setStudentName,
  setSocketConnected,
  setCurrentPoll,
  updateTimer,
  setPollEnded,
  setResults,
  setAnswerSubmitted,
  setError,
  clearError,
  setPollHistory,
  setKickedOut,
  resetPoll,
} = pollSlice.actions;

export default pollSlice.reducer;
