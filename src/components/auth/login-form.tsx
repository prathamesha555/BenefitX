"use client";


import { useState, type FormEvent } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import {
  signInWithEmailAndPassword,
  getIdTokenResult,
  setPersistence,
  browserSessionPersistence
} from "firebase/auth";

import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  LogIn
} from "lucide-react";

import AuthCard from "./auth-card";

import { auth } from "@/lib/firebase";

import { getAuthErrorMessage } from "@/lib/auth-errors";


export default function LoginForm() {

  const router = useRouter();


  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");



 async function handleSubmit(
  event: FormEvent<HTMLFormElement>
) {

  event.preventDefault();

  setError("");

  setLoading(true);


  try {

    // Keep Firebase authentication only for this browser session.
    await setPersistence(auth, browserSessionPersistence);

    const credential =
      await signInWithEmailAndPassword(

        auth,

        email.trim(),

        password

      );


    if (!credential.user.emailVerified) {

      router.replace("/verify-email");

      return;

    }


    // Force refresh to retrieve current administrator claims.

    const tokenResult =
      await getIdTokenResult(
        credential.user,
        true
      );


    const idToken =
      await credential.user.getIdToken();


    // Create secure server session.

    const response = await fetch(
      "/api/auth/session",

      {

        method: "POST",

        headers: {

          "Content-Type": "application/json"

        },

        body: JSON.stringify({

          idToken

        })

      }

    );


    const sessionResult = await response
  .json()
  .catch(() => null);

if (!response.ok) {
  throw new Error(
    typeof sessionResult?.error === "string"
      ? sessionResult.error
      : `Session creation failed (${response.status}).`
  );
}


    // Match the exact role required by the server-side admin guard.
    // Checking only `admin` here can send an account without the required
    // super_admin role into /admin, where it is immediately redirected back.
    const isSuperAdmin =
      tokenResult.claims.admin === true &&
      tokenResult.claims.role === "super_admin";

    router.replace(isSuperAdmin ? "/admin" : "/dashboard");


  } catch (error) {

    console.error(
      "BenefitX Login Error:",
      error
    );

    setError(
      error instanceof Error
        ? error.message
        : getAuthErrorMessage(error)
    );

  } finally {

    setLoading(false);

  }

}


  const inputClass =
    "h-12 w-full rounded-xl border border-[#E4E8E0] bg-[#FAF8F2] pl-11 pr-12 text-sm text-[#292D2C] outline-none transition focus:border-[#167A5B] focus:bg-white focus:ring-4 focus:ring-[#167A5B]/10";


  return (

    <AuthCard

      eyebrow="WELCOME BACK"

      title="Sign In to BenefitX"

      description="Access your saved opportunities and personal dashboard."

    >

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >


        {/* EMAIL */}

        <div>

          <label
            htmlFor="login-email"
            className="mb-2 block text-xs font-bold text-[#123D32]"
          >

            Email Address

          </label>


          <div className="relative">

            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8954B]"
            />


            <input
              id="login-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="Enter your email"
              className={inputClass}
            />

          </div>

        </div>



        {/* PASSWORD */}

        <div>

          <div className="mb-2 flex items-center justify-between">

            <label
              htmlFor="login-password"
              className="text-xs font-bold text-[#123D32]"
            >

              Password

            </label>


            <Link
              href="/forgot-password"
              className="text-[11px] font-bold text-[#167A5B] hover:text-[#B8954B]"
            >

              Forgot Password?

            </Link>

          </div>


          <div className="relative">

            <Lock
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8954B]"
            />


            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter your password"
              className={inputClass}
            />


            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              aria-label={
                showPassword ? "Hide password" : "Show password"
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7B847D]"
            >

              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}

            </button>

          </div>

        </div>



        {/* ERROR */}

        {error && (

          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-xs leading-6 text-red-700"
          >

            <AlertCircle size={17} />

            {error}

          </div>

        )}



        {/* LOGIN BUTTON */}

        <button
          type="submit"
          disabled={loading}
          className="flex min-h-[50px] w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#075B46] to-[#123D32] px-5 text-sm font-bold text-white shadow-lg shadow-[#075B46]/15 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
        >

          {loading
            ? "Signing In..."
            : "Sign In"
          }

          {!loading && <LogIn size={17} />}

        </button>



        {/* REGISTER */}

        <div className="border-t border-[#E4E8E0] pt-6 text-center">

          <p className="text-sm text-[#718077]">

            Don&apos;t have an account?

            <Link
              href="/register"
              className="ml-2 font-bold text-[#075B46] hover:text-[#B8954B]"
            >

              Create Account

            </Link>

          </p>

        </div>


      </form>

    </AuthCard>

  );

}