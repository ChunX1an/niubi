window.PoolPhysics = {
  speed(ball) {
    return Math.hypot(ball.vx, ball.vy);
  },

  moveBalls(balls, config) {
    for (const ball of balls) {
      ball.x += ball.vx;
      ball.y += ball.vy;
      ball.vx *= config.friction;
      ball.vy *= config.friction;

      if (this.speed(ball) < 0.03) {
        ball.vx = 0;
        ball.vy = 0;
      }
    }
  },

  bounceOffRails(balls, config) {
    for (const ball of balls) {
      const r = config.ballRadius;
      const rail = config.rail;

      if (ball.x - r < rail.x) {
        ball.x = rail.x + r;
        ball.vx = Math.abs(ball.vx) * 0.94;
      }
      if (ball.x + r > rail.x + rail.width) {
        ball.x = rail.x + rail.width - r;
        ball.vx = -Math.abs(ball.vx) * 0.94;
      }
      if (ball.y - r < rail.y) {
        ball.y = rail.y + r;
        ball.vy = Math.abs(ball.vy) * 0.94;
      }
      if (ball.y + r > rail.y + rail.height) {
        ball.y = rail.y + rail.height - r;
        ball.vy = -Math.abs(ball.vy) * 0.94;
      }
    }
  },

  resolveCollisions(balls, radius) {
    for (let i = 0; i < balls.length; i++) {
      for (let j = i + 1; j < balls.length; j++) {
        const a = balls[i];
        const b = balls[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const distance = Math.hypot(dx, dy);

        if (distance === 0 || distance >= radius * 2) continue;

        const nx = dx / distance;
        const ny = dy / distance;
        const overlap = (radius * 2 - distance) / 2;

        a.x -= nx * overlap;
        a.y -= ny * overlap;
        b.x += nx * overlap;
        b.y += ny * overlap;

        const relativeX = a.vx - b.vx;
        const relativeY = a.vy - b.vy;
        const relativeVelocity = relativeX * nx + relativeY * ny;

        if (relativeVelocity > 0) {
          a.vx -= relativeVelocity * nx;
          a.vy -= relativeVelocity * ny;
          b.vx += relativeVelocity * nx;
          b.vy += relativeVelocity * ny;
        }
      }
    }
  },

  update(balls, config) {
    this.moveBalls(balls, config);
    this.bounceOffRails(balls, config);
    this.resolveCollisions(balls, config.ballRadius);
  }
};