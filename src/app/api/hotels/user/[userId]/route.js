// /api/hotels/user/[userId]/route.js
import { connectDB } from "@/lib/mongodb";
import Hotel from "@/models/Hotel";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { userId } = params;
    const hotels = await Hotel.find({ userId }).sort({ createdAt: -1 });
    return new Response(JSON.stringify(hotels), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch user hotels" }), {
      status: 500,
    });
  }
}
