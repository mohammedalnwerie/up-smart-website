// UP-Smart showcase — small, dependency-free motion layer.
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Nav: solid once scrolled; mobile menu toggle.
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', scrollY > 30);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const btn = document.getElementById('menuBtn'), links = document.getElementById('links');
  btn.addEventListener('click', () => {
    const open = links.classList.toggle('open'); btn.setAttribute('aria-expanded', open);
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));

  // Reveal on scroll (also drives the converge diagram and the timeline).
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal, #converge, #timeline').forEach(el => io.observe(el));
  // Timeline: stagger the stops after the line starts filling.
  document.querySelectorAll('#timeline li').forEach((li, i) => { li.style.transitionDelay = (0.25 + i * 0.22) + 's'; });

  // Hero: the phone and floating cards follow the pointer (desktop only).
  const hv = document.getElementById('heroVisual'), phone = document.getElementById('heroPhone');
  if (!reduce && matchMedia('(pointer: fine)').matches) {
    const floats = hv.querySelectorAll('.float');
    hv.addEventListener('pointermove', e => {
      const r = hv.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      phone.style.setProperty('--ry', (-14 + x * 22) + 'deg');
      phone.style.setProperty('--rx', (6 - y * 14) + 'deg');
      floats.forEach(f => { const d = +f.dataset.depth; f.style.transform = `translate(${x * d}px, ${y * d}px)`; });
    });
    hv.addEventListener('pointerleave', () => {
      phone.style.removeProperty('--ry'); phone.style.removeProperty('--rx');
      floats.forEach(f => { f.style.transform = ''; });
    });
  }

  // Showcase: tabs switch the screen; auto-advance while in view.
  const tabs = [...document.querySelectorAll('#shotTabs button')];
  const shots = [...document.querySelectorAll('#shotPhone .stack img')];
  let cur = 0, timer = null;
  const show = i => {
    cur = i;
    tabs.forEach((t, k) => { t.classList.toggle('on', k === i); t.setAttribute('aria-selected', k === i); });
    shots.forEach((s, k) => s.classList.toggle('on', k === i));
    // restart the progress bar animation
    const t = tabs[i]; t.classList.remove('on'); void t.offsetWidth; t.classList.add('on');
  };
  const start = () => { if (reduce || timer) return; timer = setInterval(() => show((cur + 1) % tabs.length), 4500); };
  const stop = () => { clearInterval(timer); timer = null; };
  tabs.forEach((t, i) => t.addEventListener('click', () => { stop(); show(i); start(); }));
  new IntersectionObserver(es => es.forEach(e => (e.isIntersecting ? start() : stop())), { threshold: 0.3 })
    .observe(document.getElementById('shotPhone'));

  document.getElementById('yr').textContent = new Date().getFullYear();
})();
