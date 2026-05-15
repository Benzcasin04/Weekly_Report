"use client";

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = "Confirm",
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div className="dialog-overlay" onClick={onCancel}>
      <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
        <div style={{ marginBottom: 8 }}>
          <h3
            className="serif"
            style={{ fontSize: 20, color: "var(--text)", marginBottom: 8 }}
          >
            {title}
          </h3>
          <p style={{ color: "var(--text2)", fontSize: 14, lineHeight: 1.6 }}>
            {message}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 24 }}>
          <button
            onClick={onCancel}
            style={{
              padding: "8px 18px",
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
            onClick={onConfirm}
            style={{
              padding: "8px 18px",
              borderRadius: 8,
              border: "none",
              background: danger ? "var(--danger)" : "var(--primary)",
              color: "#fff",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "inherit",
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
