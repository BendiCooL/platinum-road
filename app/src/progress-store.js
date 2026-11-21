// Earned-trophy progress: kept in localStorage, exportable to a JSON file
// and importable back, so a hunter can move their checklist between machines.

const STORAGE_KEY = 'platinum-road-earned-v1';
const SPOILER_KEY = 'platinum-road-spoiler-v1';

export function loadEarnedIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return new Set(Array.isArray(parsed) ? parsed : parsed.earned || []);
  } catch {
    return new Set();
  }
}

export function saveEarnedIds(earnedIds) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...earnedIds]));
}

export function loadSpoilerShield() {
  return localStorage.getItem(SPOILER_KEY) === 'on';
}

export function saveSpoilerShield(on) {
  localStorage.setItem(SPOILER_KEY, on ? 'on' : 'off');
}

export function exportProgress(earnedIds) {
  const payload = {
    app: 'platinum-road',
    version: 1,
    exported_at: new Date().toISOString(),
    earned: [...earnedIds].sort((a, b) => a - b),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'platinum-road-progress.json';
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function importProgress(file) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  const ids = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(ids)) throw new Error('That file does not hold a progress list.');
  return new Set(ids.filter((id) => Number.isInteger(id)));
}
