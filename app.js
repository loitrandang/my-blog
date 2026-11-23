(function () {
  'use strict';
  var base = document.body.getAttribute('data-base') || '';

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function norm(s) {
    return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
  }

  /* ---------- Tô màu mã nguồn ---------- */
  var KW = 'select|from|where|group|by|order|having|join|left|right|inner|outer|on|as|and|or|not|in|is|null|case|when|then|else|end|with|limit|union|all|distinct|count|sum|avg|min|max|insert|into|update|delete|create|table|view|def|return|import|from|if|elif|for|while|class|try|except|finally|lambda|print|True|False|None';
  var RE = new RegExp('(--[^\\n]*|#[^\\n]*)|(\'[^\'\\n]*\'|"[^"\\n]*")|\\b(' + KW + ')\\b|\\b(\\d+(?:\\.\\d+)?)\\b', 'gi');
  function highlight() {
    var blocks = document.querySelectorAll('pre code');
    for (var i = 0; i < blocks.length; i++) {
      var html = esc(blocks[i].textContent).replace(RE, function (m, com, str, kw, num) {
        if (com) return '<span class="tok-com">' + m + '</span>';
        if (str) return '<span class="tok-str">' + m + '</span>';
        if (kw) return '<span class="tok-kw">' + m + '</span>';
        return '<span class="tok-num">' + m + '</span>';
      });
      blocks[i].innerHTML = html;
    }
  }

  /* ---------- Dữ liệu bài viết ---------- */
  function loadPosts() {
    return fetch(base + 'posts.json').then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    });
  }
  function param(name) {
    return new URLSearchParams(location.search).get(name) || '';
  }

  /* ---------- Trang chủ: danh sách + tìm kiếm + lọc thẻ ---------- */
  function initList(posts) {
    var list = document.getElementById('list');
    var q = document.getElementById('q');
    var empty = document.getElementById('empty');
    var filter = document.getElementById('filter');
    var tag = param('tag');
    if (tag) {
      filter.innerHTML = 'Đang lọc theo thẻ: <strong>' + esc(tag) + '</strong> · <a href="index.html">Xem tất cả</a>';
    }
    function render() {
      var kw = norm(q.value.trim());
      var out = posts.filter(function (p) {
        if (tag && (p.tags || []).indexOf(tag) < 0) return false;
        if (!kw) return true;
        return norm([p.title, p.summary, (p.tags || []).join(' ')].join(' ')).indexOf(kw) >= 0;
      }).sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
      list.innerHTML = out.map(function (p) {
        var tags = (p.tags || []).map(function (t) {
          return '<a class="tag" href="index.html?tag=' + encodeURIComponent(t) + '">' + esc(t) + '</a>';
        }).join('');
        return '<li><h2><a href="' + esc(p.url) + '">' + esc(p.title) + '</a></h2>' +
          '<div class="muted">' + esc(p.date || '') + '</div>' +
          '<p>' + esc(p.summary || '') + '</p><div>' + tags + '</div></li>';
      }).join('');
      empty.hidden = out.length > 0;
    }
    q.addEventListener('input', render);
    render();
  }

  /* ---------- Trang chuyên mục ---------- */
  function initTags(posts) {
    var box = document.getElementById('tags');
    var count = {};
    posts.forEach(function (p) {
      (p.tags || []).forEach(function (t) { count[t] = (count[t] || 0) + 1; });
    });
    var names = Object.keys(count).sort();
    box.innerHTML = names.map(function (t) {
      return '<a class="tag" href="index.html?tag=' + encodeURIComponent(t) + '">' + esc(t) + ' (' + count[t] + ')</a>';
    }).join('');
    document.getElementById('empty').hidden = names.length > 0;
  }

  highlight();
  if (document.getElementById('list') || document.getElementById('tags')) {
    loadPosts().then(function (posts) {
      if (document.getElementById('list')) initList(posts);
      if (document.getElementById('tags')) initTags(posts);
    }).catch(function () {
      var e = document.getElementById('empty');
      if (e) { e.textContent = 'Không tải được danh sách bài viết.'; e.hidden = false; }
    });
  }
})();
