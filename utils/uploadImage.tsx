// utils/uploadImage.ts

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/config/firebaseConfig";
import { v4 as uuidv4 } from "uuid";

export async function uploadImageAsync(uri: string, uid: string): Promise<string> {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const imageRef = ref(storage, `users/${uid}/meals/${uuidv4()}.jpg`);
    await uploadBytes(imageRef, blob);
    const downloadURL = await getDownloadURL(imageRef);
    return downloadURL;
  } catch (err) {
    console.error("Image upload failed:", err);
    throw new Error("Failed to upload image");
  }
}
