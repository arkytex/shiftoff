// Touch-first device check: phones and tablets report a coarse primary pointer.
// ?touch=1 forces the on-screen buttons on (handy on desktop), ?touch=0 forces them off.
let cached;

export function isTouchDevice() {
  if (cached !== undefined) return cached;
  const forced = new URLSearchParams(window.location.search).get("touch");
  if (forced === "1") cached = true;
  else if (forced === "0") cached = false;
  else cached = window.matchMedia?.("(pointer: coarse)").matches ?? false;
  return cached;
}
