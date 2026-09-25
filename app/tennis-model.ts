import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const TAU = Math.PI * 2;

function tube(points: THREE.Vector3[], radius: number, material: THREE.Material, closed = false) {
  const curve = new THREE.CatmullRomCurve3(points, closed);
  return new THREE.Mesh(new THREE.TubeGeometry(curve, closed ? 192 : 48, radius, 8, closed), material);
}

function cylinderBetween(from: THREE.Vector3, to: THREE.Vector3, radius: number) {
  const direction = to.clone().sub(from);
  const geometry = new THREE.CylinderGeometry(radius, radius, direction.length(), 24);
  geometry.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize()));
  geometry.translate(...from.clone().add(to).multiplyScalar(0.5).toArray());
  return geometry;
}

function headPoint(angle: number) {
  const cosine = Math.cos(angle);
  return new THREE.Vector3(51 * cosine, 38 * Math.sin(angle) * (1 - 0.055 * cosine), 0);
}

function headNormal(angle: number) {
  const tangent = headPoint(angle + 0.0001).sub(headPoint(angle - 0.0001)).normalize();
  return new THREE.Vector3(tangent.y, -tangent.x, 0);
}

function mergedMesh(geometries: THREE.BufferGeometry[], material: THREE.Material, name: string) {
  const mesh = new THREE.Mesh(mergeGeometries(geometries), material);
  geometries.forEach(geometry => geometry.dispose());
  mesh.name = name;
  return mesh;
}

function detailedTube(points: THREE.Vector3[], radius: number, segments: number, closed = false) {
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points, closed), segments, radius, 6, closed);
}

/** Sweep a softly rounded rectangular beam, rather than a circular wire. */
function beamGeometry(pointAt: (t: number) => THREE.Vector3, widthAt: (t: number) => number, depthAt: (t: number) => number, segments = 160, closed = false) {
  const sides = 20;
  const positions: number[] = [];
  const indices: number[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const point = pointAt(t);
    const before = pointAt(closed ? t - 0.0001 : Math.max(0, t - 0.0001));
    const after = pointAt(closed ? t + 0.0001 : Math.min(1, t + 0.0001));
    const tangent = after.sub(before).normalize();
    const normal = new THREE.Vector3(tangent.y, -tangent.x, 0);
    for (let j = 0; j <= sides; j++) {
      const angle = j / sides * TAU;
      const cosine = Math.cos(angle);
      const sine = Math.sin(angle);
      const radial = widthAt(t) * Math.sign(cosine) * Math.abs(cosine) ** 0.65;
      const depth = depthAt(t) * Math.sign(sine) * Math.abs(sine) ** 0.65;
      positions.push(point.x + normal.x * radial, point.y + normal.y * radial, point.z + depth);
      if (i < segments && j < sides) {
        const a = i * (sides + 1) + j;
        const b = a + sides + 1;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
  }
  if (!closed) {
    for (const [ring, direction] of [[0, -1], [segments, 1]]) {
      const centre = pointAt(ring / segments);
      const vertex = positions.length / 3;
      positions.push(centre.x, centre.y, centre.z);
      for (let j = 0; j < sides; j++) {
        const a = ring * (sides + 1) + j;
        indices.push(vertex, a + (direction > 0 ? 1 : 0), a + (direction > 0 ? 0 : 1));
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function gripRadius(x: number, angle: number) {
  // Rounded octagonal flats, with a gradual flare toward the butt cap.
  const flare = THREE.MathUtils.smoothstep(x, 148, 165);
  const apothem = 5.15 + flare * 1.05;
  const octant = ((angle + Math.PI / 8 + TAU) % (Math.PI / 4)) - Math.PI / 8;
  return apothem * (0.15 + 0.85 / Math.cos(octant));
}

function gripGeometry() {
  const positions: number[] = [];
  const indices: number[] = [];
  const rings = 44;
  const sides = 64;
  for (let i = 0; i <= rings; i++) {
    const x = 110 + i / rings * 55;
    for (let j = 0; j <= sides; j++) {
      const angle = j / sides * TAU;
      const radius = gripRadius(x, angle);
      positions.push(x, Math.cos(angle) * radius, Math.sin(angle) * radius);
      if (i < rings && j < sides) {
        const a = i * (sides + 1) + j;
        const b = a + sides + 1;
        indices.push(a, a + 1, b, b, a + 1, b + 1);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export function createRacket() {
  const racket = new THREE.Group();
  racket.name = 'Tennis racket';
  const crimson = new THREE.MeshPhysicalMaterial({ color: 0xba192c, metalness: 0.42, roughness: 0.23, clearcoat: 1, clearcoatRoughness: 0.16 });
  const darkRed = new THREE.MeshStandardMaterial({ color: 0x5b1521, metalness: 0.32, roughness: 0.36 });
  const graphite = new THREE.MeshStandardMaterial({ color: 0x25262a, metalness: 0.1, roughness: 0.7 });
  const silver = new THREE.MeshStandardMaterial({ color: 0xd3d7d9, metalness: 0.72, roughness: 0.3 });
  const stringMaterial = new THREE.MeshStandardMaterial({ color: 0xe9e7de, metalness: 0.12, roughness: 0.65 });
  const white = new THREE.MeshStandardMaterial({ color: 0xeceae5, roughness: 0.88 });
  const gripEdge = new THREE.MeshStandardMaterial({ color: 0xc5c3bb, roughness: 0.94 });

  const frame = new THREE.Mesh(beamGeometry(t => headPoint(t * TAU), () => 1.95, t => 3.7 + 0.2 * Math.cos(t * TAU), 160, true), crimson);
  frame.name = 'Solid hoop';
  racket.add(frame);

  const bumperPoint = (t: number) => {
    const angle = Math.PI * 0.24 + t * Math.PI * 1.52;
    return headPoint(angle).addScaledVector(headNormal(angle), 1.97);
  };
  const bumper = new THREE.Mesh(beamGeometry(bumperPoint, () => 0.18, () => 2.15, 96), graphite);
  bumper.name = 'Recessed bumper channel';
  racket.add(bumper);
  const rails: THREE.BufferGeometry[] = [];
  for (const z of [-2.7, 2.7]) {
    const points = Array.from({ length: 129 }, (_, i) => {
      const angle = Math.PI * 0.24 + i / 128 * Math.PI * 1.52;
      const point = headPoint(angle).addScaledVector(headNormal(angle), 1.7);
      point.z = z;
      return point;
    });
    rails.push(detailedTube(points, 0.22, 128));
  }
  racket.add(mergedMesh(rails, darkRed, 'Bumper edge rails'));

  const innerContour = Array.from({ length: 513 }, (_, i) => headPoint(i / 512 * TAU).addScaledVector(headNormal(i / 512 * TAU), -1.9));
  const spanAt = (axis: 'x' | 'y', value: number) => {
    const other = axis === 'x' ? 'y' : 'x';
    const hits: number[] = [];
    for (let i = 0; i < innerContour.length - 1; i++) {
      const a = innerContour[i];
      const b = innerContour[i + 1];
      if ((a[axis] <= value && b[axis] > value) || (b[axis] <= value && a[axis] > value)) {
        hits.push(a[other] + (value - a[axis]) / (b[axis] - a[axis]) * (b[other] - a[other]));
      }
    }
    return [Math.min(...hits), Math.max(...hits)];
  };
  const mains = Array.from({ length: 16 }, (_, i) => (i - 7.5) * 4.25);
  const crosses = Array.from({ length: 19 }, (_, i) => (i - 9) * 4.75);
  const strings: THREE.BufferGeometry[] = [];
  const eyelets: THREE.BufferGeometry[] = [];
  const seats: THREE.BufferGeometry[] = [];
  const addEyelet = (point: THREE.Vector3, direction: THREE.Vector3) => {
    const rotation = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction);
    const eyelet = new THREE.TorusGeometry(0.36, 0.16, 6, 12);
    eyelet.applyQuaternion(rotation);
    eyelet.translate(...point.toArray());
    eyelets.push(eyelet);
    const seat = new THREE.TorusGeometry(0.55, 0.1, 6, 12);
    seat.applyQuaternion(rotation);
    seat.translate(...point.clone().addScaledVector(direction, 0.12).toArray());
    seats.push(seat);
  };
  mains.forEach((y, i) => {
    const [left, right] = spanAt('y', y);
    const points = [new THREE.Vector3(left, y, 0)];
    crosses.forEach((x, j) => { if (x > left + 0.5 && x < right - 0.5) points.push(new THREE.Vector3(x, y, (i + j) % 2 ? 0.22 : -0.22)); });
    points.push(new THREE.Vector3(right, y, 0));
    strings.push(detailedTube(points, 0.19, points.length * 3));
    addEyelet(points[0], new THREE.Vector3(-1, 0, 0));
    addEyelet(points[points.length - 1], new THREE.Vector3(1, 0, 0));
  });
  crosses.forEach((x, j) => {
    const [bottom, top] = spanAt('x', x);
    const points = [new THREE.Vector3(x, bottom, 0)];
    mains.forEach((y, i) => { if (y > bottom + 0.5 && y < top - 0.5) points.push(new THREE.Vector3(x, y, (i + j) % 2 ? -0.22 : 0.22)); });
    points.push(new THREE.Vector3(x, top, 0));
    strings.push(detailedTube(points, 0.19, points.length * 3));
    addEyelet(points[0], new THREE.Vector3(0, -1, 0));
    addEyelet(points[points.length - 1], new THREE.Vector3(0, 1, 0));
  });
  racket.add(mergedMesh(strings, stringMaterial, 'Woven string bed'));
  racket.add(mergedMesh(eyelets, graphite, 'Individual string eyelets'));
  racket.add(mergedMesh(seats, darkRed, 'Grommet collars'));

  for (const side of [-1, 1]) {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(36.5, side * 25.5, 0),
      new THREE.Vector3(53, side * 20, 0),
      new THREE.Vector3(70, side * 12, 0),
      new THREE.Vector3(86, side * 4.5, 0),
      new THREE.Vector3(98, side * 0.4, 0),
      new THREE.Vector3(105, 0, 0),
    ]);
    const arm = new THREE.Mesh(beamGeometry(t => curve.getPoint(t), t => 1.95 + t * 0.55, t => 3.7 - t * 0.3, 64), crimson);
    arm.name = side < 0 ? 'Lower throat arm' : 'Upper throat arm';
    racket.add(arm);
  }
  racket.add(new THREE.Mesh(cylinderBetween(new THREE.Vector3(102, 0, 0), new THREE.Vector3(111, 0, 0), 3.9), crimson));

  const accents: THREE.BufferGeometry[] = [];
  for (const side of [-1, 1]) {
    const points = Array.from({ length: 25 }, (_, i) => {
      const angle = side * (0.96 + i / 24 * 0.26);
      const point = headPoint(angle);
      point.z = 3.9;
      return point;
    });
    accents.push(detailedTube(points, 0.32, 32));
  }
  racket.add(mergedMesh(accents, silver, 'Plain frame accents'));

  const grip = new THREE.Mesh(gripGeometry(), white);
  grip.name = 'Wrapped grip';
  racket.add(grip);
  const wrap = Array.from({ length: 541 }, (_, i) => {
    const t = i / 540;
    const x = 110.5 + t * 54;
    const angle = t * TAU * 9;
    const radius = gripRadius(x, angle) + 0.03;
    return new THREE.Vector3(x, Math.cos(angle) * radius, Math.sin(angle) * radius);
  });
  const overlap = new THREE.Mesh(detailedTube(wrap, 0.13, 720), gripEdge);
  overlap.name = 'Spiral grip overlap';
  racket.add(overlap);

  const pores: THREE.BufferGeometry[] = [];
  for (let row = 0; row < 24; row++) {
    const x = 112 + row * 2.1;
    for (let face = 0; face < 8; face++) {
      for (const offset of [-0.19, 0, 0.19]) {
        const angle = face * Math.PI / 4 + offset + (row % 2 ? 0.035 : -0.035);
        const normal = new THREE.Vector3(0, Math.cos(face * Math.PI / 4), Math.sin(face * Math.PI / 4));
        const radius = gripRadius(x, angle) + 0.015;
        const pore = new THREE.CircleGeometry(0.075, 6);
        pore.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal));
        pore.translate(x, Math.cos(angle) * radius, Math.sin(angle) * radius);
        pores.push(pore);
      }
    }
  }
  racket.add(mergedMesh(pores, gripEdge, 'Grip perforations'));
  racket.add(new THREE.Mesh(cylinderBetween(new THREE.Vector3(107.5, 0, 0), new THREE.Vector3(110.5, 0, 0), 5.45), darkRed));
  racket.add(new THREE.Mesh(cylinderBetween(new THREE.Vector3(164.5, 0, 0), new THREE.Vector3(166, 0, 0), 6.65), white));
  racket.add(new THREE.Mesh(cylinderBetween(new THREE.Vector3(166, 0, 0), new THREE.Vector3(167, 0, 0), 6.45), graphite));
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
