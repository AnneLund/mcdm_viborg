import mongoose, { Schema } from "mongoose";
mongoose.set("runValidators", true);

const eventScheme = new Schema({
  event: { type: String, required: true },
  description: { type: String },
  date: { type: String },
  time: { type: String },
  file: { type: String },
  presentation: { type: Boolean, default: false },
  exam: { type: Boolean, default: false },
  created: { type: Date, default: new Date() },
});

export default mongoose.models.event || mongoose.model("event", eventScheme);
