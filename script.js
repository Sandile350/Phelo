// Custom cursor and small interactions
(() => {
  const cursor = document.getElementById('cursor');
  const label = cursor.querySelector('.cursor-label');
  const workLink = document.querySelector('.work-link');

  // Show current year
  const y = new Date().getFullYear();
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = y;

  // Smooth follow
  let mouseX = window.innerWidth/2, mouseY = window.innerHeight/2;
  let curX = mouseX, curY = mouseY;
  const speed = 0.16;
  window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

  function raf(){
    curX += (mouseX - curX) * speed;
    curY += (mouseY - curY) * speed;
    cursor.style.left = curX + 'px';
    cursor.style.top = curY + 'px';
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // On hover of links/tile, change cursor
  const hoverTargets = document.querySelectorAll('a, .tile');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('view');
      if(el.classList.contains('work-link')){
        label.textContent = 'Explore';
      } else if(el.closest('.tile')){
        label.textContent = 'Open Project';
      } else {
        label.textContent = '';
      }
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('view');
      label.textContent = '';
    });
  });

  // Smooth scroll for work link
  if(workLink){
    workLink.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector('#work');
      if(target) target.scrollIntoView({behavior:'smooth',block:'start'});
    });
  }

  // Subtle parallax on mouse move for hero content
  const hero = document.querySelector('.hero');
  const heroContent = document.querySelector('.hero-content');
  if(hero && heroContent){
    hero.addEventListener('mousemove', (e) => {
      const rX = (e.clientX - window.innerWidth/2) / window.innerWidth;
      const rY = (e.clientY - window.innerHeight/2) / window.innerHeight;
      heroContent.style.transform = `translate(${rX * 12}px, ${rY * 8}px)`;
    });
    hero.addEventListener('mouseleave', ()=>{ heroContent.style.transform='none' });
  }

  // Lightbox behavior
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.querySelector('.lightbox-image');
  const lbCaption = document.querySelector('.lightbox-caption');
  const lbClose = document.querySelector('.lightbox-close');

  function openLightbox(src, caption){
    lbImg.src = src;
    lbImg.alt = caption || 'Project image';
    lbCaption.textContent = caption || '';
    lightbox.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox(){
    lightbox.setAttribute('aria-hidden','true');
    lbImg.src = '';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.tile').forEach(tile => {
    tile.addEventListener('click', () => {
      const src = tile.getAttribute('data-full');
      const caption = tile.querySelector('h3')?.textContent;
      if(src) openLightbox(src, caption);
    });
    tile.addEventListener('keydown', (e)=>{ if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tile.click(); } });
  });

  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e)=>{ if(e.target === lightbox) closeLightbox(); });
  window.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeLightbox(); });

  // Terminal typing animation (creative tech flair)
  const termEl = document.getElementById('terminal-text');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(termEl && !reduce){
    const lines = [
      'const hello = "Hi, I\'m Phelokazi."',
      'console.log(hello)',
      'Projects: realtime-dashboard, atlas-ui, ml-prototype',
      'Available for: frontend, backend, product'
    ];
    let li = 0, pos = 0, forward = true;

    function typeLoop(){
      const current = lines[li];
      if(forward){
        pos++;
        termEl.textContent = current.slice(0,pos);
        if(pos === current.length){ forward=false; setTimeout(typeLoop,1200); return; }
      } else {
        pos--;
        termEl.textContent = current.slice(0,pos);
        if(pos === 0){ forward=true; li = (li+1)%lines.length; setTimeout(typeLoop,300); return; }
      }
      setTimeout(typeLoop, 40 + Math.random()*40);
    }
    typeLoop();
  }

  // Staggered entrance animations for tiles using IntersectionObserver
  const tiles = document.querySelectorAll('.tile');
  tiles.forEach((t,i)=> t.style.setProperty('--d', `${i*120}ms`));
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const el = entry.target;
        const delay = parseInt(getComputedStyle(el).getPropertyValue('--d')) || 0;
        setTimeout(()=> el.classList.add('animate'), delay);
        obs.unobserve(el);
      }
    });
  }, {threshold: 0.15});
  tiles.forEach(t => observer.observe(t));

})();
