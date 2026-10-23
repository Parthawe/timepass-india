export const rupees = (n) => "₹" + Math.round(n).toLocaleString("en-IN");
export const basketItems = [
  ["A cutting chai", 15, "chai"],
  ["A plate of samosas", 40, "samosa"],
  ["A movie evening", 450, "ticket"],
  ["A pair of sneakers", 3500, "shoe"],
  ["A smartphone", 45000, "phone"],
  ["A scooter", 110000, "scooter"],
  ["A family holiday", 250000, "train"],
  ["A small café", 2500000, "shop"],
  ["A city flat", 7500000, "house"],
];
export function buy(balance, quantity, price, delta) {
  if (
    !Number.isInteger(delta) ||
    !Number.isInteger(quantity) ||
    quantity < 0 ||
    price <= 0 ||
    balance < 0
  )
    return { balance, quantity };
  if (quantity + delta < 0 || balance - price * delta < 0)
    return { balance, quantity };
  return { balance: balance - price * delta, quantity: quantity + delta };
}
export const places = [
  { name: "START", type: "start" },
  { name: "Jaipur", price: 180, color: "#d67a6d" },
  { name: "Kochi", price: 220, color: "#639886" },
  { name: "Chai break", type: "bonus" },
  { name: "Lucknow", price: 240, color: "#d67a6d" },
  { name: "Station", type: "fee" },
  { name: "Pune", price: 260, color: "#639886" },
  { name: "Hyderabad", price: 300, color: "#6f93b1" },
  { name: "Surprise", type: "chance" },
  { name: "Ahmedabad", price: 280, color: "#d9a34d" },
  { name: "REST", type: "rest" },
  { name: "Chennai", price: 320, color: "#6f93b1" },
  { name: "Kolkata", price: 340, color: "#d9a34d" },
  { name: "Repairs", type: "fee" },
  { name: "Bengaluru", price: 380, color: "#8d83af" },
  { name: "Station", type: "bonus" },
  { name: "Delhi", price: 420, color: "#8d83af" },
  { name: "Surprise", type: "chance" },
  { name: "Mumbai", price: 480, color: "#b57490" },
  { name: "Goa", price: 360, color: "#b57490" },
];
export function newCity() {
  return {
    cash: [1500, 1500],
    pos: [0, 0],
    owners: Array(20).fill(null),
    round: 1,
    finished: false,
    pending: null,
    log: ["You and the computer start with ₹1,500 each."],
  };
}
export function netWorth(s, p) {
  return (
    s.cash[p] +
    s.owners.reduce(
      (sum, owner, i) => sum + (owner === p ? places[i].price : 0),
      0,
    )
  );
}
export function cityLand(s, p, die) {
  if (s.finished || !Number.isInteger(die) || die < 1 || die > 6) return s;
  const who = p === 0 ? "You" : "Computer";
  const old = s.pos[p];
  s.pos[p] = (old + die) % 20;
  if (old + die >= 20) {
    s.cash[p] += 300;
    s.log.push(`${who} passed START: +₹300.`);
  }
  const i = s.pos[p],
    tile = places[i];
  s.log.push(`${who} rolled ${die}: ${tile.name}.`);
  s.pending = null;
  if (tile.price) {
    const owner = s.owners[i];
    if (owner === null && s.cash[p] >= tile.price) s.pending = { p, i };
    else if (owner !== null && owner !== p) {
      const rent = Math.round(tile.price * 0.22);
      s.cash[p] -= rent;
      s.cash[owner] += rent;
      s.log.push(`${who} paid ${rupees(rent)} rent.`);
    }
  } else if (tile.type === "bonus") {
    s.cash[p] += 100;
    s.log.push(`${who} collected ₹100.`);
  } else if (tile.type === "fee") {
    s.cash[p] -= 100;
    s.log.push(`${who} paid ₹100.`);
  } else if (tile.type === "chance") {
    const amount = die % 2 ? 150 : -100;
    s.cash[p] += amount;
    s.log.push(
      `${who}: ${amount > 0 ? "festival bonus +₹150" : "repairs −₹100"}.`,
    );
  }
  if (s.cash.some((c) => c <= 0)) {
    s.finished = true;
    s.pending = null;
  }
  return s;
}
export function cityBuy(s) {
  const pending = s.pending;
  if (!pending || s.finished) return false;
  const { p, i } = pending,
    price = places[i].price;
  if (s.owners[i] !== null || s.cash[p] < price) {
    s.pending = null;
    return false;
  }
  s.cash[p] -= price;
  s.owners[i] = p;
  s.pending = null;
  s.log.push(`${p === 0 ? "You" : "Computer"} bought ${places[i].name}.`);
  return true;
}
export function cricketRuns(position) {
  const d = Math.abs(position - 0.5);
  return d < 0.045 ? 6 : d < 0.11 ? 4 : d < 0.21 ? 2 : d < 0.32 ? 1 : 0;
}
export function circleScore(points) {
  if (points.length < 20) return 0;
  const center = points.reduce(
    (a, p) => ({ x: a.x + p.x / points.length, y: a.y + p.y / points.length }),
    { x: 0, y: 0 },
  );
  const radii = points.map((p) => Math.hypot(p.x - center.x, p.y - center.y));
  const avg = radii.reduce((a, b) => a + b, 0) / radii.length;
  if (avg < 25) return 0;
  const cv =
    Math.sqrt(radii.reduce((a, b) => a + (b - avg) ** 2, 0) / radii.length) /
    avg;
  let turn = 0;
  for (let i = 1; i < points.length; i++) {
    let d =
      Math.atan2(points[i].y - center.y, points[i].x - center.x) -
      Math.atan2(points[i - 1].y - center.y, points[i - 1].x - center.x);
    while (d > Math.PI) d -= 2 * Math.PI;
    while (d < -Math.PI) d += 2 * Math.PI;
    turn += d;
  }
  const coverage = Math.min(1, Math.abs(turn) / (Math.PI * 2));
  const gap =
    Math.hypot(points[0].x - points.at(-1).x, points[0].y - points.at(-1).y) /
    avg;
  return Math.max(
    0,
    Math.min(100, Math.round((1 - cv * 2.2) * coverage * 100 - gap * 12)),
  );
}
export function bargainOffer(floor, offer, balance) {
  return Number.isFinite(offer) && offer >= floor && offer <= balance;
}
export function shuffled(items, random = Math.random) {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
