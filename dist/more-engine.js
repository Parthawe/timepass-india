export const passengers = ["Asha", "Bala", "Chiru", "Diya"];
export const seatLabel = (i) => `${Math.floor(i / 4) + 1}${"ABCD"[i % 4]}`;
export const isWindow = (i) => i % 4 === 0 || i % 4 === 3;
const rule = (text, test) => ({ text, test });
export const seatPuzzles = [
  {
    title: "Window seat, please",
    blocked: [6],
    rules: [
      rule("Asha wants a window.", (p) => isWindow(p[0])),
      rule("Bala wants an aisle.", (p) => !isWindow(p[1])),
      rule(
        "Chiru and Diya must be in the same row.",
        (p) => Math.floor(p[2] / 4) === Math.floor(p[3] / 4),
      ),
    ],
  },
  {
    title: "Keep the group together",
    blocked: [1, 7],
    rules: [
      rule("Everyone must sit in a different seat.", () => true),
      rule(
        "Asha and Bala need the same row.",
        (p) => Math.floor(p[0] / 4) === Math.floor(p[1] / 4),
      ),
      rule(
        "Chiru and Diya need a side-by-side pair (A–B or C–D).",
        (p) => Math.floor(p[2] / 2) === Math.floor(p[3] / 2),
      ),
      rule("Diya wants a window.", (p) => isWindow(p[3])),
    ],
  },
  {
    title: "A little more particular",
    blocked: [0, 5],
    rules: [
      rule("Asha needs the front row (row 1).", (p) => p[0] < 4),
      rule(
        "Bala needs a window in the back row.",
        (p) => p[1] >= 4 && isWindow(p[1]),
      ),
      rule("Chiru wants an aisle.", (p) => !isWindow(p[2])),
      rule(
        "Diya and Asha need different rows.",
        (p) => Math.floor(p[3] / 4) !== Math.floor(p[0] / 4),
      ),
    ],
  },
  {
    title: "Two pairs, one coach",
    blocked: [2, 4],
    rules: [
      rule(
        "Asha and Bala need a side-by-side pair (A–B or C–D).",
        (p) => Math.floor(p[0] / 2) === Math.floor(p[1] / 2),
      ),
      rule(
        "Chiru and Diya need a side-by-side pair (A–B or C–D).",
        (p) => Math.floor(p[2] / 2) === Math.floor(p[3] / 2),
      ),
      rule(
        "The two pairs must sit in different rows.",
        (p) => Math.floor(p[0] / 4) !== Math.floor(p[2] / 4),
      ),
      rule("Asha wants a window.", (p) => isWindow(p[0])),
      rule("Diya wants an aisle.", (p) => !isWindow(p[3])),
    ],
  },
  {
    title: "The final adjustment",
    blocked: [1, 6],
    rules: [
      rule("Asha wants the back-left window (2A).", (p) => p[0] === 4),
      rule(
        "Bala and Asha must sit side by side.",
        (p) => Math.floor(p[0] / 2) === Math.floor(p[1] / 2),
      ),
      rule(
        "Chiru wants a front-row window.",
        (p) => p[2] < 4 && isWindow(p[2]),
      ),
      rule(
        "Diya must sit across the aisle from Chiru’s pair, in row 1.",
        (p) => p[3] < 4 && Math.floor(p[2] / 2) !== Math.floor(p[3] / 2),
      ),
    ],
  },
];
export function checkSeats(puzzle, positions) {
  const complete =
    positions.length === 4 &&
    positions.every((p) => Number.isInteger(p) && p >= 0 && p < 8);
  const valid =
    complete &&
    new Set(positions).size === 4 &&
    !positions.some((p) => puzzle.blocked.includes(p));
  return {
    complete,
    valid,
    checks: puzzle.rules.map((r) => valid && r.test(positions)),
    solved: valid && puzzle.rules.every((r) => r.test(positions)),
  };
}
export function placePassenger(positions, person, seat, blocked) {
  if (
    !Number.isInteger(person) ||
    person < 0 ||
    person > 3 ||
    !Number.isInteger(seat) ||
    seat < 0 ||
    seat > 7 ||
    blocked.includes(seat)
  )
    return [...positions];
  const next = [...positions],
    occupant = next.indexOf(seat),
    old = next[person];
  if (occupant !== -1 && occupant !== person) next[occupant] = old;
  next[person] = seat;
  return next;
}
export function solveSeats(puzzle) {
  const available = Array.from({ length: 8 }, (_, i) => i).filter(
    (i) => !puzzle.blocked.includes(i),
  );
  for (const a of available)
    for (const b of available)
      for (const c of available)
        for (const d of available) {
          const p = [a, b, c, d];
          if (checkSeats(puzzle, p).solved) return p;
        }
  return null;
}
export const labBase = [
  "water",
  "tea",
  "milk",
  "ginger",
  "rice",
  "lentil",
  "heat",
  "spice",
];
export const labNames = {
  water: "Water",
  tea: "Tea leaves",
  milk: "Milk",
  ginger: "Ginger",
  rice: "Rice",
  lentil: "Lentils",
  heat: "Heat",
  spice: "Spices",
  steam: "Steam",
  blacktea: "Black tea",
  chai: "Chai",
  adrak: "Adrak chai",
  masalachai: "Masala chai",
  soakedrice: "Soaked rice",
  ricebowl: "Rice bowl",
  batter: "Batter",
  dosa: "Dosa",
  idli: "Idli",
  dal: "Dal",
  khichdi: "Khichdi",
  kheer: "Kheer",
  malai: "Malai",
  tadka: "Tadka",
  daltadka: "Dal tadka",
  spicewater: "Spice water",
  rasam: "Rasam",
  spicedmilk: "Spiced milk",
  gingertea: "Ginger tea",
  masaladosa: "Masala dosa",
};
export const labRecipes = [
  ["water", "heat", "steam"],
  ["water", "tea", "blacktea"],
  ["blacktea", "milk", "chai"],
  ["chai", "ginger", "adrak"],
  ["chai", "spice", "masalachai"],
  ["rice", "water", "soakedrice"],
  ["soakedrice", "heat", "ricebowl"],
  ["rice", "lentil", "batter"],
  ["batter", "heat", "dosa"],
  ["batter", "steam", "idli"],
  ["lentil", "water", "dal"],
  ["ricebowl", "dal", "khichdi"],
  ["ricebowl", "milk", "kheer"],
  ["milk", "heat", "malai"],
  ["spice", "heat", "tadka"],
  ["dal", "tadka", "daltadka"],
  ["water", "spice", "spicewater"],
  ["spicewater", "heat", "rasam"],
  ["milk", "spice", "spicedmilk"],
  ["blacktea", "ginger", "gingertea"],
  ["dosa", "spice", "masaladosa"],
];
export function combineLab(a, b) {
  return (
    labRecipes.find(
      (r) => (r[0] === a && r[1] === b) || (r[0] === b && r[1] === a),
    )?.[2] || null
  );
}
export function labHint(known) {
  const s = new Set(known);
  return (
    labRecipes.find(
      ([a, b, result]) => s.has(a) && s.has(b) && !s.has(result),
    ) || null
  );
}
export function restoreLab(value) {
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [...labBase];
    const proposed = new Set(
      parsed.filter((id) => Object.hasOwn(labNames, id)),
    );
    const reached = new Set(labBase);
    let changed = true;
    while (changed) {
      changed = false;
      for (const [a, b, result] of labRecipes)
        if (
          reached.has(a) &&
          reached.has(b) &&
          proposed.has(result) &&
          !reached.has(result)
        ) {
          reached.add(result);
          changed = true;
        }
    }
    return [...reached];
  } catch {
    return [...labBase];
  }
}
const digitSum = (s) =>
  [...s.matchAll(/[0-9]/g)].reduce((sum, m) => sum + Number(m[0]), 0);
export const passRules = [
  rule(
    "Use between 18 and 80 characters.",
    (s) => s.length >= 18 && s.length <= 80,
  ),
  rule("Mention chai as a whole word.", (s) => /\bchai\b/i.test(s)),
  rule("Begin with a capital letter.", (s) => /^[A-Z]/.test(s)),
  rule(
    "Use exactly two digits.",
    (s) => (s.match(/[0-9]/g) || []).length === 2,
  ),
  rule("Make the two digits add up to 9.", (s) => digitSum(s) === 9),
  rule("Include a capital B for Block B.", (s) => s.includes("B")),
  rule("Mention the lift as a whole word.", (s) => /\blift\b/i.test(s)),
  rule("Mention Sunday as a whole word.", (s) => /\bsunday\b/i.test(s)),
  rule("Do not use the word sorry.", (s) => !/\bsorry\b/i.test(s)),
  rule("End with the word please.", (s) => /\bplease$/i.test(s)),
];
export function evaluatePass(value) {
  return passRules.map((r) => r.test(value));
}
export function passProgress(value, unlocked = 1) {
  const checks = evaluatePass(value);
  let visible = Math.max(1, Math.min(passRules.length, unlocked));
  while (visible < passRules.length && checks.slice(0, visible).every(Boolean))
    visible++;
  return { checks, visible, approved: checks.every(Boolean) };
}
