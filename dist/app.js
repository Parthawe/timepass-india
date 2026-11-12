import {
  rupees,
  basketItems,
  places,
  newCity,
  netWorth,
  cityLand,
  cityBuy,
  circleScore,
  bargainOffer,
  shuffled,
} from "./engine.js";
import { svg, cup, icon, food } from "./art.js";
import { createMoreGames } from "./more-games.js";
import {
  createCricket,
  readDaily,
  dailyLabel,
  dailyTarget,
} from "./cricket.js";
import { dayKey, shoppingStep, maxAffordable } from "./play-engine.js";
const app = document.querySelector("#app");
document.querySelector(".skip").addEventListener("click", (e) => {
  e.preventDefault();
  const main = document.querySelector("#main");
  if (main) {
    main.tabIndex = -1;
    main.focus();
    main.scrollIntoView({ block: "start" });
  }
});
const games = [
  {
    id: "seats",
    name: "Seat, Please",
    desc: "Seat four passengers and meet every request.",
    time: "5 min",
    group: "quick",
  },
  {
    id: "masala",
    name: "Masala Lab",
    desc: "Mix two ingredients and see what you discover.",
    time: "At your pace",
    group: "slow",
  },
  {
    id: "society",
    name: "Society Pass",
    desc: "Write a visitor message as the rules pile up.",
    time: "3 min",
    group: "quick",
  },
  {
    id: "city",
    name: "City Tycoon",
    desc: "Buy property and beat the computer on net worth.",
    time: "10 min",
    group: "slow",
  },
  {
    id: "spend",
    name: "Spend a Crore",
    desc: "See how far ₹1,00,00,000 goes.",
    time: "At your pace",
    group: "slow",
  },
  {
    id: "cricket",
    name: "Gully Cricket",
    desc: "Time your swing over six deliveries.",
    time: "1 min",
    group: "quick",
  },
  {
    id: "chai",
    name: "Chai Tapri",
    desc: "Make five chai orders from memory.",
    time: "2 min",
    group: "quick",
  },
  {
    id: "bargain",
    name: "Bargain Bazaar",
    desc: "Ask for the last price at three stalls.",
    time: "3 min",
    group: "quick",
  },
  {
    id: "dabba",
    name: "Dabba Memory",
    desc: "Open the dabbas and match six lunches.",
    time: "2 min",
    group: "quick",
  },
  {
    id: "roti",
    name: "Perfect Roti",
    desc: "Draw a roti and see how round it is.",
    time: "30 sec",
    group: "quick",
  },
  {
    id: "train",
    name: "Train Window",
    desc: "Take a window seat and watch the countryside.",
    time: "Stay a while",
    group: "slow",
  },
];
let cleanup = () => {},
  filter = "all";
let currentRoute = "",
  shelfScroll = 0,
  shelfGame = "",
  shelfControl = "";
const $ = (s) => document.querySelector(s);
const on = (id, fn, event = "click") =>
  document.getElementById(id)?.addEventListener(event, fn);
function mount(html) {
  const focused = document.activeElement?.id;
  $("#stage").innerHTML = html;
  if (focused) {
    let target = document.getElementById(focused);
    if (!target || target.disabled)
      target = document.querySelector(
        "#stage .primary:not(:disabled), #stage button:not(:disabled), #stage select:not(:disabled)",
      );
    target?.focus({ preventScroll: true });
  }
}
function best(key, value, lower = false) {
  try {
    const stored = Number(localStorage.getItem("timepass-" + key));
    const old = Number.isFinite(stored) && stored >= 0 ? stored : 0;
    if (value !== undefined && (!old || (lower ? value < old : value > old)))
      localStorage.setItem("timepass-" + key, String(value));
    const valueNow = Number(localStorage.getItem("timepass-" + key));
    return Number.isFinite(valueNow) && valueNow >= 0 ? valueNow : 0;
  } catch {
    return value || 0;
  }
}
const footer = () =>
  `<footer><span>Timepass · Games and experiments</span><div><a href="#/about">About & data</a><a href="https://github.com/Parthawe/timepass-india" target="_blank" rel="noopener">Source on GitHub</a></div></footer>`;
function personalRecord(id) {
  const specs = {
    cricket: ["cricket", "runs"],
    roti: ["roti", "%"],
    dabba: ["dabba", "moves"],
  };
  if (!specs[id]) return "";
  const [key, unit] = specs[id];
  try {
    const raw = localStorage.getItem("timepass-" + key);
    const score = Number(raw);
    return raw !== null && Number.isFinite(score) && score >= 0
      ? `<p class="personal-record">Your best: ${score}${unit === "%" ? "%" : " " + unit}</p>`
      : "";
  } catch {
    return "";
  }
}
function dailyLink() {
  const day = dayKey();
  const records = readDaily();
  const played = Object.hasOwn(records, day);
  return `
    <a id="daily-challenge" class="daily-link" href="#/cricket?mode=daily&day=${day}">
      <strong>${played ? "Replay daily cricket" : "Daily cricket"}</strong>
      <span>${played ? `Best ${records[day]} / 36` : `Target ${dailyTarget}`}</span>
      <span class="sr-only">${dailyLabel(day)}</span>
      ${icon("arrow")}
    </a>`;
}
const recommendations = {
  cricket: ["roti", "dabba"],
  spend: ["city", "bargain"],
  seats: ["society", "dabba"],
  masala: ["chai", "spend"],
  society: ["seats", "bargain"],
  city: ["spend", "seats"],
  roti: ["cricket", "train"],
  dabba: ["chai", "seats"],
  train: ["masala", "roti"],
  chai: ["masala", "cricket"],
  bargain: ["spend", "society"],
};
function keepPlaying(id) {
  return `<section class="keep-playing" aria-label="More games"><h2>More to play</h2><div class="next-games">${(
    recommendations[id] || []
  )
    .map((next) => {
      const g = games.find((g) => g.id === next);
      return `<a href="#/${g.id}" class="next-game"><span><strong>${g.name}</strong><span>${g.desc}</span></span>${icon("arrow")}</a>`;
    })
    .join(
      "",
    )}</div><a class="browse-games" href="#/">Browse all eleven games</a></section>`;
}
function home() {
  document.title = "Timepass · Games and experiments";
  app.innerHTML = `
    <div class="shell">
      <main id="main">
        <header class="masthead">
          <h1>Timepass</h1>
          <p>Small games from everyday India.</p>
        </header>
        <div class="shelf-head">
          <div class="filters" role="group" aria-label="Filter games">
            <button id="all" aria-pressed="${filter === "all"}">All games</button>
            <button id="quick" aria-pressed="${filter === "quick"}">Quick play</button>
            <button id="slow" aria-pressed="${filter === "slow"}">Take your time</button>
          </div>
          <div class="shelf-actions">
            ${dailyLink()}
            <button class="random" id="random">Choose for me</button>
          </div>
        </div>
        <div class="games" id="games"></div>
      </main>
      ${footer()}
    </div>`;
  const draw = () => {
    $("#games").innerHTML = games
      .filter((g) => filter === "all" || g.group === filter)
      .map(
        (g, index) =>
          `<a href="#/${g.id}" class="game-card" data-game="${g.id}">
            <img src="./assets/covers/${g.id}.webp" width="512" height="256" alt=""
              loading="${index < 3 ? "eager" : "lazy"}" decoding="async">
            <div class="cover-copy">
              <h2>${g.name}</h2>
              <span class="cover-time">${g.time}</span>
              <span class="sr-only">${g.desc}</span>
              ${personalRecord(g.id)}
            </div>
          </a>`,
      )
      .join("");
  };
  draw();
  for (const f of ["all", "quick", "slow"])
    on(f, () => {
      filter = f;
      document
        .querySelectorAll(".filters button")
        .forEach((b) => b.setAttribute("aria-pressed", String(b.id === f)));
      draw();
    });
  on("random", () => {
    const eligible = games.filter(
      (g) => filter === "all" || g.group === filter,
    );
    location.hash =
      "/" + eligible[Math.floor(Math.random() * eligible.length)].id;
  });
}
function gameShell(g, desc, narrow = false) {
  app.innerHTML = `<div class="shell"><header class="game-nav"><a class="back" href="#/">${icon("back")}All games</a><a class="tiny-logo" href="#/">Timepass</a><button id="share" class="small">Copy game link</button></header><main id="main"><div class="share-status" id="share-status" role="status"></div><header class="game-header"><h1>${g.name}</h1><p>${desc}</p></header><div class="game-stage ${narrow ? "narrow" : ""}" id="stage"></div>${keepPlaying(g.id)}</main>${footer()}</div>`;
  document.title = g.name + " • Timepass";
  on("share", async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      $("#share-status").textContent = "Link copied. Send it to your group.";
    } catch {
      $("#share-status").innerHTML =
        '<label>Copy this link <input id="share-url" readonly></label>';
      $("#share-url").value = location.href;
      $("#share-url").select();
    }
  });
}
function spend() {
  let balance = 10000000,
    qty = basketItems.map(() => 0),
    batch = 1,
    note = "Choose how many to buy or sell at a time.";
  const change = (i, delta) => {
    const [, price] = basketItems[i];
    const next = shoppingStep(
      balance,
      qty[i],
      price,
      Math.abs(delta),
      Math.sign(delta),
    );
    balance = next.balance;
    qty[i] = next.quantity;
    note =
      (delta > 0 ? "Bought " : "Sold ") +
      Math.abs(delta).toLocaleString("en-IN") +
      " × " +
      basketItems[i][0] +
      ".";
    render();
  };
  const render = () => {
    const spent = 10000000 - balance;
    mount(
      `<div class="money-header"><div class="money-amount" role="status"><p>YOUR IMAGINARY BALANCE</p><div class="balance">${rupees(balance)}</div><p>${spent ? rupees(spent) + " spent" : "One crore. Where do you start?"}</p></div><label class="batch-control" for="batch-size">Buy or sell <select id="batch-size"><option value="1" ${batch === 1 ? "selected" : ""}>1 at a time</option><option value="10" ${batch === 10 ? "selected" : ""}>10 at a time</option><option value="100" ${batch === 100 ? "selected" : ""}>100 at a time</option></select></label></div><p class="shop-feedback" role="status">${note}</p><div class="shop-grid">${basketItems.map(([name, price, art], i) => `<article class="shop-item"><div class="item-art">${food(art)}</div><h2>${name}</h2><p>${rupees(price)}</p><div class="stepper basket-stepper"><output aria-label="Quantity of ${name}">Owned: ${qty[i].toLocaleString("en-IN")}</output><button id="sell-${i}" aria-label="Sell ${batch} ${name}" ${qty[i] < batch ? "disabled" : ""}>−${batch}</button><button id="buy-${i}" aria-label="Buy ${batch} ${name}" ${balance < price * batch ? "disabled" : ""}>+${batch}</button><button id="max-${i}" class="buy-max" aria-label="Buy maximum ${name}" ${balance < price ? "disabled" : ""}>Buy max</button></div></article>`).join("")}</div>${spent ? `<section class="receipt"><h2>Your receipt</h2>${basketItems.map(([name, price], i) => (qty[i] ? `<div class="receipt-line"><span>${qty[i].toLocaleString("en-IN")} × ${name}</span><strong>${rupees(qty[i] * price)}</strong></div>` : "")).join("")}<div class="receipt-line"><strong>Total spent</strong><strong>${rupees(spent)}</strong></div></section>` : ""}${balance < 15 ? `<div class="result" role="status"><h2>Crore gone. Chai?</h2><p>You have ${rupees(balance)} left. Sell something or start again.</p></div>` : ""}<div class="actions"><button id="reset">Start with a fresh crore</button></div><p class="fineprint">All prices are invented for this game. Nothing here is for sale. Buy max spends as much of the remaining balance as that item allows.</p>`,
    );
    on(
      "batch-size",
      () => {
        batch = Number($("#batch-size").value);
        render();
      },
      "change",
    );
    basketItems.forEach(([, price], i) => {
      on("buy-" + i, () => change(i, batch));
      on("sell-" + i, () => change(i, -batch));
      on("max-" + i, () => {
        const count = maxAffordable(balance, price);
        if (count > 0) change(i, count);
      });
    });
    on("reset", () => {
      balance = 10000000;
      qty.fill(0);
      note = "A fresh crore. Choose your next purchase.";
      render();
    });
  };
  render();
  return () => {};
}
const orders = [
  {
    name: "Adrak chai",
    recipe: ["Tea", "Milk", "Sugar", "Ginger"],
    line: "“Ginger, milk, sugar. Strong, please.”",
  },
  {
    name: "Cutting chai",
    recipe: ["Tea", "Milk", "Sugar"],
    line: "“Just tea, milk and sugar. Half glass.”",
  },
  {
    name: "Elaichi, no sugar",
    recipe: ["Tea", "Milk", "Cardamom"],
    line: "“Tea, milk, cardamom. No sugar.”",
  },
  {
    name: "Black ginger tea",
    recipe: ["Tea", "Ginger", "Sugar"],
    line: "“Tea, ginger, sugar. No milk.”",
  },
  {
    name: "Masala mood",
    recipe: ["Tea", "Milk", "Sugar", "Ginger", "Cardamom"],
    line: "“Tea, milk, sugar, ginger, cardamom. All in.”",
  },
];
function chai() {
  let round = 0,
    score = 0,
    selected = new Set(),
    remember = false,
    served = false,
    note = "Read the order, then put the ticket away.",
    deck = shuffled(orders);
  const render = () => {
    const o = deck[round];
    mount(
      `<div class="status"><span><span class="muted">TIPS EARNED</span><br><strong>${rupees(score)}</strong></span><span class="muted">${round < 5 ? "Order " + (round + 1) + " of 5" : "Shift complete"}</span></div>${round === 5 ? `<div class="result"><h2>${score === 100 ? "Tapri legend." : "That’s your shift."}</h2><p>${score / 20} happy customers out of 5.</p><button id="reset">Open the tapri again</button></div>` : `<div class="panel"><div class="chai-art">${cup()}</div><div class="order-ticket"><p class="muted">CUSTOMER ${round + 1}</p><h2>${o.name}</h2>${!remember ? `<p>${o.line}</p><button class="small" id="remember">Got it. Put ticket away</button>` : "<p>Ticket tucked away. What went in?</p>"}</div><div class="ingredients" aria-label="Chai ingredients">${["Tea", "Milk", "Sugar", "Ginger", "Cardamom"].map((x) => `<button id="ingredient-${x}" aria-pressed="${selected.has(x)}" ${!remember || served ? "disabled" : ""}>${x}</button>`).join("")}</div><p class="feedback" role="status">${note}</p><div class="actions">${served ? '<button class="primary" id="next">' + (round === 4 ? "Close the tapri" : "Next customer") + "</button>" : `<button class="primary" id="serve" ${!remember || !selected.size ? "disabled" : ""}>Serve chai</button>${remember ? '<button id="peek">Read ticket again</button>' : ""}`}</div></div>`}`,
    );
    on("remember", () => {
      remember = true;
      note = "Choose the ingredients you remember.";
      render();
    });
    on("peek", () => {
      remember = false;
      render();
    });
    ["Tea", "Milk", "Sugar", "Ginger", "Cardamom"].forEach((x) =>
      on("ingredient-" + x, () => {
        selected.has(x) ? selected.delete(x) : selected.add(x);
        render();
      }),
    );
    on("serve", () => {
      if (served) return;
      served = true;
      const correct =
        selected.size === o.recipe.length &&
        o.recipe.every((x) => selected.has(x));
      if (correct) {
        score += 20;
        note = "Bilkul right. ₹20 tip for you.";
      } else note = "Wrong chai. Needed: " + o.recipe.join(", ") + ".";
      render();
    });
    on("next", () => {
      round++;
      selected.clear();
      remember = false;
      served = false;
      note = "New customer. New order.";
      render();
    });
    on("reset", () => {
      round = 0;
      score = 0;
      deck = shuffled(orders);
      selected.clear();
      remember = false;
      served = false;
      note = "Read the order, then put the ticket away.";
      render();
    });
  };
  render();
  return () => {};
}
function bargain() {
  const stock = [
    { name: "A brass kettle", ask: 450, art: "chai" },
    { name: "A pair of juttis", ask: 600, art: "shoe" },
    { name: "A mango crate", ask: 350, art: "mango" },
  ];
  let index = 0,
    balance = 1500,
    saved = 0,
    attempts = 0,
    ask = 450,
    floor = 0,
    done = false,
    note = "Make an offer, take the asking price, or walk away.",
    receipt = [];
  const start = () => {
    attempts = 0;
    ask = stock[index].ask;
    floor = Math.round((ask * (0.58 + Math.random() * 0.18)) / 10) * 10;
    done = false;
  };
  start();
  const purchase = (price) => {
    if (price > balance) return;
    balance -= price;
    saved += stock[index].ask - price;
    receipt.push({ name: stock[index].name, price });
    done = true;
    note =
      "Deal done at " +
      rupees(price) +
      ". Original ask: " +
      rupees(stock[index].ask) +
      ". Seller’s floor was " +
      rupees(floor) +
      ".";
    render();
  };
  const render = () => {
    const item = stock[index];
    mount(
      `<div class="status"><span><span class="muted">YOUR BUDGET</span><br><strong>${rupees(balance)}</strong></span><span class="muted">Saved ${rupees(saved)}<br>${index < 3 ? "Stall " + (index + 1) + " of 3" : "Bazaar complete"}</span></div>${index === 3 ? `<div class="result"><h2>${receipt.length ? "Good bargaining, boss." : "Window shopping counts."}</h2><p>${receipt.length} purchases. ${rupees(saved)} below the original asking prices.</p>${receipt.map((r) => `<p>${r.name}: ${rupees(r.price)}</p>`).join("")}<button id="reset">Another trip to the bazaar</button></div>` : `<div class="panel"><h2 class="bargain-quote">${item.name} · ${rupees(ask)}</h2><p class="muted" style="text-align:center">${attempts} of 3 offers used. The seller has a hidden minimum.</p><p class="feedback" role="status">${note}</p>${done ? `<div class="actions"><button class="primary" id="next">${index === 2 ? "Leave the bazaar" : "Next stall"}</button></div>` : `${attempts < 3 ? `<form id="offer-form"><label class="offer-label" for="offer">Your offer in rupees</label><div class="offer-row"><span>₹</span><input id="offer" type="number" min="10" max="${Math.min(ask, balance)}" step="10" value="${Math.min(balance, Math.round((ask * 0.6) / 10) * 10)}" required aria-describedby="offer-help"><button class="primary" type="submit">Make offer</button></div><p id="offer-help" class="fineprint">Up to ${rupees(Math.min(ask, balance))}, in ₹10 steps.</p></form>` : '<p class="muted" style="text-align:center">No more counteroffers. Take it or leave it.</p>'}<div class="actions"><button id="accept" ${balance < ask ? "disabled" : ""}>Pay ${rupees(ask)}</button><button id="walk">Walk away</button></div>`}</div>`}<p class="fineprint">Fictional stalls and prices. Sellers get a different minimum each game.</p>`,
    );
    on(
      "offer-form",
      (e) => {
        e.preventDefault();
        const offer = Number($("#offer").value);
        if (
          !Number.isFinite(offer) ||
          offer < 10 ||
          offer > ask ||
          offer > balance ||
          offer % 10 !== 0
        )
          return;
        if (bargainOffer(floor, offer, balance)) {
          purchase(offer);
          return;
        }
        attempts++;
        ask = Math.max(floor, Math.round((ask + floor) / 20) * 10);
        note =
          attempts === 3
            ? "“Last price. " + rupees(ask) + ". Pakka.”"
            : "“Too low! I can do " + rupees(ask) + ". Your move.”";
        render();
      },
      "submit",
    );
    on("accept", () => purchase(ask));
    on("walk", () => {
      done = true;
      note = "You walked away. The seller’s minimum was " + rupees(floor) + ".";
      render();
    });
    on("next", () => {
      index++;
      if (index < 3) {
        start();
        note = "Fresh stall. Fresh negotiations.";
      }
      render();
    });
    on("reset", () => {
      index = 0;
      balance = 1500;
      saved = 0;
      receipt = [];
      start();
      note = "Make an offer, take the asking price, or walk away.";
      render();
    });
  };
  render();
  return () => {};
}
function dabba() {
  const foods = ["samosa", "roti", "mango", "ladoo", "idli", "chilli"];
  let deck = shuffled([...foods, ...foods]),
    flipped = [],
    matched = new Set(),
    moves = 0,
    busy = false,
    timer,
    note = "Open two dabbas. Find the matching food.";
  const render = () => {
    const done = matched.size === 12;
    if (done) best("dabba", moves, true);
    mount(
      `<div class="status"><span><span class="muted">MOVES</span><br><strong>${moves}</strong></span><span class="muted">${matched.size / 2} of 6 pairs found<br>Best: ${best("dabba") || "—"} moves</span></div><div class="memory-grid">${deck.map((name, i) => `<button id="dabba-${i}" class="memory-card ${flipped.includes(i) ? "flipped" : ""} ${matched.has(i) ? "matched" : ""}" aria-label="Dabba ${i + 1}${flipped.includes(i) || matched.has(i) ? ": " + name : ": closed"}" ${matched.has(i) || busy || flipped.includes(i) ? "disabled" : ""}>${flipped.includes(i) || matched.has(i) ? food(name) : '<span class="back-pattern" aria-hidden="true">?</span>'}</button>`).join("")}</div><p class="feedback" role="status">${note}</p>${done ? `<div class="result"><h2>Lunch is sorted.</h2><p>All six pairs in ${moves} moves.</p><button id="reset">Shuffle the dabbas</button></div>` : '<div class="actions"><button id="reset">Shuffle & start again</button></div>'}`,
    );
    deck.forEach((name, i) =>
      on("dabba-" + i, () => {
        if (busy || matched.has(i) || flipped.includes(i)) return;
        flipped.push(i);
        if (flipped.length === 2) {
          moves++;
          if (deck[flipped[0]] === deck[flipped[1]]) {
            flipped.forEach((n) => matched.add(n));
            flipped = [];
            note =
              matched.size === 12
                ? "All found. Time to eat."
                : "A pair! Keep going.";
          } else {
            busy = true;
            note = "Different lunches. Remember them.";
            timer = setTimeout(() => {
              flipped = [];
              busy = false;
              note = "Try another pair.";
              render();
            }, 950);
          }
        }
        render();
      }),
    );
    on("reset", () => {
      clearTimeout(timer);
      deck = shuffled([...foods, ...foods]);
      flipped = [];
      matched.clear();
      moves = 0;
      busy = false;
      note = "New dabba arrangement.";
      render();
    });
  };
  render();
  return () => clearTimeout(timer);
}
function city() {
  let state = newCity(),
    die = "?",
    message = "You go first. Roll the die.";
  const square = (i) => {
    if (i <= 5) return [1, i + 1];
    if (i <= 10) return [i - 4, 6];
    if (i <= 15) return [6, 16 - i];
    return [21 - i, 1];
  };
  const finishRound = () => {
    if (!state.finished) {
      state.pending = null;
      cityLand(state, 1, 1 + Math.floor(Math.random() * 6));
      if (state.pending && state.cash[1] >= places[state.pending.i].price + 100)
        cityBuy(state);
      state.pending = null;
      if (!state.finished) {
        state.round++;
        if (state.round > 16) state.finished = true;
      }
    }
    message = state.finished
      ? "The game is over."
      : "Your turn. Roll when ready.";
    render();
  };
  const render = () => {
    let winner =
      state.cash[0] <= 0
        ? 1
        : state.cash[1] <= 0
          ? 0
          : netWorth(state, 0) > netWorth(state, 1)
            ? 0
            : netWorth(state, 0) < netWorth(state, 1)
              ? 1
              : null;
    mount(
      `<div class="board-layout"><div class="city-board">${places
        .map((p, i) => {
          const [r, c] = square(i);
          return `<div class="property ${state.owners[i] !== null ? "owned-" + state.owners[i] : ""}" style="grid-row:${r};grid-column:${c}" aria-label="${p.name}${p.price ? ", price " + rupees(p.price) : ""}${state.owners[i] !== null ? ", owned by " + (state.owners[i] === 0 ? "you" : "computer") : ""}">${p.color ? `<span class="swatch" style="background:${p.color}"></span>` : ""}<strong>${p.name}</strong>${p.price ? "<small>" + rupees(p.price) + "</small>" : ""}<span class="tokens">${state.pos[0] === i ? '<span class="token" aria-label="Your position"></span>' : ""}${state.pos[1] === i ? '<span class="token ai" aria-label="Computer position"></span>' : ""}</span></div>`;
        })
        .join(
          "",
        )}<div class="board-center"><h2>CITY<br>TYCOON</h2><div class="die" aria-label="Last roll">${die}</div><p>${state.finished ? "Game complete" : "Round " + state.round + " of 16"}</p><p>Pass START: +₹300<br>Rent: 22% of property price</p></div></div><aside class="city-sidebar" aria-label="Players and turns">${[0, 1].map((p) => `<div class="city-player"><div class="name"><span class="dot ${p ? "orange" : ""}"></span>${p ? "Computer" : "You"}</div><strong>${rupees(state.cash[p])}</strong><p>${state.owners.filter((x) => x === p).length} properties · worth ${rupees(netWorth(state, p))}</p></div>`).join("")}<div class="city-controls">${state.finished ? '<button id="reset" class="primary">Play again</button>' : state.pending?.p === 0 ? `<button id="buy-property" class="primary">Buy ${places[state.pending.i].name}<br>${rupees(places[state.pending.i].price)}</button><button id="skip-property">Skip property</button>` : '<button id="roll" class="primary">Roll the die</button><button id="reset">New game</button>'}</div><div class="city-log" role="log" aria-live="polite" aria-label="Recent events">${state.log
        .slice(-7)
        .reverse()
        .map((l) => "<p>" + l + "</p>")
        .join(
          "",
        )}</div></aside></div><p class="feedback" role="status">${message}</p>${state.finished ? `<div class="result"><h2>${winner === null ? "A dead heat." : winner === 0 ? "The city is yours." : "The computer takes the city."}</h2><p>${state.cash.some((c) => c <= 0) ? "Bankruptcy ends the game." : "Sixteen rounds complete. Highest net worth wins."}<br>You: ${rupees(netWorth(state, 0))} · Computer: ${rupees(netWorth(state, 1))}</p></div>` : ""}<p class="fineprint">Original short property game. All values are fictional. Buy at the marked price; collect rent when your opponent lands there. Properties count at purchase price in your net worth.</p>`,
    );
    on("roll", () => {
      if (state.finished || state.pending) return;
      die = 1 + Math.floor(Math.random() * 6);
      cityLand(state, 0, die);
      if (state.pending?.p === 0) {
        message = "Buy " + places[state.pending.i].name + " or keep your cash?";
        render();
      } else finishRound();
    });
    on("buy-property", () => {
      cityBuy(state);
      finishRound();
    });
    on("skip-property", finishRound);
    on("reset", () => {
      state = newCity();
      die = "?";
      message = "A fresh city. You go first.";
      render();
    });
  };
  render();
  return () => {};
}
function roti() {
  let points = [],
    drawing = false,
    score = null,
    mode = "draw",
    phase = 0,
    position = 0.1,
    raf,
    last = performance.now(),
    active = true;
  const render = () => {
    mount(
      `<div class="status"><span><span class="muted">ROUNDNESS</span><br><strong id="roti-score">${score === null ? "Your move" : score + "%"}</strong></span><span class="muted">Personal best: ${best("roti")}%</span></div>${mode === "draw" ? `<div class="roti-wrap"><canvas id="roti-canvas" width="500" height="500" aria-label="Draw a closed roti with your pointer or touch. Keyboard players can switch to timing mode."></canvas><span id="roti-hint" class="roti-hint">Draw one round roti.<br>Finish where you started.</span></div>` : `<div class="panel"><div class="chai-art">${food("roti")}</div><p style="text-align:center">Stop the marker in the centre to roll an even roti.</p><div class="timing-track" aria-hidden="true"><div class="zone"></div><div class="sweet"></div><div class="marker" id="roti-marker"></div></div><div class="actions"><button id="stop-roti" class="primary">Finish the roti</button></div></div>`}<p class="feedback" id="roti-feedback" role="status">${score === null ? "A little wonky is still delicious." : score >= 90 ? "That belongs in a geometry textbook." : score >= 65 ? "Pretty round. Definitely edible." : "An interesting new map. Still a roti."}</p><div class="actions"><button id="reset">Try a fresh roti</button><button id="mode">${mode === "draw" ? "Use keyboard timing mode" : "Draw with touch or pointer"}</button></div><p class="fineprint">Drawing scores measure roundness, coverage and how well the ends meet. Timing mode measures accuracy. Personal bests are stored separately for each mode.</p>`,
    );
    if (mode === "draw") {
      const c = $("#roti-canvas"),
        ctx = c.getContext("2d");
      const point = (e) => {
        const r = c.getBoundingClientRect();
        return {
          x: ((e.clientX - r.left) * 500) / r.width,
          y: ((e.clientY - r.top) * 500) / r.height,
        };
      };
      const draw = () => {
        ctx.clearRect(0, 0, 500, 500);
        ctx.strokeStyle = "#69715e";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(250, 250, 190, 0, Math.PI * 2);
        ctx.stroke();
        if (!points.length) return;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        points.slice(1).forEach((p) => ctx.lineTo(p.x, p.y));
        ctx.strokeStyle = "#e5bc70";
        ctx.lineWidth = 12;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        if (!drawing && points.length > 2) {
          ctx.closePath();
          ctx.fillStyle = "#d5ab62";
          ctx.fill();
        }
        ctx.stroke();
      };
      draw();
      c.addEventListener("pointerdown", (e) => {
        if (e.button !== 0) return;
        e.preventDefault();
        c.setPointerCapture(e.pointerId);
        points = [point(e)];
        drawing = true;
        score = null;
        $("#roti-hint").hidden = true;
        $("#roti-score").textContent = "Rolling…";
        draw();
      });
      c.addEventListener("pointermove", (e) => {
        if (!drawing) return;
        points.push(point(e));
        draw();
      });
      const end = () => {
        if (!drawing) return;
        drawing = false;
        score = circleScore(points);
        best("roti", score);
        $(".status > .muted").textContent =
          "Personal best: " + best("roti") + "%";
        draw();
        $("#roti-score").textContent = score + "%";
        $("#roti-feedback").textContent =
          score >= 90
            ? "That belongs in a geometry textbook."
            : score >= 65
              ? "Pretty round. Definitely edible."
              : "An interesting new map. Still a roti.";
      };
      c.addEventListener("pointerup", end);
      c.addEventListener("pointercancel", () => {
        drawing = false;
        points = [];
        $("#roti-hint").hidden = false;
        $("#roti-score").textContent = "Try again";
        draw();
      });
    }
    on("reset", () => {
      points = [];
      score = null;
      render();
    });
    on("mode", () => {
      mode = mode === "draw" ? "timing" : "draw";
      points = [];
      score = null;
      render();
    });
    on("stop-roti", () => {
      score = Math.max(0, Math.round(100 - Math.abs(position - 0.5) * 210));
      best("roti-timing", score);
      $(".status > .muted").textContent =
        "Timing best: " + best("roti-timing") + "%";
      $("#roti-score").textContent = score + "%";
      $("#roti-feedback").textContent =
        "Timing score: " + score + "%. Press Try a fresh roti to go again.";
      $("#stop-roti").disabled = true;
    });
    if (mode === "timing")
      $(".status .muted:last-child").textContent =
        "Timing best: " + best("roti-timing") + "%";
  };
  const frame = (t) => {
    const dt = Math.min(50, t - last);
    last = t;
    if (mode === "timing" && score === null) {
      phase += dt * 0.0025;
      position = 0.05 + 0.9 * (0.5 + 0.5 * Math.sin(phase));
      const m = $("#roti-marker");
      if (m) m.style.left = position * 100 + "%";
    }
    if (active) raf = requestAnimationFrame(frame);
  };
  render();
  raf = requestAnimationFrame(frame);
  return () => {
    active = false;
    cancelAnimationFrame(raf);
  };
}
function train() {
  let speed = 1,
    evening = false,
    paused = matchMedia("(prefers-reduced-motion: reduce)").matches,
    offset = 0,
    raf,
    last = performance.now(),
    alive = true,
    dirty = true;
  mount(
    `<div class="train-window"><canvas id="train-canvas" width="1100" height="650" aria-label="An animated, imaginary Indian countryside seen from a train: hills, fields, houses and palms."></canvas></div><p class="window-caption">Somewhere between here and there. The window seat is yours.</p><div class="train-controls"><button id="pause">${paused ? "Let it roll" : "Pause the view"}</button><label for="train-time">Light <select id="train-time"><option value="day">Afternoon</option><option value="evening">Evening</option></select></label><label for="train-speed">Speed <input id="train-speed" type="range" min="0.25" max="3" step="0.25" value="1"><output id="speed-label">1×</output></label></div><p class="fineprint">An imaginary route, drawn in your browser. No audio. No destination to reach.</p>`,
  );
  const c = $("#train-canvas"),
    ctx = c.getContext("2d"),
    W = 1100,
    H = 650;
  function render() {
    ctx.fillStyle = evening ? "#d7a286" : "#c5dce0";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = evening ? "#efc184" : "#f2df9f";
    ctx.beginPath();
    ctx.arc(840, 130, 48, 0, Math.PI * 2);
    ctx.fill();
    const cloud = (x, y, scale) => {
      ctx.fillStyle = evening ? "#e9bba0" : "#e9eee2";
      ctx.beginPath();
      ctx.ellipse(x, y, 65 * scale, 17 * scale, 0, 0, Math.PI * 2);
      ctx.ellipse(
        x - 22 * scale,
        y - 10 * scale,
        35 * scale,
        22 * scale,
        0,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    };
    for (let i = 0; i < 5; i++)
      cloud(
        ((((i * 330 - offset * 0.08) % 1650) + 1650) % 1650) - 150,
        95 + (i % 2) * 55,
        0.8 + (i % 2) * 0.3,
      );
    const hills = (base, height, period, color, factor) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, H);
      for (let x = 0; x <= W + 10; x += 10) {
        const y =
          base -
          Math.sin((x + offset * factor) / period) * height -
          Math.sin((x + offset * factor) / (period * 0.48)) * height * 0.25;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, H);
      ctx.closePath();
      ctx.fill();
    };
    hills(300, 65, 170, evening ? "#8b8d7b" : "#8faea2", 0.14);
    hills(366, 36, 120, evening ? "#80876c" : "#789987", 0.32);
    ctx.fillStyle = evening ? "#a7a16d" : "#bdc58a";
    ctx.fillRect(0, 385, W, 265);
    for (let i = 0; i < 9; i++) {
      const x = ((((i * 220 - offset * 0.8) % 1980) + 1980) % 1980) - 250;
      ctx.fillStyle = evening ? "#8a945e" : "#8ea66b";
      ctx.beginPath();
      ctx.moveTo(x, 420);
      ctx.lineTo(x + 100, 420);
      ctx.lineTo(x + 280, H);
      ctx.lineTo(x + 90, H);
      ctx.fill();
    }
    for (let i = 0; i < 6; i++) {
      const x = ((((i * 280 - offset * 0.55) % 1680) + 1680) % 1680) - 180;
      const y = 378 + (i % 2) * 25;
      ctx.fillStyle = "#d8bb8f";
      ctx.fillRect(x, y - 52, 65, 52);
      ctx.fillStyle = evening ? "#92614e" : "#a36b50";
      ctx.beginPath();
      ctx.moveTo(x - 7, y - 52);
      ctx.lineTo(x + 33, y - 83);
      ctx.lineTo(x + 72, y - 52);
      ctx.fill();
      ctx.fillStyle = "#50685d";
      ctx.fillRect(x + 26, y - 27, 15, 27);
      ctx.fillRect(x + 7, y - 34, 12, 13);
    }
    for (let i = 0; i < 6; i++) {
      const x = ((((i * 370 - offset * 1.3) % 2220) + 2220) % 2220) - 100;
      const y = 505 + (i % 2) * 40;
      ctx.strokeStyle = evening ? "#515e45" : "#55704a";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + 8, y - 60, x - 3, y - 115);
      ctx.stroke();
      ctx.lineWidth = 13;
      for (let k = 0; k < 5; k++) {
        ctx.beginPath();
        ctx.moveTo(x - 3, y - 115);
        ctx.quadraticCurveTo(
          x - 60 + k * 28,
          y - 145,
          x - 75 + k * 37,
          y - 110 + (k % 2) * 16,
        );
        ctx.stroke();
      }
    }
    ctx.fillStyle = evening ? "#756e4e" : "#78845a";
    ctx.fillRect(0, 596, W, 54);
    ctx.strokeStyle = "#b7b39b";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(0, 612);
    ctx.lineTo(W, 612);
    ctx.stroke();
    for (let i = 0; i < 15; i++) {
      const x = ((((i * 100 - offset * 3) % 1500) + 1500) % 1500) - 100;
      ctx.strokeStyle = "#57604d";
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.moveTo(x, 606);
      ctx.lineTo(x + 15, 644);
      ctx.stroke();
    }
  }
  const frame = (t) => {
    const dt = Math.min(t - last, 50);
    last = t;
    if (!paused) {
      offset += dt * 0.12 * speed;
      dirty = true;
    }
    if (dirty) {
      render();
      dirty = false;
    }
    if (alive) raf = requestAnimationFrame(frame);
  };
  on("pause", () => {
    paused = !paused;
    $("#pause").textContent = paused ? "Let it roll" : "Pause the view";
  });
  on(
    "train-time",
    () => {
      evening = $("#train-time").value === "evening";
      dirty = true;
    },
    "change",
  );
  on(
    "train-speed",
    () => {
      speed = Number($("#train-speed").value);
      $("#speed-label").textContent = speed + "×";
    },
    "input",
  );
  render();
  raf = requestAnimationFrame(frame);
  return () => {
    alive = false;
    cancelAnimationFrame(raf);
  };
}
function about() {
  document.title = "About & data • Timepass";
  app.innerHTML = `<div class="shell"><header class="game-nav"><a class="back" href="#/">${icon("back")}All games</a><a class="tiny-logo" href="#/">Timepass</a></header><main class="about" id="main"><h1>A little timepass.</h1><p>Chai orders, gully cricket, bazaar negotiations, a slightly wonky roti. This is a small collection of games built around familiar Indian moments.</p><p>Inspired by <a href="https://neal.fun/" target="_blank" rel="noopener">Neal.fun</a> and the joy of opening a website just to play with something. Timepass is an independent project, with original artwork and code.</p><h2>Eleven things to play with</h2><p>Every tile opens a working game or toy. City Tycoon is an original short property game against a computer. All property values, shopping prices, tips and bazaar deals are fictional. Train Window is an imagined landscape. Seat, Please uses an invented coach layout. Masala Lab combinations are playful game logic, not cooking instructions. Society Pass is a fictional form; it sends nothing.</p><h2>What stays in your browser</h2><p>The app saves your best cricket, memory and roti scores, daily cricket scores for up to 30 dates, plus your Masala Lab discoveries, in local storage on this device. These scores are not sent to an app server. To erase them, use the button below or clear this site's browser data. Current game sessions reset when you reload.</p><button id="clear-data">Clear scores & discoveries</button><p id="clear-status" role="status"></p><h2>Hosting & data</h2><p>The app has no accounts, analytics, advertising, payments or third-party API calls. Fonts and graphics are served with the site. GitHub Pages serves the site and may process request information under <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener">GitHub’s privacy statement</a>. Copy game link uses your browser's clipboard when you click it.</p><h2>Built to tinker with</h2><p>View the project, the build plan and the reference review <a href="https://github.com/Parthawe/timepass-india" target="_blank" rel="noopener">on GitHub</a>. No affiliation with Neal.fun or Monopoly.</p></main>${footer()}</div>`;
  on("clear-data", () => {
    try {
      ["cricket", "dabba", "roti", "roti-timing", "masala", "daily"].forEach(
        (k) => localStorage.removeItem("timepass-" + k),
      );
      $("#clear-status").textContent =
        "Saved scores and discoveries cleared on this device.";
    } catch {
      $("#clear-status").textContent =
        "Browser storage is unavailable. You can clear site data in browser settings.";
    }
  });
}
const setup = {
  spend,
  cricket: createCricket({ mount, on, $, best }),
  chai,
  bargain,
  dabba,
  city,
  roti,
  train,
  ...createMoreGames({ mount, on, $ }),
};
function route(event) {
  if (currentRoute === "") {
    shelfScroll = window.scrollY;
    shelfControl = document.activeElement?.id || "";
    const active = document.activeElement?.closest(".game-card");
    if (active) shelfGame = active.getAttribute("href").slice(2);
  }
  cleanup();
  cleanup = () => {};
  const id = location.hash.replace(/^#\/?/, "").split("?")[0];
  currentRoute = id;
  app.className = "view-" + (id || "home");
  if (!id) {
    home();
  } else if (id === "about") {
    about();
  } else {
    const g = games.find((g) => g.id === id);
    if (!g) {
      app.innerHTML = `<main class="empty" id="main"><h1>This game wandered off.</h1><p><a href="#/">Back to all games</a></p></main>`;
      document.title = "Game not found • Timepass";
    } else {
      const rules = {
        seats:
          "Seat four passengers without upsetting anyone. Read their requests, choose a passenger, then choose a seat.",
        masala:
          "Combine two things. Discover something new. Put it back in the bowl.",
        society:
          "You only wanted to visit a friend. The visitor desk would like a word. And then several more.",
        city: "Build a little property empire against the computer. Sixteen rounds. Highest net worth wins.",
        spend:
          "You have one crore rupees to spend. Buy, sell, and see how far it goes.",
        cricket:
          "Bowl a ball. Time your swing. Keep it out of the neighbour’s window.",
        chai: "Read the order. Put the ticket away. Brew it from memory.",
        bargain:
          "Three stalls. ₹1,500 in your pocket. How good is your last price?",
        dabba: "Twelve dabbas. Six matching lunches. Open two at a time.",
        roti: "Draw one closed circle on the tawa. Let’s see how round your roti really is.",
        train: "Claim the window seat. Let the countryside do its thing.",
      };
      gameShell(
        g,
        rules[id],
        [
          "cricket",
          "chai",
          "bargain",
          "dabba",
          "roti",
          "masala",
          "society",
        ].includes(id),
      );
      cleanup = setup[id]();
    }
  }
  if (!id) {
    window.scrollTo(0, shelfScroll);
    if (event) {
      const target =
        document.getElementById(shelfControl) ||
        document.querySelector(`#games a[href="#/${shelfGame}"]`);
      target?.focus({ preventScroll: true });
    }
  } else {
    window.scrollTo(0, 0);
    if (event) {
      const heading = document.querySelector("#main h1");
      if (heading) {
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
      }
    }
  }
}
window.addEventListener("hashchange", route);
route();
