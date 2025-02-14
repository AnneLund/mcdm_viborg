import mongoose, { Schema } from "mongoose";
mongoose.set("runValidators", true);

const termScheme = new Schema({
  term: { type: String },
  definition: { type: String },
  created: { type: Date, default: new Date() },
});

export default mongoose.models.term || mongoose.model("term", termScheme);
