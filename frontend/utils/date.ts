export function parseDate(dueDate?: string, dueTime?: string): Date | null {
  if (!dueDate) return null;

  // Eğer saat yoksa → gün sonu 23:59 olsun
  if (!dueTime) {
    return new Date(`${dueDate}T23:59:59`);
  }

  // Eğer time formatı "HH:mm" ise saniye ekle
  const normalizedTime = dueTime.length === 5 ? `${dueTime}:00` : dueTime;

  const date = new Date(`${dueDate}T${normalizedTime}`);

  if (isNaN(date.getTime())) return null;

  return date;
}
