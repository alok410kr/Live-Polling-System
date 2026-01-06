import mongoose from "mongoose";

const pollSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    options: [
      {
        type: String,
        required: true,
      },
    ],
    correctAnswer: {
      type: String,
      default: null,
    },
    timer: {
      type: Number,
      required: true,
      default: 60,
    },
    status: {
      type: String,
      enum: ["active", "ended"],
      default: "active",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    endedAt: {
      type: Date,
      default: null,
    },
    timeRemaining: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
pollSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model("Poll", pollSchema);
