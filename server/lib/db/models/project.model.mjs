import mongoose, { Schema } from "mongoose";
mongoose.set("runValidators", true);

const projectScheme = new Schema({
  title: { type: String, required: true },
  zip: { type: String, required: false },
  figma: { type: String, required: false },
  server: { type: String, required: false },
  isVisible: { type: Boolean, default: false },
  created: { type: Date, default: new Date() },
});

export default mongoose.models.project ||
  mongoose.model("project", projectScheme);
