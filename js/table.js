window.PoolTable = {
  draw(ctx, game, config) {
    const { canvasWidth: W, canvasHeight: H, ballRadius: r, rail, pockets } = config;

    ctx.clearRect(0, 0, W, H);

    ctx.fillStyle = "#713f12";
    ctx.fillRect(18, 18, W - 36, H - 36);

    ctx.fillStyle = "#07553f";
    ctx.fillRect(rail.x, rail.y, rail.width, rail.height);

    ctx.fillStyle = "#0b3b30";
    ctx.fillRect(rail.x + 18, rail.y + 18, rail.width - 36, rail.height - 36);

    for (const [px, py] of pockets) {
      ctx.beginPath();
      ctx.arc(px, py, 25, 0, Math.PI * 2);
      ctx.fillStyle = "#020617";
      ctx.fill();
    }

    for (const ball of game.balls) {
      if (ball.alive) this.drawBall(ctx, ball, r, game.cue);
    }

    if (game.cue.alive) this.drawBall(ctx, game.cue, r, game.cue);
    this.drawAim(ctx, game, config);
  },

  drawBall(ctx, ball, radius, cue) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,.45)";
    ctx.stroke();

    if (ball !== cue) {
      ctx.fillStyle = "rgba(0,0,0,.65)";
      ctx.font = "9px system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(ball.number, ball.x, ball.y);
    }
  },

  drawAim(ctx, game, config) {
    if (!game.aiming || !game.cue.alive || !game.allStopped()) return;

    const dx = game.cue.x - game.aimPoint.x;
    const dy = game.cue.y - game.aimPoint.y;
    const distance = Math.hypot(dx, dy);
    if (distance < 1) return;

    const nx = dx / distance;
    const ny = dy / distance;
    const pull = Math.min(85, distance);
    const back = 28 + pull;

    const tipX = game.cue.x - nx * back;
    const tipY = game.cue.y - ny * back;
    const tailX = tipX - nx * 360;
    const tailY = tipY - ny * 360;

    ctx.save();
    ctx.lineCap = "round";

    ctx.lineWidth = 7;
    ctx.strokeStyle = "#d6a96b";
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(tipX, tipY);
    ctx.stroke();

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#f5f5f5";
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(game.cue.x, game.cue.y);
    ctx.stroke();

    ctx.setLineDash([8, 8]);
    ctx.strokeStyle = "rgba(255,255,255,.72)";
    ctx.beginPath();
    ctx.moveTo(game.cue.x, game.cue.y);
    ctx.lineTo(game.cue.x + nx * 420, game.cue.y + ny * 420);
    ctx.stroke();
    ctx.restore();

    const power = Math.min(100, Math.round(distance * 100 / 170));
    const rail = config.rail;
    ctx.fillStyle = "rgba(255,255,255,.18)";
    ctx.fillRect(rail.x, rail.y - 25, rail.width, 6);
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(rail.x, rail.y - 25, rail.width * power / 100, 6);
  }
};