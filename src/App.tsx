import type { CollectionItem } from "framer-plugin";
import "./App.css";
import { framer } from "framer-plugin";
import { useEffect, useState } from "react";

import { formatFramerCmsData } from "./utils/format-framer-data";
import firebaseLogo from "./assets/framerFirebase.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLoading } from "./components/loading/useLoading";
import { LoadingComponent } from "./components/loading/Loading";
import { useCollections } from "./hooks/useCollections";
import { FormattedFramerCmsData } from "./types/types";
import { SupportedDBs } from "./exporters/supportedDbs";
import { DbCredentialsStructure } from "./exporters/connectionsConfig";

import { dbParametersConfig } from "./config/dbParametersConfig";
import { exportedData } from "./hooks/exportedData";
export function App() {
  const { controlLoading, isLoading } = useLoading();
  const { collections, selectedCollection, selectCollection } = useCollections();
  const [showPasswords, setShowPasswords] = useState(false);
  const [dbType, setDbType] = useState<SupportedDBs>(SupportedDBs.FIREBASE);
  const [dbCredentials, setDbCredentials] = useState<DbCredentialsStructure>(dbParametersConfig[dbType].credentialsIterable);

  useEffect(() => {
      setDbCredentials(dbParametersConfig[dbType].credentialsIterable);
  }, [dbType]);


  useEffect(() => {
    framer.showUI({
      width: 340,
      height: 540,
      resizable: false,
    });
  }, []);

  const handleInputCredentialsChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    //implementar validation do nome do campo para o dbType
    if(true) {
    setDbCredentials(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCollectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    selectCollection(e.target.value);
  };

  function handleDbTypeChange(dbType: SupportedDBs) {
    setDbType(dbType);
  }

  const handleSyncData = async () => {
    if (!selectedCollection) return;

    controlLoading(true);

    try {
      const items: CollectionItem[] = await selectedCollection.getItems();

      const parsedFramerCmsItems = items
        .filter((item: CollectionItem) => !item.draft)
        .map(formatFramerCmsData);

      const formattedFirebaseData: FormattedFramerCmsData = {
        dateBucket: new Date().toISOString(),
        collectionId: selectedCollection.id,
        collectionName: selectedCollection.name,
        data: parsedFramerCmsItems,
      };

      await exportedData(dbType, dbCredentials, formattedFirebaseData);
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
          <label className="opacity-70 font-medium">Select Database</label>
        <div className="flex flex-row gap-2 w-full">
          {Object.values(SupportedDBs).map((buttonDbType, index) => (
            <button key={index} onClick={() => handleDbTypeChange(buttonDbType)} className="button !w-[33%]" disabled={dbType === buttonDbType}>
              <img src={dbParametersConfig[buttonDbType].image} className="w-full h-full" />
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-end items-center">
            <h3 className="opacity-70 font-medium">{dbType} Credentials</h3>
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
          {dbCredentials && Object.keys(dbCredentials).map((key) => (
            <input
              key={key}
              className="input"
              name={key}
              type={showPasswords ? "text" : "password"}
              placeholder={`Enter your ${key}`}
              onChange={handleInputCredentialsChange}
              value={dbCredentials[key as keyof typeof dbCredentials]}
            />
          ))}
        </div>

        <button
          disabled={
            !selectedCollection ||
            Object.values(dbCredentials).some(value => value === "")
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
