// Yandex.Metrika counter bootstrap. Extracted from inline <script> in
// index.html so the page can ship with a strict Content-Security-Policy
// (no `unsafe-inline` on script-src). The counter ID is hardcoded —
// changing it is a one-line edit here. CI also mirrors it in
// VITE_YM_ID for components that read it via import.meta.env.
(function (m, e, t, r, i, k, a) {
  m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
  m[i].l = 1 * new Date();
  for (var j = 0; j < document.scripts.length; j++) {
    if (document.scripts[j].src === r) return;
  }
  k = e.createElement(t);
  a = e.getElementsByTagName(t)[0];
  k.async = 1;
  k.src = r;
  a.parentNode.insertBefore(k, a);
})(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

var YM_ID = 108745795;
window.YM_ID = YM_ID;
window.ym(YM_ID, "init", {
  clickmap: true,
  trackLinks: true,
  accurateTrackBounce: true,
  webvisor: true,
});
