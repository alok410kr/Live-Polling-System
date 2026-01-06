import { io } from "socket.io-client";
import { store } from "../store";
import {
  setSocketConnected,
  setCurrentPoll,
  updateTimer,
  setPollEnded,
  setResults,
  setError,
  setPollHistory,
  setKickedOut,
} from "../store/pollSlice";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";

// Create socket connection
const socket = io(SOCKET_URL, {
  transports: ["websocket", "polling"], // Allow fallback to polling if websocket fails
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Socket event listeners
socket.on("connect", () => {
  console.log("Connected to server:", socket.id);
  store.dispatch(setSocketConnected({ connected: true, socketId: socket.id }));
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
  store.dispatch(setSocketConnected({ connected: false, socketId: null }));
});

socket.on("connect_error", (error) => {
  console.error("Connection error:", error);
  store.dispatch(setError("Failed to connect to server"));
});

// Poll events
socket.on("pollCreated", (data) => {
  console.log("Poll created event received:", data);
  store.dispatch(
    setCurrentPoll({
      ...data,
      status: data.status || "active",
    })
  );
});

socket.on("currentPoll", (data) => {
  console.log("Current poll received:", data);
  store.dispatch(
    setCurrentPoll({
      ...data,
      status: data.status || "active",
    })
  );
  // Update timer with the received timeRemaining
  if (data.timeRemaining !== undefined) {
    store.dispatch(updateTimer(data.timeRemaining));
  }
});

socket.on("currentPollState", (data) => {
  console.log("Current poll state received (state recovery):", data);
  if (data.poll) {
    store.dispatch(
      setCurrentPoll({
        ...data.poll,
        status: data.poll.status || "active",
      })
    );
    // Update timer with the received timeRemaining
    if (data.poll.timeRemaining !== undefined) {
      store.dispatch(updateTimer(data.poll.timeRemaining));
    }
    // If student has already voted, mark as answered
    if (data.hasVoted) {
      store.dispatch(setAnswerSubmitted(true));
    }
  }
});

socket.on("timerUpdate", (data) => {
  store.dispatch(updateTimer(data.timeRemaining));
});

socket.on("pollEnded", (data) => {
  console.log("Poll ended:", data);
  store.dispatch(setPollEnded());
  if (data.results) {
    store.dispatch(setResults(data.results));
  }
});

socket.on("results", (data) => {
  console.log("Results received:", data);
  store.dispatch(setResults(data));
});

socket.on("answerReceived", (data) => {
  console.log("Answer received (broadcast):", data);
  store.dispatch(setResults(data));
});

socket.on("error", (error) => {
  console.error("Socket error:", error);
  const errorMessage =
    typeof error === "string" ? error : error.message || "An error occurred";
  store.dispatch(setError(errorMessage));
});

socket.on("kicked", (message) => {
  console.log("Kicked by teacher:", message);
  store.dispatch(setKickedOut(true));
  // Disconnect and prevent reconnection when kicked
  socket.disconnect();
});

socket.on("pollHistory", (history) => {
  console.log("Poll history received:", history);
  store.dispatch(setPollHistory(history));
});

export default socket;
