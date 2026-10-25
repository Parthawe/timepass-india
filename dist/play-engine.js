export function dayKey(date = new Date()) {
  if (!Number.isFinite(date.getTime())) throw new RangeError("Invalid date");
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function validDay(day) {
  if (typeof day !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(day)) return false;
  const time = Date.parse(day + "T00:00:00Z");
  return (
    Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === day
  );
}
export function deliveries(random = Math.random) {
  return Array.from({ length: 6 }, () => ({
    duration: 1500 + Math.floor(random() * 650),
    bounce: 0.24 + random() * 0.16,
  }));
}
export function dailyDeliveries(day) {
  if (!validDay(day)) throw new RangeError("Use a valid YYYY-MM-DD day");
  let seed = 2166136261;
  for (const char of day) {
    seed ^= char.charCodeAt(0);
    seed = Math.imul(seed, 16777619);
  }
  return deliveries(() => {
    seed += 0x6d2b79f5;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  });
}
export function dailyRecords(raw) {
  try {
    const data = JSON.parse(raw);
    if (!data || typeof data !== "object" || Array.isArray(data)) return {};
    return Object.fromEntries(
      Object.entries(data)
        .filter(
          ([day, runs]) =>
            validDay(day) && Number.isInteger(runs) && runs >= 0 && runs <= 36,
        )
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-30),
    );
  } catch {
    return {};
  }
}
export function recordDaily(raw, day, runs) {
  const records = dailyRecords(raw);
  if (!validDay(day) || !Number.isInteger(runs) || runs < 0 || runs > 36)
    return records;
  records[day] = Math.max(records[day] ?? 0, runs);
  return dailyRecords(JSON.stringify(records));
}
export function shoppingStep(balance, quantity, price, size, direction) {
  if (
    ![balance, quantity, price, size].every(Number.isSafeInteger) ||
    balance < 0 ||
    quantity < 0 ||
    price <= 0 ||
    size <= 0 ||
    ![1, -1].includes(direction)
  )
    return { balance, quantity };
  const next = quantity + size * direction,
    remaining = balance - price * size * direction;
  if (
    next < 0 ||
    remaining < 0 ||
    !Number.isSafeInteger(next) ||
    !Number.isSafeInteger(remaining)
  )
    return { balance, quantity };
  return { balance: remaining, quantity: next };
}
export function maxAffordable(balance, price) {
  return Number.isSafeInteger(balance) &&
    balance >= 0 &&
    Number.isSafeInteger(price) &&
    price > 0
    ? Math.floor(balance / price)
    : 0;
}
export function deliveryPoint(progress, bounce = 0.3) {
  const p = Math.max(0, Math.min(1, progress));
  return {
    x: 400 + 240 * p,
    y: 176 + 280 * p - 38 * Math.sin(Math.PI * Math.min(1, p / bounce)),
  };
}
export function shotPoint(runs, progress) {
  const p = Math.max(0, Math.min(1, progress));
  const end =
    runs === 6
      ? { x: 110, y: 75 }
      : runs === 4
        ? { x: 105, y: 324 }
        : runs === 2
          ? { x: 300, y: 360 }
          : runs === 1
            ? { x: 405, y: 348 }
            : { x: 572, y: 350 };
  const control = {
    x: (520 + end.x) / 2,
    y: runs === 6 ? 0 : runs === 4 ? 250 : 300,
  };
  return {
    x: (1 - p) ** 2 * 520 + 2 * (1 - p) * p * control.x + p * p * end.x,
    y: (1 - p) ** 2 * 316 + 2 * (1 - p) * p * control.y + p * p * end.y,
  };
}
