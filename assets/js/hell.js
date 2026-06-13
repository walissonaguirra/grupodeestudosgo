// Easter egg: o ônibus pro inferno. Escurece o tema, toca a música, pulsa a borda
// no ritmo, solta brasas e dá um balão de fala pra cada membro.
(function () {
  var trigger = document.querySelector('[data-hell-trigger]');
  var stage = document.querySelector('[data-hell-stage]');
  if (!trigger || !stage) return;

  var root = document.documentElement;
  var audio = stage.querySelector('[data-hell-audio]');
  var embersBox = stage.querySelector('[data-embers]');

  var cfg = { driverLines: [], crowdLines: [] };
  try {
    if (window.HELL_LINES) cfg = Object.assign(cfg, window.HELL_LINES);
  } catch (e) {}
  var driverLines = (cfg.driverLines && cfg.driverLines.length) ? cfg.driverLines : ['E se reescrevesse em WebAssembly?'];
  var crowdLines = (cfg.crowdLines && cfg.crowdLines.length) ? cfg.crowdLines : ['Boraaa!'];

  var active = false, timers = [], raf = null;
  var audioCtx = null, analyser = null, srcNode = null, freq = null;
  var pulseMode = 'auto', pulse = 0, t0 = 0, base = 0;

  function rand(a) { return a[Math.floor(Math.random() * a.length)]; }
  function later(fn, ms) { var id = setTimeout(fn, ms); timers.push(id); return id; }
  function every(fn, ms) { var id = setInterval(fn, ms); timers.push(id); return id; }

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

  // Pulse da borda: linha de base adaptativa, reage à batida sem saturar no máximo.
  function loop(ts) {
    if (!active) return;
    if (!t0) t0 = ts;
    var target;
    if (pulseMode === 'audio' && analyser) {
      analyser.getByteFrequencyData(freq);
      var sum = 0, n = Math.min(8, freq.length);
      for (var i = 0; i < n; i++) sum += freq[i];
      var cur = sum / n;
      base += (cur - base) * 0.03;
      if (base < 4) {
        target = 0;
      } else {
        target = (cur - base) / (base * 0.6) + 0.45;
        target = target < 0 ? 0 : (target > 1 ? 1 : target);
      }
    } else {
      var s = (ts - t0) / 1000;
      target = 0.5 + 0.5 * Math.abs(Math.sin(s * Math.PI * 2.1));
    }
    pulse += (target - pulse) * 0.4;
    root.style.setProperty('--pulse', pulse.toFixed(3));
    raf = requestAnimationFrame(loop);
  }

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

  // O Cesar sugere e só depois a galera concorda, um de cada vez.
  var bz = 10;
  function startBubbles() {
    var seats = [].slice.call(stage.querySelectorAll('.seat'));
    var driverSeat = null, crowdSeats = [];
    seats.forEach(function (s) {
      if (s.dataset.role === 'driver') driverSeat = s; else crowdSeats.push(s);
    });
    function bubbleOf(seat) { return seat && seat.querySelector('[data-bubble]'); }
    function show(seat, text) {
      var b = bubbleOf(seat);
      if (!b) return;
      b.textContent = text;
      b.style.zIndex = ++bz;
      b.classList.add('show');
    }
    function hide(seat) { var b = bubbleOf(seat); if (b) b.classList.remove('show'); }
    function shuffled(arr) {
      var a = arr.slice();
      for (var j = a.length - 1; j > 0; j--) {
        var k = Math.floor(Math.random() * (j + 1));
        var t = a[j]; a[j] = a[k]; a[k] = t;
      }
      return a;
    }

    function round() {
      if (!active) return;
      show(driverSeat, rand(driverLines));
      var order = shuffled(crowdSeats), lines = shuffled(crowdLines), maxDelay = 0;
      order.forEach(function (seat, i) {
        var text = lines[i % lines.length];  // frases distintas: nenhum passageiro repete na rodada
        var d = 1700 + i * (620 + Math.random() * 380) + Math.random() * 250;
        if (d > maxDelay) maxDelay = d;
        later(function () { if (active) show(seat, text); }, d);
      });
      later(function () {
        if (!active) return;
        hide(driverSeat);
        crowdSeats.forEach(hide);
        later(round, 1200 + Math.random() * 1400);
      }, maxDelay + 2600);
    }
    later(round, 4200);
  }

  function enter() {
    active = true; t0 = 0; pulse = 0; base = 0;
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
