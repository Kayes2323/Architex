import { useState, useEffect, useRef } from "react";
import * as THREE from "three";

const SC = 0.3; // scene units per foot

const PRESETS = {
  building: { label: "ভবন", w: 15, d: 15, h: 20, color: "#f3ead9" },
  cowshed: { label: "গরুর ফার্ম", w: 40, d: 22, h: 15, color: "#c9765a" },
  goatplatform: { label: "ছাগলের ফার্ম", w: 20, d: 45, h: 8, color: "#9a7a52" },
  cow: { label: "গরু", w: 6, d: 9, h: 5, color: "#8a5a3a" },
  goat: { label: "ছাগল", w: 3, d: 4, h: 3.2, color: "#d8d2c3" },
  wall: { label: "দেয়াল", w: 20, d: 1, h: 5, color: "#ffffff" },
  fence: { label: "নেট বেড়া (এক্সপ্যান্ডযোগ্য)", w: 30, d: 1, h: 5, color: "#9a9a9a" },
  gate: { label: "গেট (আসল রঙে)", w: 10, d: 1.5, h: 7, color: "#a5453a" },
  road: { label: "রাস্তা", w: 10, d: 30, h: 0.25, color: "#4a4a4a" },
  pond: { label: "পুকুর", w: 20, d: 12, h: 0.3, color: "#4a90a4" },
  tree: { label: "গাছ", w: 6, d: 6, h: 8, color: "#4a7a3a" },
  box: { label: "কাস্টম বক্স", w: 10, d: 10, h: 10, color: "#9a9a9a" },
};

const COLOR_SWATCHES = ["#f3ead9", "#ffffff", "#3fb6a3", "#a5453a", "#c9765a", "#aeb4b8", "#9a7a52", "#6b4a2c", "#4a4a4a", "#4a90a4", "#4a7a3a", "#8a5a3a", "#d8d2c3", "#e8c94a", "#9a9a9a", "#2b2620"];

function makeGrassTexture() {
  const size = 256;
  const c = document.createElement("canvas"); c.width = size; c.height = size;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#8fbf6f"; ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * size, y = Math.random() * size;
    const g = 90 + Math.floor(Math.random() * 60);
    ctx.fillStyle = `rgba(${50 + Math.random() * 30},${100 + g * 0.5},${40 + Math.random() * 30},0.55)`;
    ctx.fillRect(x, y, 2, 2);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}
function makeSoilTexture() {
  const size = 256;
  const c = document.createElement("canvas"); c.width = size; c.height = size;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#e4d3ac"; ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 3000; i++) {
    const x = Math.random() * size, y = Math.random() * size;
    ctx.fillStyle = `rgba(${140 + Math.random() * 50},${110 + Math.random() * 40},${70 + Math.random() * 30},0.5)`;
    ctx.fillRect(x, y, 1.6, 1.6);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}
function makeNetTexture() {
  const size = 128;
  const c = document.createElement("canvas"); c.width = size; c.height = size;
  const ctx = c.getContext("2d");
  ctx.clearRect(0, 0, size, size);
  ctx.strokeStyle = "rgba(90,90,90,0.9)";
  ctx.lineWidth = 2.2;
  const step = 18;
  for (let x = -size; x < size * 2; x += step) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + size, size); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x, size); ctx.lineTo(x - size, size); ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}
function stdMat(color, roughness, metalness) {
  return new THREE.MeshStandardMaterial({ color, roughness: roughness === undefined ? 0.85 : roughness, metalness: metalness === undefined ? 0.05 : metalness });
}
function mkMesh(geo, mat) {
  const m = new THREE.Mesh(geo, mat);
  m.castShadow = true; m.receiveShadow = true;
  return m;
}

function defaultObjects() {
  return [
    { id: "building1", type: "building", label: "ভবন", xFt: -67.5, zFt: 30, wFt: 15, dFt: 15, hFt: 20, color: "#f3ead9", rotY: 0 },
    { id: "goat1", type: "goatplatform", label: "ছাগলের ফার্ম", xFt: -47.5, zFt: 2, wFt: 20, dFt: 45, hFt: 8, color: "#9a7a52", rotY: 0 },
    { id: "cow1", type: "cowshed", label: "গরুর ফার্ম", xFt: 5, zFt: 6, wFt: 40, dFt: 22, hFt: 15, color: "#c9765a", rotY: 0 },
    { id: "gate1", type: "gate", label: "গেট", xFt: 0, zFt: 43.5, wFt: 10, dFt: 1.5, hFt: 7, color: "#a5453a", rotY: 0 },
    { id: "fenceL", type: "fence", label: "নেট বেড়া (বাম)", xFt: -37, zFt: 43.5, wFt: 76, dFt: 1, hFt: 5, color: "#9a9a9a", rotY: 0 },
    { id: "fenceR", type: "fence", label: "নেট বেড়া (ডান)", xFt: 37, zFt: 43.5, wFt: 76, dFt: 1, hFt: 5, color: "#9a9a9a", rotY: 0 },
    { id: "road1", type: "road", label: "রাস্তা", xFt: 0, zFt: 20, wFt: 10, dFt: 35, hFt: 0.25, color: "#4a4a4a", rotY: 0 },
    { id: "pond1", type: "pond", label: "পুকুর", xFt: 10, zFt: -52, wFt: 26, dFt: 10, hFt: 0.3, color: "#4a90a4", rotY: 0 },
    { id: "tree1", type: "tree", label: "গাছ", xFt: -80, zFt: 0, wFt: 6, dFt: 6, hFt: 8, color: "#4a7a3a", rotY: 0 },
    { id: "tree2", type: "tree", label: "গাছ", xFt: 80, zFt: 0, wFt: 6, dFt: 6, hFt: 8, color: "#4a7a3a", rotY: 0 },
    { id: "cowA1", type: "cow", label: "গরু", xFt: 0, zFt: -3, wFt: 6, dFt: 9, hFt: 5, color: "#8a5a3a", rotY: 20 },
    { id: "cowA2", type: "cow", label: "গরু", xFt: 12, zFt: -3, wFt: 6, dFt: 9, hFt: 5, color: "#6b4a30", rotY: -15 },
    { id: "goatA1", type: "goat", label: "ছাগল", xFt: -47, zFt: -14, wFt: 3, dFt: 4, hFt: 3.2, color: "#d8d2c3", rotY: 10 },
    { id: "goatA2", type: "goat", label: "ছাগল", xFt: -43, zFt: -18, wFt: 3, dFt: 4, hFt: 3.2, color: "#5c5548", rotY: -30 },
  ];
}

let idCounter = 1;
function newId() { idCounter += 1; return "obj" + idCounter + "_" + Date.now().toString(36); }

const ENABLE_LOCAL_STORAGE = true; // this is your own deployed app, so browser storage is safe to use here
const STORAGE_KEY = "farm-3d-design-v1";

export default function FarmDesigner() {
  const mountRef = useRef(null);
  const threeRef = useRef({});
  const groupsMapRef = useRef({});
  const [plot, setPlot] = useState({ wFt: 150, dFt: 87 });
  const [objects, setObjects] = useState(defaultObjects());
  const [selectedId, setSelectedId] = useState(null);
  const [placing, setPlacing] = useState(null);
  const [touring, setTouring] = useState(false);
  const [tourLabel, setTourLabel] = useState("");
  const [saveMsg, setSaveMsg] = useState("");
  const fileInputRef = useRef(null);

  // ---------- init three.js once ----------
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const W = mount.clientWidth, H = mount.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xbfe3ef);
    scene.fog = new THREE.Fog(0xbfe3ef, 60, 160);

    const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const sun = new THREE.DirectionalLight(0xfff2d9, 0.95);
    sun.position.set(28, 42, 18);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1536, 1536);
    sun.shadow.camera.left = -55; sun.shadow.camera.right = 55;
    sun.shadow.camera.top = 55; sun.shadow.camera.bottom = -55;
    sun.shadow.camera.near = 1; sun.shadow.camera.far = 140;
    sun.shadow.bias = -0.0015;
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0xd9ecff, 0.3);
    fill.position.set(-24, 18, -26);
    scene.add(fill);

    const groundGroup = new THREE.Group();
    const objectsGroup = new THREE.Group();
    scene.add(groundGroup);
    scene.add(objectsGroup);

    const raycaster = new THREE.Raycaster();
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

    let radius = 70, theta = Math.PI * 0.28, phi = 1.0;
    let targetRadius = radius, targetTheta = theta, targetPhi = phi;
    const target = new THREE.Vector3(0, 3, -2);
    function updateCamera() {
      camera.position.x = target.x + radius * Math.sin(phi) * Math.sin(theta);
      camera.position.z = target.z + radius * Math.sin(phi) * Math.cos(theta);
      camera.position.y = target.y + radius * Math.cos(phi);
      camera.lookAt(target);
    }
    updateCamera();

    function ndcFromClient(clientX, clientY) {
      const rect = renderer.domElement.getBoundingClientRect();
      return {
        x: ((clientX - rect.left) / rect.width) * 2 - 1,
        y: -((clientY - rect.top) / rect.height) * 2 + 1,
      };
    }
    function groundPointFromClient(clientX, clientY) {
      const ndc = ndcFromClient(clientX, clientY);
      raycaster.setFromCamera(ndc, camera);
      const pt = new THREE.Vector3();
      raycaster.ray.intersectPlane(groundPlane, pt);
      return pt;
    }
    function findOwner(obj3d) {
      let o = obj3d;
      while (o) {
        if (o.userData && o.userData.id) return o.userData.id;
        o = o.parent;
      }
      return null;
    }
    function pickObjectAt(clientX, clientY) {
      const ndc = ndcFromClient(clientX, clientY);
      raycaster.setFromCamera(ndc, camera);
      const hits = raycaster.intersectObjects(objectsGroup.children, true);
      if (hits.length > 0) return findOwner(hits[0].object);
      return null;
    }

    let mode = null; // 'camera' | 'object'
    let draggingId = null;
    let lastX = 0, lastY = 0, downX = 0, downY = 0, lastInteract = 0;
    let tour = null; // {waypoints, index, elapsed}

    function normalizeAngleDelta(d) {
      while (d > Math.PI) d -= Math.PI * 2;
      while (d < -Math.PI) d += Math.PI * 2;
      return d;
    }

    function down(x, y) {
      if (tour) return;
      downX = x; downY = y; lastX = x; lastY = y;
      if (window.__farmPlacing && window.__farmPlacing()) {
        mode = "placing";
        mount.style.cursor = "crosshair";
        return;
      }
      const hitId = pickObjectAt(x, y);
      if (hitId) {
        mode = "object";
        draggingId = hitId;
        window.__farmSelect && window.__farmSelect(hitId);
        mount.style.cursor = "move";
      } else {
        mode = "camera";
        mount.style.cursor = "grabbing";
      }
    }
    function up(x, y) {
      if (mode === "placing") {
        const moved = Math.hypot(x - downX, y - downY);
        if (moved < 10) {
          const pt = groundPointFromClient(x, y);
          if (pt) {
            window.__farmPlaceAt && window.__farmPlaceAt(Math.round((pt.x / SC) * 10) / 10, Math.round((pt.z / SC) * 10) / 10);
          }
        }
      } else if (mode === "object" && draggingId) {
        const grp = groupsMapRef.current[draggingId];
        if (grp) {
          const xFt = Math.round((grp.position.x / SC) * 10) / 10;
          const zFt = Math.round((grp.position.z / SC) * 10) / 10;
          window.__farmCommitPos && window.__farmCommitPos(draggingId, xFt, zFt);
        }
      } else if (mode === "camera") {
        const moved = Math.hypot(x - downX, y - downY);
        if (moved < 6) {
          window.__farmSelect && window.__farmSelect(null);
        }
      }
      mode = null; draggingId = null;
      mount.style.cursor = "grab";
      lastInteract = Date.now();
    }
    function move(x, y) {
      if (mode === "placing") return;
      if (mode === "object" && draggingId) {
        const grp = groupsMapRef.current[draggingId];
        if (grp) {
          const pt = groundPointFromClient(x, y);
          if (pt) { grp.position.x = pt.x; grp.position.z = pt.z; }
        }
        lastInteract = Date.now();
        return;
      }
      if (mode === "camera") {
        const dx = x - lastX, dy = y - lastY;
        targetTheta -= dx * 0.007;
        targetPhi -= dy * 0.007;
        targetPhi = Math.max(0.35, Math.min(1.45, targetPhi));
        lastX = x; lastY = y;
        lastInteract = Date.now();
      }
    }

    const dom = renderer.domElement;
    dom.style.touchAction = "none";

    const activePointers = new Map();
    let pinchDist = 0, pinchStartRadius = 0;

    const onPointerDown = (e) => {
      dom.setPointerCapture && (() => { try { dom.setPointerCapture(e.pointerId); } catch (err) {} })();
      activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (activePointers.size === 2) {
        mode = "pinch";
        const pts = Array.from(activePointers.values());
        pinchDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        pinchStartRadius = targetRadius;
      } else if (activePointers.size === 1) {
        down(e.clientX, e.clientY);
      }
    };
    const onPointerMove = (e) => {
      if (!activePointers.has(e.pointerId)) return;
      activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (mode === "pinch" && activePointers.size === 2) {
        const pts = Array.from(activePointers.values());
        const d = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        if (pinchDist > 0) targetRadius = Math.max(10, Math.min(140, pinchStartRadius * (pinchDist / d)));
        lastInteract = Date.now();
        return;
      }
      if (activePointers.size === 1) move(e.clientX, e.clientY);
    };
    const endPointer = (e) => {
      activePointers.delete(e.pointerId);
      try { dom.releasePointerCapture && dom.releasePointerCapture(e.pointerId); } catch (err) {}
      if (activePointers.size < 2 && mode === "pinch") { mode = null; lastInteract = Date.now(); return; }
      if (activePointers.size === 0) up(e.clientX, e.clientY);
    };
    const onWheel = (e) => {
      e.preventDefault();
      targetRadius += e.deltaY * 0.03;
      targetRadius = Math.max(10, Math.min(140, targetRadius));
      lastInteract = Date.now();
    };
    dom.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", endPointer);
    window.addEventListener("pointercancel", endPointer);
    dom.addEventListener("wheel", onWheel, { passive: false });

    function onResize() {
      const w = mount.clientWidth, h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener("resize", onResize);

    let rafId;
    function animate() {
      rafId = requestAnimationFrame(animate);
      if (tour) {
        const wp = tour.waypoints[tour.index];
        theta += normalizeAngleDelta(wp.theta - theta) * 0.05;
        phi += (wp.phi - phi) * 0.05;
        radius += (wp.radius - radius) * 0.05;
        target.x += (wp.target.x - target.x) * 0.05;
        target.y += (wp.target.y - target.y) * 0.05;
        target.z += (wp.target.z - target.z) * 0.05;
        targetTheta = theta; targetPhi = phi; targetRadius = radius;
        updateCamera();
        tour.elapsed = (tour.elapsed || 0) + 1;
        const closeEnough =
          Math.abs(normalizeAngleDelta(wp.theta - theta)) < 0.02 &&
          Math.abs(wp.phi - phi) < 0.02 &&
          Math.abs(wp.radius - radius) < 0.3;
        if ((closeEnough && tour.elapsed > 70) || tour.elapsed > 260) {
          tour.index += 1;
          tour.elapsed = 0;
          if (tour.index >= tour.waypoints.length) {
            tour = null;
            window.__farmOnTourEnd && window.__farmOnTourEnd();
          } else if (tour.labels && tour.labels[tour.index]) {
            window.__farmSetTourLabel && window.__farmSetTourLabel(tour.labels[tour.index]);
          }
        }
      } else {
        if (mode === null && Date.now() - lastInteract > 3500) {
          targetTheta += 0.0012;
        }
        theta += normalizeAngleDelta(targetTheta - theta) * 0.14;
        phi += (targetPhi - phi) * 0.14;
        radius += (targetRadius - radius) * 0.14;
        updateCamera();
      }
      renderer.render(scene, camera);
    }
    animate();

    window.__farmStartTour = (waypoints, labels) => {
      tour = { waypoints, index: 0, elapsed: 0, labels };
      if (labels && labels[0]) window.__farmSetTourLabel && window.__farmSetTourLabel(labels[0]);
    };
    window.__farmStopTour = () => { tour = null; window.__farmOnTourEnd && window.__farmOnTourEnd(); };

    threeRef.current = { scene, camera, renderer, groundGroup, objectsGroup, mount };

    return () => {
      cancelAnimationFrame(rafId);
      dom.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", endPointer);
      window.removeEventListener("pointercancel", endPointer);
      dom.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
      delete window.__farmStartTour;
      delete window.__farmStopTour;
    };
  }, []);

  // expose stable bridges for the imperative three.js handlers above
  useEffect(() => {
    window.__farmSelect = (id) => setSelectedId(id);
    window.__farmCommitPos = (id, xFt, zFt) => {
      setObjects((prev) => prev.map((o) => (o.id === id ? { ...o, xFt, zFt } : o)));
      setSelectedId(id);
    };
    window.__farmPlacing = () => !!placingRef.current;
    window.__farmPlaceAt = (xFt, zFt) => {
      const p = placingRef.current;
      if (!p) return;
      if (p.mode === "add") {
        const preset = PRESETS[p.kind];
        const obj = { id: newId(), type: p.kind, label: preset.label, xFt, zFt, wFt: preset.w, dFt: preset.d, hFt: preset.h, color: preset.color, rotY: 0 };
        setObjects((prev) => [...prev, obj]);
        setSelectedId(obj.id);
      }
      setPlacing(null);
    };
    window.__farmAdd = (kind, xFt, zFt) => {
      const preset = PRESETS[kind];
      if (!preset) return;
      const obj = { id: newId(), type: kind, label: preset.label, xFt, zFt, wFt: preset.w, dFt: preset.d, hFt: preset.h, color: preset.color, rotY: 0 };
      setObjects((prev) => [...prev, obj]);
      setSelectedId(obj.id);
    };
    window.__farmOnTourEnd = () => setTouring(false);
    window.__farmSetTourLabel = (label) => setTourLabel(label);
    return () => {
      delete window.__farmSelect; delete window.__farmCommitPos;
      delete window.__farmPlacing; delete window.__farmPlaceAt; delete window.__farmAdd;
      delete window.__farmOnTourEnd; delete window.__farmSetTourLabel;
    };
  }, []);

  const placingRef = useRef(placing);
  useEffect(() => { placingRef.current = placing; }, [placing]);

  // ---------- rebuild ground whenever plot changes ----------
  useEffect(() => {
    const t = threeRef.current;
    if (!t || !t.groundGroup) return;
    const g = t.groundGroup;
    while (g.children.length) {
      const c = g.children.pop();
      if (c.geometry) c.geometry.dispose();
      if (c.material) { if (c.material.map) c.material.map.dispose(); c.material.dispose(); }
    }
    const wFt = plot.wFt, dFt = plot.dFt;

    const grassTex = makeGrassTexture();
    grassTex.repeat.set((wFt + 60) / 12, (dFt + 60) / 12);
    const base = mkMesh(
      new THREE.BoxGeometry(wFt * SC + 60, 0.1, dFt * SC + 60),
      new THREE.MeshStandardMaterial({ map: grassTex, roughness: 1, metalness: 0 })
    );
    base.position.y = -0.1;
    base.castShadow = false;
    g.add(base);

    const soilTex = makeSoilTexture();
    soilTex.repeat.set(wFt / 8, dFt / 8);
    const plotGeo = new THREE.BoxGeometry(wFt * SC, 0.08, dFt * SC);
    const plotMesh = mkMesh(plotGeo, new THREE.MeshStandardMaterial({ map: soilTex, roughness: 1, metalness: 0 }));
    plotMesh.castShadow = false;
    const edges = new THREE.EdgesGeometry(plotGeo);
    plotMesh.add(new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x2b2620 })));
    g.add(plotMesh);
  }, [plot]);

  // ---------- rebuild objects whenever objects/selection changes ----------
  useEffect(() => {
    const t = threeRef.current;
    if (!t || !t.objectsGroup) return;
    const g = t.objectsGroup;
    while (g.children.length) {
      const c = g.children.pop();
      c.traverse((n) => {
        if (n.geometry) n.geometry.dispose();
        if (n.material) {
          if (n.material.map) n.material.map.dispose();
          n.material.dispose();
        }
      });
    }
    groupsMapRef.current = {};

    objects.forEach((obj) => {
      const grp = new THREE.Group();
      grp.userData.id = obj.id;
      grp.position.set(obj.xFt * SC, 0, obj.zFt * SC);
      grp.rotation.y = ((obj.rotY || 0) * Math.PI) / 180;

      if (obj.type === "tree") {
        const trunk = mkMesh(
          new THREE.CylinderGeometry(0.12, 0.16, obj.hFt * SC * 0.4, 6),
          stdMat(0x6b4a2c, 0.9, 0)
        );
        trunk.position.y = (obj.hFt * SC * 0.4) / 2;
        grp.add(trunk);
        const foliage = mkMesh(
          new THREE.SphereGeometry(obj.wFt * SC * 0.4, 8, 7),
          stdMat(obj.color, 0.9, 0)
        );
        foliage.position.y = obj.hFt * SC * 0.4 + obj.wFt * SC * 0.35;
        grp.add(foliage);
      } else if (obj.type === "goatplatform") {
        const legH = obj.hFt * SC * 0.4;
        const legOffX = (obj.wFt * SC) / 2 - 0.3;
        const legOffZ = (obj.dFt * SC) / 2 - 0.3;
        [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach((s) => {
          const leg = mkMesh(new THREE.BoxGeometry(0.4, legH, 0.4), stdMat(0x6b4a2c, 0.9, 0));
          leg.position.set(s[0] * legOffX, legH / 2, s[1] * legOffZ);
          grp.add(leg);
        });
        const plat = mkMesh(
          new THREE.BoxGeometry(obj.wFt * SC, obj.hFt * SC * 0.15, obj.dFt * SC),
          stdMat(obj.color, 0.9, 0)
        );
        plat.position.y = legH + (obj.hFt * SC * 0.15) / 2;
        plat.add(new THREE.LineSegments(new THREE.EdgesGeometry(plat.geometry), new THREE.LineBasicMaterial({ color: 0x2b2620 })));
        grp.add(plat);
        // tin roof, like a proper shed
        const roof = mkMesh(
          new THREE.BoxGeometry(obj.wFt * SC + 1.2, obj.hFt * SC * 0.1, obj.dFt * SC + 1.2),
          stdMat(0xaeb4b8, 0.4, 0.35)
        );
        roof.position.y = legH + obj.hFt * SC * 0.15 + (obj.hFt * SC * 0.1) / 2 + 0.35;
        grp.add(roof);
        // roof support posts
        [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach((s) => {
          const post = mkMesh(new THREE.CylinderGeometry(0.08, 0.08, 0.35, 6), stdMat(0x6b4a2c, 0.9, 0));
          post.position.set(s[0] * legOffX, legH + obj.hFt * SC * 0.15 + 0.18, s[1] * legOffZ);
          grp.add(post);
        });
      } else if (obj.type === "road") {
        const h = Math.max(obj.hFt, 0.1) * SC;
        const road = mkMesh(new THREE.BoxGeometry(obj.wFt * SC, h, obj.dFt * SC), stdMat(obj.color, 0.95, 0));
        road.position.y = h / 2 + 0.03;
        grp.add(road);
        const longAxisIsW = obj.wFt >= obj.dFt;
        const stripeGeo = longAxisIsW
          ? new THREE.BoxGeometry(obj.wFt * SC * 0.9, h * 0.3, 0.12)
          : new THREE.BoxGeometry(0.12, h * 0.3, obj.dFt * SC * 0.9);
        const stripe = mkMesh(stripeGeo, stdMat(0xe8c94a, 0.6, 0));
        stripe.position.y = h + 0.02;
        grp.add(stripe);
      } else if (obj.type === "gate") {
        const opening = obj.wFt * SC;
        const pillarH = Math.max(obj.hFt, 5) * SC + 1.6;
        const pillarW = 0.9;
        [-1, 1].forEach((s) => {
          const pillar = mkMesh(
            new THREE.BoxGeometry(pillarW, pillarH, pillarW),
            stdMat(0xa5453a, 0.8, 0.05)
          );
          pillar.position.set((s * opening) / 2, pillarH / 2, 0);
          grp.add(pillar);
        });
        // teal canopy over the gate, matching the real gate photo
        const canopy = mkMesh(
          new THREE.BoxGeometry(opening + pillarW * 2 + 0.6, 0.4, 2.2),
          stdMat(0x3fb6a3, 0.5, 0.1)
        );
        canopy.position.set(0, pillarH + 0.2, 0);
        grp.add(canopy);
        // decorative wrought-iron style bars across the opening
        const barCount = Math.max(4, Math.round(opening / 1.3));
        for (let i = 0; i <= barCount; i++) {
          const bx = -opening / 2 + (opening * i) / barCount;
          const bar = mkMesh(
            new THREE.CylinderGeometry(0.045, 0.045, pillarH * 0.62, 6),
            stdMat(0x8a8a8a, 0.35, 0.7)
          );
          bar.position.set(bx, pillarH * 0.36, 0);
          grp.add(bar);
        }
      } else if (obj.type === "fence") {
        const postCount = Math.max(2, Math.round(obj.wFt / 8));
        const h = Math.max(obj.hFt, 3) * SC;
        for (let i = 0; i <= postCount; i++) {
          const px = -(obj.wFt * SC) / 2 + (obj.wFt * SC * i) / postCount;
          const post = mkMesh(new THREE.CylinderGeometry(0.09, 0.09, h, 6), stdMat(0x8a8a8a, 0.4, 0.6));
          post.position.set(px, h / 2, 0);
          grp.add(post);
        }
        const netTex = makeNetTexture();
        netTex.repeat.set(obj.wFt / 4, h / SC / 4);
        const net = new THREE.Mesh(
          new THREE.PlaneGeometry(obj.wFt * SC, h),
          new THREE.MeshStandardMaterial({ map: netTex, color: obj.color, transparent: true, opacity: 0.9, side: THREE.DoubleSide, roughness: 0.6, metalness: 0.3 })
        );
        net.position.y = h / 2;
        net.receiveShadow = true;
        grp.add(net);
      } else if (obj.type === "cow" || obj.type === "goat") {
        const preset = PRESETS[obj.type];
        const sx = obj.wFt / preset.w, sy = obj.hFt / preset.h, sz = obj.dFt / preset.d;
        const animal = new THREE.Group();
        const bodyColor = obj.color;
        const legH = 1.6, legR = 0.16;
        const body = mkMesh(new THREE.SphereGeometry(1, 10, 8), stdMat(bodyColor, 0.85, 0));
        body.scale.set(1.55, 1, 2.1);
        body.position.y = legH + 0.9;
        animal.add(body);
        if (obj.type === "cow") {
          const patch = mkMesh(new THREE.SphereGeometry(0.55, 8, 6), stdMat(0xffffff, 0.85, 0));
          patch.position.set(0.4, legH + 1.1, 0.6);
          animal.add(patch);
        }
        const head = mkMesh(new THREE.SphereGeometry(0.55, 8, 6), stdMat(bodyColor, 0.85, 0));
        head.position.set(0, legH + 1.15, 1.95);
        head.scale.set(0.85, 0.85, 1);
        animal.add(head);
        [[-0.55, -1.55], [0.55, -1.55], [-0.55, 1.4], [0.55, 1.4]].forEach((p) => {
          const leg = mkMesh(new THREE.CylinderGeometry(legR, legR, legH, 6), stdMat(0x3a2a1c, 0.9, 0));
          leg.position.set(p[0], legH / 2, p[1]);
          animal.add(leg);
        });
        const hornColor = obj.type === "cow" ? 0xd9cfae : 0x4a4238;
        [-0.28, 0.28].forEach((hx) => {
          const horn = mkMesh(new THREE.ConeGeometry(0.08, obj.type === "cow" ? 0.4 : 0.6, 5), stdMat(hornColor, 0.6, 0));
          horn.position.set(hx, legH + 1.65, 1.95);
          horn.rotation.x = obj.type === "cow" ? -0.3 : -0.6;
          animal.add(horn);
        });
        animal.scale.set(sx, sy, sz);
        grp.add(animal);
      } else {
        const h = Math.max(obj.hFt, 0.1) * SC;
        const box = mkMesh(new THREE.BoxGeometry(obj.wFt * SC, h, obj.dFt * SC), stdMat(obj.color, 0.8, 0.05));
        box.position.y = h / 2 + 0.05;
        box.add(new THREE.LineSegments(new THREE.EdgesGeometry(box.geometry), new THREE.LineBasicMaterial({ color: 0x2b2620 })));
        grp.add(box);
        if (obj.type === "cowshed") {
          const roof = mkMesh(
            new THREE.BoxGeometry(obj.wFt * SC + 1, h * 0.08, obj.dFt * SC + 1),
            stdMat(0xaeb4b8, 0.4, 0.35)
          );
          roof.position.y = h + (h * 0.08) / 2 + 0.05;
          grp.add(roof);
        }
        if (obj.type === "building") {
          const roof = mkMesh(
            new THREE.BoxGeometry(obj.wFt * SC + 0.6, h * 0.06, obj.dFt * SC + 0.6),
            stdMat(0x3fb6a3, 0.45, 0.15)
          );
          roof.position.y = h + (h * 0.06) / 2 + 0.05;
          grp.add(roof);
        }
        if (obj.type === "pond") {
          box.material.roughness = 0.15;
          box.material.metalness = 0.5;
        }
      }

      if (obj.id === selectedId) {
        const hw = (obj.wFt * SC) / 2 + 0.3, hd = (obj.dFt * SC) / 2 + 0.3;
        const pts = [
          new THREE.Vector3(-hw, 0.12, -hd), new THREE.Vector3(hw, 0.12, -hd),
          new THREE.Vector3(hw, 0.12, hd), new THREE.Vector3(-hw, 0.12, hd),
          new THREE.Vector3(-hw, 0.12, -hd),
        ];
        const lg = new THREE.BufferGeometry().setFromPoints(pts);
        grp.add(new THREE.Line(lg, new THREE.LineBasicMaterial({ color: 0xffcc00 })));
      }

      g.add(grp);
      groupsMapRef.current[obj.id] = grp;
    });
  }, [objects, selectedId]);

  const selected = objects.find((o) => o.id === selectedId) || null;
  const selectedIdSafe = selected ? selected.id : null;

  const updateSelected = (patch) => {
    if (!selectedIdSafe) return;
    setObjects((prev) => prev.map((o) => (o.id === selectedIdSafe ? { ...o, ...patch } : o)));
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    setObjects((prev) => prev.filter((o) => o.id !== selectedId));
    setSelectedId(null);
  };

  function buildTour(objs) {
    const overview = { theta: Math.PI * 0.28, phi: 1.0, radius: 70, target: { x: 0, y: 3, z: -2 } };
    const order = [
      { type: "building", label: "ভবন" },
      { type: "goatplatform", label: "ছাগলের ফার্ম" },
      { type: "cowshed", label: "গরুর ফার্ম" },
      { type: "gate", label: "প্রবেশ গেট" },
      { type: "pond", label: "পুকুর" },
    ];
    const wps = [overview];
    const labels = ["পুরো ফার্মের ওভারভিউ"];
    order.forEach((entry, i) => {
      const o = objs.find((x) => x.type === entry.type);
      if (!o) return;
      const size = Math.max(o.wFt, o.dFt) * SC;
      wps.push({
        theta: Math.PI * 0.2 + i * 0.35,
        phi: 0.85,
        radius: Math.max(size * 1.7, 9),
        target: { x: o.xFt * SC, y: Math.max(o.hFt, 4) * SC * 0.3, z: o.zFt * SC },
      });
      labels.push(entry.label);
    });
    wps.push(overview);
    labels.push("পুরো ফার্মের ওভারভিউ");
    return { wps, labels };
  }
  const startTour = () => {
    const { wps, labels } = buildTour(objects);
    window.__farmStartTour && window.__farmStartTour(wps, labels);
    setTouring(true);
  };
  const stopTour = () => {
    window.__farmStopTour && window.__farmStopTour();
    setTouring(false);
  };

  const flash = (msg) => { setSaveMsg(msg); setTimeout(() => setSaveMsg(""), 2200); };

  const exportJSON = () => {
    try {
      const data = JSON.stringify({ plot, objects }, null, 2);
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "farm-design.json";
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
      flash("ডাউনলোড হয়েছে ✓");
    } catch (err) {
      flash("ডাউনলোড ব্যর্থ — ব্রাউজার সাপোর্ট করছে না");
    }
  };
  const triggerImport = () => fileInputRef.current && fileInputRef.current.click();
  const onImportFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (data.plot) setPlot(data.plot);
        if (Array.isArray(data.objects)) { setObjects(data.objects); setSelectedId(null); }
        flash("লোড হয়েছে ✓");
      } catch (err) {
        flash("ফাইল পড়া যায়নি");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const saveToBrowser = () => {
    if (!ENABLE_LOCAL_STORAGE) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ plot, objects }));
      flash("ব্রাউজারে সেভ হয়েছে ✓");
    } catch (err) {
      flash("সেভ ব্যর্থ");
    }
  };
  const loadFromBrowser = () => {
    if (!ENABLE_LOCAL_STORAGE) return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) { flash("কোনো সেভ পাওয়া যায়নি"); return; }
      const data = JSON.parse(raw);
      if (data.plot) setPlot(data.plot);
      if (Array.isArray(data.objects)) { setObjects(data.objects); setSelectedId(null); }
      flash("লোড হয়েছে ✓");
    } catch (err) {
      flash("লোড ব্যর্থ");
    }
  };

  useEffect(() => {
    if (!ENABLE_LOCAL_STORAGE) return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data.plot) setPlot(data.plot);
        if (Array.isArray(data.objects) && data.objects.length) setObjects(data.objects);
      }
    } catch (err) { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startAdd = (kind) => setPlacing({ mode: "add", kind });
  const cancelPlacing = () => setPlacing(null);

  return (
    <div style={{ fontFamily: "'Hind Siliguri', sans-serif", background: "#f6f3ec", minHeight: "100%" }} className="p-3">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');`}</style>

      <div className="mb-3">
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.1em", color: "#8a6a4f", textTransform: "uppercase" }}>
          Custom 3D Site Designer
        </div>
        <h1 className="text-xl font-bold m-0" style={{ color: "#2b2620" }}>নিজের ৩ডি প্রজেক্ট বানান</h1>
        <div className="text-sm" style={{ color: "#5c5548" }}>
          বাম পাশ থেকে জিনিস টেনে (drag) মাঠে ছেড়ে দিন (drop)। ইতিমধ্যে বসানো যেকোনো জিনিস সরাসরি ধরে টেনে সরাতে পারবেন।
        </div>

        <div className="flex flex-wrap gap-2 mt-2 items-center">
          {!touring ? (
            <button onClick={startTour} className="text-xs rounded px-3 py-1.5 border" style={{ borderColor: "#2b8574", background: "#e6f6f2", color: "#2b8574" }}>▶ ট্যুর দেখুন</button>
          ) : (
            <button onClick={stopTour} className="text-xs rounded px-3 py-1.5 border" style={{ borderColor: "#a5453a", background: "#fdecea", color: "#a5453a" }}>■ ট্যুর থামান</button>
          )}
          {ENABLE_LOCAL_STORAGE && (
            <>
              <button onClick={saveToBrowser} className="text-xs rounded px-3 py-1.5 border" style={{ borderColor: "#c9c0af", background: "#fff", color: "#2b2620" }}>💾 ব্রাউজারে সেভ</button>
              <button onClick={loadFromBrowser} className="text-xs rounded px-3 py-1.5 border" style={{ borderColor: "#c9c0af", background: "#fff", color: "#2b2620" }}>📂 ব্রাউজার থেকে লোড</button>
            </>
          )}
          <button onClick={exportJSON} className="text-xs rounded px-3 py-1.5 border" style={{ borderColor: "#c9c0af", background: "#fff", color: "#2b2620" }}>⬇ এক্সপোর্ট (JSON)</button>
          <button onClick={triggerImport} className="text-xs rounded px-3 py-1.5 border" style={{ borderColor: "#c9c0af", background: "#fff", color: "#2b2620" }}>⬆ ইমপোর্ট (JSON)</button>
          <input ref={fileInputRef} type="file" accept="application/json" onChange={onImportFile} style={{ display: "none" }} />
          {saveMsg && <span className="text-xs" style={{ color: "#2b8574" }}>{saveMsg}</span>}
        </div>
      </div>

      <div className="flex gap-3" style={{ flexWrap: "wrap" }}>
        <div style={{ width: 270, flex: "none" }} className="flex flex-col gap-3">
          <div className="bg-white border rounded-lg p-3" style={{ borderColor: "#e5e0d3", boxShadow: "0 1px 3px rgba(43,38,32,0.06)" }}>
            <div className="text-xs font-semibold mb-2" style={{ color: "#2b2620" }}>জমির মাপ (ft)</div>
            <div className="flex gap-2 items-center mb-1">
              <label className="text-xs w-16" style={{ color: "#5c5548" }}>প্রস্থ</label>
              <input type="number" min={20} max={600} value={plot.wFt}
                onChange={(e) => setPlot((p) => ({ ...p, wFt: Number(e.target.value) || p.wFt }))}
                className="border rounded px-2 py-1 text-sm flex-1" style={{ borderColor: "#c9c0af" }} />
            </div>
            <div className="flex gap-2 items-center">
              <label className="text-xs w-16" style={{ color: "#5c5548" }}>দৈর্ঘ্য</label>
              <input type="number" min={20} max={600} value={plot.dFt}
                onChange={(e) => setPlot((p) => ({ ...p, dFt: Number(e.target.value) || p.dFt }))}
                className="border rounded px-2 py-1 text-sm flex-1" style={{ borderColor: "#c9c0af" }} />
            </div>
          </div>

          <div className="bg-white border rounded-lg p-3" style={{ borderColor: placing ? "#2b8574" : "#e5e0d3", boxShadow: "0 1px 3px rgba(43,38,32,0.06)" }}>
            <div className="text-xs font-semibold mb-2" style={{ color: "#2b2620" }}>১. বাটনে ট্যাপ করুন → ২. মাঠে ট্যাপ করুন</div>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(PRESETS).map((k) => (
                <button
                  key={k}
                  onClick={() => startAdd(k)}
                  className="text-xs rounded px-2 py-2.5 border"
                  style={{
                    borderColor: placing && placing.kind === k ? "#2b8574" : "#c9c0af",
                    background: placing && placing.kind === k ? "#e6f6f2" : "#f6f3ec",
                    color: "#2b2620",
                    fontWeight: placing && placing.kind === k ? 700 : 400,
                  }}>
                  <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, background: PRESETS[k].color, marginRight: 6, border: "1px solid #999" }}></span>
                  {PRESETS[k].label}
                </button>
              ))}
            </div>
            {placing ? (
              <div className="mt-2 text-xs rounded px-2 py-2 flex items-center justify-between" style={{ background: "#e6f6f2", color: "#2b8574", border: "1px solid #2b8574" }}>
                <span>🎯 এখন ডানে মাঠের যেকোনো জায়গায় ট্যাপ করুন</span>
                <button onClick={cancelPlacing} className="ml-2 underline shrink-0">বাতিল</button>
              </div>
            ) : (
              <div className="text-xs mt-2" style={{ color: "#8a6a4f" }}>উপরের যেকোনো একটা বাটনে ট্যাপ করে শুরু করুন।</div>
            )}
          </div>

          <div className="bg-white border rounded-lg p-3 flex-1" style={{ borderColor: "#e5e0d3", minHeight: 140, boxShadow: "0 1px 3px rgba(43,38,32,0.06)" }}>
            <div className="text-xs font-semibold mb-2" style={{ color: "#2b2620" }}>তালিকা ({objects.length})</div>
            <div className="text-xs mb-2" style={{ color: "#8a6a4f" }}>কোনো আইটেমে ট্যাপ করলে সিলেক্ট হবে — তারপর মাঠে সরাসরি ধরে টেনে সরাতে পারবেন।</div>
            <div className="flex flex-col gap-1" style={{ maxHeight: 220, overflowY: "auto" }}>
              {objects.map((o) => (
                <button key={o.id} onClick={() => setSelectedId(o.id)}
                  className="text-xs text-left rounded px-2 py-1.5 border flex items-center gap-2"
                  style={{ borderColor: o.id === selectedId ? "#2b2620" : "#e5e0d3", background: o.id === selectedId ? "#fbe9c9" : "#fff", color: "#2b2620" }}>
                  <span style={{ display: "inline-block", width: 9, height: 9, borderRadius: 2, background: o.color, border: "1px solid #999", flex: "none" }}></span>
                  <span className="truncate">{o.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1" style={{ minWidth: 280 }}>
          <div style={{ position: "relative" }}>
            <div ref={mountRef} style={{
              width: "100%", height: "min(560px, 68vh)", minHeight: 320, background: "#bfe3ef", borderRadius: 8,
              border: placing ? "3px solid #2b8574" : "1px solid #c9c0af", cursor: placing ? "crosshair" : "grab",
              position: "relative", boxShadow: placing ? "0 0 0 4px rgba(43,133,116,0.18)" : "0 2px 10px rgba(43,38,32,0.08)",
              touchAction: "none", transition: "border-color .15s, box-shadow .15s",
            }} />
            {placing && (
              <div style={{
                position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)",
                background: "rgba(43,133,116,0.92)", color: "#fff", padding: "6px 16px", borderRadius: 20,
                fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, fontWeight: 600, pointerEvents: "none",
              }}>
                🎯 মাঠের যেকোনো জায়গায় ট্যাপ করুন
              </div>
            )}
            {touring && tourLabel && (
              <div style={{
                position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)",
                background: "rgba(43,38,32,0.82)", color: "#fff", padding: "6px 16px", borderRadius: 20,
                fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: "0.02em",
                pointerEvents: "none",
              }}>
                🎥 এখন দেখাচ্ছে: {tourLabel}
              </div>
            )}
          </div>
          <div className="text-xs mt-1" style={{ color: "#8a6a4f", fontFamily: "'JetBrains Mono', monospace" }}>
            👆 খালি জায়গায় টেনে ঘোরান · অবজেক্ট ধরে টেনে সরান · স্ক্রল/পিঞ্চ করে জুম
          </div>
        </div>

        <div style={{ width: 250, flex: "none" }}>
          <div className="bg-white border rounded-lg p-3" style={{ borderColor: "#e5e0d3", boxShadow: "0 1px 3px rgba(43,38,32,0.06)" }}>
            <div className="text-xs font-semibold mb-2" style={{ color: "#2b2620" }}>বৈশিষ্ট্য</div>
            {!selected && <div className="text-xs" style={{ color: "#8a8072" }}>কোনো অবজেক্ট সিলেক্ট করা নেই।</div>}
            {selected && (
              <div className="flex flex-col gap-2">
                <input value={selected.label} onChange={(e) => updateSelected({ label: e.target.value })}
                  className="border rounded px-2 py-1 text-sm" style={{ borderColor: "#c9c0af" }} />
                <label className="text-xs" style={{ color: "#5c5548" }}>প্রস্থ (ft): {selected.wFt}</label>
                <input type="range" min={0.5} max={150} step={0.5} value={selected.wFt} onChange={(e) => updateSelected({ wFt: Number(e.target.value) })} />
                <label className="text-xs" style={{ color: "#5c5548" }}>গভীরতা (ft): {selected.dFt}</label>
                <input type="range" min={0.5} max={150} step={0.5} value={selected.dFt} onChange={(e) => updateSelected({ dFt: Number(e.target.value) })} />
                <label className="text-xs" style={{ color: "#5c5548" }}>উচ্চতা (ft): {selected.hFt}</label>
                <input type="range" min={0.2} max={40} step={0.2} value={selected.hFt} onChange={(e) => updateSelected({ hFt: Number(e.target.value) })} />
                <label className="text-xs" style={{ color: "#5c5548" }}>ঘোরান: {selected.rotY || 0}°</label>
                <input type="range" min={0} max={359} step={1} value={selected.rotY || 0} onChange={(e) => updateSelected({ rotY: Number(e.target.value) })} />
                <label className="text-xs" style={{ color: "#5c5548" }}>রং</label>
                <div className="grid grid-cols-8 gap-1">
                  {COLOR_SWATCHES.map((c) => (
                    <button key={c} onClick={() => updateSelected({ color: c })}
                      title={c}
                      style={{
                        width: "100%", aspectRatio: "1", background: c, borderRadius: 4,
                        border: selected.color === c ? "2px solid #2b2620" : "1px solid #c9c0af",
                        cursor: "pointer",
                      }} />
                  ))}
                </div>
                <input
                  value={selected.color}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (/^#[0-9a-fA-F]{6}$/.test(v)) updateSelected({ color: v });
                    else updateSelected({ color: v }); // allow typing, only applies visually once valid
                  }}
                  className="border rounded px-2 py-1 text-xs"
                  style={{ borderColor: "#c9c0af", fontFamily: "'JetBrains Mono', monospace" }}
                  placeholder="#a5453a" />
                <div className="text-xs mt-1" style={{ color: "#8a6a4f", fontFamily: "'JetBrains Mono', monospace" }}>X: {selected.xFt} ft · Z: {selected.zFt} ft</div>
                <button onClick={deleteSelected} className="text-xs rounded px-2 py-2 border" style={{ borderColor: "#a5453a", background: "#fdecea", color: "#a5453a" }}>🗑 মুছে ফেলুন</button>
              </div>
            )}
          </div>
          <div className="text-xs mt-2 rounded p-2" style={{ background: "#fff", border: "1px solid #c9c0af", color: "#5c5548" }}>
            এটা proportional massing tool — architectural blueprint না।
          </div>
        </div>
      </div>
    </div>
  );
}
