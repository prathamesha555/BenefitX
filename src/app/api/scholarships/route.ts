import { connection, NextResponse } from "next/server";

import { getPublishedScholarships } from "@/lib/scholarship-data";

export async function GET() {
  // GET handlers can be prerendered with Cache Components enabled. Keep the
  // live Firestore read at request time, and call connection() directly here.
  await connection();

  try {
    const scholarships = await getPublishedScholarships();

    return NextResponse.json(
      { scholarships },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Public scholarship listing error:", error);

    return NextResponse.json(
      { error: "Unable to load published scholarships right now." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
