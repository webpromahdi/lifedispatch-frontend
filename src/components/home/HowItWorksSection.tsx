import {
  Ambulance,
  Building2,
  FileText,
  Headset,
  Settings,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: FileText,
    title: "Emergency Request",
    description:
      "A patient or authorized user submits an emergency request with the necessary details.",
  },
  {
    number: "02",
    icon: Headset,
    title: "Smart Dispatch",
    description:
      "Dispatchers evaluate the emergency and assign the right ambulance.",
  },
  {
    number: "03",
    icon: Ambulance,
    title: "Ambulance Response",
    description:
      "The assigned driver receives the trip and updates its progress in real time.",
  },
  {
    number: "04",
    icon: Building2,
    title: "Hospital Coordination",
    description:
      "Hospital staff can prepare for the incoming patient based on the live status.",
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="py-12 sm:py-16 lg:py-20 bg-background relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Section Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
          {/* Left: Eyebrow + Tagline Heading */}
          <div className="max-w-xl">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-primary rounded-md shadow-xs mb-3.5">
              <Settings
                className="h-3.5 w-3.5 text-primary"
                strokeWidth={2.5}
                aria-hidden="true"
              />
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-800">
                How It Works
              </span>
            </div>

            {/* Tagline Heading */}
            <h2
              id="how-it-works-heading"
              className="text-2xl sm:text-3xl lg:text-[40px] font-black text-slate-900 tracking-tight leading-[1.12]"
            >
              From Emergency Request
              <span className="block text-primary">to Hospital Arrival</span>
            </h2>
          </div>

          {/* Right: Description */}
          <div className="border-l-2 border-slate-200 pl-6 max-w-md self-start md:self-end pb-1">
            <p className="text-sm sm:text-[15px] text-slate-500 font-normal leading-relaxed">
              LifeDispatch connects each step of an emergency response
              <span className="md:block">in one coordinated workflow.</span>
            </p>
          </div>
        </div>

        {/* ── Horizontal 4-Step Timeline (Desktop / Tablet >= 768px) ── */}
        <div className="hidden md:grid grid-cols-4 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;

            return (
              <div
                key={step.number}
                className="relative flex flex-col items-center text-center px-3 sm:px-4"
              >
                {/* Numbered Box Row with Connecting Timeline Line */}
                <div className="relative w-full flex items-center justify-center h-11.5 mb-4 sm:mb-5">
                  {/* Timeline connector to the next box (for columns 0, 1, 2) */}
                  {!isLast && (
                    <div
                      className="absolute top-1/2 -translate-y-1/2 left-1/2 flex items-center pointer-events-none"
                      style={{ width: "100%", zIndex: 0 }}
                    >
                      {/* Left line segment from right edge of this box to chevron */}
                      <div className="h-[1.5px] bg-primary/70 flex-1 ml-[29px] mr-2.5" />

                      {/* Chevron arrow centered between adjacent boxes */}
                      <svg
                        width="7"
                        height="11"
                        viewBox="0 0 7 11"
                        fill="none"
                        className="text-primary shrink-0"
                        aria-hidden="true"
                      >
                        <path
                          d="M1 1L5.5 5.5L1 10"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>

                      {/* Right line segment from chevron to left edge of next box */}
                      <div className="h-[1.5px] bg-primary/70 flex-1 ml-2.5 mr-[27px]" />
                    </div>
                  )}

                  {/* 3D Octagonal Numbered Box */}
                  <div className="relative z-10 select-none">
                    <svg
                      viewBox="0 0 58 44"
                      className="w-13 h-10 sm:w-14 sm:h-[43px] overflow-visible text-primary"
                      fill="none"
                      aria-hidden="true"
                    >
                      {/* Right 3D extrusion facet */}
                      <polygon
                        points="10,2 44,2 51,9 51,35 44,42 10,42 3,35 3,9"
                        fill="currentColor"
                        transform="translate(3.5, 0)"
                      />
                      {/* Front octagonal card */}
                      <polygon
                        points="10,2 44,2 51,9 51,35 44,42 10,42 3,35 3,9"
                        fill="#ffffff"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinejoin="round"
                      />
                      {/* Step number */}
                      <text
                        x="27"
                        y="22.5"
                        fill="currentColor"
                        className="font-bold select-none"
                        fontSize="15.5"
                        fontWeight="700"
                        textAnchor="middle"
                        dominantBaseline="central"
                        style={{ fontFamily: "inherit" }}
                      >
                        {step.number}
                      </text>
                    </svg>
                  </div>
                </div>

                {/* Step Icon: sitting directly below numbered box, centered */}
                <Icon
                  className="h-7 w-7 text-primary mb-3 shrink-0"
                  strokeWidth={2}
                  aria-hidden="true"
                />

                {/* Step Title: centered directly below icon */}
                <h3 className="font-bold text-slate-900 text-sm sm:text-[15px] mb-1.5 leading-snug">
                  {step.title}
                </h3>

                {/* Step Description: centered directly below title */}
                <p className="text-slate-500 text-xs sm:text-[13px] leading-relaxed max-w-[205px]">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* ── Vertical Responsive Timeline (Mobile < 768px) ── */}
        <div className="md:hidden flex flex-col gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;
            return (
              <div
                key={step.number}
                className="relative flex items-start gap-4"
              >
                {/* Left: 3D Octagonal Marker + Vertical Connector Line */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="relative z-10 select-none">
                    <svg
                      viewBox="0 0 58 44"
                      className="w-11.5 h-[35px] overflow-visible text-primary"
                      fill="none"
                      aria-hidden="true"
                    >
                      <polygon
                        points="10,2 44,2 51,9 51,35 44,42 10,42 3,35 3,9"
                        fill="currentColor"
                        transform="translate(3, 0)"
                      />
                      <polygon
                        points="10,2 44,2 51,9 51,35 44,42 10,42 3,35 3,9"
                        fill="#ffffff"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinejoin="round"
                      />
                      <text
                        x="27"
                        y="22.5"
                        fill="currentColor"
                        className="font-bold select-none"
                        fontSize="15"
                        fontWeight="700"
                        textAnchor="middle"
                        dominantBaseline="central"
                        style={{ fontFamily: "inherit" }}
                      >
                        {step.number}
                      </text>
                    </svg>
                  </div>
                  {!isLast && (
                    <div className="w-[1.5px] h-14 bg-primary/50 my-2 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rotate-45 border-r border-b border-primary" />
                    </div>
                  )}
                </div>

                {/* Right: Details */}
                <div className="pt-0.5 pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon
                      className="h-5 w-5 text-primary shrink-0"
                      strokeWidth={2.2}
                      aria-hidden="true"
                    />
                    <h3 className="font-bold text-slate-900 text-base">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
