import mongoose, { Schema } from "mongoose";
mongoose.set("runValidators", true);

const feedbackSchema = new Schema({
  date: { type: Date, default: Date.now },
  comments: { type: String, required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "project" },
  exercise: { type: mongoose.Schema.Types.ObjectId, ref: "exercise" },
  focusPoints: { type: [String], required: true },
});

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  team: { type: mongoose.Schema.Types.ObjectId, ref: "team" },
  picture: { type: String, default: "/users/no-user.png" },
  hashedPassword: { type: String, required: true },
  role: { type: String, required: true, default: "student" },
  created: { type: Date, default: Date.now },
  feedback: { type: [feedbackSchema], default: [] },
});

export default mongoose.models.user || mongoose.model("user", userSchema);
