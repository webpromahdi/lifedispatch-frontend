import {
  AlertTriangle,
  Ambulance,
  Building2,
  Headset,
  User,
  Users,
} from "lucide-react";

const participants = [
  {
    role: "Patient",
    icon: User,
    iconColor: "text-primary",
    iconBg: "bg-primary-light",
    statusText: "Request Sent",
    statusDot: "bg-emerald-500",
    statusBadge: "bg-slate-100 text-slate-700",
    description: "Provides details and follows the status of the response.",
  },
  {
    role: "Dispatcher",
    icon: Headset,
    iconColor: "text-primary",
    iconBg: "bg-primary-light",
    statusText: "Assignment Accepted",
    statusDot: "bg-emerald-500",
    statusBadge: "bg-slate-100 text-slate-700",
    description: "Coordinates the appropriate ambulance and monitors progress.",
  },
  {
    role: "Ambulance",
    icon: Ambulance,
    iconColor: "text-primary",
    iconBg: "bg-primary-light",
    statusText: "En Route",
    statusDot: "bg-blue-500",
    statusBadge: "bg-blue-50 text-blue-700 border border-blue-100",
    description:
      "Driver receives the assignment and updates trip status in real time.",
  },
  {
    role: "Hospital",
    icon: Building2,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50",
    statusText: "Preparing",
    statusDot: "bg-purple-500",
    statusBadge: "bg-purple-50 text-purple-700 border border-purple-100",
    description: "Prepares for the incoming patient based on the live status.",
  },
];

export function ConnectedResponseSection() {
  return (
    <section
      id="features"
      aria-labelledby="connected-response-heading"
      className="py-16 sm:py-20 lg:py-24 bg-background relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* ── Left Column: Editorial Content ── */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            {/* Eyebrow Pill: 24–28px margin to heading */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-primary rounded-md shadow-xs mb-6 sm:mb-7 w-fit">
              <Users
                className="h-3.5 w-3.5 text-primary"
                strokeWidth={2.5}
                aria-hidden="true"
              />
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-800">
                One Connected Response
              </span>
            </div>

            {/* Heading: Controlled width with spacing separating the two ideas */}
            <h2
              id="connected-response-heading"
              className="text-2xl sm:text-4xl lg:text-[40px] font-black text-slate-900 tracking-tight leading-[1.14] max-w-105"
            >
              <span className="block">Everyone Sees</span>
              <span className="block">the Same Emergency.</span>
              <span className="block text-primary mt-2.5 sm:mt-3">
                Everyone Knows
              </span>
              <span className="block text-primary">What Happens Next.</span>
            </h2>

            {/* Description: 28–32px margin from heading with comfortable line-height */}
            <p className="mt-7 sm:mt-8 text-base text-slate-500 font-normal leading-relaxed max-w-md">
              LifeDispatch connects patients, dispatchers, ambulance crews, and
              hospitals around the same response, so critical information
              doesn’t have to move through disconnected systems.
            </p>
          </div>

          {/* ── Right Column: Central Panel & Connected Participants ── */}
          <div className="lg:col-span-7 flex flex-col items-center w-full">
            {/* Central Emergency Status Panel */}
            <div className="relative w-full max-w-107.5 bg-white border-2 border-slate-900 rounded-lg p-3.5 sm:p-4 shadow-[3px_3px_0px_0px_#0f172a] z-10">
              {/* Technical corner chamfer notch in top-right */}
              <div
                className="absolute top-0 right-0 w-3.5 h-3.5 bg-primary pointer-events-none rounded-tr-[5px]"
                aria-hidden="true"
              />

              <div className="flex items-center justify-between gap-3">
                {/* Alert Icon & Incident Title */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-destructive text-white flex items-center justify-center shrink-0 shadow-xs">
                    <AlertTriangle
                      className="h-5 w-5"
                      strokeWidth={2.4}
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight">
                      Emergency #2048
                    </div>
                    <div className="text-[11px] sm:text-xs text-slate-500 font-medium">
                      Medical &middot; Dhanmondi, Dhaka &middot; 10:24 AM
                    </div>
                  </div>
                </div>

                {/* Priority & Live State Badges */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-[10px] sm:text-[11px] font-bold text-red-600 bg-red-50 border border-red-200/80 px-2 py-0.5 rounded-[3px]">
                    High Priority
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-[3px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Visual Circuit Wiring (Hidden on Mobile/Tablet) */}
            <div
              className="hidden lg:block w-full h-11 relative z-0 pointer-events-none"
              aria-hidden="true"
            >
              <svg
                className="w-full h-full text-primary"
                viewBox="0 0 800 44"
                fill="none"
                preserveAspectRatio="none"
              >
                <title>Circuit connection lines to network participants</title>
                {/* Drop from central card */}
                <path
                  d="M400 0 L400 20"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                {/* Horizontal distribution trace */}
                <path
                  d="M100 20 L700 20"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                {/* 4 Drops down to the participant cards */}
                <path
                  d="M100 20 L100 36"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M300 20 L300 36"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M500 20 L500 36"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M700 20 L700 36"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                {/* Terminal circular connection pins */}
                <circle
                  cx="100"
                  cy="36"
                  r="3.5"
                  fill="#FFFFFF"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <circle
                  cx="300"
                  cy="36"
                  r="3.5"
                  fill="#FFFFFF"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <circle
                  cx="500"
                  cy="36"
                  r="3.5"
                  fill="#FFFFFF"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <circle
                  cx="700"
                  cy="36"
                  r="3.5"
                  fill="#FFFFFF"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </div>

            {/* Mobile/Tablet Connector Line */}
            <div
              className="lg:hidden w-[1.5px] h-6 bg-primary my-1"
              aria-hidden="true"
            />

            {/* Participant Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 w-full">
              {participants.map((p) => {
                const Icon = p.icon;
                return (
                  <div
                    key={p.role}
                    className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-[0_2px_8px_rgba(15,23,42,0.03)] flex flex-col items-center sm:items-start text-center sm:text-left transition-all hover:border-primary/50"
                  >
                    {/* Role Icon */}
                    <div
                      className={`w-9 h-9 rounded-lg ${p.iconBg} ${p.iconColor} flex items-center justify-center shrink-0 mb-2.5`}
                    >
                      <Icon
                        className="h-5 w-5"
                        strokeWidth={2.2}
                        aria-hidden="true"
                      />
                    </div>

                    {/* Role Name */}
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                      {p.role}
                    </h3>

                    {/* Status Pill Badge */}
                    <div className="mt-1 mb-2.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${p.statusBadge}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${p.statusDot}`}
                        />
                        {p.statusText}
                      </span>
                    </div>

                    {/* Role Description */}
                    <p className="text-slate-500 text-xs leading-relaxed mt-auto">
                      {p.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
