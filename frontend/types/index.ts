export interface WeeklyReport {
  id: string;
  name: string;
  note: string;
  created_at: string;
  updated_at: string;
}

export type NavPage = "home" | "add" | "report";
