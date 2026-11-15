import {

  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  deleteDoc

} from "firebase/firestore";

import { db } from "@/lib/firebase";


export type BookmarkKind =
  | "scholarship"
  | "scheme";


export interface UserBookmark {

  bookmarkId: string;

  opportunityId: string;

  kind: BookmarkKind;

  title: string;

  slug: string;

  sourceUrl: string;

  createdAt?: unknown;

}


export function createBookmarkId(

  kind: BookmarkKind,

  slug: string

) {

  return `${kind}__${slug}`;

}


export async function saveBookmark(

  uid: string,

  opportunity: {

    kind: BookmarkKind;

    title: string;

    slug: string;

    sourceUrl: string;

  }

) {

  const bookmarkId = createBookmarkId(

    opportunity.kind,

    opportunity.slug

  );


  await setDoc(

    doc(
      db,
      "users",
      uid,
      "bookmarks",
      bookmarkId
    ),

    {

      bookmarkId,

      opportunityId: opportunity.slug,

      kind: opportunity.kind,

      title: opportunity.title,

      slug: opportunity.slug,

      sourceUrl: opportunity.sourceUrl,

      createdAt: serverTimestamp()

    }

  );

}


export async function removeBookmark(

  uid: string,

  kind: BookmarkKind,

  slug: string

) {

  const bookmarkId = createBookmarkId(kind, slug);

  await deleteDoc(

    doc(
      db,
      "users",
      uid,
      "bookmarks",
      bookmarkId
    )

  );

}


export function subscribeToBookmarks(

  uid: string,

  callback: (items: UserBookmark[]) => void,

  onError?: (error: Error) => void

) {

  const bookmarksRef = collection(

    db,

    "users",

    uid,

    "bookmarks"

  );


  return onSnapshot(

    bookmarksRef,

    (snapshot) => {

      const items = snapshot.docs.map((item) =>

        item.data() as UserBookmark

      );

      callback(items);

    },

    (error) => {

      onError?.(error);

    }

  );

}