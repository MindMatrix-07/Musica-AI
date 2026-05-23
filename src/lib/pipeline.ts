const PIPELINE_KEY = "musica_split_structure";

export function getSplitStructure(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(PIPELINE_KEY) !== "false";
}

export function setSplitStructure(split: boolean): void {
  localStorage.setItem(PIPELINE_KEY, String(split));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("musica-pipeline-updated"));
  }
}
