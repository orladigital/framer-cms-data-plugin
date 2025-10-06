import {firebaseCredentialsStructure, couchDbCredentialsStructure, mongoDbCredentialsStructure } from "../exporters/connectionsConfig"
import { SupportedDBs } from "../exporters/supportedDbs"
import firebaseLogo from "../assets/firebaseLogo.svg"
import mongoLogo from "../assets/mongoDbLogo.svg"
import couchLogo from "../assets/couchDbLogo.svg"


export const dbParametersConfig = {
    [SupportedDBs.FIREBASE]: {
        image: firebaseLogo,
        credentialsIterable: <firebaseCredentialsStructure>{
            apiKey: "",
            authDomain: "",
            projectId: "",
            storageBucket: "",
            messagingSenderId: "",
            appId: "",
        },
    },
    [SupportedDBs.MONGODB]: {
        image: mongoLogo,
        credentialsIterable: <mongoDbCredentialsStructure>{
            uri: "",
            database: "",
        },
    },
    [SupportedDBs.COUCHDB]: {
        image: couchLogo,
        credentialsIterable: <couchDbCredentialsStructure>{
            uri: "",
            database: "",
        },
    },
}