import mongoose, { Schema } from "mongoose";
mongoose.set("runValidators", true);

const invitationSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date },
  time: { type: String },
  location: { type: String },
  type: { type: String }, // fx: “Fødselsdag”, “Reception”, “Middag”
  image: { type: String }, // evt. URL eller path
  created: { type: Date, default: Date.now },
});

export default mongoose.models.Invitation ||
  mongoose.model("Invitation", invitationSchema);
