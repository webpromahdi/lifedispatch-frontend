// ── Shared Architectural UI Primitives ──
// Used across multiple dashboard role views (Patient, Driver, Dispatcher, HospitalStaff, Admin)

// Corner Triangle Notch Decoration
export function CornerNotch() {
  return (
    <div
      className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary pointer-events-none"
      style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }}
      aria-hidden="true"
    />
  );
}

// Notched Label Tab
export function LabelTab({ label }: { label: string }) {
  return (
    <div
      className="inline-flex items-center px-3.5 py-1 bg-[#E6F8F6] text-primary-dark text-xs font-bold uppercase tracking-wider select-none"
      style={{
        clipPath: "polygon(0 0, 100% 0, calc(100% - 10px) 100%, 0 100%)",
      }}
    >
      {label}
    </div>
  );
}
