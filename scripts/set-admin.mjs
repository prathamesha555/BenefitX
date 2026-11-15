import dotenv from "dotenv";

import {
  cert,
  getApps,
  initializeApp
} from "firebase-admin/app";

import {
  getAuth
} from "firebase-admin/auth";


dotenv.config({
  path: ".env.local"
});


const projectId =
  process.env.FIREBASE_ADMIN_PROJECT_ID;

const clientEmail =
  process.env.FIREBASE_ADMIN_CLIENT_EMAIL;

const privateKey =
  process.env.FIREBASE_ADMIN_PRIVATE_KEY
    ?.replace(/\\n/g, "\n");


const uid = process.argv[2];


if (!uid) {

  console.error(
    "Usage: node scripts/set-admin.mjs YOUR_FIREBASE_UID"
  );

  process.exit(1);

}


if (
  !projectId ||
  !clientEmail ||
  !privateKey
) {

  console.error(
    "Missing Firebase Admin credentials in .env.local"
  );

  process.exit(1);

}


const app = getApps()[0] ??
  initializeApp({

    credential: cert({

      projectId,

      clientEmail,

      privateKey

    })

  });


async function assignAdmin() {

  try {

    const auth = getAuth(app);

    const user = await auth.getUser(uid);


    if (!user.emailVerified) {

      throw new Error(
        "The account email must be verified before granting admin access."
      );

    }


    const existingClaims = user.customClaims ?? {};


    await auth.setCustomUserClaims(

      uid,

      {

        ...existingClaims,

        admin: true,

        role: "super_admin"

      }

    );


    console.log("\nBenefitX Administrator Assigned Successfully.");

    console.log("-------------------------------------------");

    console.log("Email:", user.email);

    console.log("UID:", user.uid);

    console.log("Role: super_admin");

    console.log("-------------------------------------------");

    console.log(
      "Sign out and sign in again to refresh your permissions."
    );


  } catch (error) {

    console.error(
      "Unable to assign administrator:",
      error
    );

    process.exitCode = 1;

  }

}


await assignAdmin();