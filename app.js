(function () {
  var root = document.documentElement.getAttribute('data-root') || '';
  var list = document.getElementById('list');
  if (!list) return;
  var MAP = {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'};
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return MAP[c]; }); }
  function render(items) {
    if (!items.length) { list.innerHTML = '<li>Khong co bai phu hop.</li>'; return; }
    list.innerHTML = items.map(function (p) {
      var tags = (p.tags || []).map(function (t) { return '<a class="tag" href="' + root + 'tags.html#' + encodeURIComponent(t) + '">' + esc(t) + '</a>'; }).join('');
      return '<li><a class="t" href="' + root + esc(p.url) + '">' + esc(p.title) + '</a><div class="meta">' + esc(p.date) + '</div><div>' + esc(p.description || '') + '</div><div>' + tags + '</div></li>';
    }).join('');
  }
  fetch(root + 'posts.json').then(function (r) { return r.json(); }).then(function (posts) {
    posts.sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    var q = document.getElementById('q');
    var cloud = document.getElementById('tags');
    if (q) {
      render(posts);
      q.addEventListener('input', function () {
        var k = q.value.trim().toLowerCase();
        render(posts.filter(function (p) {
          return (p.title + ' ' + (p.description || '') + ' ' + (p.tags || []).join(' ')).toLowerCase().indexOf(k) !== -1;
        }));
      });
    }
    if (cloud) {
      var all = {};
      posts.forEach(function (p) { (p.tags || []).forEach(function (t) { all[t] = 1; }); });
      cloud.innerHTML = Object.keys(all).sort().map(function (t) { return '<a class="tag" href="#' + encodeURIComponent(t) + '">' + esc(t) + '</a>'; }).join('');
      var apply = function () {
        var t = decodeURIComponent(location.hash.slice(1));
        render(t ? posts.filter(function (p) { return (p.tags || []).indexOf(t) !== -1; }) : posts);
      };
      window.addEventListener('hashchange', apply);
      apply();
    }
  }).catch(function () { list.innerHTML = '<li>Khong tai duoc posts.json (neu mo file truc tiep, hay chay qua web server).</li>'; });
})();
