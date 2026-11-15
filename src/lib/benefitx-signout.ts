"use client";

import { signOut } from "firebase/auth";

import { auth } from "@/lib/firebase";


export async function signOutBenefitX() {

  try {

    const response = await fetch(
      "/api/auth/session",
      {
        method: "DELETE"
      }
    );


    if (!response.ok) {

      throw new Error(
        "Unable to clear server session."
      );

    }


  } finally {

    await signOut(auth);

  }

}