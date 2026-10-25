/* raysan-ui · scroll-progress.js
   Reading-progress bar from raysandesigns.com: a hero-gradient line along the
   bottom of the top app bar that grows left to right as the page scrolls.
   Also gives .top-app-bar the M3 on-scroll color change (adds .scrolled).

   Markup, inside the header:
     <header class="top-app-bar">
       <div class="scroll-progress" aria-hidden="true"></div>
       ...
     </header>

   Optional: data-start=".hero" on the bar to start filling only once that
   element has scrolled up under the header (the site does this with its hero).
   Add data-static to a bar to leave it alone (e.g. a fixed demo).
*/
(() => {
  const init = () => {
    const header = document.querySelector('.top-app-bar');
    const onScroll = () => header && header.classList.toggle('scrolled', window.scrollY > 8);

    const bars = [...document.querySelectorAll('.scroll-progress:not([data-static])')];
    let ticking = false;

    const update = () => {
      ticking = false;
      onScroll();
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bars.forEach((bar) => {
        const startEl = bar.dataset.start && document.querySelector(bar.dataset.start);
        const headerH = header ? header.offsetHeight : 0;
        const start = startEl ? Math.max(0, startEl.offsetTop + startEl.offsetHeight - headerH) : 0;
        const span = max - start;
        const p = span > 0 ? Math.min(1, Math.max(0, (window.scrollY - start) / span)) : 0;
        bar.style.setProperty('--progress', p.toFixed(4));
      });
    };

    const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    window.addEventListener('load', request);
    update();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
