export type DiningHours = {
  openTime: string;
  closeTime: string;
  slotMinutes: number;
  durationMinutes: number;
};

export function minutesOf(value: string): number | null {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

export function formatMinutes(total: number): string {
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function rangesOverlap(startA: number, endA: number, startB: number, endB: number): boolean {
  return startA < endB && startB < endA;
}

/** Start times that still leave a full seating before close. */
export function buildSlots(hours: DiningHours): string[] {
  const open = minutesOf(hours.openTime);
  const close = minutesOf(hours.closeTime);
  if (open == null || close == null || hours.slotMinutes < 15 || hours.durationMinutes < 30) return [];
  const lastStart = close - hours.durationMinutes;
  const slots: string[] = [];
  for (let cursor = open; cursor <= lastStart; cursor += hours.slotMinutes) {
    slots.push(formatMinutes(cursor));
  }
  return slots;
}

export function partyFits(seats: number, guests: number): boolean {
  return guests >= 1 && seats >= guests;
}
