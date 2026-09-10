// Main entry point.
// Start only after the HTML has been parsed and show a useful error if a script fails.
(function startPoolGame() {
  function start() {
    try {
      if (!window.PoolConfig) throw new Error("config.js did not load.");
      if (!window.PoolPhysics) throw new Error("physics.js did not load.");
      if (!window.PoolTable) throw new Error("table.js did not load.");
      if (!window.PoolInput) throw new Error("input.js did not load.");
      if (!window.PoolGame) throw new Error("game.js did not load.");
      if (!window.PoolMenu) throw new Error("menu.js did not load.");

      window.PoolGame.init();
      window.PoolMenu.init();
      window.PoolGame.run();
    } catch (error) {
      console.error("Pool Game startup failed:", error);
      const status = document.getElementById("status");
      if (status) {
        status.textContent = "Game startup error: " + error.message;
        status.classList.add("error");
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
