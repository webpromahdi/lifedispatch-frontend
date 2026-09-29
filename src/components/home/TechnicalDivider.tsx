export function TechnicalDivider({
  variant = "notch-down",
}: {
  variant?: "notch-down" | "notch-up" | "straight";
}) {
  if (variant === "straight") {
    return (
      <div
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-none select-none"
        aria-hidden="true"
      >
        <div className="w-full h-px bg-slate-200" />
      </div>
    );
  }

  return (
    <div
      className="w-full overflow-hidden pointer-events-none select-none py-1 sm:py-2"
      aria-hidden="true"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <svg
          className="w-full h-5 sm:h-6 text-slate-200"
          preserveAspectRatio="none"
          viewBox="0 0 1200 24"
          fill="none"
        >
          <title>Technical circuit divider</title>
          {variant === "notch-down" ? (
            <path
              d="M0 6 L260 6 L280 18 L920 18 L940 6 L1200 6"
              stroke="currentColor"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
          ) : (
            <path
              d="M0 18 L260 18 L280 6 L920 6 L940 18 L1200 18"
              stroke="currentColor"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
          )}
        </svg>
      </div>
    </div>
  );
}
