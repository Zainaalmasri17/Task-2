import { create } from "zustand";

const useReportStore = create((set, get) => ({
  reports: [],

  addReport: (report) =>
    set((state) => ({
      reports: [...state.reports, report],
    })),

  removeReport: (id) =>
    set((state) => ({
      reports: state.reports.filter((r) => r.id !== id),
    })),

  markIgnored: (id) =>
    set((state) => ({
      reports: state.reports.map((r) =>
        r.id === id ? { ...r, status: "ignored" } : r
      ),
    })),
}));

export default useReportStore;
