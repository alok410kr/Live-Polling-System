import Vote from "../models/Vote.js";
import Poll from "../models/Poll.js";

class VoteService {
  /**
   * Submit a vote
   */
  async submitVote(pollId, socketId, studentName, answer) {
    try {
      // Handle both string and ObjectId
      const mongoose = await import("mongoose");
      const pollIdObj =
        typeof pollId === "string"
          ? new mongoose.default.Types.ObjectId(pollId)
          : pollId;

      // Check if poll exists and is active
      const poll = await Poll.findById(pollIdObj);
      if (!poll) {
        throw new Error("Poll not found");
      }

      if (poll.status !== "active") {
        throw new Error("Poll is not active");
      }

      // Validate answer
      if (!poll.options.includes(answer)) {
        throw new Error("Invalid answer");
      }

      // Check if student has already voted
      const existingVote = await Vote.findOne({ pollId: pollIdObj, socketId });
      if (existingVote) {
        throw new Error("You have already answered this poll");
      }

      // Create vote
      const vote = new Vote({
        pollId: pollIdObj,
        socketId,
        studentName,
        answer,
      });

      await vote.save();
      return vote;
    } catch (error) {
      console.error("Error submitting vote:", error);
      throw error;
    }
  }

  /**
   * Check if a student has already voted
   */
  async hasVoted(pollId, socketId) {
    try {
      // Handle both string and ObjectId
      const mongoose = await import("mongoose");
      const pollIdObj =
        typeof pollId === "string"
          ? new mongoose.default.Types.ObjectId(pollId)
          : pollId;

      const vote = await Vote.findOne({ pollId: pollIdObj, socketId });
      return !!vote;
    } catch (error) {
      console.error("Error checking vote:", error);
      return false;
    }
  }

  /**
   * Get votes for a poll
   */
  async getVotesByPollId(pollId) {
    try {
      const votes = await Vote.find({ pollId }).lean();
      return votes;
    } catch (error) {
      console.error("Error getting votes:", error);
      throw new Error("Failed to get votes");
    }
  }

  /**
   * Delete votes for a poll (when poll is reset)
   */
  async deleteVotesByPollId(pollId) {
    try {
      await Vote.deleteMany({ pollId });
    } catch (error) {
      console.error("Error deleting votes:", error);
      throw new Error("Failed to delete votes");
    }
  }
}

export default new VoteService();
