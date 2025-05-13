import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getRemoteConfig } from "firebase/remote-config";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD8Vott51SkP36Ddk_bIfbV_HYD3H1gLq8",
  authDomain: "phantomchecker.firebaseapp.com",
  projectId: "phantomchecker",
  storageBucket: "phantomchecker.appspot.com",
  messagingSenderId: "244539211443",
  appId: "1:244539211443:web:22b381a0c2b190f488bac6",
  measurementId: "G-D92392WTLJ",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const remoteConfig = getRemoteConfig(app);
remoteConfig.settings.minimumFetchIntervalMillis = 1000 * 60 * 1;

getAnalytics(app);

export const getCurrentUserEmail = () => {
  return auth.currentUser.email;
};

export { auth, db, remoteConfig, storage };
