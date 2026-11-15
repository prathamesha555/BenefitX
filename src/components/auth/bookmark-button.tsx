"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { doc, onSnapshot } from "firebase/firestore";

import { Bookmark, BookmarkCheck } from "lucide-react";

import { db } from "@/lib/firebase";

import { useAuth } from "./auth-provider";

import {

  saveBookmark,

  removeBookmark,

  createBookmarkId,

  type BookmarkKind

} from "@/lib/bookmarks";


interface BookmarkButtonProps {

  kind: BookmarkKind;

  title: string;

  slug: string;

  sourceUrl: string;

}


export default function BookmarkButton({

  kind,

  title,

  slug,

  sourceUrl

}: BookmarkButtonProps) {


  const { user } = useAuth();

  const router = useRouter();


  const [saved, setSaved] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");



  useEffect(() => {

    setSaved(false);

    setError("");


    if (!user) return;


    const bookmarkId = createBookmarkId(kind, slug);


    const bookmarkRef = doc(

      db,

      "users",

      user.uid,

      "bookmarks",

      bookmarkId

    );


    return onSnapshot(

      bookmarkRef,

      (snapshot) => {

        setSaved(snapshot.exists());

      },

      () => {

        setError("Unable to load bookmark status.");

      }

    );

  }, [user, kind, slug]);



  async function toggleBookmark() {


    setError("");


    if (!user) {

      router.push("/login");

      return;

    }


    if (!user.emailVerified) {

      router.push("/verify-email");

      return;

    }


    setLoading(true);


    try {

      if (saved) {

        await removeBookmark(
          user.uid,
          kind,
          slug
        );

      } else {

        await saveBookmark(

          user.uid,

          {
            kind,
            title,
            slug,
            sourceUrl
          }

        );

      }

    } catch {

      setError("Unable to update bookmark. Please try again.");

    } finally {

      setLoading(false);

    }

  }



  return (

    <div>

      <button
        type="button"
        onClick={toggleBookmark}
        disabled={loading}
        aria-label={
          saved ? "Remove saved opportunity" : "Save opportunity"
        }
        aria-pressed={saved}
        title={
          saved ? "Remove from saved opportunities" : "Save opportunity"
        }
        className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border px-3 text-xs font-bold transition disabled:opacity-60 ${
          saved

            ? "border-[#075B46] bg-[#EEF3EC] text-[#075B46]"

            : "border-[#D8DCCF] bg-white text-[#59665F] hover:border-[#D6B779] hover:text-[#075B46]"
        }`}
      >

        {saved ? (

          <BookmarkCheck size={16} />

        ) : (

          <Bookmark size={16} />

        )}


        <span>

          {loading
            ? "Saving..."
            : saved
              ? "Saved"
              : "Save"
          }

        </span>

      </button>


      {error && (

        <p
          role="alert"
          className="mt-1 text-[10px] text-red-600"
        >

          {error}

        </p>

      )}

    </div>

  );

}