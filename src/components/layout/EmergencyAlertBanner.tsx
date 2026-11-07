"use client";

import { AlertTriangle, MapPin, Volume2, VolumeX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDerivedEmergencyAlert } from "@/hooks/useDerivedEmergencyAlert";
import {
  useAudioBlocked,
  useAudioPlaying,
  useIsEmergencySoundMuted,
} from "@/store/useAppStore";

export function EmergencyAlertBanner() {
  const {
    activeEmergency,
    pendingCount,
    isAuthorized,
    dismissActive,
    dismissAll,
  } = useDerivedEmergencyAlert();

  const audioBlocked = useAudioBlocked();
  const audioPlaying = useAudioPlaying();
  const isMuted = useIsEmergencySoundMuted();

  if (!isAuthorized || !activeEmergency) {
    return null;
  }

  const additionalCount = pendingCount - 1;

  return (
    <aside
      aria-label="Critical Emergency Alert"
      role="alert"
      className="bg-red-600 text-white shadow-md border-b border-red-700 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Left section: Alert header, Incident ID, Badge, and Message */}
          <div className="flex items-start gap-3 min-w-0">
            <div className="mt-0.5 p-1.5 rounded-lg bg-red-700/80 shrink-0 flex items-center justify-center animate-pulse">
              <AlertTriangle
                className="w-5 h-5 text-white"
                aria-hidden="true"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold tracking-tight text-white uppercase text-xs px-2 py-0.5 rounded bg-red-800 border border-red-500/40">
                  P1 CRITICAL
                </span>
                <span className="font-mono text-xs font-semibold text-red-100 bg-red-700/60 px-2 py-0.5 rounded">
                  {activeEmergency.incidentNumber}
                </span>
                {additionalCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="bg-white text-red-700 hover:bg-white font-bold text-xs shadow-xs"
                  >
                    +{additionalCount} more critical pending
                  </Badge>
                )}
                {isMuted ? (
                  <span
                    className="inline-flex items-center gap-1 text-xs text-red-200/90 font-medium"
                    title="Audio siren is muted in preferences"
                  >
                    <VolumeX className="w-3.5 h-3.5" /> Muted
                  </span>
                ) : audioBlocked ? (
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 text-xs font-semibold hover:bg-amber-300 cursor-pointer transition-colors shadow-xs"
                    title="Browser autoplay policy blocked siren audio. Click anywhere to enable sound."
                  >
                    <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                    <span>Sound blocked — click to enable</span>
                  </button>
                ) : audioPlaying ? (
                  <span className="inline-flex items-center gap-1 text-xs text-white/90 font-medium animate-pulse">
                    <Volume2 className="w-3.5 h-3.5" /> Siren active
                  </span>
                ) : null}
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-red-50 font-medium">
                <span className="capitalize">
                  {activeEmergency.emergencyType
                    .toLowerCase()
                    .replace(/_/g, " ")}
                </span>
                {activeEmergency.locationAddress && (
                  <span className="inline-flex items-center gap-1 truncate max-w-md text-red-100">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">
                      {activeEmergency.locationAddress}
                    </span>
                  </span>
                )}
                {activeEmergency.description && (
                  <span className="hidden md:inline-block truncate max-w-sm text-red-100/90">
                    — {activeEmergency.description}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right section: Action Buttons with data-alert-ack contract */}
          <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
            {pendingCount > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                data-alert-ack="true"
                onClick={dismissAll}
                className="bg-red-700/60 hover:bg-red-700 text-white border-red-400/40 hover:text-white text-xs h-8"
              >
                Acknowledge all ({pendingCount})
              </Button>
            )}
            <Button
              type="button"
              variant="default"
              size="sm"
              data-alert-ack="true"
              onClick={dismissActive}
              className="bg-white hover:bg-red-50 text-red-700 font-semibold text-xs h-8 shadow-xs"
            >
              Acknowledge
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
