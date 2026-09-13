import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, updateProfile } from "firebase/auth";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  setDoc,
  getDocs,
  arrayUnion,
  writeBatch,
} from "firebase/firestore";
import { auth, db } from "../firebase.js";
import { collectKnownUsers } from "../data/mockData.js";
import { seedCameras } from "../data/cctvData.js";

const FarmContext = createContext(null);

function useLiveCollection(name) {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const unsub = onSnapshot(collection(db, name), (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [name]);
  return items;
}

export function FarmStoreProvider({ children }) {
  // undefined = auth state still loading, null = signed out, object = signed in
  const [firebaseUser, setFirebaseUser] = useState(undefined);
  const [authError, setAuthError] = useState("");

  useEffect(() => onAuthStateChanged(auth, (u) => setFirebaseUser(u)), []);

  const transactions = useLiveCollection("transactions");
  const works = useLiveCollection("works");
  const plans = useLiveCollection("plans");
  const todayUpdates = useLiveCollection("todayUpdates");
  const cameras = useLiveCollection("cameras");
  const cctvAlerts = useLiveCollection("cctvAlerts");
  const profiles = useLiveCollection("profiles");

  // ফার্মের ৫টি নির্দিষ্ট ক্যামেরা/zone — Firestore-এ একবারই সেভ হবে, যদি খালি থাকে।
  useEffect(() => {
    (async () => {
      const snap = await getDocs(collection(db, "cameras"));
      if (snap.empty) {
        const batch = writeBatch(db);
        seedCameras().forEach((cam) => {
          const { id, ...rest } = cam;
          batch.set(doc(db, "cameras", id), rest);
        });
        await batch.commit();
      }
    })();
  }, []);

  const currentUser = firebaseUser ? firebaseUser.displayName || "" : "";

  const loginWithGoogle = async () => {
    setAuthError("");
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const u = result.user;
      await setDoc(doc(db, "profiles", u.uid), { name: u.displayName || "", email: u.email }, { merge: true });
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user" && err.code !== "auth/cancelled-popup-request") {
        setAuthError("লগইন করা যায়নি — আবার চেষ্টা করুন");
      }
      throw err;
    }
  };

  const logout = () => signOut(auth);

  const setDisplayName = async (name) => {
    if (!auth.currentUser) return;
    const trimmed = name.trim();
    await updateProfile(auth.currentUser, { displayName: trimmed });
    await setDoc(doc(db, "profiles", auth.currentUser.uid), { name: trimmed, email: auth.currentUser.email }, { merge: true });
    setFirebaseUser({ ...auth.currentUser });
  };

  const actions = useMemo(
    () => ({
      loginWithGoogle,
      logout,
      setDisplayName,
      addTransaction: (tx) => addDoc(collection(db, "transactions"), tx),
      addPlan: (plan) => addDoc(collection(db, "plans"), { ...plan, comments: [], convertedToWorkId: null }),
      addComment: (planId, comment) =>
        updateDoc(doc(db, "plans", planId), {
          comments: arrayUnion({ ...comment, id: `${Date.now()}_${Math.random().toString(36).slice(2)}` }),
        }),
      addTodayUpdate: (update) => addDoc(collection(db, "todayUpdates"), update),
      updateWorkProgress: (workId, patch) => updateDoc(doc(db, "works", workId), patch),
      convertPlanToWork: async (planId, workDraft) => {
        const ref = await addDoc(collection(db, "works"), workDraft);
        await updateDoc(doc(db, "plans", planId), { convertedToWorkId: ref.id });
      },
      retryCamera: (cameraId) => updateDoc(doc(db, "cameras", cameraId), { status: "online", lastConnected: null }),
      setCameraRecording: (cameraId, enabled) => updateDoc(doc(db, "cameras", cameraId), { recordingEnabled: enabled }),
      markAlertViewed: (alertId) => updateDoc(doc(db, "cctvAlerts", alertId), { status: "viewed" }),
    }),
    []
  );

  const knownUsers = useMemo(
    () => collectKnownUsers({ currentUser, transactions, works, plans, todayUpdates, profiles }),
    [currentUser, transactions, works, plans, todayUpdates, profiles]
  );

  const value = useMemo(
    () => ({
      firebaseUser,
      currentUser,
      authError,
      transactions,
      works,
      plans,
      todayUpdates,
      cameras,
      cctvAlerts,
      knownUsers,
      ...actions,
    }),
    [firebaseUser, currentUser, authError, transactions, works, plans, todayUpdates, cameras, cctvAlerts, knownUsers, actions]
  );

  return <FarmContext.Provider value={value}>{children}</FarmContext.Provider>;
}

export function useFarm() {
  const ctx = useContext(FarmContext);
  if (!ctx) throw new Error("useFarm must be used inside FarmStoreProvider");
  return ctx;
}
