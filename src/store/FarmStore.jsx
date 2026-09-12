import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { seedTransactions, seedWorks, seedPlans, seedTodayUpdates } from "../data/mockData.js";

const STORAGE_KEY = "nazir-agro-farm-app-v1";

function loadInitial() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (data && data.transactions && data.works && data.plans && data.todayUpdates) {
        return { currentUser: "আমি", ...data };
      }
    }
  } catch (err) {
    /* ignore, fall back to seed data */
  }
  return {
    currentUser: "আমি",
    transactions: seedTransactions(),
    works: seedWorks(),
    plans: seedPlans(),
    todayUpdates: seedTodayUpdates(),
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
      setCurrentUser: (name) => setState((s) => ({ ...s, currentUser: name })),
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
    }),
    []
  );

  const value = useMemo(() => ({ ...state, ...actions }), [state, actions]);

  return <FarmContext.Provider value={value}>{children}</FarmContext.Provider>;
}

export function useFarm() {
  const ctx = useContext(FarmContext);
  if (!ctx) throw new Error("useFarm must be used inside FarmStoreProvider");
  return ctx;
}
