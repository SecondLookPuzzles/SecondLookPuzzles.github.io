/* Text size buttons. The visitor's choice is remembered. */
(function () {
  var root = document.documentElement;
  var steps = [1, 1.15, 1.3, 1.45];

  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  var size = parseInt(get('size'), 10);
  if (!(size >= 0 && size < steps.length)) size = 0;
  root.style.setProperty('--scale', steps[size]);

  document.addEventListener('DOMContentLoaded', function () {
    var host = document.querySelector('header.site .wrap');
    if (host) {
      var tools = document.createElement('div');
      tools.className = 'tools';

      function mk(text, label) {
        var b = document.createElement('button');
        b.type = 'button';
        b.textContent = text;
        b.setAttribute('aria-label', label);
        tools.appendChild(b);
        return b;
      }
      var smaller = mk('A−', 'Smaller text');
      var larger = mk('A+', 'Larger text');

      function apply() {
        root.style.setProperty('--scale', steps[size]);
        set('size', size);
      }
      smaller.addEventListener('click', function () { if (size > 0) { size--; apply(); } });
      larger.addEventListener('click', function () { if (size < steps.length - 1) { size++; apply(); } });
      host.appendChild(tools);
    }

    var pb = document.querySelectorAll('.js-print');
    for (var i = 0; i < pb.length; i++) {
      pb[i].addEventListener('click', function () { window.print(); });
    }
  });
})();
