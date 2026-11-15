"use client";

import {
  signOutBenefitX
} from "@/lib/benefitx-signout";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import {
  sendEmailVerification,
  reload
} from "firebase/auth";

import {
  MailCheck,
  RefreshCw,
  CheckCircle2,
  LogOut,
  AlertCircle
} from "lucide-react";

import { auth } from "@/lib/firebase";

import { useAuth } from "./auth-provider";

import { signOut } from "firebase/auth";


export default function VerifyEmailForm() {

  const router = useRouter();

  const { user, loading, refreshUser } = useAuth();


  const [sending, setSending] = useState(false);

  const [checking, setChecking] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");



  useEffect(() => {

    if (!loading && !user) {

      router.replace("/login");

    }

  }, [loading, user, router]);



  async function resendEmail() {

    if (!user) return;

    setSending(true);

    setError("");

    setMessage("");


    try {

      await sendEmailVerification(user);

      setMessage(
        "Verification email sent. Check your inbox and spam folder."
      );

    } catch {

      setError(
        "Unable to send the verification email. Please try again later."
      );

    } finally {

      setSending(false);

    }

  }



  async function checkVerification() {

    if (!auth.currentUser) return;

    setChecking(true);

    setError("");

    setMessage("");


    try {

      await reload(auth.currentUser);

      await refreshUser();


      if (auth.currentUser?.emailVerified) {

        router.replace("/dashboard");

      } else {

        setMessage(
          "Your email is not verified yet. Please open the verification email and try again."
        );

      }

    } catch {

      setError(
        "Unable to check verification status. Please try again."
      );

    } finally {

      setChecking(false);

    }

  }



  async function handleLogout() {

    await signOutBenefitX();

    router.replace("/login");

  }



  if (loading || !user) {

    return (

      <div className="flex min-h-[550px] items-center justify-center bg-[#FAF8F2]">

        <RefreshCw className="animate-spin text-[#075B46]" />

      </div>

    );

  }



  return (

    <main className="flex min-h-[650px] items-center justify-center bg-gradient-to-br from-[#FAF8F2] via-white to-[#EEF3EC] px-5 py-16">

      <div className="w-full max-w-[510px] rounded-[28px] border border-[#E4E8E0] bg-white p-8 text-center shadow-[0_20px_60px_rgba(18,61,50,0.08)] sm:p-10">


        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#EEF3EC]">

          <MailCheck
            size={39}
            className="text-[#075B46]"
          />

        </div>


        <span className="mt-7 inline-block text-[10px] font-bold uppercase tracking-[1.8px] text-[#B8954B]">

          ACCOUNT VERIFICATION

        </span>


        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#123D32]">

          Verify Your Email

        </h1>


        <p className="mt-4 text-sm leading-7 text-[#718077]">

          We've sent a verification link to:

        </p>


        <p className="mt-2 break-all font-bold text-[#075B46]">

          {user.email}

        </p>


        <p className="mt-5 text-xs leading-7 text-[#718077]">

          Open the email from Firebase and click its verification link.
          Then return here and confirm your verification status.

        </p>



        {message && (

          <div className="mt-6 rounded-xl bg-[#EEF3EC] p-4 text-xs leading-6 text-[#075B46]">

            {message}

          </div>

        )}



        {error && (

          <div
            role="alert"
            className="mt-6 flex items-start gap-2 rounded-xl bg-red-50 p-4 text-left text-xs leading-6 text-red-700"
          >

            <AlertCircle size={17} />

            {error}

          </div>

        )}



        <button
          type="button"
          onClick={checkVerification}
          disabled={checking}
          className="mt-8 flex min-h-[49px] w-full items-center justify-center gap-2 rounded-xl bg-[#075B46] px-5 text-sm font-bold text-white transition hover:bg-[#123D32] disabled:opacity-60"
        >

          {checking
            ? "Checking..."
            : "I've Verified My Email"
          }

          <CheckCircle2 size={17} />

        </button>



        <button
          type="button"
          onClick={resendEmail}
          disabled={sending}
          className="mt-4 flex min-h-[49px] w-full items-center justify-center gap-2 rounded-xl border border-[#D8DCCF] bg-white px-5 text-sm font-bold text-[#123D32] transition hover:bg-[#EEF3EC] disabled:opacity-60"
        >

          {sending
            ? "Sending..."
            : "Resend Verification Email"
          }

          <RefreshCw size={16} />

        </button>



        <button
          type="button"
          onClick={handleLogout}
          className="mt-7 inline-flex items-center gap-2 text-xs font-bold text-[#718077] transition hover:text-[#075B46]"
        >

          <LogOut size={15} />

          Sign Out

        </button>


      </div>

    </main>

  );

}