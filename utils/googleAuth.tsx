import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/config/firebaseConfig";
import { useEffect } from "react";

WebBrowser.maybeCompleteAuthSession();

export function useGoogleAuth() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "379116480076-fm59utduk6k817ojgvtrhsqjh9m3cner.apps.googleusercontent.com", // Firebase → Web client ID
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => console.log("✅ Signed in with Google"))
        .catch((err) => console.error("❌ Google sign-in error:", err));
    }
  }, [response]);

  return { promptAsync, request };
}
