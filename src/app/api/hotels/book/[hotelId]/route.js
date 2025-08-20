import { connectDB } from "@/lib/mongodb";
import Hotel from "@/models/Hotel";

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const { hotelId } = params;
    const { userId } = await req.json(); // get the userId from request body

    const updatedHotel = await Hotel.findByIdAndUpdate(
      hotelId,
      { booked: true, bookedBy: userId }, // ✅ set both booked and bookedBy
      { new: true }
    );

    if (!updatedHotel) {
      return new Response(JSON.stringify({ error: "Hotel not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({
        message: "Hotel booked successfully",
        hotel: updatedHotel,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
