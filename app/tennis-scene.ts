import * as THREE from 'three';
import { createRacket, createTennisBall } from './tennis-model';
import { createTennisState, stepTennis, TENNIS_STEP } from './tennis-physics';

export type TennisLayout = { width: number; height: number; left: number; top: number; slotWidth: number };
export type TennisScene = { resize: (layout: TennisLayout) => void; setActive: (active: boolean) => void; dispose: () => void };

export function createTennisScene(host: HTMLDivElement, onContextLost: () => void): TennisScene {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.28;
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(0, 1, 1, 0, 0.1, 2000);
  camera.position.set(0, 0, 1000);
  scene.add(new THREE.HemisphereLight(0xe6eeff, 0x39232b, 2.4));
  const key = new THREE.DirectionalLight(0xffffff, 4.5);
  const rim = new THREE.DirectionalLight(0xff7984, 2.8);
  const fill = new THREE.DirectionalLight(0xa9c4ed, 2);
  scene.add(key, key.target, rim, rim.target, fill, fill.target);

  const racket = createRacket();
  const ball = createTennisBall();
  const ballSpin = new THREE.Group();
  ballSpin.add(ball);
  scene.add(racket, ballSpin);
  const shadowMaterial = new THREE.MeshBasicMaterial({ color: 0xc94c60, transparent: true, opacity: 0.22, depthWrite: false });
  const shadow = new THREE.Mesh(new THREE.CircleGeometry(1, 48), shadowMaterial);
  const impactMaterial = new THREE.MeshBasicMaterial({ color: 0xffbac0, transparent: true, opacity: 0, depthWrite: false });
  const impact = new THREE.Mesh(new THREE.RingGeometry(0.8, 1, 48), impactMaterial);
  scene.add(shadow, impact);

  const state = createTennisState();
  // The initial floor pose stays still when reduced motion is requested.
  let layout: TennisLayout | null = null;
  let active = false;
  let disposed = false;
  let lost = false;
  let frame = 0;
  let lastTime = 0;
  let accumulator = 0;
  let spin = 0;
  const clamp = THREE.MathUtils.clamp;

  function render() {
    if (!layout || disposed || lost) return;
    const { width, height, left, top, slotWidth } = layout;
    const radius = clamp(slotWidth * 0.063, 10, 20);
    const scale = slotWidth * 0.91 / 220;
    const floor = 1;
    const headX = left + slotWidth * 0.25;
    const nominalHeadY = height - top - slotWidth * 0.34;
    const travel = Math.max(30, nominalHeadY - floor - 2 * radius);
    const headY = floor + 2 * radius + state.paddleHeight * travel;

    // Swing around the grip: both the head's location and its angle come from
    // the same moving collision surface used by the ball simulation.
    const gripDistance = 153 * scale;
    const gripY = nominalHeadY + 8;
    const tiltY = 0.14;
    const swingAngle = Math.asin(clamp((gripY - headY) / (gripDistance * Math.cos(tiltY)), -0.75, 0.75));
    racket.rotation.set(0.96 + state.paddleVelocity * 0.12, tiltY, swingAngle, 'ZYX');
    racket.scale.setScalar(scale);
    // X rotation doesn't move the local handle axis; use its rotated position
    // to keep the grip planted while the face swings through the ball.
    const grip = new THREE.Vector3(153, 0, 0).multiplyScalar(scale).applyEuler(racket.rotation);
    racket.position.set(headX + gripDistance - grip.x, headY, -grip.z);

    const sinceFloor = state.time - state.lastFloorHit;
    const compression = Math.max(0, 1 - sinceFloor / 0.05) * Math.max(0, 1 - state.ballHeight / 0.09) * 0.17;
    const scaleY = 1 - compression;
    ballSpin.scale.set(radius * (1 + compression * 0.55), radius * scaleY, radius);
    const faceNormal = new THREE.Vector3(0, 0, 1).applyEuler(racket.rotation);
    const ballDepth = racket.position.z + (radius * (1 - Math.abs(faceNormal.y)) - faceNormal.x * (headX - racket.position.x)) / faceNormal.z;
    ballSpin.position.set(headX, floor + radius * scaleY + state.ballHeight * travel, ballDepth);
    ball.rotation.set(spin * 0.35, spin * 0.25, spin);

    const proximity = Math.exp(-state.ballHeight * 5);
    shadow.position.set(headX, 1.5, -2);
    shadow.scale.set(radius * (1.6 - proximity * 0.5), 2.2, 1);
    shadowMaterial.opacity = 0.08 + proximity * 0.32;
    const ripple = Math.max(0, 1 - sinceFloor / 0.18);
    impact.position.set(headX, 1, 0);
    impact.scale.set(radius * (1 + (1 - ripple) * 1.1), 3, 1);
    impactMaterial.opacity = ripple * 0.6;

    camera.left = 0; camera.right = width; camera.top = height; camera.bottom = 0;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
  }

  function tick(now: number) {
    if (!active || disposed) return;
    if (lastTime) accumulator += Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    while (accumulator >= TENNIS_STEP) {
      stepTennis(state);
      spin += state.ballVelocity * TENNIS_STEP * 0.7;
      accumulator -= TENNIS_STEP;
    }
    render();
    frame = requestAnimationFrame(tick);
  }

  function setActive(value: boolean) {
    if (active === value || disposed || (lost && value)) return;
    active = value;
    cancelAnimationFrame(frame);
    lastTime = 0;
    if (active && layout) frame = requestAnimationFrame(tick);
  }

  const contextLost = (event: Event) => {
    event.preventDefault();
    setActive(false);
    lost = true;
    onContextLost();
  };
  renderer.domElement.addEventListener('webglcontextlost', contextLost);

  return {
    setActive,
    resize(next) {
      if (disposed || next.width <= 0 || next.height <= 0) return;
      layout = next;
      renderer.setSize(next.width, next.height, false);
      const x = next.left + next.slotWidth * 0.35;
      const y = next.height - next.top;
      key.position.set(x - 160, y + 220, 320); key.target.position.set(x, y - 100, 0);
      rim.position.set(x + 200, y + 160, -180); rim.target.position.set(x, y - 100, 0);
      fill.position.set(x + 160, y - 160, 240); fill.target.position.set(x, y - 100, 0);
      render();
    },
    dispose() {
      if (disposed) return;
      setActive(false);
      disposed = true;
      renderer.domElement.removeEventListener('webglcontextlost', contextLost);
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      scene.traverse(object => {
        if (object instanceof THREE.Mesh) {
          geometries.add(object.geometry);
          (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => materials.add(material));
        }
      });
      geometries.forEach(geometry => geometry.dispose());
      materials.forEach(material => material.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}
