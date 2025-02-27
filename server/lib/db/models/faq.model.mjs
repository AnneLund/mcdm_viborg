import mongoose, { Schema } from "mongoose";
mongoose.set("runValidators", true);

const faqScheme = new Schema({
  question: { type: String, required: true },
  answer: { type: String },
  link: { type: String },
  created: { type: Date, default: new Date() },
});

export default mongoose.models.faq || mongoose.model("faq", faqScheme);
