"use client";

import {
  signOutBenefitX
} from "@/lib/benefitx-signout";

import { useEffect, useState, type FormEvent } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import {
  signOut,
  updateProfile
} from "firebase/auth";

import {
  doc,
  serverTimestamp,
  setDoc
} from "firebase/firestore";

import {

  UserRound,
  Bookmark,
  GraduationCap,
  Landmark,
  Settings,
  LogOut,
  ShieldCheck,
  ArrowRight,
  ArrowUpRight,
  Edit3,
  Save,
  X,
  RefreshCw,
  AlertCircle

} from "lucide-react";


import { auth, db } from "@/lib/firebase";

import { useAuth } from "./auth-provider";

import {

  subscribeToBookmarks,

  type UserBookmark

} from "@/lib/bookmarks";


export default function UserDashboard() {


  const router = useRouter();

  const { user, loading, refreshUser } = useAuth();


  const [ready, setReady] = useState(false);

  const [bookmarks, setBookmarks] = useState<UserBookmark[]>([]);


  const [editing, setEditing] = useState(false);

  const [name, setName] = useState("");

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

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

    setReady(true);

  }, [loading, user, router]);


  useEffect(() => {

    if (!user || !ready) return;


    return subscribeToBookmarks(

      user.uid,

      (items) => {

        items.sort((a, b) => {

          const aDate =
            a.createdAt &&
            typeof a.createdAt === "object" &&
            "toMillis" in a.createdAt
              ? (a.createdAt as { toMillis: () => number }).toMillis()
              : 0;

          const bDate =
            b.createdAt &&
            typeof b.createdAt === "object" &&
            "toMillis" in b.createdAt
              ? (b.createdAt as { toMillis: () => number }).toMillis()
              : 0;

          return bDate - aDate;

        });

        setBookmarks(items);

      },

      () => {

        setError("Unable to load saved opportunities.");

      }

    );

  }, [user, ready]);


  async function handleProfileUpdate(
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

    setMessage("");


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


      setEditing(false);

      setMessage("Your profile has been updated.");

    } catch {

      setError(
        "Unable to update your profile. Please try again."
      );

    } finally {

      setSaving(false);

    }

  }


  async function handleLogout() {

    await signOutBenefitX();

    router.replace("/login");

  }


  if (loading || !ready || !user) {

    return (

      <div className="flex min-h-[550px] items-center justify-center bg-[#FAF8F2]">

        <RefreshCw className="animate-spin text-[#075B46]" />

      </div>

    );

  }


  const scholarshipsSaved = bookmarks.filter(

    (item) => item.kind === "scholarship"

  ).length;


  const schemesSaved = bookmarks.filter(

    (item) => item.kind === "scheme"

  ).length;


  return (

    <main className="min-h-screen bg-[#FAF8F2]">


      {/* HERO */}

      <section className="relative overflow-hidden bg-gradient-to-br from-[#123D32] to-[#075B46] px-5 py-14 text-white md:py-16">

        <div className="pointer-events-none absolute -right-32 -top-36 h-96 w-96 rounded-full border border-[#D6B779]/20" />

        <div className="relative mx-auto flex max-w-[1150px] flex-col justify-between gap-7 md:flex-row md:items-center">

          <div>

            <span className="text-xs font-bold uppercase tracking-[1.7px] text-[#D6B779]">

              PERSONAL DASHBOARD

            </span>


            <h1 className="mt-4 text-3xl font-extrabold md:text-5xl">

              Welcome Back,

              <span className="block text-[#D6B779]">

                {user.displayName || "Member"}

              </span>

            </h1>


            <p className="mt-4 text-sm text-[#D4E2DA]">

              Manage your profile and saved opportunities.

            </p>

          </div>


          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#D6B779] text-[#123D32] shadow-xl">

            <UserRound size={39} />

          </div>

        </div>

      </section>


      <section className="px-5 py-12 md:py-16">

        <div className="mx-auto max-w-[1150px]">


          {/* STATS */}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">

            {[

              {

                title: "Saved Opportunities",

                value: bookmarks.length,

                icon: Bookmark

              },

              {

                title: "Saved Scholarships",

                value: scholarshipsSaved,

                icon: GraduationCap

              },

              {

                title: "Saved Schemes",

                value: schemesSaved,

                icon: Landmark

              }

            ].map((item) => {

              const Icon = item.icon;

              return (

                <div
                  key={item.title}
                  className="rounded-2xl border border-[#E4E8E0] bg-white p-6 shadow-sm"
                >

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-xs font-semibold text-[#718077]">

                        {item.title}

                      </p>

                      <p className="mt-3 text-3xl font-extrabold text-[#123D32]">

                        {item.value}

                      </p>

                    </div>


                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EEF3EC] text-[#075B46]">

                      <Icon size={24} />

                    </div>

                  </div>

                </div>

              );

            })}

          </div>


          {/* ERROR AND SUCCESS */}

          {message && (

            <div className="mt-7 rounded-xl bg-[#EEF3EC] p-4 text-sm text-[#075B46]">

              {message}

            </div>

          )}


          {error && (

            <div
              role="alert"
              className="mt-7 flex items-start gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-700"
            >

              <AlertCircle size={18} />

              {error}

            </div>

          )}

{/* PROFILE PAGE QUICK ACCESS */}

<div className="mt-8 flex flex-col justify-between gap-5 rounded-2xl border border-[#E4E8E0] bg-white p-6 shadow-sm sm:flex-row sm:items-center">

  <div className="flex items-center gap-4">

    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EEF3EC] text-[#075B46]">

      <UserRound size={23} />

    </div>

    <div>

      <h3 className="font-bold text-[#123D32]">
        My Profile
      </h3>

      <p className="mt-1 text-xs text-[#718077]">
        View and manage your personal information.
      </p>

    </div>

  </div>

  <Link
    href="/profile"
    className="inline-flex min-h-[45px] items-center justify-center gap-2 rounded-xl bg-[#075B46] px-6 text-xs font-bold text-white transition hover:bg-[#123D32]"
  >

    View My Profile

    <ArrowUpRight size={16} />

  </Link>

</div>

          {/* PROFILE */}

          <section className="mt-10 rounded-2xl border border-[#E4E8E0] bg-white p-7 shadow-sm">

            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EEF3EC] text-[#075B46]">

                  <UserRound size={23} />

                </div>


                <div>

                  <h2 className="text-lg font-bold text-[#123D32]">

                    My Profile

                  </h2>

                  <p className="mt-1 text-xs text-[#718077]">

                    Manage your personal account information.

                  </p>

                </div>

              </div>


              {!editing && (

                <button
                  type="button"
                  onClick={() => {

                    setName(user.displayName ?? "");

                    setEditing(true);

                    setMessage("");

                    setError("");

                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D8DCCF] px-4 py-2.5 text-xs font-bold text-[#123D32] transition hover:bg-[#EEF3EC]"
                >

                  <Edit3 size={15} />

                  Edit Profile

                </button>

              )}

            </div>


            {editing ? (

              <form
                onSubmit={handleProfileUpdate}
                className="mt-7 space-y-5"
              >

                <div>

                  <label
                    htmlFor="profile-name"
                    className="mb-2 block text-xs font-bold text-[#123D32]"
                  >

                    Full Name

                  </label>


                  <input
                    id="profile-name"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    required
                    minLength={2}
                    className="h-12 w-full rounded-xl border border-[#E4E8E0] bg-[#FAF8F2] px-4 text-sm outline-none focus:border-[#167A5B]"
                  />

                </div>


                <div>

                  <label className="mb-2 block text-xs font-bold text-[#123D32]">

                    Email Address

                  </label>

                  <div className="flex h-12 items-center rounded-xl border border-[#E4E8E0] bg-[#F2F5F0] px-4 text-sm text-[#718077]">

                    {user.email}

                  </div>

                  <p className="mt-2 text-[10px] text-[#7B847D]">

                    Email changes require a separate verification process.

                  </p>

                </div>


                <div className="flex flex-wrap gap-3">

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex min-h-[45px] items-center gap-2 rounded-xl bg-[#075B46] px-5 text-xs font-bold text-white hover:bg-[#123D32] disabled:opacity-60"
                  >

                    <Save size={15} />

                    {saving ? "Saving..." : "Save Changes"}

                  </button>


                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="inline-flex min-h-[45px] items-center gap-2 rounded-xl border border-[#D8DCCF] px-5 text-xs font-bold text-[#123D32]"
                  >

                    <X size={15} />

                    Cancel

                  </button>

                </div>

              </form>

            ) : (

              <div className="mt-7 grid grid-cols-1 gap-6 border-t border-[#E4E8E0] pt-7 sm:grid-cols-2">

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#7B847D]">

                    Full Name

                  </p>

                  <p className="mt-2 text-sm font-semibold text-[#123D32]">

                    {user.displayName || "Not provided"}

                  </p>

                </div>


                <div>

                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#7B847D]">

                    Email Address

                  </p>

                  <p className="mt-2 break-all text-sm font-semibold text-[#123D32]">

                    {user.email}

                  </p>

                </div>


                <div>

                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#7B847D]">

                    Account Verification

                  </p>

                  <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-[#167A5B]">

                    <ShieldCheck size={16} />

                    Verified

                  </p>

                </div>


              </div>

            )}

          </section>


          {/* SAVED OPPORTUNITIES */}

          <section className="mt-10">

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

              <div>

                <span className="text-[10px] font-bold uppercase tracking-[1.6px] text-[#B8954B]">

                  YOUR COLLECTION

                </span>


                <h2 className="mt-3 text-2xl font-extrabold text-[#123D32]">

                  Saved Opportunities

                </h2>

                <p className="mt-2 text-sm text-[#718077]">

                  Keep track of scholarships and schemes you want to explore.

                </p>

              </div>

            </div>



            {bookmarks.length > 0 ? (

              <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2">

                {bookmarks.map((bookmark) => (

                  <article
                    key={bookmark.bookmarkId}
                    className="rounded-2xl border border-[#E4E8E0] bg-white p-6 shadow-sm transition hover:border-[#D6B779] hover:shadow-lg"
                  >

                    <div className="flex items-center gap-3">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF3EC] text-[#075B46]">

                        {bookmark.kind === "scholarship" ? (

                          <GraduationCap size={22} />

                        ) : (

                          <Landmark size={22} />

                        )}

                      </div>


                      <span className="rounded-full bg-[#FBF4E5] px-3 py-1 text-[9px] font-bold uppercase text-[#876A2F]">

                        {bookmark.kind}

                      </span>

                    </div>


                    <h3 className="mt-5 text-base font-bold text-[#123D32]">

                      {bookmark.title}

                    </h3>


                    <div className="mt-5 flex items-center justify-between gap-3">

                      <Link
                        href={
                          bookmark.kind === "scholarship"
                            ? `/scholarships/${bookmark.slug}`
                            : `/schemes/${bookmark.slug}`
                        }
                        className="inline-flex items-center gap-2 text-xs font-bold text-[#075B46] hover:text-[#B8954B]"
                      >

                        View Opportunity

                        <ArrowUpRight size={15} />

                      </Link>


                      <span className="text-[10px] text-[#7B847D]">

                        Saved

                      </span>

                    </div>

                  </article>

                ))}

              </div>

            ) : (

              <div className="mt-7 rounded-2xl border border-dashed border-[#D8DCCF] bg-white px-6 py-14 text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EEF3EC]">

                  <Bookmark
                    size={28}
                    className="text-[#075B46]"
                  />

                </div>


                <h3 className="mt-5 text-lg font-bold text-[#123D32]">

                  No Saved Opportunities Yet

                </h3>


                <p className="mt-2 text-sm leading-7 text-[#718077]">

                  Explore BenefitX and save scholarships or schemes
                  that interest you.

                </p>


                <div className="mt-6 flex flex-wrap justify-center gap-3">

                  <Link
                    href="/scholarships"
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#075B46] px-5 text-xs font-bold text-white"
                  >

                    Scholarships

                    <ArrowRight size={15} />

                  </Link>


                  <Link
                    href="/schemes"
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#D6B779] px-5 text-xs font-bold text-[#123D32]"
                  >

                    Government Schemes

                    <ArrowRight size={15} />

                  </Link>

                </div>

              </div>

            )}

          </section>


          {/* ACCOUNT SETTINGS */}

          <section className="mt-10 rounded-2xl border border-[#E4E8E0] bg-white p-6">

            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF3EC] text-[#075B46]">

                  <Settings size={22} />

                </div>

                <div>

                  <h3 className="font-bold text-[#123D32]">

                    Account Settings

                  </h3>

                  <p className="mt-1 text-xs text-[#718077]">

                    Manage your BenefitX account.

                  </p>

                </div>

              </div>


              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex min-h-[45px] items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 text-xs font-bold text-red-700 transition hover:bg-red-100"
              >

                <LogOut size={16} />

                Sign Out

              </button>

            </div>

          </section>


        </div>

      </section>

    </main>

  );

}