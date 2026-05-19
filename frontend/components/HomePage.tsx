"use client";
import { WeeklyReport } from "@/types";

interface HomePageProps {
  reports: WeeklyReport[];
  onNavigate: (page: "add" | "report") => void;
  onExportExcel: () => void;
}

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: `1px solid ${accent ? "var(--primary)" : "var(--border)"}`,
        borderRadius: 12,
        padding: "20px 22px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {accent && (
        <div
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: 2,
            background: "var(--primary)",
          }}
        />
      )}
      <div
        style={{
          fontSize: 10,
          color: "var(--text2)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: 8,
          fontWeight: 500,
        }}
      >
        {label}
      </div>
      <div
        className="serif stat-value"
        style={{
          color: accent ? "var(--primary)" : "var(--text)",
          lineHeight: 1,
          marginBottom: 6,
        }}
      >
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 12, color: "var(--text2)" }}>{sub}</div>
      )}
    </div>
  );
}

export function HomePage({ reports, onNavigate, onExportExcel }: HomePageProps) {
  const lastUpdated =
    reports.length > 0
      ? new Date(
          Math.max(...reports.map((r) => new Date(r.updated_at).getTime()))
        ).toLocaleDateString("en-PH", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "—";

  const thisWeek = reports.filter((r) => {
    const d = new Date(r.created_at);
    const now = new Date();
    const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  }).length;

  const uniqueNames = new Set(reports.map((r) => r.name)).size;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", width: "100%" }}>

      {/* ── Hero ── */}
      <div style={{ marginBottom: "clamp(24px, 5vw, 48px)" }}>
        <div
          style={{
            fontSize: 11,
            color: "var(--text2)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            fontWeight: 600,
            marginBottom: 10,
          }}
        >
          Dashboard
        </div>
        <h1
          className="serif"
          style={{
            fontSize: "clamp(28px, 6vw, 48px)",
            lineHeight: 1.1,
            marginBottom: 10,
          }}
        >
          Weekly Overview
        </h1>
        <p style={{ color: "var(--text2)", fontSize: "clamp(13px, 2vw, 16px)", maxWidth: 520 }}>
          Track, manage, and export your team&apos;s weekly progress notes in one place.
        </p>
      </div>

      {/* ── Stats Grid ── */}
      <div className="stats-grid" style={{ marginBottom: "clamp(20px, 4vw, 40px)" }}>
        <StatCard label="Total Notes" value={reports.length} accent />
        <StatCard label="This Week" value={thisWeek} sub="new entries" />
        <StatCard label="Contributors" value={uniqueNames} sub="unique names" />
        <StatCard label="Last Updated" value={lastUpdated} />
      </div>

      {/* ── Quick Actions ── */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: "clamp(18px, 3vw, 28px) clamp(16px, 3vw, 32px)",
          marginBottom: "clamp(16px, 3vw, 32px)",
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: "var(--text2)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: 16,
            fontWeight: 500,
          }}
        >
          Quick Actions
        </div>
        <div className="actions-row">
          <button
            onClick={() => onNavigate("add")}
            style={{
              padding: "11px 20px",
              background: "var(--primary)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              gap: 8,
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ fontSize: 16 }}>+</span> Add Note
          </button>
          <button
            onClick={() => onNavigate("report")}
            style={{
              padding: "11px 20px",
              background: "var(--surface)",
              color: "var(--text)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontWeight: 500,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              gap: 8,
              whiteSpace: "nowrap",
            }}
          >
            <span>📋</span> View Report
          </button>
          <button
            onClick={onExportExcel}
            style={{
              padding: "11px 20px",
              background: "var(--surface)",
              color: "var(--text)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontWeight: 500,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              gap: 8,
              whiteSpace: "nowrap",
            }}
          >
            <span>⬇</span> Export All to Excel
          </button>
        </div>
      </div>

      {/* ── Recent Entries ── */}
      {reports.length > 0 && (
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "14px 20px",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: "var(--text2)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontWeight: 500,
              }}
            >
              Recent Entries
            </span>
            <button
              onClick={() => onNavigate("report")}
              style={{
                background: "none",
                border: "none",
                color: "var(--text)",
                fontSize: 12,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              View all →
            </button>
          </div>

          {reports.slice(0, 4).map((r) => (
            <div
              key={r.id}
              style={{
                padding: "14px 20px",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                gap: 14,
                alignItems: "flex-start",
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: "var(--surface2)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--primary)",
                  flexShrink: 0,
                }}
              >
                {r.name.charAt(0).toUpperCase()}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 8,
                    marginBottom: 3,
                  }}
                >
                  <span
                    style={{
                      fontWeight: 600,
                      color: "var(--text)",
                      fontSize: 13,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {r.name}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--text2)",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {new Date(r.created_at).toLocaleDateString("en-PH", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div
                  style={{
                    color: "var(--text2)",
                    fontSize: 12,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {r.note}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {reports.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "var(--text2)",
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>📝</div>
          <p style={{ fontSize: 15 }}>No notes yet. Add your first weekly note!</p>
        </div>
      )}

      {/* ── Responsive styles ── */}
      <style>{`
        /* Stats: 4 cols → 2 cols → 1 col */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }
        .stat-value { font-size: 42px; }

        @media (max-width: 860px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          .stat-value { font-size: 28px !important; }
        }

        /* Actions: row → column on very small */
        .actions-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        @media (max-width: 400px) {
          .actions-row {
            flex-direction: column;
          }
          .actions-row button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}