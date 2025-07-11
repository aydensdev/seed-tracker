import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, updateDoc, getDoc, query, collection, getDocs } from 'firebase/firestore';

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

provider.setCustomParameters({
  prompt: 'select_account' // Always show account picker
});

const signInButton = document.getElementById("sign-in-button");
signInButton.onclick = signInRequest; 

const locations = [];
const dropdown = document.getElementById("location-select");
const table = document.getElementById("table");
var currentLocation;

// Auto sign in, otherwise use button

onAuthStateChanged(getAuth(), (user) => {
    if (user) init()
});

async function signInRequest()
{
    const auth = getAuth();
    signInWithPopup(auth, provider).catch((error) => 
    {
        alert("Failed Sign In: " + error.message);
    });
}

async function init()
{  
    var snapshot;
    try 
    {
        snapshot = await getDocs(collection(db, "locations"));
    }
    catch (error) 
    {
        alert("Cannot access the database: " + error.message);
        return;
    }

    snapshot.forEach(doc => locations.push(doc.id));
    const inventory = snapshot.docs[0].data(); // Use default location
    currentLocation = locations[0];

    // Reveal everything after sign in 

    dropdown.style.display = "block";
    dropdown.parentElement.style.justifyContent = "space-evenly";

    table.style.display = "block"; 
    signInButton.style.display = "none";

    document.getElementById("tools").style.display = "flex";
    document.getElementById("upload-button").onclick = uploadCurrentLocation;

    // Create the dropdown locations

    locations.forEach(location => 
    {
        let option = document.createElement("option");
        option.value, option.textContent = location;
        dropdown.appendChild(option);
    });

    render(inventory);
}

function render(inventory)
{
    // Display the inventory in a table

    const ordered = Object.keys(inventory).sort().reduce(
        (obj, key) => { 
            obj[key] = inventory[key]; 
            return obj;
        }, {}
    );

    table.innerHTML = "";
    table.insertRow().innerHTML = `<th>Item</th><th>Quantity</th>`;
    for (const item in ordered)
    {
        table.insertRow().innerHTML = 
        `<th>${item}</th>
        <td>
            <input value=${ordered[item]} type="number" min="0" id="${item}"/>
        </td>`;
    }
}

async function uploadCurrentLocation()
{
    const inventory = {};
    for (let i = 1; i < table.rows.length; i++)
    {   
        const item = table.rows[i].cells[0].textContent;
        const quantity = table.rows[i].cells[1].children[0].value;
        inventory[item] = parseInt(quantity);
    };

    try 
    {
        await updateDoc(doc(db, "locations", currentLocation), inventory);
    } 
    catch (error) 
    {
        alert("Cannot access the database: " + error.message);
    }
}

dropdown.onchange = async () =>
{
    await uploadCurrentLocation();
    currentLocation = dropdown.value;

    try 
    {
        render((await getDoc(doc(db, "locations", currentLocation))).data());
    } 
    catch (error) 
    {
        alert("Cannot access the database: " + error.message);
    }
}