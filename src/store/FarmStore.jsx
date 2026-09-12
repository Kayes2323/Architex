import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { seedTransactions, seedWorks, seedPlans, seedTodayUpdates, collectKnownUsers } from "../data/mockData.js";
import { seedCameras, seedCctvAlerts } from "../data/cctvData.js";

const STORAGE_KEY = "nazir-agro-farm-app-v3";

function loadInitial() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (data && data.transactions && data.works && data.plans && data.todayUpdates) {
        return { currentUser: null, ...data };
      }
    }
  } catch (err) {
    /* ignore, fall back to seed data */
  }
  return {
    currentUser: null,
    transactions: seedTransactions(),
    works: seedWorks(),
    plans: seedPlans(),
    todayUpdates: seedTodayUpdates(),
    cameras: seedCameras(),
    cctvAlerts: seedCctvAlerts(),
  };
}

let idSeq = 1000;
export function newId(prefix) {
  idSeq += 1;
  return `${prefix}_${idSeq}_${Date.now().toString(36)}`;
}

const FarmContext = createContext(null);

export function FarmStoreProvider({ children }) {
  const [state, setState] = useState(loadInitial);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      /* storage unavailable — prototype still works in-memory */
    }
  }, [state]);

  const actions = useMemo(
    () => ({
      login: (name) => setState((s) => ({ ...s, currentUser: name.trim() })),
      setCurrentUser: (name) => setState((s) => ({ ...s, currentUser: name.trim() })),
      addTransaction: (tx) =>
        setState((s) => ({ ...s, transactions: [{ ...tx, id: newId("t") }, ...s.transactions] })),
      addPlan: (plan) =>
        setState((s) => ({
          ...s,
          plans: [{ ...plan, id: newId("p"), comments: [], convertedToWorkId: null }, ...s.plans],
        })),
      addComment: (planId, comment) =>
        setState((s) => ({
          ...s,
          plans: s.plans.map((p) =>
            p.id === planId ? { ...p, comments: [...p.comments, { ...comment, id: newId("c") }] } : p
          ),
        })),
      addTodayUpdate: (update) =>
        setState((s) => ({ ...s, todayUpdates: [{ ...update, id: newId("u") }, ...s.todayUpdates] })),
      updateWorkProgress: (workId, patch) =>
        setState((s) => ({
          ...s,
          works: s.works.map((w) => (w.id === workId ? { ...w, ...patch } : w)),
        })),
      convertPlanToWork: (planId, workDraft) =>
        setState((s) => {
          const work = { ...workDraft, id: newId("w") };
          return {
            ...s,
            works: [work, ...s.works],
            plans: s.plans.map((p) => (p.id === planId ? { ...p, convertedToWorkId: work.id } : p)),
          };
        }),
      retryCamera: (cameraId) =>
        setState((s) => ({
          ...s,
          cameras: s.cameras.map((c) => (c.id === cameraId ? { ...c, status: "online", lastConnected: null } : c)),
        })),
      setCameraRecording: (cameraId, enabled) =>
        setState((s) => ({
          ...s,
          cameras: s.cameras.map((c) => (c.id === cameraId ? { ...c, recordingEnabled: enabled } : c)),
        })),
      markAlertViewed: (alertId) =>
        setState((s) => ({
          ...s,
          cctvAlerts: s.cctvAlerts.map((a) => (a.id === alertId ? { ...a, status: "viewed" } : a)),
        })),
    }),
    []
  );

  const knownUsers = useMemo(() => collectKnownUsers(state), [state]);
  const value = useMemo(() => ({ ...state, knownUsers, ...actions }), [state, knownUsers, actions]);

  return <FarmContext.Provider value={value}>{children}</FarmContext.Provider>;
}

export function useFarm() {
  const ctx = useContext(FarmContext);
  if (!ctx) throw new Error("useFarm must be used inside FarmStoreProvider");
  return ctx;
}
