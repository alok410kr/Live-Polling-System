import PollService from "./PollService.js";

class TimerService {
  constructor() {
    this.timers = new Map(); // Map of pollId -> intervalId
  }

  /**
   * Start timer for a poll
   */
  startTimer(io, pollId, duration) {
    // Clear existing timer if any
    this.stopTimer(pollId);

    let timeRemaining = duration;

    const intervalId = setInterval(async () => {
      timeRemaining--;

      // Broadcast timer update to all clients
      io.emit("timerUpdate", {
        pollId: pollId.toString(),
        timeRemaining,
      });

      if (timeRemaining <= 0) {
        this.stopTimer(pollId);
        await this.endPoll(io, pollId);
      }
    }, 1000);

    this.timers.set(pollId.toString(), intervalId);
    return intervalId;
  }

  /**
   * Stop timer for a poll
   */
  stopTimer(pollId) {
    const pollIdStr = pollId.toString();
    const intervalId = this.timers.get(pollIdStr);
    if (intervalId) {
      clearInterval(intervalId);
      this.timers.delete(pollIdStr);
    }
  }

  /**
   * Get remaining time for a poll
   */
  async getRemainingTime(pollId) {
    try {
      // Handle both string and ObjectId
      const poll = await PollService.getPollById(pollId);
      if (!poll || poll.status !== "active") {
        return 0;
      }

      if (!poll.startedAt) {
        return poll.timer || 0;
      }

      const elapsed = Math.floor(
        (Date.now() - new Date(poll.startedAt).getTime()) / 1000
      );
      const remaining = Math.max(0, poll.timer - elapsed);
      return remaining;
    } catch (error) {
      console.error("Error getting remaining time:", error);
      return 0;
    }
  }

  /**
   * End poll when timer expires
   */
  async endPoll(io, pollId) {
    try {
      const poll = await PollService.endPoll(pollId);
      const results = await PollService.calculateResults(pollId);

      io.emit("pollEnded", {
        pollId: pollId.toString(),
        results,
        correctAnswer: poll.correctAnswer,
        message: "Poll ended",
      });

      console.log(`Poll ${pollId} ended`);
    } catch (error) {
      console.error("Error ending poll:", error);
    }
  }

  /**
   * Clean up all timers
   */
  cleanup() {
    this.timers.forEach((intervalId) => {
      clearInterval(intervalId);
    });
    this.timers.clear();
  }
}

export default new TimerService();
