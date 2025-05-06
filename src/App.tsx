import type { Collection, CollectionItem } from "framer-plugin";
import "./App.css";
import { framer } from "framer-plugin";
import { ChangeEvent, useEffect, useState } from "react";
import { db } from "./config/db-config";
import { addDoc, collection } from "firebase/firestore";
import { formatFramerCmsData } from "./utils/format-framer-data";
import firebaseLogo from "./assets/firebaseLogo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLoading } from "./components/Loading";

export function App() {
  const { controlLoading, LoadingComponent } = useLoading();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null);
  const [firebaseConfig, setFirebaseConfig] = useState<object>({
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

    Promise.all([framer.getCollections(), framer.getActiveCollection()]).then(
      ([collections, activeCollection]) => {
        setCollections(collections);
        setSelectedCollection(activeCollection);
      }
    );
  }, []);

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFirebaseConfig((prev) => ({ ...prev, [name]: value }));
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
        data: parsedFramerCmsItems,
      };
      await addDoc(collection(dbFirebase, "framer_cms"), formattedFirebaseData);

      toast.success("Salvo com sucesso!");
      console.log("Dados enviados com sucesso!");
    } catch (e) {
      console.error(e);
      toast.error(`Ocorreu um erro! ${e}`);
    }
    controlLoading(false);
  };

  return (
    <>
      <div className="flex flex-col gap-4 !p-4 text-sm  w-[100%]">
        <h1 className="text-lg font-semibold text-blue-50">
          Envie dados do Framer para o Firebase
        </h1>
        <img src={firebaseLogo} className="w-auto h-24" />
        <p className="text-gray-600 text-xs">
          Escolha uma coleção e preencha as credenciais do seu projeto Firebase
          para exportar os dados do CMS Framer.
        </p>
        <div className="w-auto h-[1px] bg-blue-50 my-2"></div>
        <div className="flex flex-col gap-2">
          <label className="text-blue-50 opacity-70 font-medium">
            Coleção do Framer:
          </label>
          <select
            onChange={selectCollection}
            value={selectedCollection?.id ?? ""}
            className="select"
          >
            <option value="" disabled>
              Selecione uma coleção…
            </option>
            {collections.map((collection) => (
              <option key={collection.id} value={collection.id}>
                {collection.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-blue-50 opacity-70 font-medium">
            Credenciais Firebase:
          </label>
          {Object.keys(firebaseConfig).map((key) => (
            <input
              key={key}
              className="input"
              name={key}
              type="password"
              placeholder={`Cole seu ${key}`}
              onChange={onChangeInput}
            />
          ))}
        </div>

        <button
          disabled={
            !selectedCollection ||
            Object.values(firebaseConfig).some((credencial) => !credencial)
          }
          onClick={handleSyncData}
          className="mt-2 p-2 rounded bg-blue-600 text-white font-semibold disabled:bg-gray-400"
        >
          Sincronizar dados
        </button>
      </div>
      <ToastContainer />
      <LoadingComponent />
    </>
  );
}
