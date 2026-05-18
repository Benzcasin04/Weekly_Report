import { WeeklyReport } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = {
  getAll: async (): Promise<WeeklyReport[]> => {
    const res = await fetch(`${BASE_URL}/api/v1/weekly-reports/`);
    if (!res.ok) throw new Error("Failed to fetch reports");
    return res.json();
  },

  create: async (data: { name: string; note: string }): Promise<WeeklyReport> => {
    const res = await fetch(`${BASE_URL}/api/v1/weekly-reports/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create report");
    return res.json();
  },

  // see none

  update: async (
    id: string,
    data: { name: string; note: string }
  ): Promise<WeeklyReport> => {
    const res = await fetch(`${BASE_URL}/api/v1/weekly-reports/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update report");
    return res.json();
  },

  delete: async (id: string): Promise<void> => {
    const res = await fetch(`${BASE_URL}/api/v1/weekly-reports/${id}`, {
      method: "DELETE",
    });
    if (!res.ok && res.status !== 204) throw new Error("Failed to delete report");
  },
};