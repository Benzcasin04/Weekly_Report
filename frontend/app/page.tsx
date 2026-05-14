"use client";
import { useState, useEffect, useCallback } from "react";
import { WeeklyReport, NavPage } from "@/types";
import { api } from "@/lib/api";
import { exportToExcel, exportToPDF, exportToWord } from "@/lib/exports";
import { useToast } from "@/components/Toast";
import { HomePage } from "@/components/HomePage";
import { AddNotePage } from "@/components/AddNotePage";
import { ReportPage } from "@/components/ReportPage";

const navItems: { id: NavPage; label: string; icon: string }[] = [
  { id: "home", label: "Home", icon: "⌂" },
  { id: "add", label: "Add Note", icon: "+" },
  { id: "report", label: "Report", icon: "≡" },
];

export default function Page() {
  const [page, setPage] = useState<NavPage>("home");
  const [reports, setReports] = useState<WeeklyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const { show } = useToast();

  const fetchReports = useCallback(async () => {
    const data = await api.getAll();
    setReports(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  const handleCreate = async (data: { name: string; note: string }) => {
    await api.create(data);
    await fetchReports();
    show("Note saved successfully!", "success");
    setPage("home");
  };

  const handleUpdate = async (id: string, data: { name: string; note: string }) => {
    await api.update(id, data);
    await fetchReports();
    show("Entry updated.", "success");
  };

  const handleDelete = async (id: string) => {
    await api.delete(id);
    await fetchReports();
    show("Entry deleted.", "info");
  };

  const handleExportExcel = async (rows?: WeeklyReport[]) => {
    await exportToExcel(rows ?? reports);
    show("Exported to Excel!", "success");
  };

  const handleExportPDF = async (rows?: WeeklyReport[]) => {
    await exportToPDF(rows ?? reports);
    show("Exported to PDF!", "success");
  };

  const handleExportWord = async (rows?: WeeklyReport[]) => {
    await exportToWord(rows ?? reports);
    show("Exported to Word!", "success");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header
        style={{
          position: "sticky", top: 0, zIndex: 100,
          background: "rgba(13,15,20,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border)",
          padding: "0 32px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          height: 60,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setPage("home")}>
          <div style={{ width: 32, height: 32, background: "var(--accent)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className="serif" style={{ fontSize: 16, fontWeight: 700, color: "#111" }}>W</span>
          </div>
          <span className="serif" style={{ fontSize: 20, color: "var(--text)" }}>Weeklog</span>
          <span style={{ fontSize: 10, color: "var(--accent)", background: "rgba(240,192,64,0.12)", border: "1px solid rgba(240,192,64,0.25)", borderRadius: 4, padding: "1px 6px", fontWeight: 600, letterSpacing: "0.06em" }}>B1G</span>
        </div>

        <nav style={{ display: "flex", gap: 4 }}>
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setPage(item.id)}
              style={{
                padding: "7px 16px", borderRadius: 7, border: "none",
                background: page === item.id ? "var(--surface2)" : "transparent",
                color: page === item.id ? "var(--text)" : "var(--text3)",
                cursor: "pointer", fontSize: 13, fontFamily: "inherit",
                fontWeight: page === item.id ? 600 : 400,
                display: "flex", alignItems: "center", gap: 6,
                transition: "all 0.15s", position: "relative",
              }}
            >
              {page === item.id && (
                <span style={{ position: "absolute", bottom: -1, left: "20%", right: "20%", height: 2, background: "var(--accent)", borderRadius: 1 }} />
              )}
              <span style={{ opacity: 0.7 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 12, color: "var(--text3)" }}>
            {new Date().toLocaleDateString("en-PH", { weekday: "short", month: "short", day: "numeric" })}
          </span>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--success)", boxShadow: "0 0 6px var(--success)" }} />
        </div>
      </header>

      <main style={{ flex: 1, padding: "48px 32px", maxWidth: 1100, width: "100%", margin: "0 auto" }}>
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, flexDirection: "column", gap: 16, color: "var(--text3)" }}>
            <div style={{ width: 36, height: 36, border: "2px solid var(--border2)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <span style={{ fontSize: 13 }}>Loading…</span>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <>
            {page === "home" && <HomePage reports={reports} onNavigate={setPage} onExportExcel={() => handleExportExcel()} />}
            {page === "add" && <AddNotePage onSubmit={handleCreate} />}
            {page === "report" && (
              <ReportPage
                reports={reports}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
                onExportExcel={handleExportExcel}
                onExportPDF={handleExportPDF}
                onExportWord={handleExportWord}
              />
            )}
          </>
        )}
      </main>

      <footer style={{ borderTop: "1px solid var(--border)", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="serif" style={{ fontSize: 13, color: "var(--text3)", fontStyle: "italic" }}>Weeklog — B1G Weekly Report System</span>
        <span style={{ fontSize: 11, color: "var(--text3)" }}>{reports.length} entr{reports.length !== 1 ? "ies" : "y"} · Frontend Preview</span>
      </footer>
    </div>
  );
}
