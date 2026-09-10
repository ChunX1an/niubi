// Main menu controller.
// Keeps menu buttons separate from the game logic.
window.PoolMenu = {
  init() {
    this.menuScreen = document.getElementById("main-menu");
    this.gameScreen = document.getElementById("game-screen");

    if (!this.menuScreen || !this.gameScreen) {
      throw new Error("Menu screens could not be found.");
    }

    document.querySelectorAll(".mode-button").forEach(button => {
      button.addEventListener("click", () => {
        if (!button.disabled) {
          this.startMode(button.dataset.mode);
        }
      });
    });

    const newRackButton = document.getElementById("new-rack");
    if (newRackButton) {
      newRackButton.addEventListener("click", () => {
        window.PoolGame.newRack();
      });
    }

    const mainMenuButton = document.getElementById("main-menu-button");
    if (mainMenuButton) {
      mainMenuButton.addEventListener("click", () => {
        this.showMenu();
      });
    }
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
