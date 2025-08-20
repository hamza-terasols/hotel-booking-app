import { connectDB } from "@/lib/mongodb";
import Hotel from "@/models/Hotel";

// GET single hotel
export async function GET(req, { params }) {
  try {
    await connectDB();
    const hotel = await Hotel.findById(params.id);
    if (!hotel) {
      return new Response(JSON.stringify({ error: "Hotel not found" }), { status: 404 });
    }
    return new Response(JSON.stringify(hotel), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch hotel" }), { status: 500 });
  }
}

// UPDATE hotel
export async function PUT(req, { params }) {
  try {
    await connectDB();
    const body = await req.json();

    const updatedHotel = await Hotel.findByIdAndUpdate(params.id, body, {
      new: true,
    });

    return new Response(JSON.stringify(updatedHotel), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to update hotel" }), { status: 500 });
  }
}

// DELETE hotel
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    await Hotel.findByIdAndDelete(params.id);
    return new Response(JSON.stringify({ message: "Hotel deleted" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to delete hotel" }), { status: 500 });
  }
}
