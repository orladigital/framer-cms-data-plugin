import type { Collection, CollectionItem } from "framer-plugin";
import "./App.css";
import { framer } from "framer-plugin";
import { ChangeEvent, useEffect, useState } from "react";
import { db } from "./config/db-config";
import { addDoc, collection } from "firebase/firestore";
import { formatFramerCmsData } from "./utils/format-framer-data";
import firebaseLogo from "./assets/framerFirebase.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLoading } from "./components/Loading";

export function App() {
  const { controlLoading, LoadingComponent } = useLoading();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null);
  const [showPasswords, setShowPasswords] = useState(false);
  const [firebaseConfig, setFirebaseConfig] = useState<any>({
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
  });

  useEffect(() => {
    framer.showUI({
      width: 340,
      height: 540,
      resizable: false,
    });
    controlLoading(true);
    Promise.all([framer.getCollections(), framer.getActiveCollection()]).then(
      ([collections, activeCollection]) => {
        setCollections(collections);
        setSelectedCollection(activeCollection);
      }
    );
    const savedCredentailFirebaseObject: any = {};
    (async () => {
      for (const key of Object.keys(firebaseConfig)) {
        const credentialKey = await framer.getPluginData(key);
        savedCredentailFirebaseObject[key] = credentialKey;
      }
      controlLoading(false);
      setFirebaseConfig(savedCredentailFirebaseObject);
    })();
  }, []);

  const onChangeInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    await framer.setPluginData(name, value);
    setFirebaseConfig((prev: any) => ({ ...prev, [name]: value }));
  };

  const selectCollection = (event: ChangeEvent<HTMLSelectElement>) => {
    const collection = collections.find(
      (collection) => collection.id === event.currentTarget.value
    );
    if (!collection) return;
    setSelectedCollection(collection);
  };

  const handleSyncData = async () => {
    if (!selectedCollection || !firebaseConfig) return;

    controlLoading(true);

    try {
      const dbFirebase = db(firebaseConfig);
      const items: CollectionItem[] = await selectedCollection?.getItems();

      const parsedFramerCmsItems = items
        .filter((item: CollectionItem) => !item.draft)
        .map(formatFramerCmsData);

      const formattedFirebaseData = {
        dateBucket: new Date().toISOString(),
        collectionId: selectedCollection.id,
        collectionName: selectedCollection.name,
        data: parsedFramerCmsItems,
      };
      await addDoc(collection(dbFirebase, "framer_cms"), formattedFirebaseData);

      toast.success("Saved successfully!");
      console.log("Data sent successfully!");
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
          Select a collection and enter your Firebase project credentials to export your Framer CMS data.
        </p>
        <hr />
        <div className="flex flex-col gap-2">
          <label className="opacity-70 font-medium">Select Collection</label>
          <select
            onChange={selectCollection}
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
              onChange={onChangeInput}
              value={firebaseConfig[key]}
            />
          ))}
        </div>

        <button
          disabled={
            !selectedCollection ||
            Object.values(firebaseConfig).some((credential) => !credential)
          }
          onClick={handleSyncData}
          className="mt-2 p-2 rounded bg-blue-600 text-white font-semibold disabled:bg-gray-400"
        >
          Export Data
        </button>
      </div>
      <ToastContainer />
      <LoadingComponent />
    </>
  );
}
