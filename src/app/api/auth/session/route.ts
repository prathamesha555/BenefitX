import {
  NextRequest,
  NextResponse
} from "next/server";

import {
  adminAuth
} from "@/lib/firebase-admin";

const SESSION_COOKIE = "benefitx_session";

const SESSION_DURATION =
  5 * 24 * 60 * 60 * 1000;


function isSameOrigin(request: NextRequest) {

  const origin = request.headers.get("origin");

  return origin === request.nextUrl.origin;

}


export async function POST(request: NextRequest) {

  try {

    if (!isSameOrigin(request)) {

      return NextResponse.json(
        { error: "Invalid request origin." },
        { status: 403 }
      );

    }


    const body = await request.json();

    const idToken = body.idToken;


    if (
      typeof idToken !== "string" ||
      idToken.length === 0
    ) {

      return NextResponse.json(
        { error: "Missing authentication token." },
        { status: 400 }
      );

    }


    const decodedToken =
      await adminAuth.verifyIdToken(idToken, true);


    if (decodedToken.email_verified !== true) {

      return NextResponse.json(
        { error: "Please verify your email first." },
        { status: 403 }
      );

    }


    const sessionCookie =
      await adminAuth.createSessionCookie(

        idToken,

        {
          expiresIn: SESSION_DURATION
        }

      );


    const response = NextResponse.json({

      success: true,

      message: "Session created successfully."

    });


    response.cookies.set({

      name: SESSION_COOKIE,

      value: sessionCookie,

      httpOnly: true,

      secure: process.env.NODE_ENV === "production",

      sameSite: "lax",

      path: "/"

    });


    return response;


  } catch (error) {

    console.error(
      "BenefitX Session Error:",
      error
    );


    return NextResponse.json(

      { error: "Unable to create secure session." },

      { status: 401 }

    );

  }

}


export async function DELETE(request: NextRequest) {

  if (!isSameOrigin(request)) {

    return NextResponse.json(
      { error: "Invalid request origin." },
      { status: 403 }
    );

  }


  const response = NextResponse.json({

    success: true

  });


  response.cookies.set({

    name: SESSION_COOKIE,

    value: "",

    httpOnly: true,

    secure: process.env.NODE_ENV === "production",

    sameSite: "lax",

    path: "/",

    maxAge: 0

  });


  return response;

}