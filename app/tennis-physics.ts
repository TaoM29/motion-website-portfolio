export const TENNIS_STEP = 1 / 240;
export const GRAVITY = 5.2;
export const FLOOR_RESTITUTION = 0.86;
export const RACKET_RESTITUTION = 0.78;

export type TennisState = {
  time: number;
  ballHeight: number;
  ballVelocity: number;
  paddleHeight: number;
  paddleVelocity: number;
  swingVelocity: number;
  phase: 'recover' | 'strike' | 'follow';
  floorHits: number;
  racketHits: number;
  lastFloorHit: number;
  lastRacketHit: number;
  floorSpeed: number;
  impact: { incoming: number; racket: number; outgoing: number } | null;
};

// Heights are relative to the floor and nominal contact height, so resizing
// changes only the projection, never the state or timing of a bounce.
export function createTennisState(): TennisState {
  return {
    time: 0, ballHeight: 0, ballVelocity: 3.8,
    paddleHeight: 1.08, paddleVelocity: 0, swingVelocity: 0,
    phase: 'recover', floorHits: 0, racketHits: 0,
    lastFloorHit: -10, lastRacketHit: -10, floorSpeed: 0, impact: null,
  };
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function stepTennis(state: TennisState, dt = TENNIS_STEP, strength = 1) {
  const previousGap = state.paddleHeight - state.ballHeight;
  state.time += dt;
  const rising = state.ballVelocity > 0;
  const apex = state.ballHeight + Math.max(0, state.ballVelocity) ** 2 / (2 * GRAVITY);
  const readyHeight = rising ? clamp(apex - 0.035, 0.65, 1.08) : 1.08;

  if (state.phase === 'recover' && rising && state.time - state.lastRacketHit > 0.2) {
    const contactHeight = Math.min(state.paddleHeight, readyHeight);
    const incoming = Math.sqrt(Math.max(0, state.ballVelocity ** 2 - 2 * GRAVITY * Math.max(0, contactHeight - state.ballHeight)));
    const timeToContact = (state.ballVelocity - incoming) / GRAVITY;
    if (state.ballHeight > 0.45 && timeToContact < 0.16) {
      // Plan the wrist speed, then let the moving-surface collision determine
      // the outgoing ball speed. The ball never follows a keyframed path.
      const desiredDownSpeed = 2.5 * strength;
      state.swingVelocity = clamp((-desiredDownSpeed + RACKET_RESTITUTION * incoming) / (1 + RACKET_RESTITUTION), -1.6, -0.15);
      state.phase = 'strike';
    }
  }

  if (state.phase === 'strike') {
    state.paddleVelocity += (state.swingVelocity - state.paddleVelocity) * (1 - Math.exp(-dt / 0.028));
  } else if (state.phase === 'follow') {
    state.paddleVelocity *= Math.exp(-10 * dt);
    if (state.time - state.lastRacketHit > 0.085) state.phase = 'recover';
  } else {
    state.paddleVelocity += (80 * (readyHeight - state.paddleHeight) - 18 * state.paddleVelocity) * dt;
  }
  state.paddleHeight += state.paddleVelocity * dt;
  state.ballHeight += state.ballVelocity * dt - 0.5 * GRAVITY * dt * dt;
  state.ballVelocity -= GRAVITY * dt;

  if (state.ballHeight <= 0 && state.ballVelocity < 0) {
    state.ballHeight = 0;
    state.floorSpeed = -state.ballVelocity;
    state.ballVelocity *= -FLOOR_RESTITUTION;
    state.lastFloorHit = state.time;
    state.floorHits += 1;
  }

  const gap = state.paddleHeight - state.ballHeight;
  if (previousGap >= 0 && gap <= 0 && state.ballVelocity > state.paddleVelocity && state.ballVelocity > 0 && state.time - state.lastRacketHit > 0.15) {
    const incoming = state.ballVelocity;
    const outgoing = (1 + RACKET_RESTITUTION) * state.paddleVelocity - RACKET_RESTITUTION * incoming;
    state.ballHeight = state.paddleHeight;
    state.ballVelocity = outgoing;
    state.impact = { incoming, racket: state.paddleVelocity, outgoing };
    state.lastRacketHit = state.time;
    state.racketHits += 1;
    state.phase = 'follow';
  }
}
