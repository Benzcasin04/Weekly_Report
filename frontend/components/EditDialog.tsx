"use client";
import { useState } from "react";
import { WeeklyReport } from "@/types";

interface EditDialogProps {
  report: WeeklyReport;
  onSave: (data: { name: string; note: string }) => Promise<void>;
  onCancel: () => void;
}

export function EditDialog({ report, onSave, onCancel }: EditDialogProps) {
  const [name, setName] = useState(report.name);
  const [note, setNote] = useState(report.note);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !note.trim()) return;
    setSaving(true);
    await onSave({ name: name.trim(), note: note.trim() });
    setSaving(false);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    color: "var(--text)",
    fontSize: 14,
    fontFamily: "inherit",
    outline: "none",
    transition: "border-color 0.15s",
  };

  return (
    <div className="dialog-overlay" onClick={onCancel}>
      <div className="dialog-box" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
        <h3 className="serif" style={{ fontSize: 22, marginBottom: 20 }}>
          Edit Entry
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>
              Note
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={5}
              style={{ ...inputStyle, resize: "vertical" }}
              onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 24 }}>
          <button
            onClick={onCancel}
            style={{
              padding: "9px 20px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--surface)",
              color: "var(--text)",
              cursor: "pointer",
              fontSize: 13,
              fontFamily: "inherit",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !name.trim() || !note.trim()}
            style={{
              padding: "9px 20px",
              borderRadius: 8,
              border: "none",
              background: "var(--primary)",
              color: "#fff",
              cursor: saving ? "not-allowed" : "pointer",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "inherit",
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
