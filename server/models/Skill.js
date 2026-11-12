const mongoose = require("mongoose");

const CATEGORIES = ["Programming", "Music", "Languages", "Design", "Cooking", "Fitness", "Academics", "Art", "Business", "Other"];

const skillSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: [true, "Title is required"], trim: true, minlength: 2, maxlength: 80 },
    category: { type: String, enum: CATEGORIES, default: "Other" },
    // "offer" = I can teach this, "want" = I want to learn this
    type: { type: String, enum: ["offer", "want"], required: true },
    level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
    description: { type: String, default: "", maxlength: 500 },
    mode: { type: String, enum: ["Online", "In person", "Both"], default: "Online" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Skill", skillSchema);
