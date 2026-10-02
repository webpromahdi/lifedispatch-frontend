import { ChartNoAxesCombined, ShieldCheck, Zap } from "lucide-react";

function ClearerOperationsIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

const reasons = [
  {
    number: "01",
    icon: Zap,
    title: "Faster Coordination",
    description:
      "Move from emergency request to ambulance response without unnecessary handoffs.",
  },
  {
    number: "02",
    icon: ClearerOperationsIcon,
    title: "Clearer Operations",
    description:
      "Keep emergency, ambulance, and hospital activity visible in one coordinated workflow.",
  },
  {
    number: "03",
    icon: ShieldCheck,
    title: "Accountable Response",
    description:
      "Maintain structured operational records and audit trails so critical actions remain traceable.",
  },
];

export function WhyLifeDispatchSection() {
  return (
    <section
      id="why-lifedispatch"
      aria-labelledby="why-lifedispatch-heading"
      className="py-10 sm:py-14 lg:py-16 bg-background relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* ── Left Column: Editorial Heading & Description ── */}
          <div className="lg:col-span-5 flex flex-col justify-center pr-4 sm:pr-6 lg:pr-8 xl:pr-14 lg:border-r lg:border-slate-200 pb-8 lg:pb-0 border-b lg:border-b-0 border-slate-200">
            <div className="py-2">
              {/* Eyebrow Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-primary rounded-md mb-4 sm:mb-5 w-fit shadow-xs">
                <ChartNoAxesCombined
                  className="h-4 w-4 text-primary"
                  strokeWidth={2.2}
                  aria-hidden="true"
                />
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-800">
                  Why LifeDispatch
                </span>
              </div>

              {/* Heading */}
              <h2
                id="why-lifedispatch-heading"
                className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-slate-900 tracking-tight leading-[1.12]"
              >
                Built Around
                <span className="block">the Moments</span>
                <span className="block text-primary">That Matter.</span>
              </h2>

              {/* Description */}
              <p className="mt-4 sm:mt-5 text-sm sm:text-[14.5px] text-slate-500 font-normal leading-relaxed max-w-[265px]">
                LifeDispatch helps organizations respond faster, operate more
                clearly, and maintain accountability across every emergency.
              </p>
            </div>
          </div>

          {/* ── Right Column: Editorial List Rows (Subtle Separators) ── */}
          <div className="lg:col-span-7 flex flex-col justify-center divide-y divide-slate-200 pt-6 lg:pt-0">
            {reasons.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.number}
                  className="py-3.5 sm:py-4 lg:py-4.5 pl-0 lg:pl-8 xl:pl-12 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0"
                >
                  {/* Left part: Number Badge + Icon + Title */}
                  <div className="flex items-center gap-3.5 sm:gap-4 w-full sm:w-[275px] xl:w-[295px] shrink-0">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-base sm:text-[17px] text-primary shrink-0 select-none">
                      {item.number}
                    </div>
                    <div className="shrink-0 text-primary">
                      <Icon
                        className="h-6 w-6"
                        strokeWidth={2.2}
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base sm:text-[17px] tracking-tight whitespace-nowrap">
                      {item.title}
                    </h3>
                  </div>

                  {/* Vertical Separator */}
                  <div
                    className="hidden sm:block w-px h-10 lg:h-11 bg-slate-200 shrink-0 mx-5 lg:mx-6 xl:mx-7"
                    aria-hidden="true"
                  />

                  {/* Right part: Description */}
                  <div className="flex-1">
                    <p className="text-slate-500 text-sm sm:text-[14px] leading-relaxed max-w-62.5">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
