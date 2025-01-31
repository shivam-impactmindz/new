import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  state: {
    type: String,
  },
  shop: {
    type: String,
    trim: true,
    required: true, // Shop URL is required
    unique: true,   // Ensure each shop has only one session
  },
  accessToken: {
    type: String,
    trim: true,
  },
  isOnline: {
    type: Boolean,
    enum: [true, false],
    default: false,
  },
  scope: {
    type: [String],
    default: [],
  },
  installed: {  // New field to track installation status
    type: Boolean,
    default: false,
  },
  createdAt: {  // Optional: Track when the session was created
    type: Date,
    default: Date.now,
  },
  updatedAt: {  // Optional: Track when the session was last updated
    type: Date,
    default: Date.now,
  },
});

// Check if the model already exists to prevent OverwriteModelError
const Session = mongoose.models.Session || mongoose.model("Session", sessionSchema);

export default Session;