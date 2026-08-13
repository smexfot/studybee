// fix.js - Only Handles Firebase Communication Securely
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

// Database Configuration (Separated from HTML completely)
const firebaseConfig = {
    apiKey: "AIzaSyAzxBCRdwK4NIyGwkzBrV9ev_53MJIfsOM",
    authDomain: "smexgod.firebaseapp.com",
    projectId: "smexgod",
    storageBucket: "smexgod.firebasestorage.app",
    messagingSenderId: "34615632505",
    appId: "1:34615632505:web:6e7b5c39e847854ded6aa8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Function to activate the key in the database
export async function saveGeneratedKeyToFirebase(newKey) {
    try {
        await signInAnonymously(auth);
        
        const expiresAt = Date.now() + (48 * 60 * 60 * 1000); // 48 Hours Validity
        
        await setDoc(doc(db, "valid_keys", newKey), {
            createdAt: Date.now(),
            expiresAt: expiresAt,
            status: "active",
            createdBy: "user_generate",
            maxDevices: 1,
            registeredDevices: []
        });
        
        return true;
    } catch (error) {
        console.error("Database Write Error:", error);
        return false;
    }
}
