import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBq8CTdpjxMBlBf3Zepc6D-NgcnU8CWRQ4",
  authDomain: "agrispike-b8870.firebaseapp.com",
  databaseURL:
    "https://agrispike-b8870-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "agrispike-b8870",
  storageBucket: "agrispike-b8870.firebasestorage.app",
  messagingSenderId: "978511478238",
  appId: "1:978511478238:web:d42476fac5da3258a9b14f",
};

const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);