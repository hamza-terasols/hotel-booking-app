// /api/hotels/route.js

import { connectDB } from "@/lib/mongodb";
import Hotel from "@/models/Hotel";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    // 🔑 Get token from headers
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No token provided" }), {
        status: 401,
      });
    }

    const token = authHeader.split(" ")[1]; // "Bearer <token>"
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 403,
      });
    }

    // 🔹 FormData parse karo
    const formData = await req.formData();
    const name = formData.get("name");
    const location = formData.get("location");
    const price = formData.get("price");
    const rooms = formData.get("rooms");
    const amenities = formData.get("amenities");
    const imageFile = formData.get("image");

    // 1️⃣ Upload image to imgbb
    const imgbbKey = process.env.IMGBB_API_KEY;
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());

    const uploadRes = await fetch(
      `https://api.imgbb.com/1/upload?key=${imgbbKey}`,
      {
        method: "POST",
        body: new URLSearchParams({
          image: imageBuffer.toString("base64"),
        }),
      }
    ).then((res) => res.json());

    const imageUrl = uploadRes.data?.url;

    // 2️⃣ Save to MongoDB
    await connectDB();
    const newHotel = await Hotel.create({
      name,
      location,
      price,
      rooms,
      amenities: amenities.split(",").map((a) => a.trim()),
      image: imageUrl,
      userId: decoded.id, // ✅ ab properly aayega
    });

    return new Response(JSON.stringify(newHotel), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to add hotel" }), {
      status: 500,
    });
  }
}

export async function GET() {
  try {
    await connectDB();
    // Only fetch hotels that are not booked
    const hotels = await Hotel.find({ booked: false }).sort({ createdAt: -1 });
    return new Response(JSON.stringify(hotels), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch hotels" }), {
      status: 500,
    });
  }
}
