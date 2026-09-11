/**
 * One small contract between the intro and everything that animates.
 *
 * While the intro plays, `<html data-intro="playing">` is set. Canvases skip
 * their frames so the intro has the whole budget, and scroll reveals wait for
 * the hand-off before they fire, so the page does not arrive fully formed
 * behind the fade.
 */
export const INTRO_DONE = "pva:intro-done";

export function introPlaying() {
  return (
    typeof document !== "undefined" &&
    document.documentElement.getAttribute("data-intro") === "playing"
  );
}

/** Runs `cb` now if no intro is playing, otherwise once it finishes. */
export function afterIntro(cb: () => void): () => void {
  if (!introPlaying()) {
    cb();
    return () => {};
  }
  const handler = () => cb();
  window.addEventListener(INTRO_DONE, handler, { once: true });
  return () => window.removeEventListener(INTRO_DONE, handler);
}
