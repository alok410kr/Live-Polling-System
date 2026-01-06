import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { connectDatabase } from "./config/database.js";
import PollController from "./controllers/PollController.js";
import VoteController from "./controllers/VoteController.js";
import PollService from "./services/PollService.js";
import TimerService from "./services/TimerService.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Live Polling System API");
});

const PORT = process.env.PORT || 3001;

// Connect to database
connectDatabase().catch((error) => {
  console.error("❌ Failed to connect to database:", error.message);
  console.error("   Please check your MONGODB_URI in backend/.env file");
  console.error("   See MONGODB_ATLAS_SETUP.md for setup instructions");
  process.exit(1);
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST"],
  },
});

// In-memory tracking for socket connections (not persisted)
let students = new Map(); // socketId -> { studentName, connectedAt }
let teachers = new Map(); // socketId -> { connectedAt }
let chatMessages = []; // Store chat messages (in-memory for now)

// Track current active poll ID (for timer management)
let currentPollId = null;

/**
 * Broadcast participants list to all clients
 */
function broadcastParticipants() {
  const participants = [];

  // Add teachers
  teachers.forEach((teacher, socketId) => {
    participants.push({
      socketId,
      name: "Teacher",
      role: "teacher",
    });
  });

  // Add students
  students.forEach((student, socketId) => {
    participants.push({
      socketId,
      name: student.studentName,
      role: "student",
    });
  });

  io.emit("participantsUpdate", { participants });
}

/**
 * Check if all students have answered (for auto-ending poll)
 */
async function checkIfAllStudentsAnswered(pollId) {
  try {
    const results = await PollService.calculateResults(pollId);
    const poll = await PollService.getPollById(pollId);

    if (!poll || poll.status !== "active") {
      return false;
    }

    // Get total connected students
    const totalStudents = students.size;

    // If all students have answered, end the poll
    if (totalStudents > 0 && results.totalVotes >= totalStudents) {
      await PollService.endPoll(pollId);
      TimerService.stopTimer(pollId);
      currentPollId = null;

      const finalResults = await PollService.calculateResults(pollId);

      io.emit("pollEnded", {
        pollId: pollId.toString(),
        results: finalResults,
        correctAnswer: poll.correctAnswer,
        message: "All students have answered",
      });

      console.log("All students have answered - poll ended");
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error checking if all students answered:", error);
    return false;
  }
}

io.on("connection", (socket) => {
  console.log(`A user connected with socket ID: ${socket.id}`);

  // Store student name on socket for easy access
  socket.studentName = null;
  socket.isTeacher = false;

  /**
   * Teacher joins
   */
  socket.on("joinAsTeacher", async () => {
    try {
      teachers.set(socket.id, {
        connectedAt: Date.now(),
      });
      socket.isTeacher = true;

      broadcastParticipants();

      // Send current poll state for state recovery
      const state = await PollController.getCurrentPollState(socket);
      if (state && state.poll) {
        socket.emit("currentPoll", {
          ...state.poll,
          status: state.poll.status,
        });

        // Send current results if poll is active
        if (state.poll.status === "active") {
          const results = await PollService.calculateResults(state.poll._id);
          socket.emit("results", results);
        }
      }

      console.log(`Teacher joined: ${socket.id}`);
    } catch (error) {
      console.error("Error in joinAsTeacher:", error);
      socket.emit("error", "Failed to join as teacher");
    }
  });

  /**
   * Student joins
   */
  socket.on("joinAsStudent", async (data) => {
    try {
      if (!data.studentName) {
        socket.emit("error", "Student name is required");
        return;
      }

      students.set(socket.id, {
        studentName: data.studentName,
        connectedAt: Date.now(),
      });
      socket.studentName = data.studentName;

      broadcastParticipants();

      // Send current poll state for state recovery
      const state = await PollController.getCurrentPollState(socket);
      if (state && state.poll) {
        // Calculate accurate time remaining
        const timeRemaining = await TimerService.getRemainingTime(
          state.poll._id
        );

        socket.emit("currentPoll", {
          ...state.poll,
          timeRemaining,
          status: state.poll.status,
        });

        // If student has already voted, send results and mark as answered
        if (state.hasVoted) {
          socket.hasAnswered = true;
          const results = await PollService.calculateResults(state.poll._id);
          socket.emit("results", results);
        }
      }

      console.log(`Student joined: ${data.studentName} (${socket.id})`);
    } catch (error) {
      console.error("Error in joinAsStudent:", error);
      socket.emit("error", "Failed to join as student");
    }
  });

  /**
   * Create poll (teacher only)
   */
  socket.on("createPoll", async (data) => {
    try {
      if (!socket.isTeacher) {
        socket.emit("error", "Only teachers can create polls");
        return;
      }

      const pollData = await PollController.createPoll(socket, data);

      if (pollData) {
        currentPollId = pollData._id;

        // Start timer
        TimerService.startTimer(io, pollData._id, pollData.timer);

        // Broadcast to all clients
        io.emit("pollCreated", {
          _id: pollData._id,
          question: pollData.question,
          options: pollData.options,
          correctAnswer: pollData.correctAnswer,
          timer: pollData.timer,
          timeRemaining: pollData.timeRemaining,
          status: pollData.status,
          createdAt: pollData.createdAt,
        });

        console.log(`Poll created: ${pollData._id}`);
      }
    } catch (error) {
      console.error("Error in createPoll:", error);
      socket.emit("error", error.message || "Failed to create poll");
    }
  });

  /**
   * Submit answer (student only)
   */
  socket.on("submitAnswer", async (data) => {
    try {
      if (!socket.studentName) {
        socket.emit("error", "Please join as student first");
        return;
      }

      const result = await VoteController.submitVote(socket, data);

      if (result) {
        // Broadcast updated results to all clients
        io.emit("results", result.results);

        // Mark student as having answered
        socket.hasAnswered = true;

        // Check if all students have answered
        await checkIfAllStudentsAnswered(result.pollId);

        console.log(
          `Answer submitted by ${socket.studentName}: ${data.answer}`
        );
      }
    } catch (error) {
      console.error("Error in submitAnswer:", error);
      socket.emit("error", error.message || "Failed to submit answer");
    }
  });

  /**
   * Get results
   */
  socket.on("getResults", async () => {
    try {
      const poll = await PollService.getCurrentPoll();
      if (!poll) {
        socket.emit("results", {
          results: {},
          totalVotes: 0,
          totalStudents: 0,
        });
        return;
      }

      const results = await PollService.calculateResults(poll._id);
      socket.emit("results", results);
    } catch (error) {
      console.error("Error in getResults:", error);
      socket.emit("error", "Failed to get results");
    }
  });

  /**
   * Get poll history (teacher only)
   */
  socket.on("getPollHistory", async () => {
    try {
      if (!socket.isTeacher) {
        socket.emit("error", "Only teachers can view poll history");
        return;
      }

      const history = await PollController.getPollHistory(socket);
      socket.emit("pollHistory", history);
      console.log(
        `Poll history sent to teacher ${socket.id}: ${history.length} polls`
      );
    } catch (error) {
      console.error("Error in getPollHistory:", error);
      socket.emit("error", "Failed to get poll history");
    }
  });

  /**
   * Get current poll state (for state recovery)
   */
  socket.on("getCurrentPollState", async () => {
    try {
      const state = await PollController.getCurrentPollState(socket);
      if (state) {
        socket.emit("currentPollState", state);
      } else {
        socket.emit("currentPollState", { poll: null, hasVoted: false });
      }
    } catch (error) {
      console.error("Error in getCurrentPollState:", error);
      socket.emit("error", "Failed to get current poll state");
    }
  });

  /**
   * Chat functionality
   */
  socket.on("sendMessage", (data) => {
    try {
      const message = {
        ...data,
        socketId: socket.id,
        timestamp: Date.now(),
      };
      chatMessages.push(message);

      // Broadcast to all clients
      io.emit("chatMessage", message);
      console.log(
        `Message from ${data.sender || socket.studentName || "Teacher"}: ${
          data.message
        }`
      );
    } catch (error) {
      console.error("Error in sendMessage:", error);
      socket.emit("error", "Failed to send message");
    }
  });

  /**
   * Get participants
   */
  socket.on("getParticipants", () => {
    broadcastParticipants();
  });

  /**
   * Kick student (teacher only)
   */
  socket.on("kickStudent", (data) => {
    try {
      if (!socket.isTeacher) {
        socket.emit("error", "Only teachers can kick students");
        return;
      }

      const studentSocket = io.sockets.sockets.get(data.socketId);
      if (studentSocket) {
        // Emit kicked event first
        studentSocket.emit("kicked", "You have been removed by the teacher");

        // Give a small delay to ensure event is sent before disconnecting
        setTimeout(() => {
          studentSocket.disconnect();
          students.delete(data.socketId);
          broadcastParticipants();
          console.log(`Student ${data.socketId} was kicked by teacher`);
        }, 100);
      }
    } catch (error) {
      console.error("Error in kickStudent:", error);
      socket.emit("error", "Failed to kick student");
    }
  });

  /**
   * Handle disconnect
   */
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    students.delete(socket.id);
    teachers.delete(socket.id);
    broadcastParticipants();
  });
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  TimerService.cleanup();
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  TimerService.cleanup();
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
