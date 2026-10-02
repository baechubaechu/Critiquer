export { sourceDatabase } from "@/lib/sources/database";
export type { SourceEntry } from "@/lib/sources/types";
import { sourceDatabase } from "@/lib/sources/database";

export function getSourceMetadata(sourceIds: string[]) {
  return sourceDatabase.filter((entry) => sourceIds.includes(entry.id));
}
