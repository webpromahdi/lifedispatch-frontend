"use client";

import { useEffect, useRef } from "react";
import { useDerivedEmergencyAlert } from "@/hooks/useDerivedEmergencyAlert";
import { useHasHydrated } from "@/hooks/useHasHydrated";
import {
  useAppStore,
  useAudioBlocked,
  useDismissedAlertIds,
  useIsEmergencySoundMuted,
  useSetAudioBlocked,
  useSetAudioPlaying,
} from "@/store/useAppStore";

const SIREN_AUDIO_SRC = "/sounds/emergency-siren.mp3";

/**
 * Emergency Audio Coordinator Hook.
 * Manages the HTML5 <audio> siren lifecycle, autoplay-unlock flow,
 * initial-load sound suppression, and list/seen/dismissed ID pruning.
 *
 * NOTE: audioPlaying in Zustand is strictly a reactive UI MIRROR of the
 * real <audio> element state, not a controller.
 */
export function useEmergencyAudio() {
  const hasHydrated = useHasHydrated();
  const { allPendingP1, emergencies, isSuccess, isAuthorized, pendingCount } =
    useDerivedEmergencyAlert();
  const isMuted = useIsEmergencySoundMuted();
  const audioBlocked = useAudioBlocked();
  const setAudioPlaying = useSetAudioPlaying();
  const setAudioBlocked = useSetAudioBlocked();
  const dismissedAlertIds = useDismissedAlertIds();
  const pruneDismissedAlerts = useAppStore((s) => s.pruneDismissedAlerts);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const seenIdsRef = useRef<Set<string>>(new Set());
  const isInitialLoadRef = useRef(true);
  const prevDismissedCountRef = useRef(dismissedAlertIds.length);
  const pendingCountRef = useRef(pendingCount);

  // Keep pendingCountRef updated to prevent stale closures in event listeners
  pendingCountRef.current = pendingCount;

  // Initialize <audio> element once
  useEffect(() => {
    if (typeof window === "undefined" || !isAuthorized) return;

    const audio = new Audio(SIREN_AUDIO_SRC);
    audio.loop = true;
    audio.preload = "auto";
    audioRef.current = audio;

    const handleEnded = () => setAudioPlaying(false);
    const handlePause = () => setAudioPlaying(false);
    const handleError = () => {
      console.error(
        "Emergency siren audio asset failed to load or is corrupt:",
        SIREN_AUDIO_SRC,
      );
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("error", handleError, { once: true });

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("error", handleError);
      audio.pause();
      audio.currentTime = 0;
      setAudioPlaying(false);
    };
  }, [isAuthorized, setAudioPlaying]);

  // Dedicated Pruning Effect: executed once in DashboardShell
  useEffect(() => {
    if (!isAuthorized || !isSuccess) return;

    const currentFetchedIds = new Set(emergencies.map((e) => e.id));

    // Prune seenIdsRef to IDs still present in the fetched list
    for (const seenId of Array.from(seenIdsRef.current)) {
      if (!currentFetchedIds.has(seenId)) {
        seenIdsRef.current.delete(seenId);
      }
    }

    // Prune dismissedAlertIds when emergencies list is empty or has orphaned IDs
    if (dismissedAlertIds.length > 0) {
      if (emergencies.length === 0) {
        pruneDismissedAlerts([]);
      } else {
        const hasOrphans = dismissedAlertIds.some(
          (id) => !currentFetchedIds.has(id),
        );
        if (hasOrphans) {
          pruneDismissedAlerts(Array.from(currentFetchedIds));
        }
      }
    }
  }, [
    emergencies,
    isSuccess,
    dismissedAlertIds,
    isAuthorized,
    pruneDismissedAlerts,
  ]);

  // Main Audio Control & New P1 Arrival Detection
  useEffect(() => {
    // Gate on hasHydrated so persisted mute preference is respected before audio decisions run
    if (!isAuthorized || !hasHydrated) return;
    const audio = audioRef.current;

    // Direct Acknowledge Intercept: when dismissedAlertIds grows, pause and reset audio immediately
    if (dismissedAlertIds.length > prevDismissedCountRef.current) {
      if (audio && !audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
      setAudioPlaying(false);
    }
    prevDismissedCountRef.current = dismissedAlertIds.length;

    if (!audio) return;

    // 1. Initial load seeding: only seed after first successful query fetch
    if (isInitialLoadRef.current) {
      if (isSuccess) {
        for (const em of allPendingP1) {
          seenIdsRef.current.add(em.id);
        }
        isInitialLoadRef.current = false;
      }
      return;
    }

    // 2. If queue is empty, ensure audio is paused
    if (allPendingP1.length === 0) {
      if (!audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
      setAudioPlaying(false);
      return;
    }

    // 3. Detect ALL unseen P1 emergencies in this batch
    const unseenP1Batch = allPendingP1.filter(
      (em) => !seenIdsRef.current.has(em.id),
    );

    if (unseenP1Batch.length > 0) {
      // Mark all unseen P1s as seen in one pass
      for (const em of unseenP1Batch) {
        seenIdsRef.current.add(em.id);
      }

      // Start siren once per batch if not muted and not already playing
      if (!isMuted && audio.paused) {
        audio.currentTime = 0;
        audio
          .play()
          .then(() => {
            setAudioPlaying(true);
            setAudioBlocked(false);
          })
          .catch((err: unknown) => {
            if (err instanceof Error) {
              if (err.name === "AbortError") {
                // Interrupted by pause or another action; ignore silently
                return;
              }
              if (err.name === "NotAllowedError") {
                setAudioBlocked(true);
                setAudioPlaying(false);
                return;
              }
              console.error("Emergency siren audio play failed:", err);
            } else {
              console.error("Emergency siren audio play failed:", err);
            }
            setAudioPlaying(false);
          });
      }
    }

    // 4. Stop audio immediately when muted
    if (isMuted && !audio.paused) {
      audio.pause();
      audio.currentTime = 0;
      setAudioPlaying(false);
    }
  }, [
    allPendingP1,
    isSuccess,
    isMuted,
    isAuthorized,
    hasHydrated,
    dismissedAlertIds.length,
    setAudioPlaying,
    setAudioBlocked,
  ]);

  // Browser Autoplay Policy Unlock: resume on user gesture if blocked
  useEffect(() => {
    if (!audioBlocked || isMuted || !isAuthorized || !hasHydrated) return;

    function removeListeners() {
      window.removeEventListener("pointerdown", handleUserUnlock);
      window.removeEventListener("keydown", handleUserUnlock);
    }

    function handleUserUnlock(event: Event) {
      // Contract: return early if the click occurred inside an acknowledge button
      // An Acknowledge click must not consume or remove the unlock listener
      const target = event.target as HTMLElement | null;
      if (target?.closest("[data-alert-ack]")) {
        return;
      }

      const audio = audioRef.current;
      // Do NOT start siren if nothing is pending and unacknowledged
      if (!audio || pendingCountRef.current === 0) {
        removeListeners();
        setAudioBlocked(false);
        return;
      }

      audio
        .play()
        .then(() => {
          removeListeners();
          setAudioPlaying(true);
          setAudioBlocked(false);
        })
        .catch((err: unknown) => {
          if (err instanceof Error) {
            if (err.name === "AbortError") {
              return;
            }
            if (err.name === "NotAllowedError") {
              // Browser still blocked; keep listener registered
              return;
            }
            console.error("Emergency siren audio unlock play failed:", err);
          } else {
            console.error("Emergency siren audio unlock play failed:", err);
          }
          removeListeners();
          setAudioBlocked(false);
          setAudioPlaying(false);
        });
    }

    window.addEventListener("pointerdown", handleUserUnlock);
    window.addEventListener("keydown", handleUserUnlock);

    return () => {
      removeListeners();
    };
  }, [
    audioBlocked,
    isMuted,
    isAuthorized,
    hasHydrated,
    setAudioPlaying,
    setAudioBlocked,
  ]);
}
