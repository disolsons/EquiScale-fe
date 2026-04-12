import type { ReactNode } from "react";

type TraceSidePanelProps = {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export default function TraceSidePanel({
  isOpen,
  title,
  onClose,
  children,
}: TraceSidePanelProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.25)",
          zIndex: 40,
        }}
      />

      <aside
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          width: "420px",
          maxWidth: "90vw",
          background: "#fff",
          borderLeft: "1px solid #ddd",
          boxShadow: "-8px 0 24px rgba(0,0,0,0.08)",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "20px 20px 16px",
            borderBottom: "1px solid #eee",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "12px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "12px",
                color: "#777",
                marginBottom: "6px",
                fontWeight: 500,
              }}
            >
              Traceability
            </div>
            <h3
              style={{
                margin: 0,
                fontSize: "20px",
                lineHeight: 1.2,
              }}
            >
              {title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              border: "1px solid #ddd",
              background: "#fff",
              borderRadius: "8px",
              padding: "8px 10px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>

        <div
          style={{
            padding: "20px",
            overflowY: "auto",
            flex: 1,
          }}
        >
          {children}
        </div>
      </aside>
    </>
  );
}