import Poll from "../models/Poll.js";
import Vote from "../models/Vote.js";

class PollService {
  /**
   * Create a new poll
   */
  async createPoll(pollData) {
    try {
      const poll = new Poll({
        question: pollData.question,
        options: pollData.options,
        correctAnswer: pollData.correctAnswer || null,
        timer: pollData.timer || 60,
        status: "active",
        startedAt: new Date(),
        timeRemaining: pollData.timer || 60,
      });

      await poll.save();
      return poll;
    } catch (error) {
      console.error("Error creating poll:", error);
      throw new Error("Failed to create poll");
    }
  }

  /**
   * Get the current active poll
   */
  async getCurrentPoll() {
    try {
      const poll = await Poll.findOne({ status: "active" })
        .sort({ createdAt: -1 })
        .lean();

      if (!poll) {
        return null;
      }

      // Convert _id to string for consistency
      poll._id = poll._id.toString();

      // Calculate time remaining based on startedAt and timer
      if (poll.startedAt && poll.timer) {
        const elapsed = Math.floor(
          (Date.now() - new Date(poll.startedAt).getTime()) / 1000
        );
        const remaining = Math.max(0, poll.timer - elapsed);
        poll.timeRemaining = remaining;
      }

      return poll;
    } catch (error) {
      console.error("Error getting current poll:", error);
      throw new Error("Failed to get current poll");
    }
  }

  /**
   * End a poll
   */
  async endPoll(pollId) {
    try {
      const poll = await Poll.findByIdAndUpdate(
        pollId,
        {
          status: "ended",
          endedAt: new Date(),
          timeRemaining: 0,
        },
        { new: true }
      );

      return poll;
    } catch (error) {
      console.error("Error ending poll:", error);
      throw new Error("Failed to end poll");
    }
  }

  /**
   * Get poll history
   */
  async getPollHistory(limit = 50) {
    try {
      const polls = await Poll.find({ status: "ended" })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

      // Get results for each poll
      const pollsWithResults = await Promise.all(
        polls.map(async (poll) => {
          const votes = await Vote.find({ pollId: poll._id }).lean();
          const results = {};
          let totalVotes = 0;

          poll.options.forEach((option) => {
            results[option] = 0;
          });

          votes.forEach((vote) => {
            if (results[vote.answer] !== undefined) {
              results[vote.answer]++;
              totalVotes++;
            }
          });

          return {
            ...poll,
            _id: poll._id.toString(),
            results: {
              results,
              totalVotes,
              totalStudents: votes.length,
            },
          };
        })
      );

      return pollsWithResults;
    } catch (error) {
      console.error("Error getting poll history:", error);
      throw new Error("Failed to get poll history");
    }
  }

  /**
   * Check if a new poll can be created
   */
  async canCreateNewPoll() {
    try {
      const activePoll = await Poll.findOne({ status: "active" });

      if (!activePoll) {
        return true;
      }

      // Check if all students have answered
      const voteCount = await Vote.countDocuments({ pollId: activePoll._id });
      // Note: We'll need to pass totalStudents from socket context
      // For now, we'll check if poll has ended
      return activePoll.status === "ended";
    } catch (error) {
      console.error("Error checking if can create new poll:", error);
      return false;
    }
  }

  /**
   * Get poll by ID
   */
  async getPollById(pollId) {
    try {
      const poll = await Poll.findById(pollId).lean();
      if (poll && poll._id) {
        poll._id = poll._id.toString();
      }
      return poll;
    } catch (error) {
      console.error("Error getting poll by ID:", error);
      throw new Error("Failed to get poll");
    }
  }

  /**
   * Calculate results for a poll
   */
  async calculateResults(pollId) {
    try {
      // Handle both string and ObjectId
      const poll =
        typeof pollId === "string"
          ? await Poll.findById(pollId).lean()
          : await Poll.findById(pollId).lean();

      if (!poll) {
        throw new Error("Poll not found");
      }

      const votes = await Vote.find({ pollId }).lean();
      const results = {};
      let totalVotes = 0;

      poll.options.forEach((option) => {
        results[option] = 0;
      });

      votes.forEach((vote) => {
        if (results[vote.answer] !== undefined) {
          results[vote.answer]++;
          totalVotes++;
        }
      });

      return {
        results,
        totalVotes,
        totalStudents: votes.length,
      };
    } catch (error) {
      console.error("Error calculating results:", error);
      throw new Error("Failed to calculate results");
    }
  }
}

export default new PollService();
