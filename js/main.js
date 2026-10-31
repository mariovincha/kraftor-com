/* =========================================================
   Datos de contacto y redes: se cambian SOLO aquí.
   ========================================================= */
const CONTACTO = {
  whatsapp: '51958317484',          // con código de país, sin espacios ni "+"
  correo: 'info@kraftor.com',
  redes: {                          // vacías = no se muestran
    facebook: 'https://www.facebook.com/kraftordigital',
    instagram: 'https://www.instagram.com/kraftordigital/',
    linkedin: 'https://www.linkedin.com/company/kraftor',
    tiktok: '',
    youtube: '',
  },
};

const wa = (t = 'Hola Kraftor, quisiera más información.') => `https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(t)}`;
document.querySelectorAll('[data-wa], [data-wa-texto]').forEach((a) => {
  if (!CONTACTO.whatsapp) return;
  a.href = wa(a.dataset.waTexto);
  a.target = '_blank'; a.rel = 'noopener';
});
document.querySelectorAll('[data-correo]').forEach((a) => { a.href = 'mailto:' + CONTACTO.correo; a.textContent = CONTACTO.correo; });

const ICONOS = {
  facebook: '<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8Z"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/>',
  linkedin: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7"/>',
  tiktok: '<path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.5 2.5 2.5 4.5 5 4.5"/>',
  youtube: '<rect x="2.5" y="5.5" width="19" height="13" rx="3"/><path d="m10 9 5 3-5 3V9Z"/>',
};
document.getElementById('redes').innerHTML = Object.entries(CONTACTO.redes)
  .filter(([, url]) => url)
  .map(([red, url]) => `<a href="${url}" target="_blank" rel="noopener" aria-label="${red}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">${ICONOS[red]}</svg></a>`)
  .join('');

document.getElementById('anio').textContent = new Date().getFullYear();

/* Menú en celular */
const menuBtn = document.getElementById('menuBtn'), menu = document.getElementById('menu');
menuBtn.addEventListener('click', () => {
  const abierto = menu.classList.toggle('abierto');
  menuBtn.setAttribute('aria-expanded', abierto);
});
menu.addEventListener('click', (e) => { if (e.target.tagName === 'A') { menu.classList.remove('abierto'); menuBtn.setAttribute('aria-expanded', false); } });

/* Sombra del menú y botón "Volver al principio" */
const nav = document.getElementById('nav'), arriba = document.getElementById('arriba');
addEventListener('scroll', () => {
  nav.classList.toggle('sombra', scrollY > 40);
  arriba.classList.toggle('ver', scrollY > 700);
}, { passive: true });
arriba.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

/* Carrusel */
(() => {
  const slides = [...document.querySelectorAll('.slide')];
  const puntos = document.getElementById('puntos');
  const pausaBtn = document.getElementById('pausa');
  let i = 0, timer = null, pausado = matchMedia('(prefers-reduced-motion: reduce)').matches;
  slides.forEach((_, n) => {
    const b = document.createElement('button');
    b.className = 'punto'; b.setAttribute('aria-label', `Ir a la diapositiva ${n + 1}`);
    b.addEventListener('click', () => { ir(n); reiniciar(); });
    puntos.appendChild(b);
  });
  function ir(n) {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => { s.classList.toggle('activo', k === i); s.setAttribute('aria-hidden', k !== i); s.inert = k !== i; });
    [...puntos.children].forEach((p, k) => p.setAttribute('aria-current', k === i));
    slides[i].querySelectorAll('img[loading="lazy"]').forEach((img) => (img.loading = 'eager'));
  }
  function reiniciar() { clearInterval(timer); if (!pausado) timer = setInterval(() => ir(i + 1), 7000); }
  const iconoPausa = pausaBtn.innerHTML;
  pausaBtn.addEventListener('click', () => {
    pausado = !pausado;
    pausaBtn.setAttribute('aria-label', pausado ? 'Reproducir' : 'Pausar');
    pausaBtn.innerHTML = pausado ? '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 3v10l9-5z"/></svg>' : iconoPausa;
    reiniciar();
  });
  document.getElementById('prev').addEventListener('click', () => { ir(i - 1); reiniciar(); });
  document.getElementById('next').addEventListener('click', () => { ir(i + 1); reiniciar(); });
  const hero = document.querySelector('.hero');
  hero.addEventListener('mouseenter', () => clearInterval(timer));
  hero.addEventListener('mouseleave', reiniciar);
  let x0 = null;
  hero.addEventListener('touchstart', (e) => (x0 = e.touches[0].clientX), { passive: true });
  hero.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 50) { ir(i + (dx < 0 ? 1 : -1)); reiniciar(); }
  });
  ir(0); reiniciar();
})();

/* Filtro del portafolio */
document.querySelectorAll('.filtros button').forEach((b) => b.addEventListener('click', () => {
  document.querySelectorAll('.filtros button').forEach((x) => x.setAttribute('aria-pressed', x === b));
  document.querySelectorAll('#port .card').forEach((c) => (c.hidden = b.dataset.f !== '*' && c.dataset.cat !== b.dataset.f));
}));

/* Formulario → WhatsApp (no hay servidor) */
document.getElementById('form').addEventListener('submit', (e) => {
  e.preventDefault();
  const f = e.target;
  if (!f.nombre.value.trim() || !f.mensaje.value.trim()) { (f.nombre.value.trim() ? f.mensaje : f.nombre).focus(); return; }
  const texto = `Hola Kraftor, soy ${f.nombre.value.trim()}${f.empresa.value.trim() ? ' de ' + f.empresa.value.trim() : ''}.\nMe interesa: ${f.interes.value}.\n\n${f.mensaje.value.trim()}`;
  if (CONTACTO.whatsapp) open(wa(texto), '_blank', 'noopener');
  else location.href = `mailto:${CONTACTO.correo}?subject=${encodeURIComponent('Contacto desde kraftor.com')}&body=${encodeURIComponent(texto)}`;
});
