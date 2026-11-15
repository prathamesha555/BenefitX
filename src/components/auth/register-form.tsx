"use client";

import { useState, type FormEvent } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification
} from "firebase/auth";

import {
  doc,
  setDoc,
  serverTimestamp
} from "firebase/firestore";

import {
  Eye,
  EyeOff,
  UserRound,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle
} from "lucide-react";

import AuthCard from "./auth-card";

import { auth, db } from "@/lib/firebase";

import { getAuthErrorMessage } from "@/lib/auth-errors";


export default function RegisterForm() {

  const router = useRouter();


  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");



  async function handleSubmit(event: FormEvent<HTMLFormElement>) {

    event.preventDefault();

    setError("");


    if (name.trim().length < 2) {

      setError("Please enter your full name.");

      return;

    }


    if (password.length < 8) {

      setError("Password must contain at least 8 characters.");

      return;

    }


    if (password !== confirmPassword) {

      setError("Passwords do not match.");

      return;

    }


    setLoading(true);


    try {

      const credential = await createUserWithEmailAndPassword(

        auth,

        email.trim(),

        password

      );


      await updateProfile(credential.user, {

        displayName: name.trim()

      });


      // Create the user's private profile.

      await setDoc(

        doc(db, "users", credential.user.uid),

        {

          uid: credential.user.uid,

          displayName: name.trim(),

          email: credential.user.email ?? email.trim(),

          createdAt: serverTimestamp(),

          updatedAt: serverTimestamp()

        }

      );


      // Send verification email.

      await sendEmailVerification(credential.user);


      router.push("/verify-email");


    } catch (error) {

  console.error("BENEFITX REGISTRATION ERROR:", error);

  const firebaseError = error as {
    code?: string;
    message?: string;
  };

  const errorCode = firebaseError.code || "unknown";

  setError(
    `${getAuthErrorMessage(error)} Error Code: ${errorCode}`
  );

} finally {

  setLoading(false);

}

  }



  const inputClass =
    "h-12 w-full rounded-xl border border-[#E4E8E0] bg-[#FAF8F2] pl-11 pr-4 text-sm text-[#292D2C] outline-none transition focus:border-[#167A5B] focus:bg-white focus:ring-4 focus:ring-[#167A5B]/10";


  return (

    <AuthCard

      eyebrow="JOIN BENEFITX"

      title="Create Your Account"

      description="Join BenefitX and make discovering opportunities easier."

    >

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >


        {/* FULL NAME */}

        <div>

          <label
            htmlFor="register-name"
            className="mb-2 block text-xs font-bold text-[#123D32]"
          >

            Full Name

          </label>


          <div className="relative">

            <UserRound
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8954B]"
            />


            <input
              id="register-name"
              type="text"
              autoComplete="name"
              required
              minLength={2}
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Enter your full name"
              className={inputClass}
            />

          </div>

        </div>



        {/* EMAIL */}

        <div>

          <label
            htmlFor="register-email"
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
              id="register-email"
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

          <label
            htmlFor="register-password"
            className="mb-2 block text-xs font-bold text-[#123D32]"
          >

            Password

          </label>


          <div className="relative">

            <Lock
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8954B]"
            />


            <input
              id="register-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Create a strong password"
              className={`${inputClass} pr-12`}
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


          <p className="mt-2 text-[10px] text-[#7B847D]">

            Use at least 8 characters.

          </p>

        </div>



        {/* CONFIRM PASSWORD */}

        <div>

          <label
            htmlFor="register-confirm-password"
            className="mb-2 block text-xs font-bold text-[#123D32]"
          >

            Confirm Password

          </label>


          <div className="relative">

            <Lock
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8954B]"
            />


            <input
              id="register-confirm-password"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              placeholder="Re-enter your password"
              className={inputClass}
            />

          </div>

        </div>



        {/* ERROR */}

        {error && (

          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-xs leading-6 text-red-700"
          >

            <AlertCircle
              size={17}
              className="mt-0.5 shrink-0"
            />

            {error}

          </div>

        )}



        {/* SUBMIT */}

        <button
          type="submit"
          disabled={loading}
          className="flex min-h-[50px] w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#075B46] to-[#123D32] px-5 text-sm font-bold text-white shadow-lg shadow-[#075B46]/15 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
        >

          {loading
            ? "Creating Account..."
            : "Create Account"
          }

          {!loading && <ArrowRight size={17} />}

        </button>



        <p className="text-center text-xs leading-6 text-[#7B847D]">

          By creating an account, you agree to use BenefitX
          as an independent information platform.

        </p>



        {/* LOGIN LINK */}

        <div className="border-t border-[#E4E8E0] pt-5 text-center">

          <p className="text-sm text-[#718077]">

            Already have an account?

            <Link
              href="/login"
              className="ml-2 font-bold text-[#075B46] hover:text-[#B8954B]"
            >

              Sign In

            </Link>

          </p>

        </div>


      </form>

    </AuthCard>

  );

}