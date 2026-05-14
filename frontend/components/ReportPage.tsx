"use client";
import { useState, useMemo } from "react";
import { WeeklyReport } from "@/types";
import { ConfirmDialog } from "./ConfirmDialog";
import { EditDialog } from "./EditDialog";

interface ReportPageProps {
  reports: WeeklyReport[];
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, data: { name: string; note: string }) => Promise<void>;
  onExportExcel: (rows: WeeklyReport[]) => void;
  onExportPDF: (rows: WeeklyReport[]) => void;
  onExportWord: (rows: WeeklyReport[]) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-PH", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ReportPage({
  reports,
  onDelete,
  onUpdate,
  onExportExcel,
  onExportPDF,
  onExportWord,
}: ReportPageProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editReport, setEditReport] = useState<WeeklyReport | null>(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      reports.filter(
        (r) =>
          r.name.toLowerCase().includes(search.toLowerCase()) ||
          r.note.toLowerCase().includes(search.toLowerCase())
      ),
    [reports, search]
  );

  const allSelected =
    filtered.length > 0 && filtered.every((r) => selected.has(r.id));
  const someSelected = selected.size > 0;

  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((r) => r.id)));
    }
  };

  const toggleRow = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const selectedRows = reports.filter((r) => selected.has(r.id));
  const exportRows = someSelected ? selectedRows : filtered;

  const btnStyle = (variant: "primary" | "ghost" | "danger" | "outline"): React.CSSProperties => ({
    padding: "8px 14px",
    borderRadius: 7,
    border:
      variant === "ghost" || variant === "outline"
        ? "1px solid var(--border2)"
        : "none",
    background:
      variant === "primary"
        ? "var(--accent)"
        : variant === "danger"
        ? "rgba(232,85,85,0.12)"
        : "transparent",
    color:
      variant === "primary"
        ? "#111"
        : variant === "danger"
        ? "var(--danger)"
        : "var(--text2)",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: variant === "primary" ? 700 : 500,
    fontFamily: "inherit",
    whiteSpace: "nowrap",
  });

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div
          style={{
            fontSize: 11,
            color: "var(--accent)",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            fontWeight: 600,
            marginBottom: 12,
          }}
        >
          Weekly Report
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <h1 className="serif" style={{ fontSize: 42, lineHeight: 1.1 }}>
              B1G Weekly Report
            </h1>
            <p style={{ color: "var(--text2)", marginTop: 8, fontSize: 14 }}>
              {reports.length} total entr{reports.length !== 1 ? "ies" : "y"}
              {someSelected && (
                <span style={{ color: "var(--accent)", marginLeft: 8 }}>
                  · {selected.size} selected
                </span>
              )}
            </p>
          </div>

          {/* Export Controls */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {someSelected && (
              <span
                style={{
                  padding: "8px 12px",
                  background: "rgba(240,192,64,0.1)",
                  border: "1px solid rgba(240,192,64,0.3)",
                  borderRadius: 7,
                  fontSize: 11,
                  color: "var(--accent)",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {selected.size} selected
              </span>
            )}
            <button
              onClick={() => onExportExcel(exportRows)}
              style={btnStyle("outline")}
              title={someSelected ? "Export selected to Excel" : "Export all to Excel"}
            >
              📊 Excel{someSelected ? ` (${selected.size})` : ""}
            </button>
            <button
              onClick={() => onExportPDF(exportRows)}
              style={btnStyle("outline")}
              title={someSelected ? "Export selected to PDF" : "Export all to PDF"}
            >
              📄 PDF{someSelected ? ` (${selected.size})` : ""}
            </button>
            <button
              onClick={() => onExportWord(exportRows)}
              style={btnStyle("outline")}
              title={someSelected ? "Export selected to Word" : "Export all to Word"}
            >
              📝 Word{someSelected ? ` (${selected.size})` : ""}
            </button>
          </div>
        </div>
      </div>

      {/* Search + Table */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        {/* Toolbar */}
        <div
          style={{
            padding: "14px 20px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            gap: 12,
            alignItems: "center",
          }}
        >
          <input
            type="text"
            placeholder="Search by name or note…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              padding: "8px 12px",
              background: "var(--bg)",
              border: "1px solid var(--border2)",
              borderRadius: 7,
              color: "var(--text)",
              fontSize: 13,
              fontFamily: "inherit",
              outline: "none",
              maxWidth: 320,
            }}
          />
          {someSelected && (
            <button
              onClick={() => setSelected(new Set())}
              style={{ ...btnStyle("ghost"), fontSize: 12 }}
            >
              Clear selection
            </button>
          )}
          <span style={{ fontSize: 12, color: "var(--text3)", marginLeft: "auto" }}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: 700,
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid var(--border)",
                  background: "var(--surface2)",
                }}
              >
                <th style={{ padding: "11px 16px", width: 40 }}>
                  <div
                    className={`custom-checkbox ${allSelected ? "checked" : ""}`}
                    onClick={toggleAll}
                    style={{
                      width: 16,
                      height: 16,
                      border: `1.5px solid ${allSelected ? "var(--accent)" : "var(--border2)"}`,
                      borderRadius: 4,
                      background: allSelected ? "var(--accent)" : "transparent",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {allSelected && (
                      <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                        <path d="M1 3.5L3.5 6L8 1" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </th>
                {["Name", "Note", "Created At", "Updated At", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        padding: "11px 16px",
                        textAlign: "left",
                        fontSize: 11,
                        color: "var(--text3)",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const isSelected = selected.has(r.id);
                return (
                  <tr
                    key={r.id}
                    className={`report-row${isSelected ? " selected" : ""}`}
                    style={{
                      borderBottom: "1px solid var(--border)",
                      background: isSelected
                        ? "rgba(240,192,64,0.06)"
                        : "transparent",
                      transition: "background 0.1s",
                    }}
                  >
                    <td style={{ padding: "14px 16px" }}>
                      <div
                        onClick={() => toggleRow(r.id)}
                        style={{
                          width: 16,
                          height: 16,
                          border: `1.5px solid ${isSelected ? "var(--accent)" : "var(--border2)"}`,
                          borderRadius: 4,
                          background: isSelected ? "var(--accent)" : "transparent",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {isSelected && (
                          <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                            <path d="M1 3.5L3.5 6L8 1" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", minWidth: 140 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background: "var(--surface2)",
                            border: "1px solid var(--border2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 12,
                            fontWeight: 700,
                            color: "var(--accent)",
                            flexShrink: 0,
                          }}
                        >
                          {r.name.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 500, fontSize: 13 }}>{r.name}</span>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        color: "var(--text2)",
                        fontSize: 13,
                        maxWidth: 360,
                      }}
                    >
                      <div
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          lineHeight: 1.5,
                        }}
                      >
                        {r.note}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        color: "var(--text3)",
                        fontSize: 12,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatDate(r.created_at)}
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        color: "var(--text3)",
                        fontSize: 12,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatDate(r.updated_at)}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          onClick={() => setEditReport(r)}
                          style={{
                            padding: "6px 12px",
                            background: "var(--surface2)",
                            border: "1px solid var(--border2)",
                            borderRadius: 6,
                            color: "var(--text2)",
                            cursor: "pointer",
                            fontSize: 11,
                            fontFamily: "inherit",
                            fontWeight: 500,
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteId(r.id)}
                          style={{
                            padding: "6px 12px",
                            background: "rgba(232,85,85,0.1)",
                            border: "1px solid rgba(232,85,85,0.2)",
                            borderRadius: 6,
                            color: "var(--danger)",
                            cursor: "pointer",
                            fontSize: 11,
                            fontFamily: "inherit",
                            fontWeight: 500,
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      padding: "60px 20px",
                      textAlign: "center",
                      color: "var(--text3)",
                    }}
                  >
                    <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
                    {search ? "No results found." : "No entries yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirm */}
      {deleteId && (
        <ConfirmDialog
          title="Delete Entry"
          message="This action cannot be undone. The entry will be permanently removed."
          confirmLabel="Delete"
          danger
          onConfirm={async () => {
            await onDelete(deleteId);
            setDeleteId(null);
          }}
          onCancel={() => setDeleteId(null)}
        />
      )}

      {/* Edit Dialog */}
      {editReport && (
        <EditDialog
          report={editReport}
          onSave={async (data) => {
            await onUpdate(editReport.id, data);
            setEditReport(null);
          }}
          onCancel={() => setEditReport(null)}
        />
      )}
    </div>
  );
}
