import { formatFramerCmsData } from "../utils/format-framer-data";

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface FormattedFirebaseData {
    dateBucket: string;
    collectionId: string;
    collectionName: string;
    data: ReturnType<typeof formatFramerCmsData>[];
  }