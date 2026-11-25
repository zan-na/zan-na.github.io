/* Fills in the lists of papers and talks, and the email address, from content.js. */
(function () {
  'use strict';

  var site = window.SITE || { papers: [], talks: [] };

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function twoDigits(n) { return n < 10 ? '0' + n : String(n); }

  function paperEntry(paper, number) {
    var entry = el('li', 'entry');
    entry.appendChild(el('div', 'entry-num', twoDigits(number)));

    var body = el('div', 'entry-body');
    var title = el('h3', 'entry-title');
    title.innerHTML = paper.title;            // titles may contain <i> and <sub> for mathematics
    body.appendChild(title);

    var meta = [];
    if (paper.coauthors) meta.push('with ' + paper.coauthors);
    var venue = [paper.venue, paper.year].filter(Boolean).join(', ');
    if (venue) meta.push(venue);
    if (meta.length) body.appendChild(el('div', 'entry-meta', meta.join(' · ')));
    entry.appendChild(body);

    var links = el('div', 'entry-links');
    if (paper.arxiv) {
      var abs = el('a', null, 'arXiv');
      abs.href = 'https://arxiv.org/abs/' + paper.arxiv;
      abs.setAttribute('aria-label', 'arXiv page for ' + title.textContent);
      links.appendChild(abs);
    }
    if (paper.link) {
      var other = el('a', null, paper.linkLabel || 'Link');
      other.href = paper.link;
      links.appendChild(other);
    }
    if (links.childNodes.length) entry.appendChild(links);
    return entry;
  }

  // Text, or a link if a web address was given.
  function linked(text, href) {
    if (!text) return null;
    if (!href) return document.createTextNode(text);
    var a = el('a', null, text);
    a.href = href;
    return a;
  }

  function talkEntry(talk) {
    var entry = el('li', 'entry');
    entry.appendChild(el('div', 'entry-num entry-num--date', talk.date || ''));
    var body = el('div', 'entry-body');
    var title = el('h3', 'entry-title');
    title.innerHTML = talk.title || talk.event || '';   // titles may contain <i> and <sub> for mathematics
    body.appendChild(title);
    var parts = [
      talk.title ? linked(talk.event, talk.eventLink) : null,
      linked(talk.note, talk.noteLink),
      linked(talk.place, talk.placeLink)
    ].filter(Boolean);
    if (parts.length) {
      var meta = el('div', 'entry-meta');
      for (var i = 0; i < parts.length; i++) {
        if (i) meta.appendChild(document.createTextNode(' \u00b7 '));
        meta.appendChild(parts[i]);
      }
      body.appendChild(meta);
    }
    entry.appendChild(body);
    return entry;
  }

  function fill(selector, items, make, emptyText) {
    var lists = document.querySelectorAll(selector);
    for (var i = 0; i < lists.length; i++) {
      var list = lists[i];
      var limit = parseInt(list.getAttribute('data-limit'), 10) || items.length;
      list.textContent = '';
      if (!items.length) {
        list.appendChild(el('li', 'empty-note', emptyText));
        continue;
      }
      for (var k = 0; k < items.length && k < limit; k++) {
        list.appendChild(make(items[k], items.length - k));
      }
    }
  }

  fill('[data-papers]', site.papers || [], paperEntry, 'Papers will be listed here soon.');
  fill('[data-talks]', site.talks || [], talkEntry, 'Talks will be listed here soon.');

  // The email address is put together here, in the browser, so it never appears whole in the page source.
  var mail = site.email;
  if (mail && mail.length === 2 && mail[0] && mail[1]) {
    var address = mail[0] + '\u0040' + mail[1];
    var shown = document.querySelectorAll('[data-email]');
    for (var m = 0; m < shown.length; m++) { shown[m].textContent = address; shown[m].href = 'mailto:' + address; }
    var buttons = document.querySelectorAll('[data-email-button]');
    for (var n = 0; n < buttons.length; n++) buttons[n].href = 'mailto:' + address;
  }

  var years = document.querySelectorAll('[data-year]');
  for (var y = 0; y < years.length; y++) years[y].textContent = String(new Date().getFullYear());
})();
