const mongoose = require("mongoose");

const swapSchema = new mongoose.Schema(
  {
    requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    // skill the requester will teach
    offeredSkill: { type: String, required: [true, "Offered skill is required"], trim: true },
    // skill the requester wants to learn (taught by receiver)
    requestedSkill: { type: String, required: [true, "Requested skill is required"], trim: true },
    message: { type: String, default: "", maxlength: 300 },
    status: { type: String, enum: ["pending", "accepted", "declined", "completed"], default: "pending" },
    reviews: [
      {
        reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String, maxlength: 300 },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Swap", swapSchema);
