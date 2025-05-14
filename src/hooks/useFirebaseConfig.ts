import { useState, useEffect } from 'react';
import { framer } from 'framer-plugin';
import { FirebaseConfig } from '../types/types';

const initialFirebaseConfig: FirebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};

export function useFirebaseConfig() {
  const [firebaseConfig, setFirebaseConfig] = useState<FirebaseConfig>(initialFirebaseConfig);

  useEffect(() => {
    const loadSavedCredentials = async () => {
      const savedCredentialFirebaseObject: FirebaseConfig = { ...initialFirebaseConfig };
      
      for (const key of Object.keys(initialFirebaseConfig)) {
        const credentialKey = await framer.getPluginData(key);
        savedCredentialFirebaseObject[key as keyof FirebaseConfig] = credentialKey || "";
      }
      
      setFirebaseConfig(savedCredentialFirebaseObject);
    };

    loadSavedCredentials();
  }, []);

  const updateFirebaseConfig = async (name: string, value: string) => {
    await framer.setPluginData(name, value);
    setFirebaseConfig(prev => ({ ...prev, [name]: value }));
  };

  const isConfigValid =  Object.values(firebaseConfig).every(value => value !== "");


  return {
    firebaseConfig,
    updateFirebaseConfig,
    isConfigValid
  };
} 