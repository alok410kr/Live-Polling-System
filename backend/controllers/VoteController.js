import VoteService from "../services/VoteService.js";
import PollService from "../services/PollService.js";

class VoteController {
  /**
   * Handle vote submission via socket
   */
  async submitVote(socket, data) {
    try {
      // Get current active poll
      const poll = await PollService.getCurrentPoll();

      if (!poll) {
        socket.emit("error", "No active poll");
        return null;
      }

      if (poll.status !== "active") {
        socket.emit("error", "Poll is not active");
        return null;
      }

      // Validate answer
      if (!data.answer || !poll.options.includes(data.answer)) {
        socket.emit("error", "Invalid answer");
        return null;
      }

      // Get student name from socket
      const studentName = socket.studentName;
      if (!studentName) {
        socket.emit("error", "Please join as student first");
        return null;
      }

      // Submit vote
      await VoteService.submitVote(
        poll._id.toString(),
        socket.id,
        studentName,
        data.answer
      );

      // Calculate and return updated results
      const results = await PollService.calculateResults(poll._id.toString());

      return {
        pollId: poll._id.toString(),
        results,
        hasVoted: true,
      };
    } catch (error) {
      console.error("Error in submitVote controller:", error);
      socket.emit("error", error.message || "Failed to submit vote");
      throw error;
    }
  }

  /**
   * Check if student has voted
   */
  async checkVoteStatus(socket, pollId) {
    try {
      const hasVoted = await VoteService.hasVoted(pollId, socket.id);
      return hasVoted;
    } catch (error) {
      console.error("Error in checkVoteStatus controller:", error);
      return false;
    }
  }
}

export default new VoteController();
