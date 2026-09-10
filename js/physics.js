/*
 * Pool Physics
 * ------------
 * This file controls ONLY how balls move and collide.
 *
 * Main ideas:
 * 1. Friction gradually slows rolling balls.
 * 2. Rails bounce the balls.
 * 3. Ball collisions use an impulse so momentum is transferred.
 * 4. Several small physics steps per frame reduce tunneling at high speed.
 */

window.PoolPhysics = {
  // Return the current speed of a ball.
  speed(ball) {
    return Math.hypot(ball.vx, ball.vy);
  },

  // Move every ball for one small physics step.
  moveBalls(balls, config, dt) {
    const friction = Math.pow(config.friction, dt * 60);

    for (const ball of balls) {
      if (!ball.alive) continue;

      ball.x += ball.vx * dt * 60;
      ball.y += ball.vy * dt * 60;

      // Rolling resistance.
      ball.vx *= friction;
      ball.vy *= friction;

      // Prevent tiny floating-point movement.
      if (this.speed(ball) < 0.035) {
        ball.vx = 0;
        ball.vy = 0;
      }
    }
  },

  // Bounce balls off the wooden cushions.
  bounceOffRails(balls, config) {
    const r = config.ballRadius;
    const rail = config.rail;
    const restitution = 0.88;

    for (const ball of balls) {
      if (!ball.alive) continue;

      if (ball.x - r < rail.x) {
        ball.x = rail.x + r;
        ball.vx = Math.abs(ball.vx) * restitution;
      }

      if (ball.x + r > rail.x + rail.width) {
        ball.x = rail.x + rail.width - r;
        ball.vx = -Math.abs(ball.vx) * restitution;
      }

      if (ball.y - r < rail.y) {
        ball.y = rail.y + r;
        ball.vy = Math.abs(ball.vy) * restitution;
      }

      if (ball.y + r > rail.y + rail.height) {
        ball.y = rail.y + rail.height - r;
        ball.vy = -Math.abs(ball.vy) * restitution;
      }
    }
  },

  // Resolve one pair of colliding balls.
  resolvePair(a, b, radius) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const distance = Math.hypot(dx, dy);
    const minimumDistance = radius * 2;

    if (distance === 0 || distance >= minimumDistance) return;

    // Direction from ball A to ball B.
    const nx = dx / distance;
    const ny = dy / distance;

    // Separate overlapping balls so they do not stick together.
    const overlap = minimumDistance - distance;
    const separationX = nx * overlap * 0.5;
    const separationY = ny * overlap * 0.5;

    a.x -= separationX;
    a.y -= separationY;
    b.x += separationX;
    b.y += separationY;

    // Relative velocity along the collision normal.
    const relativeVx = b.vx - a.vx;
    const relativeVy = b.vy - a.vy;
    const velocityAlongNormal = relativeVx * nx + relativeVy * ny;

    // They are already moving apart.
    if (velocityAlongNormal > 0) return;

    // Equal-mass billiard balls.
    const restitution = 0.96;
    const impulse = -(1 + restitution) * velocityAlongNormal / 2;

    a.vx -= impulse * nx;
    a.vy -= impulse * ny;
    b.vx += impulse * nx;
    b.vy += impulse * ny;

    // A tiny amount of tangential collision friction makes contacts
    // feel less perfectly "air hockey"-like.
    const tx = -ny;
    const ty = nx;
    const tangentVelocity = (b.vx - a.vx) * tx + (b.vy - a.vy) * ty;
    const tangentImpulse = tangentVelocity * 0.025;

    a.vx += tangentImpulse * tx;
    a.vy += tangentImpulse * ty;
    b.vx -= tangentImpulse * tx;
    b.vy -= tangentImpulse * ty;
  },

  resolveCollisions(balls, radius) {
    for (let i = 0; i < balls.length; i++) {
      if (!balls[i].alive) continue;

      for (let j = i + 1; j < balls.length; j++) {
        if (!balls[j].alive) continue;
        this.resolvePair(balls[i], balls[j], radius);
      }
    }
  },

  // Run several smaller steps each frame.
  // This makes fast shots much less likely to pass through another ball.
  update(balls, config, deltaTime = 1 / 60) {
    const safeDelta = Math.min(Math.max(deltaTime, 0), 0.033);
    const steps = 4;
    const stepTime = safeDelta / steps;

    for (let i = 0; i < steps; i++) {
      this.moveBalls(balls, config, stepTime);
      this.bounceOffRails(balls, config);
      this.resolveCollisions(balls, config.ballRadius);
    }
  }
};