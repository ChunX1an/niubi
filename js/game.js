window.PoolGame = {
  init() {
    this.config = window.PoolConfig;
    this.canvas = document.getElementById("pool-table");
    this.ctx = this.canvas.getContext("2d");
    this.status = document.getElementById("status");
    this.modeTitle = document.getElementById("game-mode-title");
    this.modeHint = document.getElementById("game-hint");
    this.aiming = false;
    this.animationStarted = false;
    this.start("quick");
    window.PoolInput.attach(this);
  },

  start(mode) {
    this.mode = mode;
    this.modeTitle.textContent = mode === "practice" ? "🎯 Practice" : "⚡ Quick Play";
    this.modeHint.textContent = "Drag backward from the cue ball and release to shoot.";
    this.newRack();
  },

  newRack() {
    const c = this.config;
    this.cue = { x: 260, y: c.canvasHeight / 2, vx: 0, vy: 0, alive: true };
    this.balls = [];

    const colors = [
      "#facc15", "#38bdf8", "#ef4444", "#a855f7", "#f97316",
      "#22c55e", "#ec4899", "#14b8a6", "#f59e0b", "#e5e7eb",
      "#60a5fa", "#f43f5e", "#c084fc", "#fb923c", "#4ade80"
    ];

    let number = 0;
    for (let row = 0; row < 5; row++) {
      for (let column = 0; column <= row; column++) {
        this.balls.push({
          x: 700 + row * 23,
          y: 280 + (column - row / 2) * 28,
          vx: 0,
          vy: 0,
          color: colors[number % colors.length],
          number: ++number,
          alive: true
        });
      }
    }

    this.aiming = false;
    this.setStatus("Pull back from the cue ball to line up your shot.");
  },

  allBalls() {
    return (this.cue.alive ? [this.cue] : [])
      .concat(this.balls.filter(ball => ball.alive));
  },

  allStopped() {
    return this.allBalls().every(ball => window.PoolPhysics.speed(ball) < 0.1);
  },

  pointerPosition(event) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * this.config.canvasWidth / rect.width,
      y: (event.clientY - rect.top) * this.config.canvasHeight / rect.height
    };
  },

  setStatus(message) {
    this.status.textContent = message;
  },

  update() {
    const activeBalls = this.allBalls();

    window.PoolPhysics.update(activeBalls, this.config);

    for (const ball of activeBalls) {
      for (const [px, py] of this.config.pockets) {
        if (Math.hypot(ball.x - px, ball.y - py) < 25) {
          ball.alive = false;
          ball.vx = 0;
          ball.vy = 0;

          if (ball === this.cue) {
            this.setStatus("Scratch! Press New Rack to restart.");
          }
          break;
        }
      }
    }
  },

  draw() {
    window.PoolTable.draw(this.ctx, this, this.config);
  },

  loop() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.loop());
  },

  run() {
    if (this.animationStarted) return;
    this.animationStarted = true;
    this.loop();
  }
};