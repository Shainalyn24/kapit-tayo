(function () {
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  var mods = [
    { id: 'start', name: 'Start', desc: '' },
    { id: 'places', name: 'Where it happens', desc: 'Street, online, school and work' },
    { id: 'numbers', name: 'The numbers', desc: 'Survey and police data' },
    { id: 'law', name: 'The law', desc: 'Penalties and who must act' },
    { id: 'help', name: 'What to do', desc: 'Three steps' },
    { id: 'quiz', name: 'Quiz', desc: 'Five questions' },
    { id: 'sources', name: 'Sources', desc: '' }
  ];
  var seen = { start: true };
  var nav = document.getElementById('nav'), todo = document.getElementById('todo');

  mods.forEach(function (m, i) {
    var b = el('button', null, '<span class="n">' + (i === 0 ? '★' : i === 6 ? 'R' : i) + '</span><span>' + m.name + '</span>');
    b.type = 'button'; b.setAttribute('data-id', m.id);
    b.addEventListener('click', function () { go(m.id); });
    nav.appendChild(b);
    if (i >= 1 && i <= 5) {
      var t = el('button', null, '<b>' + i + '. ' + m.name + '</b><span>' + m.desc + '</span>'); t.type = 'button';
      t.addEventListener('click', function () { go(m.id); });
      todo.appendChild(t);
    }
  });

  function go(id) {
    mods.forEach(function (m) { document.getElementById('m-' + m.id).hidden = m.id !== id; });
    seen[id] = true;
    nav.querySelectorAll('button').forEach(function (b) {
      var bid = b.getAttribute('data-id');
      if (bid === id) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
      b.classList.toggle('seen', !!seen[bid] && bid !== 'start' || (bid === 'start' && id !== 'start'));
    });
    var n = 0; ['places', 'numbers', 'law', 'help', 'quiz'].forEach(function (k) { if (seen[k]) n++; });
    document.getElementById('prog-t').textContent = n + ' of 5 modules opened';
    document.getElementById('prog-b').style.width = (n / 5 * 100) + '%';
    window.scrollTo(0, 0);
  }
  document.querySelectorAll('[data-go]').forEach(function (b) { b.addEventListener('click', function () { go(b.getAttribute('data-go')); }); });

  /* bar rows */
  function rows(id, data, hot) {
    var host = document.getElementById(id);
    data.forEach(function (d) {
      host.appendChild(el('div', 'row' + (hot ? ' hot' : ''), '<div class="row-top"><span>' + d[0] + '</span><b>' + d[1] + '%</b></div><div class="track" role="img" aria-label="' + d[1] + ' percent"><i style="--w:' + d[1] + '%"></i></div>'));
    });
  }
  rows('rows-street', [
    ['Young women (18 to 24) harassed at least once <sup><a href="#r6">6</a></sup>', 88],
    ['Women harassed at least once in their lives (3 in 5) <sup><a href="#r7">7</a></sup>', 60],
    ['Harasser was a stranger <sup><a href="#r8">8</a></sup>', 70],
    ['Happened in the daytime, 6 am to 6 pm <sup><a href="#r8">8</a></sup>', 70],
    ['Did nothing afterwards <sup><a href="#r6">6</a></sup>', 50],
    ['Faced the worst kinds, like groping or flashing <sup><a href="#r8">8</a></sup>', 34]
  ], false);
  rows('rows-online', [
    ['Cyberlibel (harmful online posts)', 20],
    ['Sextortion (blackmail)', 19],
    ['Account hacking', 12],
    ['Online crimes against children', 8]
  ], true);

  /* stepper */
  var steps = [
    { h: 'Save proof', p: 'Take screenshots. Note the date, time and place.' },
    { h: 'Report it', p: 'Online: the PNP Anti-Cybercrime Group.<sup><a href="#r5">5</a><a href="#r13">13</a></sup> In public: the staff of the place, the police or your local hotline.<sup><a href="#r2">2</a><a href="#r3">3</a></sup>' },
    { h: 'Believe them', p: 'Never blame a victim for what they wore. In the survey, more women than men did.<sup><a href="#r9">9</a></sup>' }
  ];
  var si = 0, st = document.getElementById('stepper');
  function drawStep() {
    var s = steps[si];
    st.innerHTML = '<div class="dots">' + steps.map(function (_, i) { return '<i class="' + (i <= si ? 'on' : '') + '"></i>'; }).join('') + '</div>' +
      '<div class="stepbox"><span class="num">' + (si + 1) + '</span><div><h3>' + s.h + '</h3><p>' + s.p + '</p></div></div>' +
      '<div class="btns"><button type="button" class="btn ghost" id="sp"' + (si === 0 ? ' disabled' : '') + '>Back</button><button type="button" class="btn" id="sn"' + (si === steps.length - 1 ? ' disabled' : '') + '>Next step</button></div>';
    document.getElementById('sp').addEventListener('click', function () { si--; drawStep(); });
    document.getElementById('sn').addEventListener('click', function () { si++; drawStep(); });
  }
  drawStep();

  /* quiz */
  var qs = [
    { q: 'Which law punishes catcalling in public places?', o: ['The Safe Spaces Act (RA 11313)', 'No law covers it', 'Only the 1995 law'], a: 0, w: 'The Safe Spaces Act punishes catcalling and whistling.', r: '<sup><a href="#r2">2</a></sup>' },
    { q: 'Someone says "it was just a joke". Is it still harassment?', o: ['No, a joke is an excuse', 'Yes, motive does not matter', 'Only online'], a: 1, w: 'The Act covers unwanted sexual remarks or actions whatever the motive.', r: '<sup><a href="#r2">2</a></sup>' },
    { q: 'Who takes complaints about online harassment?', o: ['The PNP Anti-Cybercrime Group', 'Only the barangay', 'No one'], a: 0, w: 'The PNP Anti-Cybercrime Group receives and enforces online complaints.', r: '<sup><a href="#r5">5</a></sup>' },
    { q: 'In the Quezon City survey, who was the harasser most often?', o: ['A family member', 'A stranger', 'A teacher'], a: 1, w: '70% of women said the harasser was a stranger.', r: '<sup><a href="#r8">8</a></sup>' },
    { q: 'What happens if a school head ignores a harassment report?', o: ['Nothing', 'They can be held responsible', 'The victim is punished'], a: 1, w: 'Employers and school heads can be held liable if they do not act.', r: '<sup><a href="#r4">4</a></sup>' }
  ];
  var qi = 0, score = 0, qz = document.getElementById('quiz');
  function drawQ() {
    var q = qs[qi];
    qz.innerHTML = '<span class="eyebrow">Question ' + (qi + 1) + ' of ' + qs.length + '</span><h3 style="margin-top:8px">' + q.q + '</h3><div class="opts"></div><p class="why"></p><div class="btns"><button type="button" class="btn" id="qn" hidden></button></div>';
    var opts = qz.querySelector('.opts'), why = qz.querySelector('.why'), nx = document.getElementById('qn');
    q.o.forEach(function (t, i) {
      var b = el('button', 'opt', t); b.type = 'button';
      b.addEventListener('click', function () {
        opts.querySelectorAll('.opt').forEach(function (x, j) { x.disabled = true; if (j === q.a) x.classList.add('right'); else if (x === b) x.classList.add('wrong'); });
        if (i === q.a) score++;
        why.innerHTML = '<b>' + (i === q.a ? 'Correct.' : 'Not quite.') + '</b> ' + q.w + q.r;
        nx.hidden = false; nx.textContent = qi === qs.length - 1 ? 'See my score' : 'Next question'; nx.focus();
      });
      opts.appendChild(b);
    });
    nx.addEventListener('click', function () { qi++; if (qi < qs.length) drawQ(); else endQ(); });
  }
  function endQ() {
    qz.innerHTML = '<span class="eyebrow">Your score</span><div class="score">' + score + ' / ' + qs.length + '</div><p style="margin:8px 0 16px">' + (score >= 4 ? 'You know the basics. Share this with a friend.' : 'Review the modules and try once more.') + '</p><button type="button" class="btn" id="qr">Try again</button>';
    document.getElementById('qr').addEventListener('click', function () { qi = 0; score = 0; drawQ(); });
  }
  drawQ();

  /* reference links jump to the Sources module */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('sup a');
    if (!a) return;
    e.preventDefault();
    var id = a.getAttribute('href').slice(1);
    go('sources');
    var t = document.getElementById(id);
    if (t) { t.scrollIntoView(); t.style.background = 'var(--line)'; setTimeout(function () { t.style.background = ''; }, 1800); }
  });

  go('start');
})();
