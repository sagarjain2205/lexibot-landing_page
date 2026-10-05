// LexiBot landing page interactions
document.addEventListener('DOMContentLoaded', () => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Navbar: more opaque on scroll + mobile menu */
  const nav = document.getElementById('navbar');
  const links = document.getElementById('navLinks');
  const burger = document.getElementById('burger');
  const onScroll = () => nav.classList.toggle('scrolled', scrollY > 20);
  onScroll(); addEventListener('scroll', onScroll, { passive: true });
  burger.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    links.classList.remove('open'); burger.setAttribute('aria-expanded', false);
  }));

  /* Gauge + counter animation (runs when visible) */
  function animateGauge(g) {
    const score = +g.dataset.score;
    g.querySelector('.val').style.strokeDashoffset = 339.3 * (1 - score / 100);
    const num = g.querySelector('em');
    if (reduce) { num.textContent = score; return; }
    let n = 0;
    const t = setInterval(() => {
      n += 2; num.textContent = Math.min(n, score);
      if (n >= score) clearInterval(t);
    }, 22);
  }
  const gaugeObs = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { animateGauge(e.target); gaugeObs.unobserve(e.target); }
  }), { threshold: 0.4 });
  document.querySelectorAll('.gauge').forEach(g => gaugeObs.observe(g));

  /* Scroll reveal (cards + steps only) */
  const rvObs = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); rvObs.unobserve(e.target); }
  }), { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.card, .step, .flow li, .notice').forEach(el => { el.classList.add('rv'); rvObs.observe(el); });

  /* Floating particles (lightweight canvas) */
  const c = document.getElementById('particles');
  if (!c || reduce) return;
  const ctx = c.getContext('2d');
  let ps = [];
  const init = () => {
    c.width = innerWidth; c.height = innerHeight;
    ps = Array.from({ length: Math.min(60, Math.floor(innerWidth / 24)) }, () => ({
      x: Math.random() * c.width, y: Math.random() * c.height,
      r: Math.random() * 1.4 + 0.3, vy: -(Math.random() * 0.25 + 0.05),
      a: Math.random() * 0.6 + 0.2, col: Math.random() > 0.7 ? '139,92,246' : '56,189,248'
    }));
  };
  const draw = () => {
    ctx.clearRect(0, 0, c.width, c.height);
    ps.forEach(p => {
      p.y += p.vy; if (p.y < -5) { p.y = c.height + 5; p.x = Math.random() * c.width; }
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283);
      ctx.fillStyle = `rgba(${p.col},${p.a * 0.6})`; ctx.fill();
    });
    requestAnimationFrame(draw);
  };
  init(); draw(); addEventListener('resize', init);
});
