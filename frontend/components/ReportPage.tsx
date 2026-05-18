import { useState, useMemo, useRef, useEffect } from "react";
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
    month: "short", day: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString("en-PH", {
    month: "short", day: "numeric", year: "numeric",
  });
}

const PAGE_SIZE = 5;

// ── 3-dot Dropdown Menu ────────────────────────────────────
function ActionsMenu({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        style={{
          width: 30, height: 30, borderRadius: 6,
          border: "1px solid var(--border)", background: "transparent",
          color: "var(--text2)", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, fontWeight: 700, letterSpacing: 1,
        }}
        title="Actions"
      >
        ⋯
      </button>
      {open && (
        <div style={{
          position: "absolute", right: 0, top: 36, zIndex: 200,
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: 8, boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
          minWidth: 130, overflow: "hidden",
        }}>
          <button
            onClick={(e) => { e.stopPropagation(); setOpen(false); onEdit(); }}
            style={{
              width: "100%", padding: "10px 14px",
              background: "transparent", border: "none",
              color: "var(--text)", cursor: "pointer",
              fontSize: 13, fontFamily: "inherit", fontWeight: 500,
              textAlign: "left", display: "flex", alignItems: "center", gap: 8,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface2)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            ✏️ Edit
          </button>
          <div style={{ height: 1, background: "var(--border)" }} />
          <button
            onClick={(e) => { e.stopPropagation(); setOpen(false); onDelete(); }}
            style={{
              width: "100%", padding: "10px 14px",
              background: "transparent", border: "none",
              color: "var(--danger)", cursor: "pointer",
              fontSize: 13, fontFamily: "inherit", fontWeight: 500,
              textAlign: "left", display: "flex", alignItems: "center", gap: 8,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(166,61,61,0.08)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            🗑️ Delete
          </button>
        </div>
      )}
    </div>
  );
}

// ── View Detail Dialog ─────────────────────────────────────
function ViewDialog({ report, onClose }: { report: WeeklyReport; onClose: () => void }) {
  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: 14, padding: 28, width: "100%", maxWidth: 520,
          animation: "dialogIn 0.2s ease",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%",
            background: "var(--surface2)", border: "1px solid var(--border)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 700, color: "var(--primary)", flexShrink: 0,
          }}>
            {report.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: "var(--text)" }}>{report.name}</div>
            <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 2 }}>
              Created {formatDate(report.created_at)}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              marginLeft: "auto", width: 28, height: 28,
              borderRadius: 6, border: "1px solid var(--border)",
              background: "transparent", color: "var(--text2)",
              cursor: "pointer", fontSize: 14, fontFamily: "inherit",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        {/* Note */}
        <div style={{
          background: "var(--bg)", border: "1px solid var(--border)",
          borderRadius: 8, padding: "14px 16px", marginBottom: 16,
        }}>
          <div style={{ fontSize: 10, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 8 }}>
            Weekly Note
          </div>
          <p style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
            {report.note}
          </p>
        </div>

        {/* Timestamps */}
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px" }}>
            <div style={{ fontSize: 10, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 4 }}>Created</div>
            <div style={{ fontSize: 12, color: "var(--text)" }}>{formatDate(report.created_at)}</div>
          </div>
          <div style={{ flex: 1, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px" }}>
            <div style={{ fontSize: 10, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 4 }}>Updated</div>
            <div style={{ fontSize: 12, color: "var(--text)" }}>{formatDate(report.updated_at)}</div>
          </div>
        </div>

        <style>{`@keyframes dialogIn { from { opacity:0; transform:scale(0.96) translateY(-8px); } to { opacity:1; transform:scale(1) translateY(0); } }`}</style>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────
export function ReportPage({
  reports, onDelete, onUpdate,
  onExportExcel, onExportPDF, onExportWord,
}: ReportPageProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editReport, setEditReport] = useState<WeeklyReport | null>(null);
  const [viewReport, setViewReport] = useState<WeeklyReport | null>(null);
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    return reports.filter((r) => {
      const matchSearch =
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.note.toLowerCase().includes(search.toLowerCase());
      const dateOk = filterDate
        ? new Date(r.created_at).toLocaleDateString("en-CA") === filterDate
        : true;
      return matchSearch && dateOk;
    });
  }, [reports, search, filterDate]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleSearch = (v: string) => { setSearch(v); setCurrentPage(1); };
  const handleFilterDate = (v: string) => { setFilterDate(v); setCurrentPage(1); };
  const clearFilters = () => { setSearch(""); setFilterDate(""); setCurrentPage(1); setSelected(new Set()); };

  const allSelected = paginated.length > 0 && paginated.every((r) => selected.has(r.id));
  const someSelected = selected.size > 0;

  const toggleAll = () => {
    const next = new Set(selected);
    if (allSelected) paginated.forEach((r) => next.delete(r.id));
    else paginated.forEach((r) => next.add(r.id));
    setSelected(next);
  };

  const toggleRow = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const selectedRows = reports.filter((r) => selected.has(r.id));
  const exportRows = someSelected ? selectedRows : filtered;
  const hasActiveFilters = search || filterDate;

  const outlineBtn: React.CSSProperties = {
    padding: "7px 12px", borderRadius: 7,
    border: "1px solid var(--border)", background: "transparent",
    color: "var(--text)", cursor: "pointer", fontSize: 12,
    fontWeight: 500, fontFamily: "inherit",
    whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 4,
  };

  const Checkbox = ({ checked, onClick }: { checked: boolean; onClick: () => void }) => (
    <div onClick={onClick} style={{
      width: 16, height: 16,
      border: `1.5px solid ${checked ? "var(--primary)" : "var(--border)"}`,
      borderRadius: 4, background: checked ? "var(--primary)" : "transparent",
      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    }}>
      {checked && (
        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
          <path d="M1 3.5L3.5 6L8 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );

  const PageBtn = ({ page, active, onClick, disabled, label }: {
    page?: number; active?: boolean; onClick: () => void; disabled?: boolean; label?: string;
  }) => (
    <button onClick={onClick} disabled={disabled} style={{
      width: 34, height: 34, borderRadius: 7,
      border: `1px solid ${active ? "var(--primary)" : "var(--border)"}`,
      background: active ? "var(--primary)" : "transparent",
      color: active ? "#fff" : disabled ? "var(--border)" : "var(--text)",
      cursor: disabled ? "not-allowed" : "pointer",
      fontSize: 13, fontFamily: "inherit", fontWeight: active ? 600 : 400,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {label ?? page}
    </button>
  );

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safePage > 3) pages.push("...");
      for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) pages.push(i);
      if (safePage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div style={{ width: "100%" }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: "clamp(16px, 3vw, 28px)" }}>
        <div style={{ fontSize: 11, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 10 }}>
          Weekly Report
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 className="serif" style={{ fontSize: "clamp(24px, 5vw, 42px)", lineHeight: 1.1 }}>B1G Weekly Report</h1>
            <p style={{ color: "var(--text2)", marginTop: 6, fontSize: 13 }}>
              {filtered.length} of {reports.length} entr{reports.length !== 1 ? "ies" : "y"}
              {someSelected && <span style={{ color: "var(--primary)", marginLeft: 8 }}>· {selected.size} selected</span>}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button onClick={() => onExportExcel(exportRows)} style={outlineBtn}>📊 <span className="export-label">Excel</span>{someSelected && <span style={{ color: "var(--primary)", fontWeight: 700 }}>({selected.size})</span>}</button>
            <button onClick={() => onExportPDF(exportRows)} style={outlineBtn}>📄 <span className="export-label">PDF</span>{someSelected && <span style={{ color: "var(--primary)", fontWeight: 700 }}>({selected.size})</span>}</button>
            <button onClick={() => onExportWord(exportRows)} style={outlineBtn}>📝 <span className="export-label">Word</span>{someSelected && <span style={{ color: "var(--primary)", fontWeight: 700 }}>({selected.size})</span>}</button>
          </div>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: "12px 12px 0 0", padding: "12px 16px",
        borderBottom: "1px solid var(--border)",
        display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap",
      }}>
        <input
          type="text" placeholder="Search by name or note…" value={search}
          onChange={(e) => handleSearch(e.target.value)}
          style={{
            flex: 1, minWidth: 140, padding: "8px 12px",
            background: "var(--bg)", border: "1px solid var(--border)",
            borderRadius: 7, color: "var(--text)", fontSize: 13,
            fontFamily: "inherit", outline: "none",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 11, color: "var(--text2)", whiteSpace: "nowrap" }}>📅 Filter Date</span>
          <input
            type="date" value={filterDate}
            onChange={(e) => handleFilterDate(e.target.value)}
            style={{
              padding: "7px 10px",
              background: filterDate ? "var(--primary)" : "var(--bg)",
              border: `1px solid ${filterDate ? "var(--primary)" : "var(--border)"}`,
              borderRadius: 7, color: filterDate ? "#fff" : "var(--text)",
              fontSize: 12, fontFamily: "inherit", outline: "none", cursor: "pointer",
            }}
          />
        </div>
        {hasActiveFilters && (
          <button onClick={clearFilters} style={{ ...outlineBtn, color: "var(--danger)", borderColor: "rgba(166,61,61,0.3)" }}>
            ✕ Clear
          </button>
        )}
        {someSelected && (
          <button onClick={() => setSelected(new Set())} style={{ ...outlineBtn, fontSize: 12 }}>
            Clear ({selected.size})
          </button>
        )}
        <span style={{ fontSize: 12, color: "var(--text2)", whiteSpace: "nowrap", marginLeft: "auto" }}>
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── DESKTOP TABLE ── */}
      <div className="table-view" style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderTop: "none", borderRadius: paginated.length === 0 ? "0 0 12px 12px" : "0",
        overflowX: "auto",
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 680 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--surface2)" }}>
              <th style={{ padding: "10px 14px", width: 40 }}>
                <Checkbox checked={allSelected} onClick={toggleAll} />
              </th>
              {["Name", "Note", "Created At", "Updated At", "Actions"].map((h) => (
                <th key={h} style={{
                  padding: "10px 14px", textAlign: "left",
                  fontSize: 11, color: "var(--text2)",
                  textTransform: "uppercase", letterSpacing: "0.08em",
                  fontWeight: 600, whiteSpace: "nowrap",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((r) => {
              const isSelected = selected.has(r.id);
              return (
                <tr
                  key={r.id}
                  onClick={() => setViewReport(r)}
                  style={{
                    borderBottom: "1px solid var(--border)",
                    background: isSelected ? "var(--surface2)" : "transparent",
                    transition: "background 0.1s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "var(--surface2)"; }}
                  onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
                >
                  <td style={{ padding: "12px 14px" }} onClick={(e) => e.stopPropagation()}>
                    <Checkbox checked={isSelected} onClick={() => toggleRow(r.id)} />
                  </td>
                  <td style={{ padding: "12px 14px", minWidth: 130 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: "50%",
                        background: "var(--surface2)", border: "1px solid var(--border)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 12, fontWeight: 700, color: "var(--primary)", flexShrink: 0,
                      }}>
                        {r.name.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 500, fontSize: 13 }}>{r.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 14px", color: "var(--text2)", fontSize: 13, maxWidth: 280 }}>
                    <div style={{
                      display: "-webkit-box", WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.5,
                    }}>
                      {r.note}
                    </div>
                  </td>
                  <td style={{ padding: "12px 14px", color: "var(--text2)", fontSize: 12, whiteSpace: "nowrap" }}>
                    {formatDate(r.created_at)}
                  </td>
                  <td style={{ padding: "12px 14px", color: "var(--text2)", fontSize: 12, whiteSpace: "nowrap" }}>
                    {formatDate(r.updated_at)}
                  </td>
                  <td style={{ padding: "12px 14px" }} onClick={(e) => e.stopPropagation()}>
                    <ActionsMenu
                      onEdit={() => setEditReport(r)}
                      onDelete={() => setDeleteId(r.id)}
                    />
                  </td>
                </tr>
              );
            })}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: "48px 20px", textAlign: "center", color: "var(--text2)" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>🔍</div>
                  {hasActiveFilters ? "No results match your filters." : "No entries yet."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── MOBILE CARDS ── */}
      <div className="card-view" style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderTop: "none", borderRadius: paginated.length === 0 ? "0 0 12px 12px" : "0",
        overflow: "hidden",
      }}>
        {paginated.length > 0 && (
          <div style={{
            padding: "10px 16px", borderBottom: "1px solid var(--border)",
            display: "flex", alignItems: "center", gap: 10, background: "var(--surface2)",
          }}>
            <Checkbox checked={allSelected} onClick={toggleAll} />
            <span style={{ fontSize: 12, color: "var(--text2)" }}>
              {allSelected ? "Deselect all" : "Select all"}
            </span>
            {someSelected && (
              <span style={{ fontSize: 12, color: "var(--primary)", marginLeft: "auto", fontWeight: 600 }}>
                {selected.size} selected
              </span>
            )}
          </div>
        )}
        {paginated.map((r) => {
          const isSelected = selected.has(r.id);
          return (
            <div
              key={r.id}
              onClick={() => setViewReport(r)}
              style={{
                padding: "16px", borderBottom: "1px solid var(--border)",
                background: isSelected ? "var(--surface2)" : "transparent",
                transition: "background 0.1s", cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                <div onClick={(e) => e.stopPropagation()}>
                  <Checkbox checked={isSelected} onClick={() => toggleRow(r.id)} />
                </div>
                <div style={{
                  width: 34, height: 34, borderRadius: "50%",
                  background: "var(--surface2)", border: "1px solid var(--border)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 700, color: "var(--primary)", flexShrink: 0,
                }}>
                  {r.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</span>
                    <span style={{ fontSize: 11, color: "var(--text2)", whiteSpace: "nowrap", marginLeft: 8 }}>
                      {formatDateShort(r.created_at)}
                    </span>
                  </div>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                  <ActionsMenu onEdit={() => setEditReport(r)} onDelete={() => setDeleteId(r.id)} />
                </div>
              </div>
              <p style={{
                fontSize: 13, color: "var(--text2)", lineHeight: 1.6,
                marginBottom: 0, paddingLeft: 58,
                display: "-webkit-box", WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical", overflow: "hidden",
              }}>
                {r.note}
              </p>
            </div>
          );
        })}
        {paginated.length === 0 && (
          <div style={{ padding: "48px 20px", textAlign: "center", color: "var(--text2)" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>🔍</div>
            {hasActiveFilters ? "No results match your filters." : "No entries yet."}
          </div>
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderTop: "1px solid var(--border)", borderRadius: "0 0 12px 12px",
          padding: "12px 16px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 10,
        }}>
          <span style={{ fontSize: 12, color: "var(--text2)" }}>
            Page {safePage} of {totalPages} · {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <PageBtn label="←" onClick={() => setCurrentPage(safePage - 1)} disabled={safePage === 1} />
            {getPageNumbers().map((p, i) =>
              p === "..." ? (
                <span key={`e-${i}`} style={{ fontSize: 13, color: "var(--text2)", padding: "0 4px" }}>…</span>
              ) : (
                <PageBtn key={p} page={p} active={p === safePage} onClick={() => setCurrentPage(p as number)} />
              )
            )}
            <PageBtn label="→" onClick={() => setCurrentPage(safePage + 1)} disabled={safePage === totalPages} />
          </div>
        </div>
      )}

      {/* ── Dialogs ── */}
      {viewReport && (
        <ViewDialog report={viewReport} onClose={() => setViewReport(null)} />
      )}
      {deleteId && (
        <ConfirmDialog
          title="Delete Entry"
          message="This action cannot be undone. The entry will be permanently removed."
          confirmLabel="Delete" danger
          onConfirm={async () => { await onDelete(deleteId); setDeleteId(null); }}
          onCancel={() => setDeleteId(null)}
        />
      )}
      {editReport && (
        <EditDialog
          report={editReport}
          onSave={async (data) => { await onUpdate(editReport.id, data); setEditReport(null); }}
          onCancel={() => setEditReport(null)}
        />
      )}

      {/* ── Responsive ── */}
      <style>{`
        @media (max-width: 640px) {
          .table-view { display: none !important; }
          .card-view { display: block !important; }
          .export-label { display: none; }
        }
        @media (min-width: 641px) {
          .table-view { display: block !important; }
          .card-view { display: none !important; }
          .export-label { display: inline; }
        }
        .dialog-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          z-index: 8000;
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          animation: fadeInOverlay 0.2s ease;
        }
        @keyframes fadeInOverlay { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}