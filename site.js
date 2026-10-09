// Builds the "On this page" list from the document's section headings and
// highlights the section in view. Pages read fine without it.
(function () {
  var article = document.querySelector('article');
  if (!article) return;
  var heads = Array.prototype.filter.call(article.querySelectorAll('h2'), function (h) {
    return !h.closest('[lang="he"]');
  });
  var he = article.querySelector('[lang="he"]');
  var items = heads.map(function (h, i) {
    if (!h.id) h.id = 's' + (i + 1);
    return { id: h.id, text: h.textContent.trim(), el: h };
  });
  if (he) {
    if (!he.id) he.id = 'he';
    items.push({ id: he.id, text: 'עברית', el: he });
  }
  if (items.length < 2) return;

  function list() {
    var ol = document.createElement('ol');
    items.forEach(function (it) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#' + it.id;
      a.textContent = it.text;
      a.dataset.id = it.id;
      li.appendChild(a);
      ol.appendChild(li);
    });
    return ol;
  }
  var toc = document.querySelector('.toc');
  var tocM = document.querySelector('.toc-m');
  if (toc) toc.appendChild(list());
  if (tocM) {
    tocM.appendChild(list());
    tocM.addEventListener('click', function (e) { if (e.target.tagName === 'A') tocM.open = false; });
  }
  if (toc) toc.hidden = false;
  if (tocM) tocM.hidden = false;

  var links = toc ? toc.querySelectorAll('a') : [];
  function mark() {
    var current = items[0].id;
    for (var i = 0; i < items.length; i++) {
      if (items[i].el.getBoundingClientRect().top < 120) current = items[i].id;
    }
    Array.prototype.forEach.call(links, function (a) { a.classList.toggle('on', a.dataset.id === current); });
  }
  window.addEventListener('scroll', mark, { passive: true });
  mark();
})();
