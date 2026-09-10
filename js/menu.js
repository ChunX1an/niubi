window.PoolMenu = {
  init() {
    this.menuScreen = document.getElementById("main-menu");
    this.gameScreen = document.getElementById("game-screen");

    document.querySelectorAll(".mode-button").forEach(button => {
      button.addEventListener("click", () => {
        if (!button.disabled) this.startMode(button.dataset.mode);
      });
    });

    document.getElementById("new-rack").addEventListener("click", () => {
      window.PoolGame.newRack();
    });

    document.getElementById("main-menu").addEventListener("click", () => {
      this.showMenu();
    });
  },

  startMode(mode) {
    this.menuScreen.classList.remove("active");
    this.gameScreen.classList.add("active");
    window.PoolGame.start(mode);
  },

  showMenu() {
    window.PoolGame.aiming = false;
    this.gameScreen.classList.remove("active");
    this.menuScreen.classList.add("active");
  }
};