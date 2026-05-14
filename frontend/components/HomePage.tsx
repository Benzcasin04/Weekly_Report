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
        border: `1px solid ${accent ? "var(--accent)" : "var(--border)"}`,
        borderRadius: 12,
        padding: "24px 28px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {accent && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: "var(--accent)",
          }}
        />
      )}
      <div
        style={{
          fontSize: 11,
          color: "var(--text3)",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: 10,
          fontWeight: 500,
        }}
      >
        {label}
      </div>
      <div
        className="serif"
        style={{
          fontSize: 36,
          color: accent ? "var(--accent)" : "var(--text)",
          lineHeight: 1,
          marginBottom: 6,
        }}
      >
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 12, color: "var(--text3)" }}>{sub}</div>
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
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      {/* Hero */}
      <div style={{ marginBottom: 48 }}>
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
          Dashboard
        </div>
        <h1
          className="serif"
          style={{ fontSize: 48, lineHeight: 1.1, marginBottom: 12 }}
        >
          Weekly Overview
        </h1>
        <p style={{ color: "var(--text2)", fontSize: 16, maxWidth: 520 }}>
          Track, manage, and export your team&apos;s weekly progress notes in one
          place.
        </p>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 40,
        }}
      >
        <StatCard label="Total Notes" value={reports.length} accent />
        <StatCard label="This Week" value={thisWeek} sub="new entries" />
        <StatCard label="Contributors" value={uniqueNames} sub="unique names" />
        <StatCard label="Last Updated" value={lastUpdated} />
      </div>

      {/* Actions */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          padding: "28px 32px",
          marginBottom: 32,
        }}
      >
        <div
          style={{
            fontSize: 12,
            color: "var(--text3)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 20,
            fontWeight: 500,
          }}
        >
          Quick Actions
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button
            onClick={() => onNavigate("add")}
            style={{
              padding: "12px 24px",
              background: "var(--accent)",
              color: "#111",
              border: "none",
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 16 }}>+</span> Add Note
          </button>
          <button
            onClick={() => onNavigate("report")}
            style={{
              padding: "12px 24px",
              background: "var(--surface2)",
              color: "var(--text)",
              border: "1px solid var(--border2)",
              borderRadius: 8,
              fontWeight: 500,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>📋</span> View Report
          </button>
          <button
            onClick={onExportExcel}
            style={{
              padding: "12px 24px",
              background: "var(--surface2)",
              color: "var(--text)",
              border: "1px solid var(--border2)",
              borderRadius: 8,
              fontWeight: 500,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>⬇</span> Export All to Excel
          </button>
        </div>
      </div>

      {/* Recent entries */}
      {reports.length > 0 && (
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "16px 24px",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: 12,
                color: "var(--text3)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
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
                color: "var(--accent)",
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
                padding: "16px 24px",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "var(--surface2)",
                  border: "1px solid var(--border2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--accent)",
                  flexShrink: 0,
                }}
              >
                {r.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 600,
                    color: "var(--text)",
                    fontSize: 13,
                    marginBottom: 2,
                  }}
                >
                  {r.name}
                </div>
                <div
                  style={{
                    color: "var(--text2)",
                    fontSize: 13,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {r.note}
                </div>
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--text3)",
                  whiteSpace: "nowrap",
                  alignSelf: "flex-start",
                  marginTop: 2,
                }}
              >
                {new Date(r.created_at).toLocaleDateString("en-PH", {
                  month: "short",
                  day: "numeric",
                })}
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
            color: "var(--text3)",
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>📝</div>
          <p style={{ fontSize: 16 }}>No notes yet. Add your first weekly note!</p>
        </div>
      )}
    </div>
  );
}
