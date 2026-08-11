import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Animated neural-network field: drifting nodes connected by thin gradient
 * lines, gently reacting to the pointer. Client-only (WebGL).
 */
export default function NeuralNetwork() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const count = isCoarse ? 42 : 90;
    const linkDist = isCoarse ? 2.2 : 1.9;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    host.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";

    // --- Deep starfield (static, parallax-rotating) ---
    const starCount = isCoarse ? 320 : 800;
    const starPos = new Float32Array(starCount * 3);
    const starCol = new Float32Array(starCount * 3);
    const white = new THREE.Color("#EAF2FF");
    const iceBlue = new THREE.Color("#8FD8FF");
    const pinkStar = new THREE.Color("#FF9BE0");
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 40;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 24;
      starPos[i * 3 + 2] = -6 - Math.random() * 18;
      const r = Math.random();
      const c = r < 0.08 ? pinkStar : r < 0.24 ? iceBlue : white;
      const b = 0.4 + Math.random() * 0.6;
      starCol[i * 3] = c.r * b;
      starCol[i * 3 + 1] = c.g * b;
      starCol[i * 3 + 2] = c.b * b;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute("color", new THREE.BufferAttribute(starCol, 3));
    const stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({
        size: 0.06,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    scene.add(stars);

    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const violet = new THREE.Color("#8B5BFF");
    const cyan = new THREE.Color("#22E1FF");
    const magenta = new THREE.Color("#FF5FD1");

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
      velocities[i * 3] = (Math.random() - 0.5) * 0.006;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.006;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.003;
      const c =
        Math.random() < 0.28
          ? magenta.clone().lerp(violet, Math.random())
          : violet.clone().lerp(cyan, Math.random());
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    nodeGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const nodes = new THREE.Points(
      nodeGeo,
      new THREE.PointsMaterial({
        size: 0.085,
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    scene.add(nodes);


    const maxLinks = count * 8;
    const linePos = new Float32Array(maxLinks * 6);
    const lineCol = new Float32Array(maxLinks * 6);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePos, 3));
    lineGeo.setAttribute("color", new THREE.BufferAttribute(lineCol, 3));
    const lines = new THREE.LineSegments(
      lineGeo,
      new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    scene.add(lines);

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointerMove = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const resize = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    let raf = 0;
    let visible = true;
    let onScreen = true;
    let frame = 0;
    let last = 0;
    const minDelta = 1000 / 40; // cap at ~40fps — plenty for a drifting field
    const onVis = () => {
      visible = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVis);

    // Stop rendering entirely once the hero is scrolled past.
    const io = new IntersectionObserver((entries) => {
      onScreen = entries[0]?.isIntersecting ?? true;
    });
    io.observe(host);

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible || !onScreen) return;
      if (now - last < minDelta) return;
      last = now;
      frame++;

      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;


      const px = pointer.x * 6;
      const py = pointer.y * 3.4;

      for (let i = 0; i < count; i++) {
        const ix = i * 3;
        positions[ix] = positions[ix]! + velocities[ix]!;
        positions[ix + 1] = positions[ix + 1]! + velocities[ix + 1]!;
        positions[ix + 2] = positions[ix + 2]! + velocities[ix + 2]!;

        if (Math.abs(positions[ix]!) > 7) velocities[ix] = -velocities[ix]!;
        if (Math.abs(positions[ix + 1]!) > 4.2) velocities[ix + 1] = -velocities[ix + 1]!;
        if (Math.abs(positions[ix + 2]!) > 2.2) velocities[ix + 2] = -velocities[ix + 2]!;

        const dx = positions[ix]! - px;
        const dy = positions[ix + 1]! - py;
        const d2 = dx * dx + dy * dy;
        if (d2 < 4 && d2 > 0.0001) {
          const f = (1 - d2 / 4) * 0.012;
          positions[ix] = positions[ix]! + dx * f;
          positions[ix + 1] = positions[ix + 1]! + dy * f;
        }
      }
      nodeGeo.attributes["position"]!.needsUpdate = true;

      // Link recomputation is O(n^2) — run it every other frame.
      if (frame % 2 === 0) {
      let l = 0;
      for (let i = 0; i < count && l < maxLinks; i++) {
        for (let j = i + 1; j < count && l < maxLinks; j++) {
          const ax = positions[i * 3]!;
          const ay = positions[i * 3 + 1]!;
          const az = positions[i * 3 + 2]!;
          const bx = positions[j * 3]!;
          const by = positions[j * 3 + 1]!;
          const bz = positions[j * 3 + 2]!;
          const dx = ax - bx;
          const dy = ay - by;
          const dz = az - bz;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (dist > linkDist) continue;
          const fade = 1 - dist / linkDist;
          const o = l * 6;
          linePos[o] = ax;
          linePos[o + 1] = ay;
          linePos[o + 2] = az;
          linePos[o + 3] = bx;
          linePos[o + 4] = by;
          linePos[o + 5] = bz;
          lineCol[o] = colors[i * 3]! * fade;
          lineCol[o + 1] = colors[i * 3 + 1]! * fade;
          lineCol[o + 2] = colors[i * 3 + 2]! * fade;
          lineCol[o + 3] = colors[j * 3]! * fade;
          lineCol[o + 4] = colors[j * 3 + 1]! * fade;
          lineCol[o + 5] = colors[j * 3 + 2]! * fade;
          l++;
        }
      }
      lineGeo.setDrawRange(0, l * 2);
      lineGeo.attributes["position"]!.needsUpdate = true;
      lineGeo.attributes["color"]!.needsUpdate = true;
      }

      nodes.rotation.y = pointer.x * 0.12;
      nodes.rotation.x = -pointer.y * 0.08;
      lines.rotation.copy(nodes.rotation);

      // Slow galactic drift + gentle parallax on the far starfield
      stars.rotation.z += 0.00012;
      stars.rotation.y = pointer.x * 0.03;
      stars.rotation.x = -pointer.y * 0.02;
      const tw = 0.75 + Math.sin(performance.now() * 0.0009) * 0.15;
      (stars.material as THREE.PointsMaterial).opacity = tw;

      renderer.render(scene, camera);

    };
    tick(performance.now());

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVis);
      ro.disconnect();
      io.disconnect();
      nodeGeo.dispose();
      lineGeo.dispose();
      starGeo.dispose();
      (nodes.material as THREE.Material).dispose();
      (lines.material as THREE.Material).dispose();
      (stars.material as THREE.Material).dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={hostRef} className="absolute inset-0" aria-hidden="true" />;
}
