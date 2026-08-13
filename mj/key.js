// Firebase v11 SDKs imported as ES Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

// Your Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAzxBCRdwK4NIyGwkzBrV9ev_53MJIfsOM",
    authDomain: "smexgod.firebaseapp.com",
    projectId: "smexgod",
    storageBucket: "smexgod.firebasestorage.app",
    messagingSenderId: "34615632505",
    appId: "1:34615632505:web:6e7b5c39e847854ded6aa8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

/**
 * Validates the access key from Firestore.
 * Expects a collection named 'valid_keys' where document ID is the actual Key.
 * Document should have a field 'expiresAt' containing the expiry timestamp (in milliseconds).
 */
export async function validateAccessKey(keyString) {
    if (!keyString) return false;

    try {
        // Sign in anonymously to access Firestore securely
        await signInAnonymously(auth);

        // Fetch the key document from 'valid_keys' collection
        const keyRef = doc(db, "valid_keys", keyString);
        const keySnap = await getDoc(keyRef);

        if (keySnap.exists()) {
            const data = keySnap.data();
            const expiryTime = data.expiresAt; 
            const currentTime = Date.now();

            // Check if 48 hours validity is still active
            if (currentTime < expiryTime) {
                return true; // Key is valid
            } else {
                console.warn("Key has expired.");
                return false; // Key expired
            }
        }
        
        console.warn("Key not found in database.");
        return false; // Key doesn't exist
    } catch (error) {
        console.error("Firebase Key Validation Error:", error);
        return false; // Fallback to false on error
    }
}
