// Contagem regressiva pra próxima call (sábado 14h, America/Sao_Paulo).
(function () {
  var el = document.querySelector('[data-countdown]');
  if (!el) return;

  var TZ = 'America/Sao_Paulo';
  var $d = el.querySelector('[data-days]');
  var $h = el.querySelector('[data-hours]');
  var $m = el.querySelector('[data-minutes]');
  var $s = el.querySelector('[data-seconds]');

  // Componentes do relógio numa timezone, sem depender do fuso do navegador.
  function parts(date) {
    var f = new Intl.DateTimeFormat('en-CA', {
      timeZone: TZ, weekday: 'short', hour12: false,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
    var o = {};
    f.formatToParts(date).forEach(function (p) { o[p.type] = p.value; });
    return o;
  }

  // Instante (UTC) cujo horário-de-parede em BRT é o informado. Brasil não usa mais horário de verão (UTC-3).
  function brtInstant(y, mo, d, h) {
    return new Date(Date.UTC(y, mo - 1, d, h + 3, 0, 0));
  }

  function nextSaturday14(now) {
    for (var i = 0; i < 14; i++) {
      var probe = new Date(now.getTime() + i * 86400000);
      var p = parts(probe);
      if (p.weekday === 'Sat') {
        var inst = brtInstant(+p.year, +p.month, +p.day, 14);
        if (inst.getTime() > now.getTime()) return inst;
      }
    }
    return null;
  }

  var raw = el.dataset.target;
  var fixedTarget = raw ? new Date(raw) : null;

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function tick() {
    var now = new Date();
    var target = (fixedTarget && fixedTarget.getTime() > now.getTime())
      ? fixedTarget
      : nextSaturday14(now);
    if (!target) return;

    var diff = Math.max(0, target.getTime() - now.getTime());
    var sec = Math.floor(diff / 1000);
    $d.textContent = Math.floor(sec / 86400);
    $h.textContent = pad(Math.floor(sec % 86400 / 3600));
    $m.textContent = pad(Math.floor(sec % 3600 / 60));
    $s.textContent = pad(sec % 60);
  }

  tick();
  setInterval(tick, 1000);
})();
