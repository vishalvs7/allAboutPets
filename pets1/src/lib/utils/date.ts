// /src/lib/utils/date.ts
import { Timestamp } from "firebase/firestore";

export function toReadableDate(input: unknown): string {
  try {
    if (!input) return "—";
    // Firestore Timestamp
    if (typeof input === "object" && input !== null && "toDate" in (input as any)) {
      const d = (input as Timestamp).toDate();
      return d.toLocaleString();
    }
    // JS Date
    if (input instanceof Date) {
      return input.toLocaleString();
    }
    // ISO string or number
    if (typeof input === "string" || typeof input === "number") {
      const d = new Date(input);
      if (!isNaN(d.getTime())) return d.toLocaleString();
    }
    return "—";
  } catch {
    return "—";
  }
}
