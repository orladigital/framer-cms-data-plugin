export interface DbCredentialsStructure {}


export interface mongoDbCredentialsStructure extends DbCredentialsStructure {
  uri: string;
  database: string;
}

export interface firebaseCredentialsStructure extends DbCredentialsStructure {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface couchDbCredentialsStructure  extends DbCredentialsStructure {
  uri: string;
  database: string;
}