/* raysan-ui · theme-toggle.js
   <theme-toggle></theme-toggle> renders Ray's icon-only sun/moon switch.
   Light is the default. The choice is saved per device in localStorage under
   "theme" (same key raysandesigns.com uses), every toggle on the page stays
   in sync, and <meta name="theme-color"> follows the theme.

   To avoid a light flash on dark pages, also put this in <head>, before CSS:
   <script>try{if(localStorage.getItem("theme")==="dark")document.documentElement.setAttribute("data-theme","dark")}catch(e){}</script>

   Optional attributes:
     light-color="#ffffff"  dark-color="#121417"   theme-color meta values
*/
(() => {
  if (customElements.get('theme-toggle')) return;

  const root = document.documentElement;
  const KEY = 'theme';
  const current = () => (root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');

  const save = (t) => { try { localStorage.setItem(KEY, t); } catch (e) { /* private mode */ } };

  class ThemeToggle extends HTMLElement {
    connectedCallback() {
      if (!this.button) {
        this.button = document.createElement('button');
        this.button.type = 'button';
        this.button.className = 'theme-toggle';
        this.icon = document.createElement('span');
        this.icon.className = 'ms';
        this.icon.setAttribute('aria-hidden', 'true');
        this.button.append(this.icon);
        this.append(this.button);
        this.button.addEventListener('click', () => ThemeToggle.set(current() === 'dark' ? 'light' : 'dark', true));
      }
      this.render();
      ThemeToggle.syncMeta(current());
    }

    static syncMeta(theme) {
      const first = document.querySelector('theme-toggle');
      const meta = document.querySelector('meta[name="theme-color"]');
      if (!meta) return;
      const light = (first && first.getAttribute('light-color')) || '#ffffff';
      const dark = (first && first.getAttribute('dark-color')) || '#121417';
      meta.setAttribute('content', theme === 'dark' ? dark : light);
    }

    render() {
      const dark = current() === 'dark';
      const label = dark ? 'Switch to light mode' : 'Switch to dark mode';
      this.icon.textContent = dark ? 'light_mode' : 'dark_mode';
      this.button.setAttribute('aria-pressed', String(dark));
      this.button.setAttribute('aria-label', label);
      this.button.title = label;
    }

    static set(theme, animate) {
      if (animate) root.classList.add('theme-fading');
      if (theme === 'dark') root.setAttribute('data-theme', 'dark');
      else root.removeAttribute('data-theme');
      save(theme);

      ThemeToggle.syncMeta(theme);
      document.querySelectorAll('theme-toggle').forEach((el) => el.render && el.render());
      document.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
      if (animate) setTimeout(() => root.classList.remove('theme-fading'), 350);
    }
  }

  customElements.define('theme-toggle', ThemeToggle);
  window.RaysanTheme = { get: current, set: (t) => ThemeToggle.set(t, true) };
})();
