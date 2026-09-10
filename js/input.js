window.PoolInput = {
  attach(game) {
    const canvas = game.canvas;

    canvas.addEventListener("pointerdown", (event) => {
      if (!game.cue.alive || !game.allStopped()) return;

      const point = game.pointerPosition(event);
      const nearCue = Math.hypot(point.x - game.cue.x, point.y - game.cue.y) < 55;

      if (nearCue) {
        game.aiming = true;
        game.aimPoint = point;
        canvas.setPointerCapture(event.pointerId);
        game.setStatus("Move farther back for more power.");
      }
    });

    canvas.addEventListener("pointermove", (event) => {
      if (!game.aiming) return;

      game.aimPoint = game.pointerPosition(event);

      const distance = Math.hypot(
        game.aimPoint.x - game.cue.x,
        game.aimPoint.y - game.cue.y
      );
      const power = Math.min(100, Math.round(distance * 100 / 170));
      game.setStatus(`Power: ${power}% — release to shoot.`);
    });

    canvas.addEventListener("pointerup", (event) => {
      if (!game.aiming) return;

      game.aiming = false;

      const point = game.pointerPosition(event);
      const dx = game.cue.x - point.x;
      const dy = game.cue.y - point.y;
      const distance = Math.hypot(dx, dy);

      if (distance <= 5) return;

      const power = Math.min(game.config.maxPower, distance * 5);
      const scale = power / distance;

      game.cue.vx = dx * scale;
      game.cue.vy = dy * scale;
      game.setStatus("Shot!");
    });
  }
};