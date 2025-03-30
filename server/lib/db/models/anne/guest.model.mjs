import mongoose, { Schema } from "mongoose";
mongoose.set("runValidators", true);

const guestSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  token: { type: String, required: true, unique: true },
  hasResponded: { type: Boolean, default: false },
  isAttending: { type: Boolean },
  numberOfGuests: { type: Number, default: 1 },
  dateResponded: { type: Date },
  created: { type: Date, default: Date.now },
  expiresAt: { type: Date },

  invitationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Invitation",
    required: true,
  },
});

export default mongoose.models.Guest || mongoose.model("Guest", guestSchema);
