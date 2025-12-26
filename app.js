const $ = (id) => document.getElementById(id);

let state = null;

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function parseWords(text) {
  return text
    .split(/\r?\n/)
    .map(s => s.trim())
    .filter(Boolean);
}

function startGame() {
  const count = Number($("playerCount").value);
  const words = parseWords($("words").value);

  if (!Number.isInteger(count) || count < 2 || count > 20) {
    alert("Bitte eine Spielerzahl zwischen 2 und 20 wählen.");
    return;
  }
  if (words.length < 1) {
    alert("Bitte mindestens 1 Wort eingeben (eine Zeile = ein Wort).");
    return;
  }

  const secretWord = pickRandom(words);
  const impostorIndex = Math.floor(Math.random() * count);

  state = {
    count,
    secretWord,
    impostorIndex,
    current: 0,
    revealed: false
  };

  $("setup").classList.add("hidden");
  $("reveal").classList.remove("hidden");

  updateUI(true);
}

function updateUI(resetSecretBox=false) {
  const n = state.current + 1;
  $("playerTitle").textContent = `Spieler ${n} von ${state.count}`;
  $("statusHint").textContent =
    `Genau 1 Impostor. (Für Test: Impostor ist Spieler ${state.impostorIndex + 1})`;

  if (resetSecretBox) {
    $("secretBox").textContent = "Klicke auf „Aufdecken“";
    state.revealed = false;
  }
}

function reveal() {
  if (!state) return;
  if (state.revealed) return;

  const isImpostor = state.current === state.impostorIndex;
  $("secretBox").textContent = isImpostor ? "Du bist der IMPOSTOR (kein Wort)!" : `WORT: ${state.secretWord}`;
  state.revealed = true;
}

function hide() {
  if (!state) return;
  $("secretBox").textContent = "Versteckt ✅ (Gib das Gerät weiter)";
}

function nextPlayer() {
  if (!state) return;
  if (state.current < state.count - 1) {
    state.current += 1;
    updateUI(true);
  } else {
    $("secretBox").textContent = `Alle Rollen verteilt ✅ Wort war: ${state.secretWord}`;
  }
}

function restart() {
  state = null;
  $("reveal").classList.add("hidden");
  $("setup").classList.remove("hidden");
}

$("startBtn").addEventListener("click", startGame);
$("revealBtn").addEventListener("click", reveal);
$("hideBtn").addEventListener("click", hide);
$("nextBtn").addEventListener("click", nextPlayer);
$("restartBtn").addEventListener("click", restart);
