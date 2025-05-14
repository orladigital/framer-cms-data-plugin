import type { CollectionItem } from "framer-plugin";
import "./App.css";
import { framer } from "framer-plugin";
import { useEffect, useState } from "react";
import { db } from "./config/db-config";
import { addDoc, collection } from "firebase/firestore";
import { formatFramerCmsData } from "./utils/format-framer-data";
import firebaseLogo from "./assets/framerFirebase.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLoading } from "./components/loading/useLoading";
import { LoadingComponent } from "./components/loading/Loading";
import { useFirebaseConfig } from "./hooks/useFirebaseConfig";
import { useCollections } from "./hooks/useCollections";
import { FormattedFirebaseData } from "./types/types";

export function App() {
  const { controlLoading, isLoading } = useLoading();
  const [showPasswords, setShowPasswords] = useState(false);
  const { firebaseConfig, updateFirebaseConfig, isConfigValid } = useFirebaseConfig();
  const { collections, selectedCollection, selectCollection } = useCollections();

  useEffect(() => {
    framer.showUI({
      width: 340,
      height: 540,
      resizable: false,
    });
  }, []);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    await updateFirebaseConfig(name, value);
  };

  const handleCollectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    selectCollection(e.target.value);
  };

  const handleSyncData = async () => {
    if (!selectedCollection || !isConfigValid) return;

    controlLoading(true);

    try {
      const dbFirebase = db(firebaseConfig);
      const items: CollectionItem[] = await selectedCollection.getItems();

      const parsedFramerCmsItems = items
        .filter((item: CollectionItem) => !item.draft)
        .map(formatFramerCmsData);

      const formattedFirebaseData: FormattedFirebaseData = {
        dateBucket: new Date().toISOString(),
        collectionId: selectedCollection.id,
        collectionName: selectedCollection.name,
        data: parsedFramerCmsItems,
      };

      await addDoc(collection(dbFirebase, "framer_cms"), formattedFirebaseData);
      toast.success("Saved successfully!");
    } catch (e) {
      console.error(e);
      toast.error(`An error occurred: ${e}`);
    }

    controlLoading(false);
  };

  return (
    <>
      <div className="flex flex-col gap-4 !p-4 text-sm w-full">
        <h1 className="text-lg font-semibold">
          Export Framer CMS Data to Firebase
        </h1>
        <img src={firebaseLogo} className="w-auto h-24" />
        <p className="text-xs">
          Select a collection and enter your Firebase project credentials to
          export your Framer CMS data.
        </p>
        <hr />
        <div className="flex flex-col gap-2">
          <label className="opacity-70 font-medium">Select Collection</label>
          <select
            onChange={handleCollectionChange}
            value={selectedCollection?.id ?? ""}
            className="select"
          >
            <option value="" disabled>
              Select a collection
            </option>
            {collections.map((collection) => (
              <option key={collection.id} value={collection.id}>
                {collection.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-end items-center">
            <h3 className="opacity-70 font-medium">Firebase Credentials</h3>
            <p className="text-[10px] !ml-auto !mr-1">
              {showPasswords ? "Hide passwords: " : "Show passwords: "}
            </p>
            <button
              type="button"
              onClick={() => setShowPasswords(!showPasswords)}
              className="button-password-visibility"
            >
              {showPasswords ? "🔒" : "👁️"}
            </button>
          </div>
          {Object.keys(firebaseConfig).map((key) => (
            <input
              key={key}
              className="input"
              name={key}
              type={showPasswords ? "text" : "password"}
              placeholder={`Enter your ${key}`}
              onChange={handleInputChange}
              value={firebaseConfig[key as keyof typeof firebaseConfig]}
            />
          ))}
        </div>

        <button
          disabled={
            !selectedCollection ||
            !isConfigValid
          }
          onClick={handleSyncData}
          className="mt-2 p-2 rounded bg-blue-600 text-white font-semibold disabled:bg-gray-400"
        >
          Export Data
        </button>
      </div>
      <ToastContainer />
      <LoadingComponent loading={isLoading} />
    </>
  );
}
