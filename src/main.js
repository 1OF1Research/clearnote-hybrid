// ClearNote Hybrid — all generative inference goes through Firebase AI Logic.
// SDK surface verified firsthand 2026-11-23 against the official hybrid
// get-started + configuration-options pages (firebase.google.com/docs/
// ai-logic/hybrid/web/):
//  - Hybrid on-device inference requires JS SDK v13.1.0+ and Chrome 139+.
//  - InferenceMode values: ONLY_ON_DEVICE, PREFER_ON_DEVICE,
//    PREFER_IN_CLOUD, ONLY_IN_CLOUD. (There is no PREFER_CLOUD.)
//  - getAI needs an explicit backend: new GoogleAIBackend().
//  - The cloud model is named via inCloudParams, not a top-level `model`.
//  - initializeDeviceModel() must be called after/on a user interaction
//    (the button click) and before generateContent().
//  - result.response.inferenceSource reports where the run happened
//    (live-observed 2026-11-24: the value arrives lowercase, e.g.
//    "in_cloud"), which the UI normalizes so the routing is visible,
//    not claimed.
// Three modes, chosen per feature (venue FAQ allows per-feature modes):
//  1. Private tidy-up: ONLY_ON_DEVICE — sensitive text never leaves the device; throws rather than falling back.
//  2. Quick summary:  PREFER_ON_DEVICE (hybrid) — on-device when Nano is available, cloud fallback.
//  3. Deep read:      PREFER_IN_CLOUD — long documents get the stronger cloud model, on-device fallback offline.
// No other model API is called anywhere in this app.

import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app-check.js";
import { getAI, getGenerativeModel, GoogleAIBackend, InferenceMode } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-ai.js";
import { firebaseConfig, appCheckSiteKey, appCheckDebug } from "./config.js";

let ai = null;

export function initFirebase() {
  if (!firebaseConfig?.apiKey) return { ok: false, reason: "config-missing" };
  const app = initializeApp(firebaseConfig);
  // Local development: the AI Logic setup workflow enforces App Check.
  // With appCheckDebug set, the debug provider issues a token that must be
  // registered once in Firebase console > App Check > Manage debug tokens.
  if (appCheckDebug) self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  if (appCheckSiteKey || appCheckDebug) {
    initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(appCheckSiteKey || "debug"),
      isTokenAutoRefreshEnabled: true,
    });
  }
  ai = getAI(app, { backend: new GoogleAIBackend() });
  return { ok: true };
}

// Models are created inside the click handler path: creating the instance
// and calling initializeDeviceModel() happen on the user interaction, as
// the hybrid guide requires, not at page load.
async function makeModel(mode) {
  const model = getGenerativeModel(ai, {
    mode,
    inCloudParams: { model: "gemini-3.5-flash-lite" },
  });
  await model.initializeDeviceModel(() => {});
  return model;
}

async function run(mode, prompt) {
  const model = await makeModel(mode);
  const result = await model.generateContent(prompt);
  return {
    text: result.response.text(),
    source: result.response.inferenceSource || "unknown",
  };
}

export const tidyPrivate = (text) =>
  run(InferenceMode.ONLY_ON_DEVICE, `Tidy this private note into clean bullet points. Keep every fact, add nothing:\n\n${text}`);

export const summarizeQuick = (text) =>
  run(InferenceMode.PREFER_ON_DEVICE, `Summarize this in 3 plain sentences for the person who wrote it:\n\n${text}`);

export const deepRead = (text) =>
  run(InferenceMode.PREFER_IN_CLOUD, `Read this long document. Give: (1) what it is about, (2) decisions or deadlines it contains, (3) open questions. Plain language:\n\n${text}`);
