import type { Collection, CollectionItem } from "framer-plugin"
import "./App.css"
import { framer } from "framer-plugin"
import { ChangeEvent, useEffect, useState } from "react"
import { db } from "./config/db-config"
import { addDoc, collection } from "firebase/firestore"
import { formatFramerCmsData } from "./utils/format-firebase-data"
export function App() {
    
    const [collections, setCollections] = useState<Collection[]>([])
    const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null)
    const [firebaseConfig, setFirebaseConfig] = useState<object>({
        apiKey: "",
        authDomain: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: "",
        appId: ""
    })


    useEffect(() => {
        framer.showUI({
            width: 340,
            height: 340,
            resizable: false,
        })

        Promise.all([framer.getCollections(), framer.getActiveCollection()]).then(([collections, activeCollection]) => {
          
            setCollections(collections)
            setSelectedCollection(activeCollection)
        })
    }, [])

    const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFirebaseConfig((prev) => ({ ...prev, [name]: value }));
    }

    const selectCollection = (event: ChangeEvent<HTMLSelectElement>) => {
        const collection = collections.find(collection => collection.id === event.currentTarget.value)
        if (!collection) return
        setSelectedCollection(collection)
    }


    const handleSyncData = async () => {
        if (!selectedCollection || !firebaseConfig) return
        const dbFirebase = db(firebaseConfig)
 
        const items: CollectionItem[] = await selectedCollection?.getItems();
        const parsedFramerCmsItems = items.map(formatFramerCmsData)
        console.log(parsedFramerCmsItems)

        const formattedFirebaseData = {
            dateBucket: new Date().toISOString(), 
            data : parsedFramerCmsItems
        };
        console.log(formattedFirebaseData);
        await addDoc(collection(dbFirebase, "framer_cms"), formattedFirebaseData);
    
        console.log("Dados enviados com sucesso!")
    }

    return (
        <div className="export-collection">

            <div className="footer">
                <select
                    onChange={selectCollection}
                    className={!selectedCollection ? "footer-select footer-select--unselected" : "footer-select"}
                    value={selectedCollection?.id ?? ""}
                >
                    <option value="" disabled>
                        Select Collection…
                    </option>

                    {collections.map(collection => (
                        <option key={collection.id} value={collection.id}>
                            {collection.name}
                        </option>
                    ))}
                </select>
                
                <input className="input" name="apiKey" type="text" placeholder="Cole sua apiKey" onChange={(e)=>{onChangeInput(e)}}/>
                <input className="input" name="authDomain" type="text" placeholder="Cole sua authDomain" onChange={(e)=>{onChangeInput(e)}}/>
                <input className="input" name="projectId" type="text" placeholder="Cole sua projectId" onChange={(e)=>{onChangeInput(e)}}/>
                <input className="input" name="storageBucket" type="text" placeholder="Cole sua storageBucket" onChange={(e)=>{onChangeInput(e)}}/>
                <input className="input" name="messagingSenderId" type="text" placeholder="Cole sua messagingSenderId" onChange={(e)=>{onChangeInput(e)}}/>
                <input className="input" name="appId" type="text" placeholder="Cole sua appId" onChange={(e)=>{onChangeInput(e)}}/>
                <div className="footer-actions">
                    <button disabled={!selectedCollection} onClick={()=>{handleSyncData()}}>
                        Sincronizar dados
                    </button>
                </div>
            </div>
        </div>
    )
}
