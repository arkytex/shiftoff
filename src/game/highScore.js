// Best altitude (m), kept in this browser. Storage can be blocked (private windows, site data
// cleared), so every access is guarded and a failure just means no saved best.
const KEY = "shiftx_high_score";

export function loadHighScore() {
  try {
    return Number(localStorage.getItem(KEY)) || 0;
  } catch {
    return 0;
  }
}

/** Saves score if it beats the stored best. Returns true when it's a new best. */
export function saveHighScore(score) {
  if (score <= loadHighScore()) return false;
  try {
    localStorage.setItem(KEY, String(Math.floor(score)));
  } catch {
    // not saved, but still a best for this run
  }
  return true;
}

// Total runs ended, for the "attempt #N" jokes. Same storage caveats as the best score.
const DEATHS_KEY = "shiftx_deaths";

/** Counts one more death and returns the new total. */
export function recordDeath() {
  let deaths = 1;
  try {
    deaths = (Number(localStorage.getItem(DEATHS_KEY)) || 0) + 1;
    localStorage.setItem(DEATHS_KEY, String(deaths));
  } catch {
    // not saved; this run still counts as 1
  }
  return deaths;
}
