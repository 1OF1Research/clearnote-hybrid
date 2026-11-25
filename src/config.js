// Public web config for ClearNote Hybrid (Firebase project
// clearnote-hybrid, Spark, $0) — shipped in this repo on purpose:
// a browser app sends these values to every visitor, so they are
// client identifiers, not secrets. Protection comes from the
// controls around them, both verified 2026-11-25: the browser API
// key is restricted in Google Cloud to Firebase AI Logic,
// Firebase App Check, Firebase Installations, and reCAPTCHA
// Enterprise only, and App Check (Fraud Defense / reCAPTCHA
// Enterprise) is registered for this app and the Pages domain
// and enforced for AI Logic.
export const firebaseConfig = {
  apiKey: "AIzaSyDVKKFU2tA_WK18XiZXsb3Mi7D68xBB93g",
  authDomain: "clearnote-hybrid.firebaseapp.com",
  projectId: "clearnote-hybrid",
  storageBucket: "clearnote-hybrid.firebasestorage.app",
  messagingSenderId: "86170400372",
  appId: "1:86170400372:web:6bb725d640a5265c500321",
};
export const appCheckSiteKey = "6LexyzEuAAAAAMbXXXejtwRokHC5OptYOHB3AxcY";
export const appCheckDebug = false;
