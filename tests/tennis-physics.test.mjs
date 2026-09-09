import assert from 'node:assert/strict';
import test from 'node:test';
import { createTennisState, stepTennis, TENNIS_STEP, GRAVITY, RACKET_RESTITUTION } from '../app/tennis-physics.ts';
import { createRacket, createTennisBall } from '../app/tennis-model.ts';
import { Box3, Raycaster, Vector3 } from 'three';

test('the ball accelerates under gravity between contacts', () => {
  const state = createTennisState();
  state.ballHeight = 0.5;
  state.ballVelocity = -0.2;
  for (let i = 0; i < 24; i++) stepTennis(state);
  assert.ok(Math.abs(state.ballVelocity - (-0.2 - GRAVITY * 0.1)) < 1e-10);
  assert.ok(Math.abs(state.ballHeight - (0.5 - 0.2 * 0.1 - 0.5 * GRAVITY * 0.1 ** 2)) < 1e-10);
});

function simulate(strength, seconds = 30) {
  const state = createTennisState();
  state.ballHeight = 0;
  const outgoing = [];
  let hits = 0;
  for (let i = 0; i < seconds / TENNIS_STEP; i++) {
    stepTennis(state, TENNIS_STEP, strength);
    assert.ok(Number.isFinite(state.ballHeight));
    assert.ok(state.ballHeight >= 0, 'ball must not pass through the floor');
    assert.ok(state.ballHeight <= state.paddleHeight + 0.01, 'ball must not pass through the racket');
    if (state.racketHits !== hits) {
      hits = state.racketHits;
      assert.ok(state.impact.racket < 0, 'the racket should be swinging down at contact');
      assert.ok(state.impact.outgoing < 0, 'the hit should send the ball toward the floor');
      const expected = (1 + RACKET_RESTITUTION) * state.impact.racket - RACKET_RESTITUTION * state.impact.incoming;
      assert.ok(Math.abs(state.ballVelocity - expected) < 1e-10);
      outgoing.push(-state.ballVelocity);
    }
  }
  return { state, averageSpeed: outgoing.slice(5).reduce((sum, value) => sum + value, 0) / (outgoing.length - 5) };
}

test('repeated racket and floor contacts stay stable and share one collision state', () => {
  const { state } = simulate(1, 60);
  assert.ok(state.racketHits > 60);
  assert.ok(Math.abs(state.racketHits - state.floorHits) <= 1);
});

test('a faster swing produces a faster ball and more frequent floor bounces', () => {
  const gentle = simulate(0.85);
  const firm = simulate(1.15);
  assert.ok(firm.averageSpeed > gentle.averageSpeed * 1.2);
  assert.ok(firm.state.floorHits > gentle.state.floorHits);
});

test('the racket has a solid 3D frame, open centre, strings and volume in the grip', () => {
  const racket = createRacket();
  racket.updateMatrixWorld(true);
  const frame = racket.getObjectByName('Solid hoop');
  const bounds = new Box3().setFromObject(frame).getSize(new Vector3());
  assert.ok(bounds.z > 6);
  const ray = new Raycaster(new Vector3(0, 0, 30), new Vector3(0, 0, -1));
  assert.equal(ray.intersectObject(frame).length, 0, 'the hoop centre should be open');
  ray.set(new Vector3(48, 0, 30), new Vector3(0, 0, -1));
  assert.ok(ray.intersectObject(frame).length > 0, 'the frame should have an actual front surface');
  const grip = new Box3().setFromObject(racket.getObjectByName('Wrapped grip')).getSize(new Vector3());
  assert.ok(grip.y > 9 && grip.z > 9);
  assert.ok(racket.getObjectByName('Woven string bed').geometry.attributes.position.count > 100);
  const ball = new Box3().setFromObject(createTennisBall()).getSize(new Vector3());
  assert.ok(ball.x >= 2 && ball.y >= 2 && ball.z >= 2);
});
