import connectMongo from "@/lib/mongodb";
import Booking from "@/models/booking";

export async function POST(req) {
  try {
    await connectMongo();

    const body = await req.json();

    // Basic validation
    const { userId, hotelId, checkIn, checkOut, guests, roomType, total } = body;
    if (!userId || !hotelId || !checkIn || !checkOut || !guests || !roomType || !total) {
      return new Response(JSON.stringify({ message: "Missing fields" }), { status: 400 });
    }

    // Create booking
    const booking = await Booking.create({
      userId,
      hotelId,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      guests,
      roomType,
      total,
      createdAt: new Date(),
    });

    return new Response(JSON.stringify({ message: "Booking successful", booking }), { status: 201 });

  } catch (error) {
    console.error("Booking API error:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
  }
}
