// Partials loader + active menu highlighter
// All comments in English (per your PR rules).

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await includePartials();   // fetch + inject header/footer
    highlightActiveLink();     // set .is-active + aria-current on current route
    fillFooterYear();          // put current year in footer
  } catch (err) {
    console.error('[app] init error:', err);
  }
});

/**
 * Finds all nodes with [data-include], fetches the HTML, and replaces the placeholder node
 * with the fetched markup. Works with relative paths (e.g., "../partials/header.html").
 */
async function includePartials() {
  const placeholders = Array.from(document.querySelectorAll('[data-include]'));
  await Promise.all(
    placeholders.map(async (host) => {
      const url = host.getAttribute('data-include');
      try {
        const res = await fetch(url, { cache: 'no-cache' });
        if (!res.ok) throw new Error(`HTTP ${res.status} on ${url}`);
        const html = await res.text();

        // Replace the placeholder node with fetched content (keep root elements from the partial)
        const tpl = document.createElement('template');
        tpl.innerHTML = html.trim();
        host.replaceWith(tpl.content.cloneNode(true));
      } catch (e) {
        console.error('[includePartials] Failed to load:', url, e);
        // Fallback message (visible if fetch fails)
        host.innerHTML = `<p style="padding:1rem;background:#fee;color:#900">
          Error loading partial: <code>${url}</code>
        </p>`;
      }
    })
  );
}

/**
 * Marks the current navigation link as active.
 * Strategy:
 *  - Prefer <body data-route="index|about|contact"> if present.
 *  - Fallback to infer route from the current URL.
 *  - Add .is-active and aria-current="page" on the matching <a data-route="..."> inside header.
 */
function highlightActiveLink() {
  const route = (document.body.dataset.route || inferRouteFromPath()).toLowerCase();
  const header = document.querySelector('header.site-header');
  if (!header) return;

  header.querySelectorAll('a[data-route]').forEach((a) => {
    if (a.dataset.route && a.dataset.route.toLowerCase() === route) {
      a.classList.add('is-active');
      a.setAttribute('aria-current', 'page');
    } else {
      a.classList.remove('is-active');
      a.removeAttribute('aria-current');
    }
  });
}

/** Basic route inference from the filename (index/about/contact). */
function inferRouteFromPath() {
  const file = location.pathname.split('/').pop().toLowerCase();
  if (file.includes('page1')) return 'page1';
  if (file.includes('page2')) return 'page2';
  if (file.includes('recuperation')) return 'recuperation';
  if (file.includes('signup')) return 'signup';
  return 'index';
}

/** Fill the footer year placeholder (#year) with the current year. */
function fillFooterYear() {
  const y = document.querySelector('#year');
  if (y) y.textContent = String(new Date().getFullYear());
}
