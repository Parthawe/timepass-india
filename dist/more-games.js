import {
  passengers,
  seatLabel,
  isWindow,
  seatPuzzles,
  checkSeats,
  placePassenger,
  solveSeats,
  labBase,
  labNames,
  labRecipes,
  combineLab,
  labHint,
  restoreLab,
  passRules,
  passProgress,
} from "./more-engine.js";
export function createMoreGames({ mount, on, $ }) {
  function seats() {
    let level = 0,
      positions = [-1, -1, -1, -1],
      selected = 0,
      complete = false,
      note = "Choose a passenger, then choose an empty seat.",
      showHint = false;
    const render = () => {
      const puzzle = seatPuzzles[level],
        state = checkSeats(puzzle, positions);
      mount(
        `<div class="status"><span><span class="muted">COACH PUZZLE</span><br><strong>${level + 1} of ${seatPuzzles.length}</strong></span><span class="muted">${positions.filter((p) => p >= 0).length} of 4 seated</span></div><div class="seat-layout"><section class="seat-choices"><h2 class="subheading">${puzzle.title}</h2><div class="passenger-picker" aria-label="Choose a passenger">${passengers.map((name, i) => `<button id="passenger-${i}" aria-pressed="${selected === i}" ${complete ? "disabled" : ""}><span class="passenger-letter">${name[0]}</span>${name}<small>${positions[i] < 0 ? "Unseated" : seatLabel(positions[i])}</small></button>`).join("")}</div><div class="coach" aria-label="Fictional coach seating"><p class="coach-direction">Front of coach</p>${[
          0, 1,
        ]
          .map(
            (row) =>
              `<div class="coach-row">${[0, 1, 2, 3]
                .map((col) => {
                  const seat = row * 4 + col,
                    occupant = positions.indexOf(seat),
                    blocked = puzzle.blocked.includes(seat);
                  return `<button id="seat-${seat}" class="coach-seat ${blocked ? "reserved" : ""} ${occupant >= 0 ? "occupied" : ""}" ${blocked || complete ? "disabled" : ""} aria-label="Seat ${seatLabel(seat)}, ${isWindow(seat) ? "window" : "aisle"}${blocked ? ", reserved" : occupant >= 0 ? ", " + passengers[occupant] : ", empty"}"><span>${seatLabel(seat)}</span><strong>${blocked ? "Taken" : occupant >= 0 ? passengers[occupant] : "Empty"}</strong><small>${isWindow(seat) ? "Window" : "Aisle"}</small></button>`;
                })
                .join("")}</div>`,
          )
          .join(
            "",
          )}<p class="coach-direction">A–B and C–D are side-by-side pairs. The gap is the aisle.</p></div></section><section class="seat-requests"><h2 class="subheading">Passenger requests</h2><ul>${puzzle.rules.map((r, i) => `<li class="${complete ? "satisfied" : ""}">${r.text}</li>`).join("")}</ul><p class="feedback" role="status">${note}</p>${showHint && !complete ? `<p class="hint-text">One seat that works: ${passengers[selected]} → ${seatLabel(solveSeats(puzzle)[selected])}. You may need to move other passengers.</p>` : ""}<div class="actions">${complete ? `<button class="primary" id="next-puzzle">${level === seatPuzzles.length - 1 ? "Finish the journey" : "Next coach puzzle"}</button>` : `<button class="primary" id="check-seats" ${!state.complete ? "disabled" : ""}>Check the seats</button><button id="seat-hint">${showHint ? "Hide hint" : "Give me a hint"}</button>`}<button id="reset-seats">Reset this coach</button></div></section></div><p class="fineprint">Invented coach layout and passengers. No real bookings or live railway data.</p>`,
      );
      passengers.forEach((_, i) =>
        on("passenger-" + i, () => {
          selected = i;
          render();
        }),
      );
      for (let i = 0; i < 8; i++)
        on("seat-" + i, () => {
          if (complete) return;
          positions = placePassenger(positions, selected, i, puzzle.blocked);
          const next = positions.findIndex((p) => p < 0);
          if (next >= 0) selected = next;
          note = passengers.filter((_, j) => positions[j] < 0).length
            ? "Keep going. Every request needs to work."
            : "Everyone is seated. Check their requests.";
          render();
        });
      on("check-seats", () => {
        const result = checkSeats(puzzle, positions);
        if (result.solved) {
          complete = true;
          showHint = false;
          note = "Everyone is happy. Tickets checked.";
        } else {
          const misses = puzzle.rules.filter((_, i) => !result.checks[i]);
          note =
            misses.length +
            " request" +
            (misses.length === 1 ? " still needs" : "s still need") +
            " attention. " +
            misses[0]?.text;
        }
        render();
      });
      on("seat-hint", () => {
        showHint = !showHint;
        render();
      });
      on("reset-seats", () => {
        positions = [-1, -1, -1, -1];
        selected = 0;
        complete = false;
        showHint = false;
        note = "Fresh coach. Choose a passenger.";
        render();
      });
      on("next-puzzle", () => {
        if (level === seatPuzzles.length - 1) {
          mount(
            `<div class="result"><h2>Everyone got a seat.</h2><p>You solved all five coach puzzles. The window seats are spoken for.</p><button id="restart-seats">Take another train</button></div>`,
          );
          on("restart-seats", () => {
            level = 0;
            positions = [-1, -1, -1, -1];
            selected = 0;
            complete = false;
            note = "Choose a passenger, then a seat.";
            render();
          });
        } else {
          level++;
          positions = [-1, -1, -1, -1];
          selected = 0;
          complete = false;
          showHint = false;
          note = "New coach. Read the requests.";
          render();
        }
      });
    };
    render();
    return () => {};
  }
  function masala() {
    let known;
    try {
      known = restoreLab(localStorage.getItem("timepass-masala"));
    } catch {
      known = [...labBase];
    }
    let selected = [],
      note = "Pick any two ingredients. Start with water and heat.",
      history = [],
      hint = false;
    const save = () => {
      try {
        localStorage.setItem("timepass-masala", JSON.stringify(known));
      } catch {}
    };
    const render = () => {
      const count = known.length - labBase.length,
        nextHint = labHint(known),
        all = count === labRecipes.length;
      mount(
        `<div class="status"><span><span class="muted">DISCOVERIES</span><br><strong>${count} / ${labRecipes.length}</strong></span><span class="muted">${known.length} things in your kitchen</span></div><section class="mixing-bench" aria-label="Mix ingredients"><div class="mixing-slots">${[0, 1].map((i) => `<div class="mix-slot">${selected[i] ? labNames[selected[i]] : "Pick ingredient " + (i + 1)}</div>`).join('<span class="mix-plus" aria-hidden="true">+</span>')}</div><div class="actions"><button class="primary" id="mix" ${selected.length !== 2 ? "disabled" : ""}>Mix them</button><button id="clear-mix" ${!selected.length ? "disabled" : ""}>Clear the bowl</button><button id="lab-hint">${hint ? "Hide hint" : "Nudge me"}</button></div><p class="feedback" role="status">${note}</p>${hint && nextHint ? `<p class="hint-text">Try ${labNames[nextHint[0]]} + ${labNames[nextHint[1]]}.</p>` : ""}</section><div class="ingredient-shelf" aria-label="Available ingredients">${known.map((id) => `<button id="lab-${id}" class="ingredient-chip ${labBase.includes(id) ? "base" : ""}" aria-pressed="${selected.includes(id)}">${labNames[id]}</button>`).join("")}</div>${all ? '<div class="result" role="status"><h2>The kitchen is full.</h2><p>You found all 21 combinations. Your discoveries stay on this device until you reset them.</p></div>' : ""}${
          history.length
            ? `<section class="lab-notebook"><h2 class="subheading">This session’s notebook</h2>${history
                .slice(-5)
                .reverse()
                .map((h) => `<p>${h}</p>`)
                .join("")}</section>`
            : ""
        }<div class="actions"><button id="reset-lab">Reset discoveries</button></div><p class="fineprint">A playful kitchen sandbox. Combinations are game logic, not cooking instructions. Discoveries save on this device.</p>`,
      );
      for (const id of known)
        on("lab-" + id, () => {
          selected = selected.length === 2 ? [id] : [...selected, id];
          render();
          if (selected.length === 2) $("#mix").focus({ preventScroll: true });
        });
      on("clear-mix", () => {
        selected = [];
        note = "Empty bowl. Try another pair.";
        render();
        $("#lab-" + known[0]).focus({ preventScroll: true });
      });
      on("lab-hint", () => {
        hint = !hint;
        render();
      });
      on("mix", () => {
        if (selected.length !== 2) return;
        const [a, b] = selected,
          result = combineLab(a, b);
        if (result) {
          const fresh = !known.includes(result);
          if (fresh) {
            known.push(result);
            save();
          }
          note = fresh
            ? "Discovered " +
              labNames[result] +
              ". Add it to the next experiment."
            : "You already know " + labNames[result] + ". Try another pair.";
          history.push(
            labNames[a] + " + " + labNames[b] + " → " + labNames[result],
          );
        } else
          note =
            "Nothing new in this bowl. Try another pair, or ask for a nudge.";
        selected = [];
        render();
        $("#lab-" + (result || a)).focus({ preventScroll: true });
      });
      on("reset-lab", () => {
        known = [...labBase];
        selected = [];
        history = [];
        hint = false;
        note = "A fresh kitchen. Start with water and heat.";
        save();
        render();
      });
    };
    render();
    return () => {};
  }
  function society() {
    let unlocked = 1,
      showHint = false,
      approved = false;
    mount(
      `<div class="pass-form"><div class="pass-slip"><span>WINDOW 03</span><span>Visitor desk</span></div><form id="society-form" novalidate><label for="visitor-message">Your completely made-up visitor message</label><p class="muted">The desk keeps adding requirements. Earlier rules still apply.</p><textarea id="visitor-message" rows="3" maxlength="80" autocomplete="off" spellcheck="false" placeholder="Invent a message. No real names, IDs or addresses." aria-describedby="pass-counter pass-note"></textarea><div class="pass-counter" id="pass-counter">0 / 80 characters</div><div class="pass-rules" id="pass-rules" aria-label="Visitor message rules"></div><p id="pass-note" class="feedback" role="status">The first requirement is on the board.</p><div id="pass-hint" class="hint-text"></div><div class="actions"><button class="primary" id="submit-pass" type="submit" disabled>Get the pretend pass</button><button id="hint-pass" type="button">Help with this rule</button><button id="reset-pass" type="button">Start over</button></div></form><div id="approved-pass"></div></div><p class="fineprint">This is a fictional form puzzle. Nothing is submitted, saved or sent anywhere.</p>`,
    );
    const input = $("#visitor-message");
    const refresh = () => {
      const value = input.value,
        result = passProgress(value, unlocked);
      unlocked = result.visible;
      $("#pass-counter").textContent = value.length + " / 80 characters";
      $("#pass-rules").innerHTML = passRules
        .slice(0, unlocked)
        .map(
          (r, i) =>
            `<div class="pass-rule ${result.checks[i] ? "passed" : "needs-work"}"><span class="rule-state">${result.checks[i] ? "Met" : "Pending"}</span><span>${r.text}</span></div>`,
        )
        .join("");
      $("#submit-pass").disabled = !result.approved || approved;
      $("#pass-note").textContent = result.approved
        ? "All ten rules met. The desk is ready to issue your pretend pass."
        : unlocked +
          " of " +
          passRules.length +
          " rules revealed. " +
          result.checks.slice(0, unlocked).filter(Boolean).length +
          " currently met.";
      const tips = [
        "A sentence of 18–80 characters gives you room for later rules.",
        "Use chai on its own, separated by spaces.",
        "Begin with an English capital, such as C.",
        "Use two digits, such as 4 and 5.",
        "4 + 5 = 9. Other two-digit pairs can work too.",
        "The letter must be a capital B.",
        "Include lift on its own, separated by spaces.",
        "Sunday can appear anywhere as a whole word.",
        "Remove sorry if you used it.",
        "The last word must be please, with no punctuation after it.",
      ];
      const first = result.checks.slice(0, unlocked).findIndex((x) => !x);
      $("#pass-hint").textContent = showHint
        ? first >= 0
          ? tips[first]
          : "All the rules are satisfied. Request your pretend pass."
        : "";
    };
    on("visitor-message", refresh, "input");
    on("hint-pass", () => {
      showHint = !showHint;
      $("#hint-pass").textContent = showHint
        ? "Hide help"
        : "Help with this rule";
      refresh();
    });
    on(
      "society-form",
      (e) => {
        e.preventDefault();
        if (!passProgress(input.value, unlocked).approved || approved) return;
        approved = true;
        input.disabled = true;
        $("#hint-pass").disabled = true;
        $("#approved-pass").innerHTML =
          '<div class="result" role="status"><div class="approval-stamp">APPROVED</div><h2>The desk lets you in.</h2><p>Ten rules satisfied. Your imaginary neighbours are expecting you.</p></div>';
        refresh();
        const result = $("#approved-pass .result");
        result.tabIndex = -1;
        result.focus();
      },
      "submit",
    );
    on("reset-pass", () => {
      unlocked = 1;
      showHint = false;
      approved = false;
      input.disabled = false;
      input.value = "";
      $("#hint-pass").disabled = false;
      $("#hint-pass").textContent = "Help with this rule";
      $("#approved-pass").innerHTML = "";
      refresh();
      input.focus();
    });
    refresh();
    return () => {};
  }
  return { seats, masala, society };
}
