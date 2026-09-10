"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useIsClient } from "./hooks";

/**
 * The detail popup used by portfolio, services and pricing.
 *
 * Opens on a gentle scale and fade, closes the same way rather than
 * disappearing: `closing` keeps the panel mounted for the length of the exit
 * animation. Dismissable with the close button, a click on the backdrop, or
 * Escape. Focus moves into the panel on open and returns to the trigger on
 * close, and the page behind it cannot scroll while it is up.
 */
export default function Modal({
  open,
  onClose,
  label,
  children,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  children: React.ReactNode;
}) {
  const mounted = useIsClient();
  const [closing, setClosing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const beginClose = useCallback(() => {
    setClosing(true);
    window.setTimeout(() => {
      setClosing(false);
      onClose();
    }, 260);
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    returnFocusRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const raf = requestAnimationFrame(() => panelRef.current?.focus());

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        beginClose();
        return;
      }
      if (e.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      returnFocusRef.current?.focus?.();
    };
  }, [open, beginClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      <div
        className={closing ? "modal-veil-out" : "modal-veil-in"}
        onClick={beginClose}
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(3,7,20,0.72)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
        }}
      />

      <div
        ref={panelRef}
        tabIndex={-1}
        className={`surface relative w-full max-w-[720px] outline-none ${
          closing ? "modal-panel-out" : "modal-panel-in"
        }`}
        style={{
          borderRadius: "var(--radius-card)",
          background: "rgba(10,21,51,0.97)",
          maxHeight: "88vh",
          overflowY: "auto",
          boxShadow: "var(--shadow-lift)",
        }}
      >
        <button
          type="button"
          onClick={beginClose}
          aria-label="Close"
          className="sticky top-4 z-10 ml-auto mr-4 grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-colors hover:bg-[rgba(242,238,223,0.08)]"
          style={{
            borderColor: "var(--line-strong)",
            background: "rgba(5,11,31,0.75)",
            float: "right",
          }}
        >
          <X size={17} strokeWidth={1.5} />
        </button>

        <div className="px-6 pb-8 pt-6 sm:px-9 sm:pb-10">{children}</div>
      </div>
    </div>,
    document.body
  );
}
