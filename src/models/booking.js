import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  userId: String,
  hotelId: String,
  checkIn: Date,
  checkOut: Date,
  guests: Number,
  roomType: String,
  total: Number,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
