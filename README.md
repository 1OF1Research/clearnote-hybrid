# ClearNote Hybrid

A plain idea, done properly: your most private notes should never have to leave your device to be useful.

ClearNote is a web app (Chrome on desktop, version 139 or higher) with three actions on pasted text. Each action picks its own route, and every result states where it actually ran:

1. **Tidy privately** — cleans a private note into bullet points using on-device inference only (`ONLY_ON_DEVICE`). If no on-device model is available, it refuses rather than sending the text to the cloud.
2. **Quick summary** — hybrid (`PREFER_ON_DEVICE`): on-device when Gemini Nano is available in Chrome, cloud fallback when it is not.
3. **Deep read** — cloud first (`PREFER_IN_CLOUD`): a longer document gets structure, deadlines, and open questions from the stronger cloud model, with an on-device fallback when offline.

All generative inference goes through **Firebase AI Logic** (JS SDK v13.1.0+, `firebase-ai.js`). The three modes are set per feature in `src/main.js` with `InferenceMode`; the cloud model is named through `inCloudParams`; `initializeDeviceModel()` runs on the button click, before the request, as the hybrid guide requires; and the result line reads `inferenceSource` from the response, so the routing shown to the user is the routing that happened. No other model API is called anywhere.

App Check is wired in `src/main.js` (Firebase AI Logic enforces it). This repo ships the public web config in `src/config.js` on purpose — those values are client identifiers, not secrets — with the Fraud Defense (reCAPTCHA Enterprise) App Check provider registered for the hosted domain, and the project's browser key restricted in Google Cloud to only the APIs this app calls. That is what lets the hosted demo below run for anyone who opens it.

## Live demo
https://1of1research.github.io/clearnote-hybrid/ — open it, paste text (or use a sample), and run an action. Quick summary and Deep read complete in the cloud; Tidy privately runs on-device where Gemini Nano is available and refuses where it is not.

## Run it yourself
1. Create a free Firebase project. In the Firebase console, open **AI Services > AI Logic**, choose **Get started**, and pick the **Gemini Developer API** provider (no cost to start; no billing setup needed).
2. To use your own project instead of the shipped one, copy `src/config.example.js` to `src/config.js` and fill in your web app's project values.
3. For local runs against your own project, set `appCheckDebug` to `true` in `src/config.js`, open the app once, copy the App Check debug token from the browser console, and register it in Firebase console > **App Check** > your app > **Manage debug tokens**. For a hosted run, register a reCAPTCHA Enterprise site key for your domain instead.
4. Serve this folder statically (any static host, or `python3 -m http.server` for localhost) and open it in Chrome 139+ with the on-device model enabled: set `chrome://flags/#prompt-api-for-gemini-nano-multimodal-input` to **Enabled** and restart Chrome. The first on-device request may download Gemini Nano in the background.

## What was built during the submission period
Everything in this repo — first version 2026-11-23, inside the Nov 11–30 submission window.

License: Apache-2.0 (see LICENSE).
