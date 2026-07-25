export function SectionLabel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`text-[13px] uppercase tracking-[0.16em] text-muted ${className}`}
    >
      {children}
    </div>
  );
}
