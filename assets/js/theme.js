/* تبديل المظهر — فاتح/داكن، محفوظ في localStorage عبر كل الصفحات */
(function(){
  const KEY = "rahlati:theme";

  function currentTheme(){
    return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
  }
  function applyIcon(theme){
    const btn = document.getElementById("themeToggle");
    if (btn) btn.textContent = theme === "light" ? "☀️" : "🌙";
  }

  applyIcon(currentTheme());

  const btn = document.getElementById("themeToggle");
  if (btn){
    btn.addEventListener("click", () => {
      const next = currentTheme() === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      try{ localStorage.setItem(KEY, next); }catch(e){}
      applyIcon(next);
    });
  }
})();
