import test from "node:test";
import assert from "node:assert/strict";
import {
  dayKey,
  validDay,
  dailyDeliveries,
  deliveries,
  dailyRecords,
  recordDaily,
  shoppingStep,
  maxAffordable,
  deliveryPoint,
  shotPoint,
} from "../dist/play-engine.js";
test("daily dates use the device calendar and reject impossible dates", () => {
  assert.equal(dayKey(new Date(2026, 9, 24, 23, 59)), "2026-10-24");
  assert.equal(validDay("2026-02-30"), false);
  assert.equal(validDay("2024-02-29"), true);
  assert.equal(validDay("2026-2-1"), false);
  assert.equal(validDay(null), false);
  assert.throws(() => dayKey(new Date(NaN)), RangeError);
});
test("a daily over always contains the same six deliveries for a given date", () => {
  assert.deepEqual(
    dailyDeliveries("2026-10-24"),
    dailyDeliveries("2026-10-24"),
  );
  assert.notDeepEqual(
    dailyDeliveries("2026-10-24"),
    dailyDeliveries("2026-10-25"),
  );
  assert.equal(dailyDeliveries("2026-10-24").length, 6);
  assert.throws(() => dailyDeliveries("bad"), RangeError);
});
test("free and daily deliveries stay inside their playable timing bounds", () => {
  for (const profile of [
    ...deliveries(() => 0),
    ...deliveries(() => 0.9999),
    ...dailyDeliveries("2026-10-24"),
  ]) {
    assert.ok(profile.duration >= 1500 && profile.duration < 2150);
    assert.ok(profile.bounce >= 0.24 && profile.bounce < 0.4);
  }
});
test("daily records retain a personal best, including a real zero score", () => {
  let r = recordDaily(null, "2026-10-24", 0);
  assert.equal(r["2026-10-24"], 0);
  r = recordDaily(JSON.stringify(r), "2026-10-24", 24);
  r = recordDaily(JSON.stringify(r), "2026-10-24", 10);
  assert.equal(r["2026-10-24"], 24);
  assert.equal(recordDaily("{}", "2026-10-24", 37)["2026-10-24"], undefined);
});
test("corrupt daily records cannot produce invalid dates or injected scores", () => {
  assert.deepEqual(dailyRecords("bad"), {});
  assert.deepEqual(dailyRecords("[]"), {});
  assert.deepEqual(
    dailyRecords('{"2026-02-30":6,"2026-10-24":"36","__proto__":6}'),
    {},
  );
});
test("daily history stays bounded at thirty dates", () => {
  let r = {};
  for (let i = 1; i <= 31; i++)
    r = recordDaily(
      JSON.stringify(r),
      "2026-10-" + String(i).padStart(2, "0"),
      i,
    );
  assert.equal(Object.keys(r).length, 30);
  assert.equal(r["2026-10-01"], undefined);
  assert.equal(r["2026-10-31"], 31);
});
test("bulk shopping conserves cash and blocks unaffordable batches", () => {
  assert.deepEqual(shoppingStep(1000, 0, 15, 10, 1), {
    balance: 850,
    quantity: 10,
  });
  assert.deepEqual(shoppingStep(850, 10, 15, 10, -1), {
    balance: 1000,
    quantity: 0,
  });
  assert.deepEqual(shoppingStep(1000, 0, 15, 100, 1), {
    balance: 1000,
    quantity: 0,
  });
  assert.deepEqual(shoppingStep(1000, 0, 15, 1, -1), {
    balance: 1000,
    quantity: 0,
  });
});
test("buy max uses only whole affordable units and leaves less than one item price", () => {
  for (const price of [
    15, 40, 450, 3500, 45000, 110000, 250000, 2500000, 7500000,
  ]) {
    const count = maxAffordable(10000000, price),
      result = shoppingStep(10000000, 0, price, count, 1);
    assert.ok(result.balance >= 0 && result.balance < price);
    assert.equal(result.balance + result.quantity * price, 10000000);
  }
  assert.equal(maxAffordable(10, 15), 0);
  assert.equal(maxAffordable(50, 0), 0);
});
test("shopping rejects fractional, non-finite and overflowing input", () => {
  for (const args of [
    [10, 0, 2, 1.5, 1],
    [10, 0, NaN, 1, 1],
    [10, 0, 2, 1, 0],
    [10, 0, 2, -1, 1],
    [10, Number.MAX_SAFE_INTEGER, 1, 1, 1],
  ]) {
    assert.deepEqual(shoppingStep(...args), {
      balance: args[0],
      quantity: args[1],
    });
  }
});
test("the animated delivery reaches the bat at the scoring centre", () => {
  assert.deepEqual(deliveryPoint(0.5), { x: 520, y: 316 });
  for (const p of [-1, 0, 0.2, 0.5, 1, 2]) {
    const point = deliveryPoint(p);
    assert.ok(Number.isFinite(point.x) && Number.isFinite(point.y));
  }
  assert.equal(deliveryPoint(-1).x, 400);
  assert.equal(deliveryPoint(2).x, 640);
});
test("shot paths begin at the bat and finish inside the scene", () => {
  for (const runs of [0, 1, 2, 4, 6]) {
    assert.deepEqual(shotPoint(runs, 0), { x: 520, y: 316 });
    const end = shotPoint(runs, 1);
    assert.ok(end.x >= 0 && end.x <= 800 && end.y >= 0 && end.y <= 400);
  }
});
