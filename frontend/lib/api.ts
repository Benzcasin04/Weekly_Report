import { WeeklyReport } from "@/types";
import { v4 as uuidv4 } from "uuid";

// In-memory store (replace with actual FastAPI calls)
let store: WeeklyReport[] = [
  {
    id: uuidv4(),
    name: "Maria Santos",
    note: "Completed Q2 pipeline review and aligned with cross-functional teams on deliverables. Resolved 3 blockers from last sprint.",
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: uuidv4(),
    name: "James Reyes",
    note: "Finalized front-end components for the dashboard redesign. Code review done on 5 PRs. Attended architecture sync.",
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: uuidv4(),
    name: "Ana Cruz",
    note: "Submitted weekly compliance report. Coordinated with legal for updated NDAs. Prepared onboarding materials for two new hires.",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const api = {
  getAll: async (): Promise<WeeklyReport[]> => {
    await delay(300);
    return [...store].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  },

  create: async (data: { name: string; note: string }): Promise<WeeklyReport> => {
    await delay(400);
    const now = new Date().toISOString();
    const record: WeeklyReport = {
      id: uuidv4(),
      name: data.name,
      note: data.note,
      created_at: now,
      updated_at: now,
    };
    store = [record, ...store];
    return record;
  },

  update: async (
    id: string,
    data: { name: string; note: string }
  ): Promise<WeeklyReport> => {
    await delay(400);
    const idx = store.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error("Not found");
    store[idx] = { ...store[idx], ...data, updated_at: new Date().toISOString() };
    return store[idx];
  },

  delete: async (id: string): Promise<void> => {
    await delay(300);
    store = store.filter((r) => r.id !== id);
  },
};

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}
