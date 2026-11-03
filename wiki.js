// Crop Wiki: image fallbacks, bar-height sync and the active chip in the sticky index. Plain JS, works in iPhone Safari.
(function(){
  var root = document.documentElement;
  // 1. Missing render: try the data-alt image once, then show the soft placeholder.
  window.wikiImgFail = function(img){
    var alt = img.getAttribute('data-alt');
    if (alt && !img.dataset.tried){ img.dataset.tried = '1'; img.src = alt; return; }
    img.classList.add('missing');
    var ph = img.nextElementSibling;
    if (ph && ph.classList.contains('ph')) ph.classList.add('on');
  };
  // 2. Keep the CSS bar heights (--hdr, --idx) equal to the rendered header and index, so scroll-padding,
  //    the index's sticky top and the crop screen height all agree on every width.
  var hdr = document.querySelector('header.nav'), idx = document.querySelector('.idx'), bars = 97;
  function measure(){
    var h = hdr ? hdr.offsetHeight : 54, i = idx ? idx.offsetHeight : 43;
    root.style.setProperty('--hdr', h + 'px'); root.style.setProperty('--idx', i + 'px');
    bars = h + i;
  }
  measure();
  if ('ResizeObserver' in window){ var ro = new ResizeObserver(function(){ measure(); update(); }); if (hdr) ro.observe(hdr); if (idx) ro.observe(idx); }
  // 3. Highlight the chip for the crop that crosses a reference line just under the sticky bars.
  //    (A section-ratio observer favoured short sections and could leave a stale chip on tall ones.)
  var chips = {}; document.querySelectorAll('.idx .chip').forEach(function(a){ chips[a.getAttribute('href').slice(1)] = a; });
  var secs = [].slice.call(document.querySelectorAll('section.crop'));
  var current = null;
  function setCurrent(id){
    if (id === current) return;
    if (current && chips[current]) chips[current].removeAttribute('aria-current');
    current = id;
    if (id && chips[id]){ chips[id].setAttribute('aria-current', 'true');
      var c = chips[id], g = c.parentNode; if (g.scrollWidth > g.clientWidth) g.scrollTo({left: c.offsetLeft - (g.clientWidth - c.offsetWidth) / 2, behavior: 'smooth'}); }
  }
  function update(){
    var line = bars + 40, best = null;   // reference line: 40px below the index bar
    for (var i = 0; i < secs.length; i++){
      var r = secs[i].getBoundingClientRect();
      if (r.top <= line && r.bottom > line){ best = secs[i].id; break; }
    }
    setCurrent(best);
  }
  var tick = false;
  function onScroll(){ if (tick) return; tick = true; requestAnimationFrame(function(){ tick = false; update(); }); }
  window.addEventListener('scroll', onScroll, {passive: true});
  window.addEventListener('resize', onScroll);
  window.addEventListener('load', function(){ measure(); update(); });
  update();
  // 4. Overflow hint: .more on the index while the chip row can still scroll right (CSS draws the fade + label).
  var row = idx && idx.querySelector('.row');
  function hint(){ if (row) idx.classList.toggle('more', row.scrollLeft + row.clientWidth < row.scrollWidth - 8); }
  if (row){ row.addEventListener('scroll', hint, {passive: true}); window.addEventListener('resize', hint); window.addEventListener('load', hint); hint(); }
  // 5. Chip click: close the mobile menu if open and let the browser jump.
  document.querySelectorAll('.idx .chip').forEach(function(a){ a.addEventListener('click', function(){ var m = document.querySelector('.mnav'); if (m) m.open = false; }); });
})();
