// api/hotels/booked/admin/[adminId]/route.js
import { connectDB } from "@/lib/mongodb";
import Hotel from "@/models/Hotel";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { adminId } = params;

    // Find only booked hotels for this admin
    const bookedHotels = await Hotel.find({
      booked: true,
      userId: adminId, // Only this admin's hotels
    })
      .populate("bookedBy", "name email")
      .sort({ createdAt: -1 });

    return new Response(JSON.stringify(bookedHotels), { status: 200 });
  } catch (error) {
    console.error("Error fetching booked hotels:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch booked hotels" }),
      { status: 500 }
    );
  }
}
