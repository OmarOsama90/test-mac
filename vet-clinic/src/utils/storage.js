// Desktop (Tauri) = JSON file in the app-data folder. Browser (npm start) = localStorage.
// getCases THROWS on a read error on purpose: the app then refuses to autosave,
// so a corrupted/unreadable file is never overwritten with an empty list.
const FILE = "cases.json";
const BACKUP = "cases.bak.json";
const LS_KEY = "vet-cases";
const inTauri = () => typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

export async function getCases() {
  if (!inTauri()) return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  const { readTextFile, exists, BaseDirectory } = await import("@tauri-apps/plugin-fs");
  const o = { baseDir: BaseDirectory.AppData };
  if (!(await exists(FILE, o))) return [];
  const data = JSON.parse(await readTextFile(FILE, o));
  if (!Array.isArray(data)) throw new Error("cases.json is not a list");
  return data;
}

export async function saveCases(cases) {
  const json = JSON.stringify(cases, null, 2);
  if (!inTauri()) return localStorage.setItem(LS_KEY, json);
  const { writeTextFile, copyFile, exists, BaseDirectory } = await import("@tauri-apps/plugin-fs");
  const o = { baseDir: BaseDirectory.AppData };
  if (await exists(FILE, o)) await copyFile(FILE, BACKUP, { fromPathBaseDir: BaseDirectory.AppData, toPathBaseDir: BaseDirectory.AppData });
  await writeTextFile(FILE, json, o);
}

export async function exportBackup(cases) {
  const json = JSON.stringify(cases, null, 2);
  const name = `vet-backup-${new Date().toISOString().slice(0, 10)}.json`;
  if (inTauri()) {
    const { save } = await import("@tauri-apps/plugin-dialog");
    const { writeTextFile } = await import("@tauri-apps/plugin-fs");
    const path = await save({ defaultPath: name, filters: [{ name: "JSON", extensions: ["json"] }] });
    if (!path) return false;
    await writeTextFile(path, json);
    return true;
  }
  const url = URL.createObjectURL(new Blob([json], { type: "application/json" }));
  const a = document.createElement("a");
  a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
  return true;
}
