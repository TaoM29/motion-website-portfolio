import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const TAU = Math.PI * 2;

function tube(points: THREE.Vector3[], radius: number, material: THREE.Material, closed = false) {
  const curve = new THREE.CatmullRomCurve3(points, closed);
  return new THREE.Mesh(new THREE.TubeGeometry(curve, closed ? 192 : 48, radius, 8, closed), material);
}

function cylinderBetween(from: THREE.Vector3, to: THREE.Vector3, radius: number) {
  const direction = to.clone().sub(from);
  const geometry = new THREE.CylinderGeometry(radius, radius, direction.length(), 6);
  geometry.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize()));
  geometry.translate(...from.clone().add(to).multiplyScalar(0.5).toArray());
  return geometry;
}

/** A solid, bevelled hoop with a hollow throat and individually modelled strings. */
export function createRacket() {
  const racket = new THREE.Group();
  racket.name = 'Tennis racket';
  const crimson = new THREE.MeshPhysicalMaterial({ color: 0xb92238, metalness: 0.35, roughness: 0.28, clearcoat: 0.8, clearcoatRoughness: 0.2 });
  const graphite = new THREE.MeshStandardMaterial({ color: 0x24252a, metalness: 0.35, roughness: 0.42 });
  const silver = new THREE.MeshStandardMaterial({ color: 0xc9c8bd, metalness: 0.25, roughness: 0.55 });
  const white = new THREE.MeshStandardMaterial({ color: 0xe9e5dc, roughness: 0.86 });
  const gripEdge = new THREE.MeshStandardMaterial({ color: 0xb9b7af, roughness: 0.9 });

  const hoop = new THREE.Shape();
  hoop.absellipse(0, 0, 50, 35, 0, TAU, false, 0);
  const hole = new THREE.Path();
  hole.absellipse(0, 0, 45, 30, 0, TAU, true, 0);
  hoop.holes.push(hole);
  const frameGeometry = new THREE.ExtrudeGeometry(hoop, { depth: 5, bevelEnabled: true, bevelThickness: 0.9, bevelSize: 0.75, bevelSegments: 3, steps: 1, curveSegments: 64 });
  frameGeometry.translate(0, 0, -2.5);
  const frame = new THREE.Mesh(frameGeometry, crimson);
  frame.name = 'Solid hoop';
  racket.add(frame);

  const bumper = Array.from({ length: 65 }, (_, index) => {
    const angle = Math.PI * 0.32 + index / 64 * Math.PI * 1.36;
    return new THREE.Vector3(50.6 * Math.cos(angle), 35.6 * Math.sin(angle), 0);
  });
  racket.add(tube(bumper, 1.2, graphite));

  const strings: THREE.BufferGeometry[] = [];
  for (let x = -40; x <= 40; x += 5) {
    const y = 30 * Math.sqrt(1 - (x / 45) ** 2);
    strings.push(cylinderBetween(new THREE.Vector3(x, -y, 0.2), new THREE.Vector3(x, y, 0.2), 0.24));
  }
  for (let y = -25; y <= 25; y += 5) {
    const x = 45 * Math.sqrt(1 - (y / 30) ** 2);
    strings.push(cylinderBetween(new THREE.Vector3(-x, y, -0.2), new THREE.Vector3(x, y, -0.2), 0.24));
  }
  const stringBed = new THREE.Mesh(mergeGeometries(strings), silver);
  stringBed.name = 'Woven string bed';
  racket.add(stringBed);
  strings.forEach(geometry => geometry.dispose());

  for (const side of [-1, 1]) {
    racket.add(tube([
      new THREE.Vector3(31, side * 27, 0),
      new THREE.Vector3(54, side * 20, 0),
      new THREE.Vector3(78, side * 6, 0),
      new THREE.Vector3(101, side * 3, 0),
    ], 2.6, crimson));
  }
  racket.add(tube([new THREE.Vector3(58, -17, 0), new THREE.Vector3(62, 0, 0), new THREE.Vector3(58, 17, 0)], 2.1, crimson));
  racket.add(new THREE.Mesh(cylinderBetween(new THREE.Vector3(91, 0, 0), new THREE.Vector3(117, 0, 0), 3.9), crimson));

  const grip = new THREE.Mesh(cylinderBetween(new THREE.Vector3(110, 0, 0), new THREE.Vector3(164, 0, 0), 5.7), white);
  grip.name = 'Wrapped grip';
  racket.add(grip);
  const wrap = Array.from({ length: 241 }, (_, index) => {
    const t = index / 240;
    return new THREE.Vector3(111 + t * 52, Math.cos(t * TAU * 9) * 5.7, Math.sin(t * TAU * 9) * 5.7);
  });
  racket.add(tube(wrap, 0.35, gripEdge));
  racket.add(new THREE.Mesh(cylinderBetween(new THREE.Vector3(164, 0, 0), new THREE.Vector3(168, 0, 0), 6.4), graphite));
  racket.add(new THREE.Mesh(cylinderBetween(new THREE.Vector3(107, 0, 0), new THREE.Vector3(111, 0, 0), 5.6), graphite));
  return racket;
}

export function createTennisBall() {
  const ball = new THREE.Group();
  const felt = new THREE.MeshPhysicalMaterial({ color: 0xb4182d, roughness: 1, metalness: 0, sheen: 1, sheenColor: 0xe64954, sheenRoughness: 1 });
  ball.add(new THREE.Mesh(new THREE.SphereGeometry(1, 40, 28), felt));
  const seam = Array.from({ length: 96 }, (_, index) => {
    const angle = index / 96 * TAU;
    const latitude = 0.58 * Math.sin(angle * 2);
    return new THREE.Vector3(Math.cos(latitude) * Math.cos(angle), Math.sin(latitude), Math.cos(latitude) * Math.sin(angle)).multiplyScalar(1.002);
  });
  ball.add(tube(seam, 0.025, new THREE.MeshStandardMaterial({ color: 0xe7dfc9, roughness: 0.92 }), true));
  return ball;
}
