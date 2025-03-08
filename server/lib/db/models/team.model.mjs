import mongoose, { Schema } from "mongoose";
mongoose.set("runValidators", true);

const teamScheme = new Schema({
  team: { type: String, required: true },
  description: { type: String },
  created: { type: Date, default: new Date() },
});

export default mongoose.models.team || mongoose.model("team", teamScheme);
