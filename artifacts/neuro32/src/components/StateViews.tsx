// Reusable EmptyState / ErrorState / LoadingState for collection views.
//
// Used in admin feeds and user LK to replace generic "нет данных" / silent
// skeletons with something intentional. All three share the same visual frame
// so they don't look like three different UIs.
import type { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
};

const frameStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "56px 24px",
  textAlign: "center",
  minHeight: 200,
  border: "1px dashed rgba(255,255,255,0.08)",
  borderRadius: 14,
  background: "rgba(255,255,255,0.02)",
};

const iconBox: React.CSSProperties = {
  width: 48,
  height: 48,
  display: "grid",
  placeItems: "center",
  borderRadius: 12,
  background: "rgba(240,165,0,0.08)",
  color: "var(--amber)",
  marginBottom: 16,
  fontSize: 24,
};

const titleStyle: React.CSSProperties = {
  fontFamily: "var(--fu)",
  fontSize: "1.05rem",
  color: "var(--t1)",
  margin: 0,
  marginBottom: 6,
  letterSpacing: "0.01em",
};

const descStyle: React.CSSProperties = {
  fontSize: "0.88rem",
  color: "var(--t3)",
  lineHeight: 1.5,
  margin: 0,
  maxWidth: 420,
};

const actionRow: React.CSSProperties = { marginTop: 18 };

export function EmptyState({ title, description, icon, action }: Props) {
  return (
    <div style={frameStyle} role="status" aria-live="polite">
      <div style={iconBox} aria-hidden="true">{icon ?? "∅"}</div>
      <h3 style={titleStyle}>{title}</h3>
      {description && <p style={descStyle}>{description}</p>}
      {action && <div style={actionRow}>{action}</div>}
    </div>
  );
}

export function ErrorState({
  title = "Не удалось загрузить данные",
  description,
  action,
}: Partial<Props>) {
  return (
    <div
      style={{ ...frameStyle, borderColor: "rgba(239,68,68,0.25)" }}
      role="alert"
    >
      <div
        style={{ ...iconBox, background: "rgba(239,68,68,0.1)", color: "#f87171" }}
        aria-hidden="true"
      >!</div>
      <h3 style={titleStyle}>{title}</h3>
      {description && <p style={descStyle}>{description}</p>}
      {action && <div style={actionRow}>{action}</div>}
    </div>
  );
}

export function LoadingState({ title = "Загружаем…" }: Partial<Props>) {
  return (
    <div style={frameStyle} role="status" aria-live="polite">
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "2px solid rgba(255,255,255,0.12)",
          borderTopColor: "var(--amber)",
          animation: "ssv-spin 0.9s linear infinite",
          marginBottom: 14,
        }}
        aria-hidden="true"
      />
      <h3 style={titleStyle}>{title}</h3>
      <style>{`@keyframes ssv-spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
