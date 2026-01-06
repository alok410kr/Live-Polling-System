import PollService from "../services/PollService.js";
import VoteService from "../services/VoteService.js";

class PollController {
  /**
   * Handle poll creation via socket
   */
  async createPoll(socket, data) {
    try {
      // Check if new poll can be created
      const canCreate = await PollService.canCreateNewPoll();
      if (!canCreate) {
        socket.emit(
          "error",
          "Cannot create new poll. Please wait for current poll to end."
        );
        return;
      }

      // Validate poll data
      if (!data.question || !data.options || data.options.length < 2) {
        socket.emit(
          "error",
          "Invalid poll data. Question and at least 2 options are required."
        );
        return;
      }

      // Create poll
      const poll = await PollService.createPoll(data);

      // Return poll data with timeRemaining
      const pollData = {
        _id: poll._id.toString(),
        question: poll.question,
        options: poll.options,
        correctAnswer: poll.correctAnswer,
        timer: poll.timer,
        timeRemaining: poll.timeRemaining,
        status: poll.status,
        createdAt: poll.createdAt,
      };

      return pollData;
    } catch (error) {
      console.error("Error in createPoll controller:", error);
      socket.emit("error", error.message || "Failed to create poll");
      throw error;
    }
  }

  /**
   * Handle getting current poll state (for state recovery)
   */
  async getCurrentPollState(socket) {
    try {
      const poll = await PollService.getCurrentPoll();

      if (!poll) {
        return null;
      }

      // Check if student has already voted
      let hasVoted = false;
      if (socket.studentName) {
        hasVoted = await VoteService.hasVoted(poll._id.toString(), socket.id);
      }

      return {
        poll: {
          _id: poll._id.toString(),
          question: poll.question,
          options: poll.options,
          correctAnswer: poll.correctAnswer,
          timer: poll.timer,
          timeRemaining: poll.timeRemaining,
          status: poll.status,
          createdAt: poll.createdAt,
        },
        hasVoted,
      };
    } catch (error) {
      console.error("Error in getCurrentPollState controller:", error);
      socket.emit("error", error.message || "Failed to get current poll state");
      throw error;
    }
  }

  /**
   * Handle getting poll results
   */
  async getResults(socket, pollId) {
    try {
      const results = await PollService.calculateResults(pollId);
      return results;
    } catch (error) {
      console.error("Error in getResults controller:", error);
      socket.emit("error", error.message || "Failed to get results");
      throw error;
    }
  }

  /**
   * Handle getting poll history
   */
  async getPollHistory(socket) {
    try {
      const history = await PollService.getPollHistory();
      return history;
    } catch (error) {
      console.error("Error in getPollHistory controller:", error);
      socket.emit("error", error.message || "Failed to get poll history");
      throw error;
    }
  }

  /**
   * Handle ending a poll
   */
  async endPoll(socket, pollId) {
    try {
      const poll = await PollService.endPoll(pollId);
      const results = await PollService.calculateResults(pollId);

      return {
        poll,
        results,
      };
    } catch (error) {
      console.error("Error in endPoll controller:", error);
      socket.emit("error", error.message || "Failed to end poll");
      throw error;
    }
  }
}

export default new PollController();
