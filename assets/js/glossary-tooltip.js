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

  var scope =
    document.querySelector('main article .content') ||
    document.querySelector('main .content') ||
    document.querySelector('main');

  if (!scope) {
    return;
  }

  var walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, {
    acceptNode: function (node) {
      var parent = node.parentElement;
      if (!parent) {
        return NodeFilter.FILTER_REJECT;
      }
      var tag = parent.tagName;
      if (/^(SCRIPT|STYLE|CODE|PRE|KBD|SAMP|H1|H2|H3|H4|H5|H6)$/.test(tag)) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  var nodes = [];
  while (walker.nextNode()) {
    nodes.push(walker.currentNode);
  }

  nodes.forEach(function (node) {
    var text = node.nodeValue;
    var out = '';
    var lastIndex = 0;
    var match;
    regex.lastIndex = 0;

    while ((match = regex.exec(text)) !== null) {
      var entry = map.get(match[0].toLowerCase());
      if (!entry) {
        continue;
      }
      var def = entry.def.replace(/"/g, '&quot;');
      out += text.slice(lastIndex, match.index);
      out +=
        '<span class="glossary-tip" tabindex="0" data-def="' +
        def +
        '" title="' +
        def +
        '">';
      out += match[0];
      out += '</span>';
      lastIndex = match.index + match[0].length;
      if (match[0].length === 0) {
        regex.lastIndex++;
      }
    }

    if (lastIndex > 0) {
      out += text.slice(lastIndex);
      var holder = document.createElement('span');
      holder.innerHTML = out;
      var fragment = document.createDocumentFragment();
      while (holder.firstChild) {
        fragment.appendChild(holder.firstChild);
      }
      node.parentNode.replaceChild(fragment, node);
    }
  });
})();