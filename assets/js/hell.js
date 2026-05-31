// Easter egg: o ônibus pro inferno.
// Liga o "modo inferno": escurece o tema, toca a música, faz a borda pulsar no
// ritmo, solta brasas, dá um balão de fala pra cada membro e queima a base da
// tela com o algoritmo de fogo do DOOM (PSX fire) num canvas.
(function () {
  var trigger = document.querySelector('[data-hell-trigger]');
  var stage = document.querySelector('[data-hell-stage]');
  if (!trigger || !stage) return;

  var root = document.documentElement;
  var audio = stage.querySelector('[data-hell-audio]');
  var embersBox = stage.querySelector('[data-embers]');

  var cfg = { driverLines: [], crowdLines: [] };
  try {
    var raw = document.querySelector('[data-hell-config]');
    if (raw) cfg = Object.assign(cfg, JSON.parse(raw.textContent));
  } catch (e) { /* opcional */ }
  var driverLines = (cfg.driverLines && cfg.driverLines.length) ? cfg.driverLines : ['E se reescrevesse em WebAssembly?'];
  var crowdLines = (cfg.crowdLines && cfg.crowdLines.length) ? cfg.crowdLines : ['Boraaa!'];

  var active = false, timers = [], raf = null;
  var audioCtx = null, analyser = null, srcNode = null, freq = null;
  var pulseMode = 'auto', pulse = 0, t0 = 0;

  function rand(a) { return a[Math.floor(Math.random() * a.length)]; }
  function later(fn, ms) { var id = setTimeout(fn, ms); timers.push(id); return id; }
  function every(fn, ms) { var id = setInterval(fn, ms); timers.push(id); return id; }

  /* ---------- áudio + análise ---------- */
  function startAudio() {
    if (!audio) return;
    try {
      audio.currentTime = 0;
      var p = audio.play();
      if (p && p.catch) p.catch(function () { pulseMode = 'auto'; });
      setupAnalyser();
    } catch (e) { pulseMode = 'auto'; }
  }
  function setupAnalyser() {
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!audioCtx) {
        audioCtx = new AC();
        srcNode = audioCtx.createMediaElementSource(audio);
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        srcNode.connect(analyser);
        analyser.connect(audioCtx.destination);
        freq = new Uint8Array(analyser.frequencyBinCount);
      }
      if (audioCtx.state === 'suspended') audioCtx.resume();
      audio.addEventListener('playing', function () { pulseMode = 'audio'; }, { once: true });
      audio.addEventListener('error', function () { pulseMode = 'auto'; }, { once: true });
    } catch (e) { pulseMode = 'auto'; }
  }

  /* ---------- loop (pulse) ---------- */
  function loop(ts) {
    if (!active) return;
    if (!t0) t0 = ts;
    var target;
    if (pulseMode === 'audio' && analyser) {
      analyser.getByteFrequencyData(freq);
      var sum = 0, n = Math.min(8, freq.length);
      for (var i = 0; i < n; i++) sum += freq[i];
      target = Math.min(1, (sum / n) / 160);
    } else {
      var s = (ts - t0) / 1000;
      target = 0.5 + 0.5 * Math.abs(Math.sin(s * Math.PI * 2.1));  // ~126 bpm
    }
    pulse += (target - pulse) * 0.4;                                // snappy
    root.style.setProperty('--pulse', pulse.toFixed(3));
    raf = requestAnimationFrame(loop);
  }

  /* ---------- brasas ---------- */
  function spawnEmber() {
    if (!active) return;
    var e = document.createElement('span');
    e.className = 'ember';
    var size = 4 + Math.random() * 8;
    e.style.left = Math.random() * 100 + 'vw';
    e.style.width = e.style.height = size + 'px';
    e.style.setProperty('--drift', (Math.random() * 120 - 60) + 'px');
    var dur = 2.6 + Math.random() * 2.6;
    e.style.animationDuration = dur + 's';
    embersBox.appendChild(e);
    later(function () { e.remove(); }, dur * 1000);
  }

  /* ---------- balão por membro ---------- */
  function startBubbles() {
    var seats = [].slice.call(stage.querySelectorAll('.seat'));
    seats.forEach(function (seat, idx) {
      var bubble = seat.querySelector('[data-bubble]');
      if (!bubble) return;
      var pool = seat.dataset.role === 'driver' ? driverLines : crowdLines;
      function cycle() {
        if (!active) return;
        bubble.textContent = rand(pool);
        bubble.classList.add('show');
        later(function () {
          bubble.classList.remove('show');
          later(cycle, 1400 + Math.random() * 4200);
        }, 2200 + Math.random() * 1800);
      }
      later(cycle, 4200 + idx * 500 + Math.random() * 1500);  // escalonado, após o ônibus chegar
    });
  }

  /* ---------- liga / desliga ---------- */
  function enter() {
    active = true; t0 = 0; pulse = 0;
    stage.setAttribute('aria-hidden', 'false');
    trigger.title = 'Apagar o inferno'; trigger.textContent = '🧯';
    root.classList.add('hell', 'hell-1');
    later(function () { active && root.classList.add('hell-2'); }, 4000);
    later(function () { active && root.classList.add('hell-3'); }, 9000);
    startAudio();
    every(spawnEmber, 220);
    startBubbles();
    raf = requestAnimationFrame(loop);
  }
  function exit() {
    active = false;
    timers.forEach(clearTimeout); timers.forEach(clearInterval); timers = [];
    if (raf) cancelAnimationFrame(raf);
    raf = null;
    root.classList.remove('hell', 'hell-1', 'hell-2', 'hell-3');
    root.style.setProperty('--pulse', 0);
    stage.setAttribute('aria-hidden', 'true');
    trigger.title = 'Não clica não…'; trigger.textContent = '🔥';
    [].forEach.call(stage.querySelectorAll('.bubble'), function (b) { b.classList.remove('show'); });
    embersBox.innerHTML = '';
    if (audio) { try { audio.pause(); audio.currentTime = 0; } catch (e) {} }
    if (audioCtx && audioCtx.state === 'running') { try { audioCtx.suspend(); } catch (e) {} }
  }

  trigger.addEventListener('click', function () { active ? exit() : enter(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && active) exit(); });
})();
