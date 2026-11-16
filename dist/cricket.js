import { svg } from "./art.js";
import { cricketRuns } from "./engine.js";
import {
  dayKey,
  validDay,
  dailyDeliveries,
  deliveries,
  dailyRecords,
  recordDaily,
  deliveryPoint,
  shotPoint,
} from "./play-engine.js";
export const dailyTarget = 24;
export function readDaily() {
  try {
    return dailyRecords(localStorage.getItem("timepass-daily"));
  } catch {
    return {};
  }
}
function saveDaily(day, runs) {
  try {
    localStorage.setItem(
      "timepass-daily",
      JSON.stringify(
        recordDaily(localStorage.getItem("timepass-daily"), day, runs),
      ),
    );
  } catch {}
}
export function dailyLabel(day) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(day + "T00:00:00Z"));
}
function field() {
  return svg(
    `<path d="m350 400 31-197h34l157 197Z" fill="#fff2ce" opacity=".18"/>
    <path d="M365 236h69m39 108h96" stroke="#fff5dd" stroke-width="3" stroke-linecap="round"/>
    <path d="M385 222v-34m9 34v-34m9 34v-34m-21 0h24" stroke="#503023" stroke-width="4" stroke-linecap="round"/><g id="batter-stumps"><path d="M543 344v-40m11 40v-40m11 40v-40m-26 0h30" stroke="#513326" stroke-width="4" stroke-linecap="round"/></g><g id="cricket-bat" transform="rotate(-18 520 329)"><path d="M520 295v-31" stroke="#694d36" stroke-width="8" stroke-linecap="round"/><rect x="510" y="291" width="20" height="63" rx="4" fill="#efd5a0" stroke="#394c42" stroke-width="2"/><path d="M516 300v42" stroke="#b3915d" stroke-width="2"/></g><ellipse id="ball-shadow" cx="400" cy="222" rx="6" ry="2" fill="#7f8f6e"/><g id="delivery-ball" transform="translate(400 176)"><circle r="8" fill="#9d2420" stroke="#fff2da" stroke-width="1.8"/><path d="M-2-6v12m4-12v12" stroke="#f8ddbc" stroke-width="1"/></g><text id="field-call" x="135" y="296" font-family="Bricolage,Arial,sans-serif" font-size="48" font-weight="800" fill="#49261b" stroke="#fff2da" stroke-width="5" paint-order="stroke"></text>`,
    "0 0 800 400",
  );
}
export function createCricket({ mount, on, $, best }) {
  return function cricket() {
    const params = new URLSearchParams(location.hash.split("?")[1] || ""),
      today = dayKey();
    const mode = params.get("mode") === "daily" ? "daily" : "free",
      requested = params.get("day");
    const day = validDay(requested) && requested <= today ? requested : today;
    let profiles = mode === "daily" ? dailyDeliveries(day) : deliveries(),
      results = [],
      phase = "ready",
      pace = 1,
      start = 0,
      pausedAt = 0,
      flightStart = 0,
      lastRuns = 0,
      raf,
      alive = true,
      needFocus = false;
    let note = "Bowl a ball. Swing in the dark green strip.";
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const total = () => results.reduce((a, b) => a + b, 0);
    const render = () => {
      const done = phase === "done";
      if (done) {
        best("cricket", total());
        if (mode === "daily") saveDaily(day, total());
      }
      const dailyBest = readDaily()[day];
      mount(
        `<div class="cricket-toolbar"><div class="cricket-modes" aria-label="Cricket mode"><button id="free-over" aria-pressed="${mode === "free"}">Free play</button><button id="daily-over" aria-pressed="${mode === "daily"}">Daily over</button></div>${mode === "free" ? `<label class="pace-select" for="cricket-pace">Pace <select id="cricket-pace" ${phase === "bowling" || phase === "paused" || phase === "flight" ? "disabled" : ""}><option value="1" ${pace === 1 ? "selected" : ""}>Regular</option><option value="1.6" ${pace === 1.6 ? "selected" : ""}>Gentle</option></select></label>` : `<span class="daily-date">${dailyLabel(day)} · Target ${dailyTarget}</span>`}</div><div class="cricket-match"><div class="cricket-score"><div><strong>${total()}<span>runs</span></strong><span>${results.filter((r) => r === 0).length} wicket${results.filter((r) => r === 0).length === 1 ? "" : "s"} · ${results.length} / 6 balls</span></div><div class="cricket-best">${mode === "daily" ? `Best this over<br><strong>${dailyBest === undefined ? "—" : dailyBest + " / 36"}</strong>` : `Personal best<br><strong>${best("cricket")} / 36</strong>`}</div></div><div class="cricket-playfield"><div class="cricket-field live-field">${field()}</div><div class="timing-track cricket-track" aria-hidden="true"><div class="zone"></div><div class="sweet"></div><div class="marker" id="marker" style="left:${phase === "paused" ? pausedAt * 100 : 0}%"></div></div><div class="track-labels"><span>Early</span><span>Swing here</span><span>Late</span></div></div><div class="cricket-console"><div class="balls" aria-label="Ball results">${Array.from({ length: 6 }, (_, i) => `<span class="ball-result ${results[i] !== undefined ? "hit" : ""} ${results[i] === 6 ? "six" : ""} ${i === results.length && !done ? "current" : ""}" aria-label="Ball ${i + 1}: ${results[i] === undefined ? "not bowled" : results[i] === 0 ? "wicket" : results[i] + " runs"}">${results[i] === undefined ? i + 1 : results[i] === 0 ? "W" : results[i]}</span>`).join("")}</div><p class="feedback cricket-feedback" role="status">${note}</p>${done ? `<div class="result cricket-result"><h2>${mode === "daily" ? (total() >= dailyTarget ? "Daily target cleared." : "Another over?") : total() >= 24 ? "The neighbours want their ball back." : total() >= 12 ? "Solid knock." : "Next over is yours."}</h2><p>${total()} runs from six balls.${mode === "daily" ? " Target: " + dailyTarget + ". Same deliveries each time you replay this date." : ""}</p><div class="actions"><button id="reset" class="primary">${mode === "daily" ? "Retry this over" : "Play another over"}</button><button id="copy-score">Copy score</button></div><div id="score-copy-status" class="score-copy-status" role="status"></div></div>` : `<div class="actions cricket-actions"><button class="primary" id="play-ball" ${phase === "flight" ? "disabled" : ""}>${phase === "ready" ? "Bowl ball " + (results.length + 1) : phase === "paused" ? "Resume ball" : phase === "flight" ? "Ball complete" : "Play shot"}</button>${phase === "bowling" || phase === "paused" ? `<button id="pause-over">${phase === "paused" ? "Resume" : "Pause"}</button>` : ""}</div><p class="fineprint cricket-help">Tap the button or focus it and press Space. Dark green: six. Light green: four. A missed delivery is a wicket.</p>`}</div></div>${mode === "daily" ? '<p class="fineprint">Daily overs use your device’s calendar date. The score is saved only on this device.</p>' : ""}`,
      );
      if (phase === "flight") {
        const call = $("#field-call");
        if (call)
          call.textContent =
            lastRuns === 0
              ? "BOWLED!"
              : lastRuns === 6
                ? "SIX!"
                : lastRuns === 4
                  ? "FOUR!"
                  : "+" + lastRuns;
      }
      on("free-over", () => {
        if (mode !== "free") location.hash = "/cricket";
      });
      on("daily-over", () => {
        if (mode !== "daily")
          location.hash = "/cricket?mode=daily&day=" + today;
      });
      on(
        "cricket-pace",
        () => {
          pace = Number($("#cricket-pace").value);
        },
        "change",
      );
      on("play-ball", () => {
        if (phase === "ready") {
          phase = "bowling";
          start = performance.now();
          note = "Watch the bounce. Swing in the green.";
          render();
        } else if (phase === "paused") resume();
        else if (phase === "bowling")
          settle(
            (performance.now() - start) /
              (profiles[results.length].duration * pace),
          );
      });
      on("pause-over", () => {
        if (phase === "paused") resume();
        else pause();
      });
      on("reset", () => {
        profiles = mode === "daily" ? dailyDeliveries(day) : deliveries();
        results = [];
        phase = "ready";
        note = "New over. Bowl when you’re ready.";
        needFocus = true;
        render();
      });
      on("copy-score", async () => {
        const text = `Timepass ${mode === "daily" ? "daily over (" + day + ")" : "Gully Cricket"}: ${total()}/36.\n${location.origin + location.pathname}#/cricket${mode === "daily" ? "?mode=daily&day=" + day : ""}`;
        try {
          await navigator.clipboard.writeText(text);
          $("#score-copy-status").textContent =
            "Score copied. Send it to your group.";
        } catch {
          $("#score-copy-status").innerHTML =
            '<label>Copy your score <textarea id="score-copy-fallback" readonly rows="3"></textarea></label>';
          $("#score-copy-fallback").value = text;
          $("#score-copy-fallback").select();
        }
      });
      if (needFocus) {
        ($("#play-ball") || $("#reset"))?.focus({ preventScroll: true });
        needFocus = false;
      }
    };
    const resume = () => {
      if (phase !== "paused") return;
      start =
        performance.now() - pausedAt * profiles[results.length].duration * pace;
      phase = "bowling";
      note = "Back in play. Watch the green strip.";
      render();
    };
    const pause = () => {
      if (phase !== "bowling") return;
      pausedAt = Math.max(
        0,
        Math.min(
          0.999,
          (performance.now() - start) /
            (profiles[results.length].duration * pace),
        ),
      );
      phase = "paused";
      note = "Delivery paused. Resume when you’re ready.";
      render();
      moveBall(deliveryPoint(pausedAt, profiles[results.length].bounce));
    };
    const finish = () => {
      phase = results.length === 6 ? "done" : "ready";
      needFocus = true;
      render();
    };
    const settle = (progress) => {
      if (phase !== "bowling") return;
      lastRuns = progress >= 1 ? 0 : cricketRuns(progress);
      results.push(lastRuns);
      note =
        lastRuns === 6
          ? "SIX! Straight onto the terrace."
          : lastRuns === 4
            ? "Four! Found the gap."
            : lastRuns
              ? "Quick running. " +
                lastRuns +
                " run" +
                (lastRuns > 1 ? "s." : ".")
              : "Bowled! Try swinging in the middle of the strip.";
      if (reduced) {
        finish();
        return;
      }
      phase = "flight";
      flightStart = performance.now();
      render();
    };
    function moveBall(p) {
      $("#delivery-ball")?.setAttribute(
        "transform",
        `translate(${p.x} ${p.y})`,
      );
      const shadow = $("#ball-shadow");
      if (shadow) {
        shadow.setAttribute("cx", p.x);
        shadow.setAttribute("cy", Math.min(380, Math.max(222, p.y + 23)));
      }
    }
    function frame(t) {
      if (!alive) return;
      if (phase === "bowling") {
        const p = Math.max(
          0,
          (t - start) / (profiles[results.length].duration * pace),
        );
        if (p >= 1) settle(1);
        else {
          moveBall(deliveryPoint(p, profiles[results.length].bounce));
          const marker = $("#marker");
          if (marker) marker.style.left = p * 100 + "%";
        }
      } else if (phase === "flight") {
        const p = Math.min(1, (t - flightStart) / 650);
        moveBall(shotPoint(lastRuns, p));
        $("#cricket-bat")?.setAttribute(
          "transform",
          `rotate(${-18 - 75 * Math.sin(p * Math.PI)} 520 329)`,
        );
        if (lastRuns === 0)
          $("#batter-stumps")?.setAttribute(
            "transform",
            `rotate(${p * 24} 554 343)`,
          );
        if (p >= 1) finish();
      }
      raf = requestAnimationFrame(frame);
    }
    const visibility = () => {
      if (document.hidden) pause();
    };
    document.addEventListener("visibilitychange", visibility);
    render();
    raf = requestAnimationFrame(frame);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", visibility);
    };
  };
}
