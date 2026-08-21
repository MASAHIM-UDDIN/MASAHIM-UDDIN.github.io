/* Load the original application logic, then load presentation-only overrides. */
(function () {
  const app = document.createElement('script');
  app.src = 'js/app-base.js';
  app.onload = function () {
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'css/portfolio-overrides.css?v=1.0.0';
    document.head.appendChild(css);
  };
  document.head.appendChild(app);
})();
