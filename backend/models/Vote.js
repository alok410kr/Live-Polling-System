import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
  {
    pollId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Poll",
      required: true,
    },
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    socketId: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate votes from same student for same poll
voteSchema.index({ pollId: 1, socketId: 1 }, { unique: true });

export default mongoose.model("Vote", voteSchema);
