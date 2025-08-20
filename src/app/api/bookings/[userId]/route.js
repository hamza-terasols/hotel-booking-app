import { connectDB } from "@/lib/mongodb";
import Hotel from "@/models/Hotel";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { userId } = params;

    const bookings = await Hotel.find({ bookedBy: userId }).sort({ createdAt: -1 });

    return new Response(JSON.stringify(bookings), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
