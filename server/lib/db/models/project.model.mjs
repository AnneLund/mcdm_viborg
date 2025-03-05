import mongoose, { Schema } from "mongoose";
mongoose.set("runValidators", true);

const projectScheme = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  materialsZip: { type: String },
  figma: { type: String },
  serverZip: { type: String },
  isVisible: { type: Boolean },
  created: { type: Date, default: new Date() },
});

export default mongoose.models.project ||
  mongoose.model("project", projectScheme);
