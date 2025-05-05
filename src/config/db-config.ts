import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export const db = (firebaseConfig: any) => {
  const app = initializeApp(firebaseConfig);
  return getFirestore(app);
};
