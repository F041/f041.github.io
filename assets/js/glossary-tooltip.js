// Glossario negli articoli: la prima occorrenza di ogni termine diventa un pulsante
// che apre la definizione sotto il paragrafo (tap, clic, Invio; Esc per chiudere).
// Niente tooltip al passaggio del mouse: deve funzionare anche da telefono e da tastiera.
(function () {
  'use strict';

  var dataEl = document.getElementById('glossary-data');
  if (!dataEl) {
    return;
  }

  var entries;
  try {
    entries = JSON.parse(dataEl.textContent);
  } catch (e) {
    return;
  }
  if (!Array.isArray(entries) || entries.length === 0) {
    return;
  }

  var map = new Map();
  var patterns = [];
  entries.forEach(function (entry) {
    if (!entry.term || !entry.def) {
      return;
    }
    map.set(entry.term.toLowerCase(), entry);
    patterns.push(entry.term);
  });
  if (patterns.length === 0) {
    return;
  }

  // longer terms first, so "legge del valore" matches before "valore"
  patterns.sort(function (a, b) {
    return b.length - a.length;
  });

  function escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  var regex = new RegExp('\\b(' + patterns.map(escapeRegExp).join('|') + ')\\b', 'gi');

  // solo nel testo degli articoli: niente evidenziazioni in homepage, nelle pagine o nel glossario stesso
  var scope = document.querySelector('.epp-layout-post main article .content');

  if (!scope) {
    return;
  }

  var walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, {
    acceptNode: function (node) {
      var parent = node.parentElement;
      if (!parent) {
        return NodeFilter.FILTER_REJECT;
      }
      if (/^(SCRIPT|STYLE|CODE|PRE|KBD|SAMP|H1|H2|H3|H4|H5|H6|A|BUTTON)$/.test(parent.tagName)) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  var nodes = [];
  while (walker.nextNode()) {
    nodes.push(walker.currentNode);
  }

  var seen = new Set();
  var counter = 0;
  var glossaryUrl = dataEl.getAttribute('data-glossary-url') || '/glossario/';

  nodes.forEach(function (node) {
    var text = node.nodeValue;
    var fragment = null;
    var lastIndex = 0;
    var match;
    regex.lastIndex = 0;

    while ((match = regex.exec(text)) !== null) {
      var key = match[0].toLowerCase();
      var entry = map.get(key);
      if (!entry || seen.has(key)) {
        continue;
      }
      seen.add(key);
      fragment = fragment || document.createDocumentFragment();
      fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'glossary-tip';
      btn.textContent = match[0];
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-controls', 'glossary-def-' + ++counter);
      btn.dataset.term = entry.term;
      btn.dataset.def = entry.def;
      btn.dataset.anchor = entry.id || '';
      fragment.appendChild(btn);

      lastIndex = match.index + match[0].length;
    }

    if (fragment) {
      fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
      node.parentNode.replaceChild(fragment, node);
    }
  });

  if (counter === 0) {
    return;
  }

  var hint = document.createElement('p');
  hint.className = 'glossary-hint';
  hint.textContent = 'Le parole evidenziate sono nel glossario: toccale o premi Invio per leggere la definizione.';
  scope.insertBefore(hint, scope.firstChild);

  var openBtn = null;

  function close() {
    if (!openBtn) {
      return;
    }
    var panel = document.getElementById(openBtn.getAttribute('aria-controls'));
    if (panel) {
      panel.remove();
    }
    openBtn.setAttribute('aria-expanded', 'false');
    openBtn = null;
  }

  function open(btn) {
    close();
    var panel = document.createElement('aside');
    panel.className = 'glossary-def';
    panel.id = btn.getAttribute('aria-controls');

    var label = document.createElement('span');
    label.className = 'glossary-def__label';
    label.textContent = 'Glossario · ' + btn.dataset.term;
    panel.appendChild(label);
    panel.appendChild(document.createTextNode(btn.dataset.def + ' '));

    var more = document.createElement('a');
    more.href = glossaryUrl + (btn.dataset.anchor ? '#' + btn.dataset.anchor : '');
    more.textContent = 'Voce completa';
    panel.appendChild(more);

    // la definizione va dopo il blocco che contiene il termine (paragrafo, voce di elenco, citazione)
    // (dentro una voce di elenco o una cella va in fondo alla voce, per non rompere la lista)
    var block = btn.closest('li, td, dd, p, blockquote') || btn.parentElement;
    if (/^(LI|TD|DD)$/.test(block.tagName)) {
      block.appendChild(panel);
    } else {
      block.insertAdjacentElement('afterend', panel);
    }
    btn.setAttribute('aria-expanded', 'true');
    openBtn = btn;
  }

  scope.addEventListener('click', function (e) {
    var btn = e.target.closest('.glossary-tip');
    if (!btn) {
      return;
    }
    if (btn === openBtn) {
      close();
    } else {
      open(btn);
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && openBtn) {
      var btn = openBtn;
      close();
      btn.focus();
    }
  });
})();
