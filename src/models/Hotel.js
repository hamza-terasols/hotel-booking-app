// src/models/Hotel.js
import mongoose from "mongoose";

const HotelSchema = new mongoose.Schema(
  {
    name: String,
    location: String,
    price: Number,
    rooms: Number,
    amenities: [String],
    image: String,
    booked: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
 // 👈 new
  },
  { timestamps: true }
);

export default mongoose.models.Hotel || mongoose.model("Hotel", HotelSchema);
