import { connection, NextResponse } from "next/server";

import { getPublishedSchemes } from "@/lib/scheme-data";

export async function GET() {
  // Cache Components may prerender GET handlers. Connect this request to the
  // incoming request before accessing live Firestore data.
  await connection();

  try {
    const schemes = await getPublishedSchemes();

    return NextResponse.json(
      { schemes },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Public scheme listing error:", error);

    return NextResponse.json(
      { error: "Unable to load published government schemes right now." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
