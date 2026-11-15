export function getAuthErrorMessage(error: unknown): string {

  const code =
    typeof error === "object" &&
    error !== null &&
    "code" in error
      ? String(error.code)
      : "";

  const messages: Record<string, string> = {

    "auth/email-already-in-use":
      "This email already has an account. Try signing in.",

    "auth/invalid-email":
      "Please enter a valid email address.",

    "auth/weak-password":
      "Password is too weak. Use at least 8 characters.",

    "auth/operation-not-allowed":
      "Email/Password authentication is not enabled in Firebase.",

    "auth/invalid-api-key":
      "Firebase API key is incorrect. Check your configuration.",

    "auth/unauthorized-domain":
      "This website domain is not authorized in Firebase.",

    "auth/network-request-failed":
      "Network connection failed. Check your internet.",

    "auth/too-many-requests":
      "Too many attempts. Please try again later.",

    "auth/invalid-credential":
      "Invalid login credentials.",

    "auth/user-disabled":
      "This account has been disabled.",

    "permission-denied":
      "Firestore denied the request. Check your database security rules.",

    "unavailable":
      "Firebase service is temporarily unavailable.",

    "not-found":
      "Firebase database or requested resource was not found."

  };

  return messages[code] ||
    "Registration failed. Check the Firebase error code.";

}