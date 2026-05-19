"use client";
import { useState } from "react";

interface AddNotePageProps {
  onSubmit: (data: { name: string; note: string }) => Promise<void>;
}

export function AddNotePage({ onSubmit }: AddNotePageProps) {
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !note.trim()) return;
    setLoading(true);
    await onSubmit({ name: name.trim(), note: note.trim() });
    setName("");
    setNote("");
    setLoading(false);
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%",
    padding: "12px 16px",
    background: "var(--surface)",
    border: `1.5px solid ${focusedField === field ? "var(--primary)" : "var(--border)"}`,
    borderRadius: 8,
    color: "var(--text)",
    fontSize: 14,
    fontFamily: "inherit",
    outline: "none",
    transition: "border-color 0.15s",
    boxSizing: "border-box",
  });

  const isDisabled = loading || !name.trim() || !note.trim();

  return (
    <div className="addnote-wrap">

      {/* ── Header ── */}
      <div style={{ marginBottom: "clamp(24px, 4vw, 40px)" }}>
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
          New Entry
        </div>
        <h1
          className="serif"
          style={{
            fontSize: "clamp(26px, 5vw, 42px)",
            lineHeight: 1.1,
            marginBottom: 8,
          }}
        >
          Add Weekly Note
        </h1>
        <p style={{ color: "var(--text2)", fontSize: "clamp(13px, 2vw, 15px)" }}>
          Document your team member&apos;s weekly progress and accomplishments.
        </p>
      </div>

      {/* ── Form Card ── */}
      <form onSubmit={handleSubmit}>
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: "clamp(20px, 4vw, 32px)",
            display: "flex",
            flexDirection: "column",
            gap: "clamp(16px, 3vw, 24px)",
          }}
        >
          {/* Name Field */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 11,
                color: "var(--text2)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              Name <span style={{ color: "var(--primary)" }}>*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Juan dela Cruz"
              style={inputStyle("name")}
              onFocus={() => setFocusedField("name")}
              onBlur={() => setFocusedField(null)}
              required
            />
          </div>

          {/* Note Field */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 11,
                color: "var(--text2)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              Weekly Note <span style={{ color: "var(--primary)" }}>*</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Describe what was accomplished this week, blockers resolved, and upcoming plans…"
              rows={7}
              style={{
                ...inputStyle("note"),
                resize: "vertical",
                lineHeight: 1.7,
                minHeight: 140,
              }}
              onFocus={() => setFocusedField("note")}
              onBlur={() => setFocusedField(null)}
              required
            />
            <div
              style={{
                fontSize: 11,
                color: "var(--text2)",
                marginTop: 6,
                textAlign: "right",
              }}
            >
              {note.length} characters
            </div>
          </div>

          {/* Submit */}
          <div className="submit-row">
            <button
              type="submit"
              disabled={isDisabled}
              style={{
                padding: "13px 32px",
                background: isDisabled ? "var(--border)" : "var(--primary)",
                color: isDisabled ? "var(--text2)" : "#fff",
                border: "none",
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 14,
                cursor: isDisabled ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                transition: "all 0.15s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                whiteSpace: "nowrap",
              }}
            >
              {loading ? (
                <>
                  <span
                    style={{
                      width: 14,
                      height: 14,
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "#fff",
                      borderRadius: "50%",
                      display: "inline-block",
                      animation: "spin 0.7s linear infinite",
                    }}
                  />
                  Saving…
                </>
              ) : (
                "Save Note →"
              )}
            </button>
          </div>
        </div>
      </form>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Center the form, full width on mobile */
        .addnote-wrap {
          max-width: 600px;
          margin: 0 auto;
          width: 100%;
        }

        /* Submit button full-width on mobile */
        .submit-row {
          display: flex;
          justify-content: flex-end;
        }
        @media (max-width: 480px) {
          .submit-row {
            justify-content: stretch;
          }
          .submit-row button {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}