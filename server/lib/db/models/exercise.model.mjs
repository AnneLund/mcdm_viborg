import mongoose, { Schema } from "mongoose";
mongoose.set("runValidators", true);

const exerciseScheme = new Schema({
  title: { type: String, required: true },
  file: { type: String },
  description: { type: String },
  created: { type: Date, default: new Date() },
});

export default mongoose.models.exercise ||
  mongoose.model("exercise", exerciseScheme);
