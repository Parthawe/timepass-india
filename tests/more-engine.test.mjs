import test from "node:test";
import assert from "node:assert/strict";
import {
  seatPuzzles,
  solveSeats,
  checkSeats,
  placePassenger,
  labBase,
  labRecipes,
  labNames,
  labHint,
  combineLab,
  restoreLab,
  passRules,
  evaluatePass,
  passProgress,
} from "../dist/more-engine.js";
test("all five seat puzzles have legal complete solutions", () => {
  assert.equal(seatPuzzles.length, 5);
  for (const puzzle of seatPuzzles) {
    const solution = solveSeats(puzzle);
    assert.ok(solution, puzzle.title);
    assert.equal(new Set(solution).size, 4);
    assert.equal(checkSeats(puzzle, solution).solved, true);
    for (const s of solution) assert.equal(puzzle.blocked.includes(s), false);
  }
});
test("unseated, duplicate and reserved seat assignments cannot pass", () => {
  for (const p of seatPuzzles) {
    assert.equal(checkSeats(p, [-1, -1, -1, -1]).solved, false);
    assert.equal(checkSeats(p, [0, 0, 0, 0]).solved, false);
    const good = solveSeats(p);
    good[0] = p.blocked[0];
    assert.equal(checkSeats(p, good).solved, false);
  }
});
test("moving into an occupied seat swaps passengers without duplication", () => {
  const before = [0, 1, 2, 3],
    after = placePassenger(before, 0, 1, []);
  assert.deepEqual(after, [1, 0, 2, 3]);
  assert.deepEqual(before, [0, 1, 2, 3]);
  assert.deepEqual(placePassenger([-1, 1, 2, 3], 0, 1, []), [1, -1, 2, 3]);
});
test("reserved seats and out-of-range passenger/seat input leave positions alone", () => {
  for (const [person, seat] of [
    [0, 6],
    [4, 2],
    [0, 8],
    [-1, 2],
    [0, -1],
  ])
    assert.deepEqual(
      placePassenger([0, 1, 2, 3], person, seat, [6]),
      [0, 1, 2, 3],
    );
});
test("every kitchen combination works in either order and has a named result", () => {
  for (const [a, b, result] of labRecipes) {
    assert.equal(combineLab(a, b), result);
    assert.equal(combineLab(b, a), result);
    assert.ok(labNames[a] && labNames[b] && labNames[result]);
  }
  assert.equal(combineLab("unknown", "tea"), null);
  assert.equal(combineLab("water", "water"), null);
});
test("all 21 discoveries are reachable from the eight starting ingredients", () => {
  const known = [...labBase];
  while (labHint(known)) {
    const [a, b, result] = labHint(known);
    assert.ok(known.includes(a) && known.includes(b));
    assert.ok(!known.includes(result));
    known.push(result);
  }
  assert.equal(known.length - labBase.length, 21);
  assert.equal(new Set(labRecipes.map((r) => r[2])).size, 21);
});
test("saved discoveries recover safely from malformed or impossible storage", () => {
  assert.deepEqual(restoreLab("not json"), labBase);
  assert.deepEqual(restoreLab("{}"), labBase);
  assert.deepEqual(restoreLab('["__proto__","unknown","masaladosa"]'), labBase);
  assert.deepEqual(restoreLab(JSON.stringify([...labBase, "steam", "steam"])), [
    ...labBase,
    "steam",
  ]);
});
test("a complete saved kitchen restores without losing reachable discoveries", () => {
  const known = [...labBase];
  while (labHint(known)) known.push(labHint(known)[2]);
  assert.deepEqual(
    new Set(restoreLab(JSON.stringify([...known].reverse()))),
    new Set(known),
  );
});
const valid = "Chai for B45 lift on Sunday please";
test("the visitor pass has a solution satisfying all ten rules", () => {
  assert.equal(passRules.length, 10);
  assert.ok(evaluatePass(valid).every(Boolean));
  assert.equal(passProgress(valid).approved, true);
  assert.equal(passProgress(valid).visible, 10);
});
test("rules unlock cumulatively and remain visible when an earlier rule breaks", () => {
  assert.equal(passProgress("").visible, 1);
  assert.ok(passProgress("a visitor message long enough").visible >= 2);
  const after = passProgress("too short", 10);
  assert.equal(after.visible, 10);
  assert.equal(after.approved, false);
  assert.equal(after.checks[0], false);
});
test("each visitor rule rejects its corresponding invalid input", () => {
  const invalid = [
    "short",
    valid.replace("Chai", "Coffee"),
    valid.toLowerCase(),
    valid.replace("45", "4"),
    valid.replace("45", "44"),
    valid.replace("B", "b"),
    valid.replace("lift", "lifted"),
    valid.replace("Sunday", "Sundays"),
    valid.replace("for", "sorry for"),
    valid + ".",
  ];
  invalid.forEach((s, i) =>
    assert.equal(evaluatePass(s)[i], false, passRules[i].text),
  );
});
test("a false whole-word match never satisfies the form", () => {
  assert.equal(evaluatePass(valid.replace("Chai", "Chains"))[1], false);
  assert.equal(evaluatePass(valid.replace("please", "displease"))[9], false);
});
