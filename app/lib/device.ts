/** True on phones and tablets: no fine pointer. Heavy effects scale down here. */
export function isCoarse() {
  return typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
}
