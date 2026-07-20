/* Shared light/dark theme toggle for all pages */
(function () {
  function applyTheme(theme) {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    const btn = document.getElementById("themeToggleBtn");
    if (!btn) return;
    btn.addEventListener("click", function () {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      const next = isDark ? "light" : "dark";
      applyTheme(next);
      localStorage.setItem("gst-theme", next);
    });
  });
})();
