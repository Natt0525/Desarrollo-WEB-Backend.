import { useEffect, useRef } from "react";
import * as THREE from "three";
import { PART_BY_ID, PHONE_PARTS, type PhonePartId } from "./phoneModel";

type PhoneExplorerProps = {
  exploded: boolean;
  selected: PhonePartId | null;
  onSelect: (part: PhonePartId | null) => void;
  onProgress?: (progress: number) => void;
};

type ScenePart = {
  id: PhonePartId;
  group: THREE.Group;
  home: THREE.Vector3;
  offset: THREE.Vector3;
  meshes: THREE.Mesh[];
  edges: THREE.LineSegments[];
};

const BLUE = new THREE.Color("#0b43ff");
const DARK = new THREE.Color("#05070b");

function roundedGeometry(
  width: number,
  height: number,
  depth: number,
  radius: number,
) {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  const r = Math.min(radius, width / 2, height / 2);
  shape.moveTo(x + r, y);
  shape.lineTo(x + width - r, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + r);
  shape.lineTo(x + width, y + height - r);
  shape.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  shape.lineTo(x + r, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSegments: 6,
    steps: 1,
    bevelSize: Math.min(0.085, radius * 0.22, depth * 0.32),
    bevelThickness: Math.min(0.055, depth * 0.24),
    curveSegments: 16,
  });
  geometry.translate(0, 0, -depth / 2);
  geometry.computeVertexNormals();
  return geometry;
}

function material(
  color: THREE.ColorRepresentation,
  options: Partial<THREE.MeshPhysicalMaterialParameters> = {},
) {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.42,
    metalness: 0.08,
    ...options,
    transparent: options.transparent ?? false,
    opacity: options.opacity ?? 1,
  });
}

function smooth(value: number) {
  const x = THREE.MathUtils.clamp(value, 0, 1);
  return x * x * (3 - 2 * x);
}

function localProgress(progress: number, order: number) {
  const start = order * 0.045;
  return smooth((progress - start) / 0.48);
}

function PhoneExplorer({
  exploded,
  selected,
  onSelect,
  onProgress,
}: PhoneExplorerProps) {
  const host = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<PhonePartId | null>(selected);
  const explodedRef = useRef(exploded);
  const onSelectRef = useRef(onSelect);
  const onProgressRef = useRef(onProgress);

  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);
  useEffect(() => {
    explodedRef.current = exploded;
  }, [exploded]);
  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);
  useEffect(() => {
    onProgressRef.current = onProgress;
  }, [onProgress]);

  useEffect(() => {
    const container = host.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = null;
    const camera = new THREE.OrthographicCamera(-7, 7, 7, -7, 0.1, 100);
    camera.position.set(7.8, 5.4, 11.5);
    const cameraTarget = new THREE.Vector3(0, 0, 0);
    camera.lookAt(cameraTarget);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      container.classList.add("phone-canvas-fallback");
      container.setAttribute("role", "img");
      container.setAttribute("aria-label", "Vista esquemática de un celular");
      const fallbackMessage = document.createElement("span");
      fallbackMessage.textContent = "Vista 3D no disponible en este dispositivo";
      container.appendChild(fallbackMessage);
      return () => fallbackMessage.remove();
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xf4f7ff, 0x222936, 3.4));
    const key = new THREE.DirectionalLight(0xffffff, 6.4);
    key.position.set(-5, 8, 9);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xb8c7ff, 3.2);
    fill.position.set(5, 3, 8);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0x315cff, 4.4);
    rim.position.set(7, 0, -5);
    scene.add(rim);

    const stage = new THREE.Group();
    stage.rotation.set(-0.08, -0.34, -0.12);
    scene.add(stage);

    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(3.9, 80),
      new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.16,
        depthWrite: false,
      }),
    );
    shadow.scale.set(0.88, 0.3, 1);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.set(0, -4.4, -1.3);
    scene.add(shadow);

    const parts = new Map<PhonePartId, ScenePart>();
    const interactive: THREE.Object3D[] = [];

    const addPart = (
      id: PhonePartId,
      home: [number, number, number],
      build: (group: THREE.Group) => void,
    ) => {
      const group = new THREE.Group();
      group.name = id;
      group.position.set(...home);
      group.userData.partId = id;
      build(group);
      const meshes: THREE.Mesh[] = [];
      const edges: THREE.LineSegments[] = [];
      group.traverse((object) => {
        object.userData.partId = id;
        if (object instanceof THREE.Mesh) {
          object.castShadow = false;
          object.receiveShadow = false;
          meshes.push(object);
          interactive.push(object);
          object.geometry.computeBoundingBox();
          const bounds = object.geometry.boundingBox;
          const span = bounds
            ? bounds.getSize(new THREE.Vector3())
            : new THREE.Vector3();
          const maxDimension = Math.max(span.x, span.y, span.z);
          if (!object.userData.noEdge && maxDimension < 4.2) {
            const line = new THREE.LineSegments(
              new THREE.EdgesGeometry(object.geometry, 28),
              new THREE.LineBasicMaterial({
                color: 0x526071,
                transparent: true,
                opacity: 0.25,
              }),
            );
            line.userData.partId = id;
            object.add(line);
            edges.push(line);
          }
        }
      });
      stage.add(group);
      const spec = PART_BY_ID[id];
      parts.set(id, {
        id,
        group,
        home: new THREE.Vector3(...home),
        offset: new THREE.Vector3(...spec.offset),
        meshes,
        edges,
      });
    };

    const box = (
      group: THREE.Group,
      size: [number, number, number],
      position: [number, number, number],
      mat: THREE.Material,
      radius = 0.12,
    ) => {
      const mesh = new THREE.Mesh(
        roundedGeometry(size[0], size[1], size[2], radius),
        mat,
      );
      mesh.position.set(...position);
      group.add(mesh);
      return mesh;
    };

    const cylinder = (
      group: THREE.Group,
      radius: number,
      depth: number,
      position: [number, number, number],
      mat: THREE.Material,
      segments = 32,
    ) => {
      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(radius, radius, depth, segments),
        mat,
      );
      mesh.rotation.x = Math.PI / 2;
      mesh.position.set(...position);
      group.add(mesh);
      return mesh;
    };

    const plane = (
      group: THREE.Group,
      size: [number, number],
      position: [number, number, number],
      mat: THREE.Material,
      radius = 0.12,
    ) => {
      const mesh = new THREE.Mesh(
        roundedGeometry(size[0], size[1], 0.018, radius),
        mat,
      );
      mesh.position.set(...position);
      mesh.userData.noEdge = true;
      group.add(mesh);
      return mesh;
    };

    addPart("cover", [0, 0, -0.46], (group) => {
      const coverBody = box(
        group,
        [3.62, 7.18, 0.18],
        [0, 0, 0],
        material("#202733", {
          metalness: 0.48,
          roughness: 0.28,
          clearcoat: 0.72,
          clearcoatRoughness: 0.2,
        }),
        0.46,
      );
      coverBody.userData.noEdge = true;
      const plate = box(
        group,
        [1.35, 1.9, 0.075],
        [-0.92, 2.25, -0.13],
        material("#141a24", { metalness: 0.58, roughness: 0.24 }),
        0.28,
      );
      plate.userData.noEdge = true;
      [
        [-1.13, 2.65],
        [-0.72, 2.1],
        [-1.16, 1.75],
      ].forEach(([x, y]) => {
        cylinder(
          group,
          0.27,
          0.13,
          [x, y, -0.2],
          material("#050608", { metalness: 0.85, roughness: 0.18 }),
        );
        cylinder(
          group,
          0.17,
          0.145,
          [x, y, -0.27],
          material("#16233f", { transmission: 0.22, roughness: 0.08 }),
        );
      });
    });

    addPart("frame", [0, 0, 0], (group) => {
      const metal = material("#59636f", {
        metalness: 0.88,
        roughness: 0.22,
        clearcoat: 0.36,
      });
      const shell = box(group, [3.72, 7.14, 0.54], [0, 0, 0], metal, 0.46);
      shell.userData.noEdge = true;
      const midplate = box(
        group,
        [3.38, 6.78, 0.1],
        [0, 0, 0.27],
        material("#252d37", { metalness: 0.6, roughness: 0.42 }),
        0.36,
      );
      midplate.userData.noEdge = true;
      const innerBed = box(
        group,
        [3.16, 6.54, 0.045],
        [0, 0, 0.335],
        material("#111720", { metalness: 0.28, roughness: 0.58 }),
        0.3,
      );
      innerBed.userData.noEdge = true;
      box(group, [0.11, 0.82, 0.16], [1.9, 0.76, 0.02], metal, 0.055);
      box(group, [0.11, 0.46, 0.16], [1.9, -0.16, 0.02], metal, 0.055);
      const port = box(
        group,
        [0.72, 0.14, 0.23],
        [0, -3.58, 0.02],
        material("#020307", { metalness: 0.65 }),
        0.07,
      );
      port.userData.noEdge = true;
      for (const x of [-1.28, -0.95, 0.95, 1.28]) {
        cylinder(group, 0.045, 0.17, [x, -3.6, 0.02], material("#050608"));
      }
      for (const [x, y] of [
        [-1.5, -3.2],
        [1.5, -3.2],
        [-1.5, 3.2],
        [1.5, 3.2],
      ]) {
        cylinder(
          group,
          0.055,
          0.08,
          [x, y, 0.22],
          material("#bdc6cf", { metalness: 1, roughness: 0.2 }),
          16,
        );
      }
      box(
        group,
        [0.72, 0.055, 0.035],
        [0, 3.585, 0.03],
        material("#11151b", { metalness: 0.45, roughness: 0.34 }),
        0.026,
      );
    });

    addPart("battery", [0.12, -0.35, 0.18], (group) => {
      box(
        group,
        [2.55, 3.65, 0.26],
        [0, 0, 0],
        material("#353d48", { metalness: 0.18, roughness: 0.5 }),
        0.28,
      );
      box(
        group,
        [2.16, 2.62, 0.018],
        [0, 0.05, 0.15],
        material("#c8ccd0", { metalness: 0.1, roughness: 0.72 }),
        0.12,
      );
      for (let i = 0; i < 5; i += 1) {
        box(
          group,
          [1.5 - i * 0.12, 0.018, 0.008],
          [-0.2 + i * 0.04, 0.68 - i * 0.22, 0.17],
          material("#69717a"),
          0.006,
        );
      }
      box(
        group,
        [0.45, 0.34, 0.08],
        [0.85, 1.95, 0.02],
        material("#bb7627", { metalness: 0.5, roughness: 0.4 }),
        0.04,
      );
    });

    addPart("mainboard", [-0.25, 2.05, 0.2], (group) => {
      const pcb = material("#193b32", { metalness: 0.22, roughness: 0.58 });
      box(group, [3.05, 1.5, 0.18], [0, 0, 0], pcb, 0.2);
      box(group, [1.02, 1.1, 0.2], [-0.95, -0.96, 0], pcb, 0.18);
      [
        [-0.72, 0.12, 0.92, 0.68],
        [0.52, 0.22, 0.82, 0.56],
        [0.48, -0.43, 0.55, 0.32],
      ].forEach(([x, y, w, h]) => {
        box(
          group,
          [w, h, 0.12],
          [x, y, 0.14],
          material("#aab0b5", { metalness: 0.9, roughness: 0.26 }),
          0.04,
        );
      });
      for (let i = 0; i < 18; i += 1) {
        const x = -1.3 + (i % 9) * 0.3;
        const y = i < 9 ? 0.62 : -0.62;
        cylinder(
          group,
          0.026,
          0.04,
          [x, y, 0.17],
          material("#d7a83f", { metalness: 0.75 }),
          10,
        );
      }
    });

    addPart("rearCameras", [-0.95, 2.38, -0.18], (group) => {
      const base = material("#15191f", { metalness: 0.5, roughness: 0.35 });
      const lens = material("#081126", {
        metalness: 0.25,
        roughness: 0.08,
        transmission: 0.28,
        clearcoat: 1,
      });
      [
        [-0.28, 0.35, 0.34],
        [0.32, 0.05, 0.28],
        [-0.25, -0.42, 0.25],
      ].forEach(([x, y, r]) => {
        box(group, [r * 2.3, r * 2.3, 0.18], [x, y, 0], base, r * 0.32);
        cylinder(
          group,
          r,
          0.28,
          [x, y, 0.16],
          material("#202733", { metalness: 0.88, roughness: 0.2 }),
        );
        cylinder(group, r * 0.68, 0.3, [x, y, 0.25], lens);
        cylinder(
          group,
          r * 0.28,
          0.32,
          [x, y, 0.3],
          material("#020306", { roughness: 0.04, transmission: 0.3 }),
        );
      });
    });

    addPart("frontCamera", [0, 2.82, 0.33], (group) => {
      box(
        group,
        [0.52, 0.42, 0.16],
        [0, 0, 0],
        material("#10151c", { metalness: 0.55 }),
        0.09,
      );
      cylinder(
        group,
        0.14,
        0.26,
        [0, 0, 0.14],
        material("#07132b", { transmission: 0.3, roughness: 0.07 }),
      );
    });

    addPart("usb", [0, -2.92, 0.19], (group) => {
      box(
        group,
        [2.2, 0.7, 0.16],
        [0, 0, 0],
        material("#245044", { roughness: 0.55 }),
        0.14,
      );
      box(
        group,
        [0.82, 0.34, 0.28],
        [0, -0.3, 0.06],
        material("#aeb8c1", { metalness: 0.95, roughness: 0.22 }),
        0.1,
      );
      box(
        group,
        [0.56, 0.16, 0.3],
        [0, -0.39, 0.06],
        material("#07090c", { roughness: 0.55 }),
        0.07,
      );
      for (const x of [-0.84, -0.55, 0.55, 0.84])
        cylinder(
          group,
          0.038,
          0.04,
          [x, 0.12, 0.12],
          material("#d5a83b", { metalness: 0.8 }),
          10,
        );
    });

    addPart("speaker", [1.03, -2.3, 0.25], (group) => {
      box(
        group,
        [1.12, 1.02, 0.34],
        [0, 0, 0],
        material("#252c35", { roughness: 0.46, metalness: 0.18 }),
        0.24,
      );
      for (let i = -3; i <= 3; i += 1)
        box(
          group,
          [0.07, 0.58, 0.025],
          [i * 0.115, 0.06, 0.19],
          material("#4a525c"),
          0.03,
        );
    });

    addPart("vibration", [-1.05, -2.25, 0.25], (group) => {
      cylinder(
        group,
        0.48,
        0.3,
        [0, 0, 0],
        material("#8e969f", { metalness: 0.92, roughness: 0.22 }),
        48,
      );
      cylinder(
        group,
        0.26,
        0.32,
        [0, 0, 0.08],
        material("#252a30", { metalness: 0.5, roughness: 0.3 }),
        40,
      );
      cylinder(
        group,
        0.07,
        0.34,
        [0, 0, 0.17],
        material("#d1a442", { metalness: 0.75 }),
        24,
      );
    });

    addPart("flex", [0, 0, 0.38], (group) => {
      const copper = material("#b86a24", { metalness: 0.52, roughness: 0.42 });
      const paths = [
        [
          [-0.72, 1.48, 0],
          [-0.82, 0.4, 0.03],
          [-0.48, -0.72, 0],
          [-0.22, -2.42, 0],
        ],
        [
          [0.7, 1.55, 0],
          [0.84, 0.55, 0.02],
          [0.65, -0.4, 0],
          [0.34, -2.42, 0],
        ],
      ];
      paths.forEach((points) => {
        const curve = new THREE.CatmullRomCurve3(
          points.map(
            (p) => new THREE.Vector3(...(p as [number, number, number])),
          ),
          false,
          "catmullrom",
          0.2,
        );
        const mesh = new THREE.Mesh(
          new THREE.TubeGeometry(curve, 32, 0.065, 6, false),
          copper,
        );
        group.add(mesh);
      });
      box(group, [0.54, 0.42, 0.08], [-0.72, 1.48, 0], copper, 0.05);
      box(group, [0.54, 0.42, 0.08], [0.7, 1.55, 0], copper, 0.05);
    });

    addPart("oled", [0, 0, 0.52], (group) => {
      const panel = box(
        group,
        [3.42, 6.88, 0.13],
        [0, 0, 0],
        material("#151b26", {
          metalness: 0.22,
          roughness: 0.18,
          clearcoat: 0.9,
        }),
        0.4,
      );
      const pixels = plane(
        group,
        [3.2, 6.62],
        [0, 0, 0.08],
        material("#173276", {
          emissive: "#09205c",
          emissiveIntensity: 0.52,
          roughness: 0.16,
          clearcoat: 0.7,
        }),
        0.26,
      );
      panel.userData.noEdge = true;
      pixels.userData.noEdge = true;
    });

    addPart("touch", [0, 0, 0.66], (group) => {
      const touch = plane(
        group,
        [3.48, 6.94],
        [0, 0, 0],
        material("#90b8ff", {
          transparent: true,
          opacity: 0.13,
          transmission: 0.5,
          roughness: 0.08,
        }),
        0.4,
      );
      touch.userData.noEdge = true;
    });

    addPart("glass", [0, 0, 0.76], (group) => {
      const glass = plane(
        group,
        [3.58, 7.05],
        [0, 0, 0],
        material("#dce9ff", {
          transparent: true,
          opacity: 0.22,
          transmission: 0.76,
          roughness: 0.05,
          clearcoat: 1,
          clearcoatRoughness: 0.05,
          ior: 1.52,
        }),
        0.44,
      );
      glass.userData.noEdge = true;
      cylinder(
        group,
        0.115,
        0.14,
        [0, 2.86, 0.04],
        material("#02040a", { opacity: 0.9, roughness: 0.2 }),
        28,
      );
    });

    const homeLineGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(),
      new THREE.Vector3(),
    ]);
    const homeLine = new THREE.Line(
      homeLineGeometry,
      new THREE.LineDashedMaterial({
        color: BLUE,
        dashSize: 0.18,
        gapSize: 0.12,
        transparent: true,
        opacity: 0,
      }),
    );
    homeLine.computeLineDistances();
    scene.add(homeLine);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const pointerStart = new THREE.Vector2();
    let dragging = false;
    let moved = false;
    let dragX = 0;
    let dragY = 0;
    let targetRotX = stage.rotation.x;
    let targetRotY = stage.rotation.y;
    let progress = 0;
    let last = performance.now();
    let frame = 0;

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height, false);
      const aspect = width / Math.max(height, 1);
      const vertical = width < 700 ? 8.6 : 6.3;
      camera.top = vertical;
      camera.bottom = -vertical;
      camera.left = -vertical * aspect;
      camera.right = vertical * aspect;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    const eventPointer = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onPointerDown = (event: PointerEvent) => {
      dragging = true;
      moved = false;
      pointerStart.set(event.clientX, event.clientY);
      dragX = targetRotY;
      dragY = targetRotX;
      renderer.domElement.setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event: PointerEvent) => {
      eventPointer(event);
      if (!dragging) return;
      const dx = event.clientX - pointerStart.x;
      const dy = event.clientY - pointerStart.y;
      if (Math.abs(dx) + Math.abs(dy) > 5) moved = true;
      targetRotY = dragX + dx * 0.007;
      targetRotX = THREE.MathUtils.clamp(dragY + dy * 0.005, -0.65, 0.55);
    };
    const onPointerUp = (event: PointerEvent) => {
      dragging = false;
      if (renderer.domElement.hasPointerCapture(event.pointerId))
        renderer.domElement.releasePointerCapture(event.pointerId);
      if (moved) return;
      eventPointer(event);
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster
        .intersectObject(stage, true)
        .find((intersection) => intersection.object instanceof THREE.Mesh);
      const id = hit?.object.userData.partId as PhonePartId | undefined;
      onSelectRef.current(id ?? null);
    };
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("pointercancel", onPointerUp);

    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const selectedWorld = new THREE.Vector3();
    const homeWorld = new THREE.Vector3();

    const render = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      const target = explodedRef.current ? 1 : 0;
      progress = still.matches
        ? target
        : THREE.MathUtils.damp(progress, target, 4.25, dt);
      if (Math.abs(progress - target) < 0.001) progress = target;
      onProgressRef.current?.(progress);

      stage.rotation.y = still.matches
        ? targetRotY
        : THREE.MathUtils.damp(stage.rotation.y, targetRotY, 8, dt);
      stage.rotation.x = still.matches
        ? targetRotX
        : THREE.MathUtils.damp(stage.rotation.x, targetRotX, 8, dt);

      const active = selectedRef.current;
      parts.forEach((part) => {
        const share = localProgress(progress, PART_BY_ID[part.id].order);
        part.group.position.copy(part.home).addScaledVector(part.offset, share);
        if (active === part.id && progress > 0.35) {
          const lift = part.offset.clone().normalize().multiplyScalar(0.42);
          part.group.position.add(lift);
        }
        const selectedPart = active === part.id;
        const dimmed = active !== null && !selectedPart;
        part.meshes.forEach((mesh) => {
          const mat = mesh.material as THREE.MeshPhysicalMaterial;
          if (mat.userData.baseOpacity === undefined)
            mat.userData.baseOpacity = mat.opacity;
          if (mat.userData.baseTransparent === undefined)
            mat.userData.baseTransparent = mat.transparent;
          const baseOpacity = mat.userData.baseOpacity as number;
          const baseTransparent = mat.userData.baseTransparent as boolean;
          mat.opacity = dimmed ? Math.min(baseOpacity, 0.16) : baseOpacity;
          mat.transparent = dimmed || baseTransparent;
          mat.depthWrite = !mat.transparent;
          if ("emissive" in mat) {
            mat.emissive.lerp(
              selectedPart ? BLUE : DARK,
              still.matches ? 1 : 0.14,
            );
            mat.emissiveIntensity = selectedPart ? 0.9 : 0.04;
          }
        });
        part.edges.forEach((edge) => {
          const edgeMaterial = edge.material as THREE.LineBasicMaterial;
          edgeMaterial.color.lerp(
            selectedPart ? BLUE : new THREE.Color("#526071"),
            0.18,
          );
          edgeMaterial.opacity = dimmed ? 0.06 : selectedPart ? 0.95 : 0.25;
        });
      });

      const desiredTarget = new THREE.Vector3(0, 0, 0);
      if (active) {
        const part = parts.get(active);
        part?.group.getWorldPosition(desiredTarget);
        desiredTarget.multiplyScalar(0.32);
      }
      cameraTarget.lerp(desiredTarget, still.matches ? 1 : 0.075);
      const desiredZoom = active ? 1.14 : progress > 0.5 ? 0.74 : 1;
      camera.zoom = THREE.MathUtils.damp(camera.zoom, desiredZoom, 4.8, dt);
      camera.updateProjectionMatrix();
      camera.lookAt(cameraTarget);

      if (active && progress > 0.3) {
        const part = parts.get(active);
        if (part) {
          part.group.getWorldPosition(selectedWorld);
          homeWorld.copy(part.home);
          stage.localToWorld(homeWorld);
          homeLineGeometry.setFromPoints([selectedWorld, homeWorld]);
          homeLineGeometry.attributes.position.needsUpdate = true;
          homeLine.computeLineDistances();
          (homeLine.material as THREE.LineDashedMaterial).opacity = 0.55;
        }
      } else {
        (homeLine.material as THREE.LineDashedMaterial).opacity = 0;
      }

      shadow.material.opacity = 0.16 - progress * 0.07;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("pointercancel", onPointerUp);
      scene.traverse((object) => {
        if (
          object instanceof THREE.Mesh ||
          object instanceof THREE.LineSegments ||
          object instanceof THREE.Line
        ) {
          object.geometry?.dispose();
          const mats = Array.isArray(object.material)
            ? object.material
            : [object.material];
          mats.forEach((mat) => mat.dispose());
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      className="phone-canvas"
      ref={host}
      role="group"
      aria-label="Modelo tridimensional de un celular Android. Arrastra para girarlo y toca una pieza para seleccionarla."
      data-exploded={exploded ? "true" : "false"}
      data-selected={selected ?? "none"}
    >
      <span className="canvas-hint" aria-hidden="true">
        Arrastra para girar
      </span>
      <span className="canvas-axis" aria-hidden="true">
        <i /> 360°
      </span>
    </div>
  );
}

export { PHONE_PARTS };
export default PhoneExplorer;
