// Automatically generate/overwrite with database template, ran once at start

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyC9VZzeLZDHJuKkjBlsTgJlDiutb1fMAak",
    authDomain: "seed-tracker-fcc97.firebaseapp.com",
    projectId: "seed-tracker-fcc97",
    storageBucket: "seed-tracker-fcc97.firebasestorage.app",
    messagingSenderId: "797439018740",
    appId: "1:797439018740:web:7f21a580b02454fefc80a1",
    measurementId: "G-YW6EN9MCXN"
};

const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

const signInButton = document.getElementById("sign-in-button");
signInButton.onclick = async () =>
{
    const auth = getAuth();
    var user = (await signInWithPopup(auth, provider)).user;
    signInButton.style.display = "none";

    var locations = ["Grove", "Westminster", "Victoria"];
    var seedTypes = ["Arugula", "Beet", "Cucumber", "Lettuce", "Radish", "Turnip", "Spinach"];
    var initalSeeds = 0;

    var defaultDoc = Object.fromEntries(seedTypes.map(type => [type, initalSeeds]));

    locations.forEach(async (location) => {
        await setDoc(doc(db, "locations", location), defaultDoc);
    });

    console.log("Sucessfully initialized databse for " + user.displayName);
}




