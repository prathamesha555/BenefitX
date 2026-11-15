"use client";

import { useState, type FormEvent } from "react";

import Link from "next/link";

import { sendPasswordResetEmail } from "firebase/auth";

import {
  Mail,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ArrowRight
} from "lucide-react";

import AuthCard from "./auth-card";

import { auth } from "@/lib/firebase";

import { getAuthErrorMessage } from "@/lib/auth-errors";


export default function ForgotPasswordForm() {

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  const [error, setError] = useState("");



  async function handleSubmit(event: FormEvent<HTMLFormElement>) {

    event.preventDefault();

    setLoading(true);

    setError("");

    setSuccess(false);


    try {

      await sendPasswordResetEmail(
        auth,
        email.trim()
      );

      setSuccess(true);

    } catch (error) {

      const message = getAuthErrorMessage(error);

      setError(message);

    } finally {

      setLoading(false);

    }

  }



  return (

    <AuthCard

      eyebrow="ACCOUNT RECOVERY"

      title="Reset Your Password"

      description="Enter your registered email to request a password reset link."

    >

      {success ? (

        <div className="rounded-2xl border border-[#E4E8E0] bg-[#F2F5F0] p-6 text-center">

          <CheckCircle2
            size={42}
            className="mx-auto text-[#167A5B]"
          />


          <h2 className="mt-5 text-lg font-bold text-[#123D32]">

            Check Your Email

          </h2>


          <p className="mt-3 text-sm leading-7 text-[#718077]">

            If an account exists for this email address,
            Firebase will send password reset instructions.

          </p>


          <Link
            href="/login"
            className="mt-7 inline-flex items-center gap-2 font-bold text-[#075B46]"
          >

            <ArrowLeft size={16} />

            Return to Login

          </Link>

        </div>

      ) : (

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >


          <div>

            <label
              htmlFor="forgot-email"
              className="mb-2 block text-xs font-bold text-[#123D32]"
            >

              Registered Email Address

            </label>


            <div className="relative">

              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8954B]"
              />


              <input
                id="forgot-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="Enter your email"
                className="h-12 w-full rounded-xl border border-[#E4E8E0] bg-[#FAF8F2] pl-11 pr-4 text-sm outline-none transition focus:border-[#167A5B] focus:bg-white focus:ring-4 focus:ring-[#167A5B]/10"
              />

            </div>

          </div>



          {error && (

            <div
              role="alert"
              className="flex items-start gap-3 rounded-xl bg-red-50 p-4 text-xs leading-6 text-red-700"
            >

              <AlertCircle size={17} />

              {error}

            </div>

          )}



          <button
            type="submit"
            disabled={loading}
            className="flex min-h-[50px] w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#075B46] to-[#123D32] px-5 text-sm font-bold text-white transition hover:shadow-lg disabled:opacity-60"
          >

            {loading
              ? "Sending..."
              : "Send Reset Instructions"
            }

            {!loading && <ArrowRight size={17} />}

          </button>


          <div className="text-center">

            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#075B46] hover:text-[#B8954B]"
            >

              <ArrowLeft size={15} />

              Back to Login

            </Link>

          </div>

        </form>

      )}

    </AuthCard>

  );

}