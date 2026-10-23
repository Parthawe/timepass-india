import test from "node:test";
import assert from "node:assert/strict";
import {
  buy,
  newCity,
  cityLand,
  cityBuy,
  netWorth,
  places,
  cricketRuns,
  circleScore,
  bargainOffer,
  shuffled,
  basketItems,
} from "../dist/engine.js";
test("Indian basket cannot overspend, sell below zero or create fractional quantities", () => {
  assert.deepEqual(buy(10, 0, 15, 1), { balance: 10, quantity: 0 });
  assert.deepEqual(buy(10, 0, 15, -1), { balance: 10, quantity: 0 });
  assert.deepEqual(buy(10, 1, 15, 0.5), { balance: 10, quantity: 1 });
  assert.deepEqual(buy(10, 1, 15, -1), { balance: 25, quantity: 0 });
});
test("buying and selling conserves a crore across the full basket", () => {
  let balance = 10000000;
  for (const [, price] of basketItems) {
    const before = balance;
    const purchased = buy(balance, 0, price, 1);
    assert.equal(purchased.balance + price * purchased.quantity, before);
    const sold = buy(purchased.balance, purchased.quantity, price, -1);
    assert.equal(sold.balance, before);
    balance = sold.balance;
  }
});
test("passing START pays exactly ₹300", () => {
  const s = newCity();
  s.pos[0] = 18;
  cityLand(s, 0, 3);
  assert.equal(s.pos[0], 1);
  assert.equal(s.cash[0], 1800);
});
test("property purchase costs cash, preserves net worth, cannot be bought twice", () => {
  const s = newCity();
  cityLand(s, 0, 1);
  const before = netWorth(s, 0);
  assert.equal(cityBuy(s), true);
  assert.equal(s.owners[1], 0);
  assert.equal(s.cash[0], 1320);
  assert.equal(netWorth(s, 0), before);
  assert.equal(cityBuy(s), false);
});
test("landing on owned property transfers rent without destroying money", () => {
  const s = newCity();
  s.owners[1] = 0;
  const total = s.cash[0] + s.cash[1];
  cityLand(s, 1, 1);
  assert.equal(s.cash[1], 1500 - Math.round(places[1].price * 0.22));
  assert.equal(s.cash[0] + s.cash[1], total);
  assert.equal(s.pending, null);
});
test("unaffordable and claimed properties cannot be purchased", () => {
  const s = newCity();
  s.cash[0] = 100;
  cityLand(s, 0, 1);
  assert.equal(s.pending, null);
  s.pending = { p: 0, i: 1 };
  assert.equal(cityBuy(s), false);
  assert.equal(s.owners[1], null);
});
test("zero cash ends the game and finished games ignore rolls", () => {
  const s = newCity();
  s.cash[0] = 100;
  cityLand(s, 0, 5);
  assert.equal(s.finished, true);
  const p = s.pos[0];
  cityLand(s, 0, 6);
  assert.equal(s.pos[0], p);
});
test("invalid dice are ignored", () => {
  for (const die of [0, 7, 1.5, NaN]) {
    const s = newCity();
    cityLand(s, 0, die);
    assert.equal(s.pos[0], 0);
    assert.equal(s.cash[0], 1500);
  }
});
test("cricket maps centre and edge to distinct outcomes", () => {
  assert.equal(cricketRuns(0.5), 6);
  assert.equal(cricketRuns(0.58), 4);
  assert.equal(cricketRuns(0.7), 2);
  assert.equal(cricketRuns(0.8), 1);
  assert.equal(cricketRuns(0.95), 0);
});
const circle = Array.from({ length: 181 }, (_, i) => ({
  x: 250 + 140 * Math.cos((i / 180) * 2 * Math.PI),
  y: 250 + 140 * Math.sin((i / 180) * 2 * Math.PI),
}));
test("roti accepts a closed circle and penalizes open, narrow and degenerate drawings", () => {
  assert.ok(circleScore(circle) >= 98);
  assert.equal(circleScore([]), 0);
  assert.equal(circleScore(Array(30).fill({ x: 50, y: 50 })), 0);
  assert.ok(circleScore(circle.slice(0, 90)) < 65);
  assert.ok(
    circleScore(circle.map((p) => ({ ...p, y: 250 + (p.y - 250) * 0.35 }))) <
      60,
  );
});
test("a seller accepts only offers at floor or higher within the wallet", () => {
  assert.equal(bargainOffer(200, 199, 500), false);
  assert.equal(bargainOffer(200, 200, 500), true);
  assert.equal(bargainOffer(200, 600, 500), false);
  assert.equal(bargainOffer(200, NaN, 500), false);
});
test("memory shuffle preserves exactly six pairs without mutating input", () => {
  const a = ["a", "b", "c", "d", "e", "f", "a", "b", "c", "d", "e", "f"],
    snapshot = [...a];
  const b = shuffled(a, () => 0.4);
  assert.deepEqual(a, snapshot);
  assert.notEqual(a, b);
  assert.deepEqual([...b].sort(), [...a].sort());
  for (const x of new Set(b)) assert.equal(b.filter((y) => y === x).length, 2);
});
test("many simulated property games keep integral cash and valid ownership", () => {
  for (let g = 0; g < 100; g++) {
    const s = newCity();
    for (let r = 0; r < 16 && !s.finished; r++) {
      for (const p of [0, 1]) {
        cityLand(s, p, 1 + Math.floor(Math.random() * 6));
        if (s.pending) cityBuy(s);
        assert.ok(s.cash.every(Number.isInteger));
        assert.ok(s.owners.every((x) => x === null || x === 0 || x === 1));
        if (s.finished) break;
      }
    }
  }
});
