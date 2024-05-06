// jQuery document ready function to ensure the DOM is fully loaded
$(document).ready(function () {
 
    function setTheme(mode = "dark") {
        const userMode = localStorage.getItem("bs-theme");
        const sysMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const useSystem = mode === "system" || (!userMode && mode === "auto");
        const modeChosen = useSystem
          ? "system"
          : mode === "dark" || mode === "light"
            ? mode
            : userMode;
    
        if (modeChosen === "dark") {
          document.body.classList.remove("light");
          document.body.classList.add("dark");
          $('#mainLogo').attr('src', 'edi-white.png');
    
        } else if (modeChosen === "light") {
          document.body.classList.remove("dark");
          document.body.classList.add("light");
          $('#mainLogo').attr('src', 'edi-black.png');

        }
    
        if (useSystem) {
          localStorage.removeItem("bs-theme");
        } else {
          localStorage.setItem("bs-theme", modeChosen);
        }
    
        document.documentElement.setAttribute(
          "data-bs-theme",
          useSystem ? (sysMode ? "light" : "dark") : modeChosen
        );
        document
          .querySelectorAll(".mode-switch .btn")
          .forEach((e) => e.classList.remove("text-white"));
        document.getElementById(modeChosen).classList.add("text-white");
      }
      setTheme();


    document.querySelectorAll(".mode-switch .btn")
      .forEach((e) => e.addEventListener("click", () => setTheme(e.id)));
    
      window.matchMedia("(prefers-color-scheme: light)")
      .addEventListener("change", () => setTheme());
    
});
