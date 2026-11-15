"use client";

import {
  signOutBenefitX
} from "@/lib/benefitx-signout";

import { useEffect, useState, type FormEvent } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import {
  updateProfile,
  signOut
} from "firebase/auth";

import {
  doc,
  setDoc,
  serverTimestamp
} from "firebase/firestore";

import {
  UserRound,
  Mail,
  ShieldCheck,
  ArrowLeft,
  Save,
  LogOut,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  GraduationCap
} from "lucide-react";

import { auth, db } from "@/lib/firebase";

import { useAuth } from "./auth-provider";


export default function ProfilePage() {

  const router = useRouter();

  const { user, loading, refreshUser } = useAuth();


  const [name, setName] = useState("");

  const [saving, setSaving] = useState(false);

  const [success, setSuccess] = useState("");

  const [error, setError] = useState("");


  useEffect(() => {

    if (loading) return;

    if (!user) {

      router.replace("/login");

      return;

    }

    if (!user.emailVerified) {

      router.replace("/verify-email");

      return;

    }

    setName(user.displayName ?? "");

  }, [loading, user, router]);


  async function handleSave(
    event: FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();

    if (!user) return;

    const cleanName = name.trim();


    if (cleanName.length < 2) {

      setError("Please enter a valid name.");

      return;

    }


    setSaving(true);

    setError("");

    setSuccess("");


    try {

      await updateProfile(user, {

        displayName: cleanName

      });


      await setDoc(

        doc(db, "users", user.uid),

        {

          uid: user.uid,

          displayName: cleanName,

          email: user.email ?? "",

          updatedAt: serverTimestamp()

        },

        {

          merge: true

        }

      );


      await refreshUser();

      setSuccess("Your profile has been successfully updated.");

    } catch (error) {

      console.error("BenefitX Profile Update Error:", error);

      setError(
        "Unable to update your profile. Please try again."
      );

    } finally {

      setSaving(false);

    }

  }


  async function handleLogout() {

    await signOutBenefitX();

    router.replace("/");

  }


  if (loading || !user || !user.emailVerified) {

    return (

      <div className="flex min-h-[600px] items-center justify-center bg-[#FAF8F2]">

        <RefreshCw className="animate-spin text-[#075B46]" />

      </div>

    );

  }


  return (

    <main className="min-h-screen bg-[#FAF8F2]">

      {/* PAGE HEADER */}

      <section className="relative overflow-hidden bg-gradient-to-br from-[#123D32] via-[#075B46] to-[#167A5B] px-5 py-14 text-white">

        <div className="pointer-events-none absolute -right-32 -top-36 h-96 w-96 rounded-full border border-[#D6B779]/20" />

        <div className="relative mx-auto max-w-[1050px]">

          <div className="flex items-center gap-2 text-xs text-[#D4E2DA]">

            <Link href="/" className="hover:text-[#D6B779]">
              Home
            </Link>

            <span>/</span>

            <Link href="/dashboard" className="hover:text-[#D6B779]">
              Dashboard
            </Link>

            <span>/</span>

            <span className="text-[#D6B779]">
              My Profile
            </span>

          </div>


          <div className="mt-8 flex items-center gap-5">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D6B779] text-[#123D32] shadow-lg">

              <UserRound size={32} />

            </div>


            <div>

              <span className="text-xs font-bold uppercase tracking-[1.6px] text-[#D6B779]">

                PERSONAL ACCOUNT

              </span>

              <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">

                My Profile

              </h1>

              <p className="mt-2 text-sm text-[#D4E2DA]">

                Manage your BenefitX account information.

              </p>

            </div>

          </div>

        </div>

      </section>


      {/* PROFILE CONTENT */}

      <section className="px-5 py-14 md:py-20">

        <div className="mx-auto grid max-w-[1050px] grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">


          {/* SIDEBAR */}

          <aside className="h-fit rounded-2xl border border-[#E4E8E0] bg-white p-6 shadow-sm">

            <div className="flex flex-col items-center text-center">

              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#EEF3EC] text-[#075B46]">

                <UserRound size={37} />

              </div>


              <h2 className="mt-4 text-lg font-bold text-[#123D32]">

                {user.displayName || "BenefitX Member"}

              </h2>


              <p className="mt-2 max-w-full break-all text-xs text-[#718077]">

                {user.email}

              </p>


              <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#EEF3EC] px-4 py-2 text-[10px] font-bold text-[#075B46]">

                <ShieldCheck size={14} />

                Verified Account

              </span>

            </div>


            <div className="mt-7 border-t border-[#E4E8E0] pt-5 space-y-2">

              <Link
                href="/dashboard"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#59665F] transition hover:bg-[#EEF3EC] hover:text-[#075B46]"
              >

                <GraduationCap size={18} />

                Dashboard

              </Link>


              <Link
                href="/profile"
                className="flex items-center gap-3 rounded-xl bg-[#EEF3EC] px-4 py-3 text-sm font-bold text-[#075B46]"
              >

                <UserRound size={18} />

                My Profile

              </Link>

            </div>

          </aside>


          {/* PROFILE FORM */}

          <section className="rounded-2xl border border-[#E4E8E0] bg-white p-7 shadow-sm md:p-9">


            <div>

              <span className="text-[10px] font-bold uppercase tracking-[1.6px] text-[#B8954B]">

                ACCOUNT INFORMATION

              </span>


              <h2 className="mt-3 text-2xl font-extrabold text-[#123D32]">

                Personal Details

              </h2>


              <p className="mt-2 text-sm leading-7 text-[#718077]">

                Your profile helps organise your BenefitX experience.

              </p>

            </div>


            {/* NOTIFICATIONS */}

            {success && (

              <div
                role="status"
                className="mt-7 flex items-center gap-3 rounded-xl border border-[#C5E3CE] bg-[#EEF8F0] p-4 text-sm text-[#176B43]"
              >

                <CheckCircle2 size={19} />

                {success}

              </div>

            )}


            {error && (

              <div
                role="alert"
                className="mt-7 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >

                <AlertCircle size={19} />

                {error}

              </div>

            )}


            <form
              onSubmit={handleSave}
              className="mt-8 space-y-7"
            >


              {/* NAME */}

              <div>

                <label
                  htmlFor="profile-name"
                  className="mb-3 block text-xs font-bold text-[#123D32]"
                >

                  Full Name

                </label>


                <div className="relative">

                  <UserRound
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8954B]"
                  />


                  <input
                    id="profile-name"
                    type="text"
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                      setSuccess("");
                    }}
                    minLength={2}
                    maxLength={80}
                    required
                    className="h-13 w-full rounded-xl border border-[#E4E8E0] bg-[#FAF8F2] pl-12 pr-4 text-sm text-[#292D2C] outline-none transition focus:border-[#167A5B] focus:bg-white focus:ring-4 focus:ring-[#167A5B]/10"
                  />

                </div>

              </div>


              {/* EMAIL */}

              <div>

                <label
                  htmlFor="profile-email"
                  className="mb-3 block text-xs font-bold text-[#123D32]"
                >

                  Email Address

                </label>


                <div className="relative">

                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8954B]"
                  />


                  <input
                    id="profile-email"
                    type="email"
                    value={user.email ?? ""}
                    disabled
                    className="h-13 w-full rounded-xl border border-[#E4E8E0] bg-[#F2F5F0] pl-12 pr-4 text-sm text-[#718077] outline-none"
                  />

                </div>


                <p className="mt-2 text-[11px] text-[#7B847D]">

                  Your registered email is used for account authentication.

                </p>

              </div>


              {/* VERIFICATION */}

              <div className="rounded-xl border border-[#E4E8E0] bg-[#F2F5F0] p-5">

                <div className="flex items-center gap-3">

                  <ShieldCheck
                    size={22}
                    className="text-[#075B46]"
                  />

                  <div>

                    <p className="text-sm font-bold text-[#123D32]">

                      Email Verification

                    </p>

                    <p className="mt-1 text-xs text-[#167A5B]">

                      Your email address is verified.

                    </p>

                  </div>

                </div>

              </div>


              {/* SAVE */}

              <div className="flex flex-col gap-3 border-t border-[#E4E8E0] pt-7 sm:flex-row">


                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex min-h-[49px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#075B46] to-[#123D32] px-7 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                >

                  <Save size={17} />

                  {saving ? "Saving Changes..." : "Save Changes"}

                </button>


                <Link
                  href="/dashboard"
                  className="inline-flex min-h-[49px] items-center justify-center gap-2 rounded-xl border border-[#D8DCCF] px-7 text-sm font-bold text-[#123D32] transition hover:bg-[#EEF3EC]"
                >

                  <ArrowLeft size={17} />

                  Back to Dashboard

                </Link>

              </div>

            </form>


            {/* SIGN OUT */}

            <div className="mt-10 border-t border-[#E4E8E0] pt-7">

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 text-sm font-bold text-red-600 transition hover:text-red-800"
              >

                <LogOut size={17} />

                Sign Out of BenefitX

              </button>

            </div>


          </section>

        </div>

      </section>

    </main>

  );

}