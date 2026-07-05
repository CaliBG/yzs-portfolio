/* ═══════════════════════════════════════════════
   YZS® Hero WebGL — 粒子星尘场
   波浪流动 + 鼠标斥力 + 滚动衰减
   ═══════════════════════════════════════════════ */
(function () {
  const canvas = document.getElementById('webgl');
  if (!canvas || typeof THREE === 'undefined') return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'high-performance' });
  } catch (e) {
    canvas.style.display = 'none';
    return;
  }

  const isMobile = matchMedia('(max-width: 860px), (pointer: coarse)').matches;
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.z = 10;

  // 粒子网格平面
  const COLS = isMobile ? 90 : 160;
  const ROWS = isMobile ? 50 : 90;
  const COUNT = COLS * ROWS;
  const positions = new Float32Array(COUNT * 3);
  const seeds = new Float32Array(COUNT);
  const W = 28, H = 16;
  let i = 0;
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      positions[i * 3] = (x / (COLS - 1) - 0.5) * W;
      positions[i * 3 + 1] = (y / (ROWS - 1) - 0.5) * H;
      positions[i * 3 + 2] = 0;
      seeds[i] = Math.random();
      i++;
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));

  const uniforms = {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(99, 99) },
    uScroll: { value: 0 },
    uPixelRatio: { value: Math.min(devicePixelRatio, 2) },
    uInk: { value: new THREE.Color('#f3efe6') },
    uAccent: { value: new THREE.Color('#ff5a2c') },
  };

  const mat = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: `
      attribute float aSeed;
      uniform float uTime;
      uniform vec2 uMouse;
      uniform float uScroll;
      uniform float uPixelRatio;
      varying float vGlow;
      varying float vSeed;

      void main() {
        vec3 p = position;

        // 多层波浪
        float wave = sin(p.x * 0.55 + uTime * 0.8) * cos(p.y * 0.45 + uTime * 0.6) * 0.9;
        wave += sin(p.x * 0.18 - uTime * 0.4 + aSeed * 6.28) * 0.6;
        p.z += wave;
        p.y += sin(uTime * 0.3 + aSeed * 6.28) * 0.15;

        // 鼠标斥力(世界坐标近似)
        vec2 d = p.xy - uMouse;
        float dist = length(d);
        float force = smoothstep(3.5, 0.0, dist);
        p.xy += normalize(d + 0.0001) * force * 1.6;
        p.z += force * 1.4;

        // 滚动时整体下沉后退
        p.y += uScroll * 6.0;
        p.z -= uScroll * 4.0;

        vGlow = force;
        vSeed = aSeed;

        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        float size = (1.1 + aSeed * 1.6 + force * 2.4) * uPixelRatio;
        gl_PointSize = size * (10.0 / -mv.z);
      }
    `,
    fragmentShader: `
      uniform vec3 uInk;
      uniform vec3 uAccent;
      uniform float uTime;
      varying float vGlow;
      varying float vSeed;

      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        if (d > 0.5) discard;
        float alpha = smoothstep(0.5, 0.05, d);

        float pulse = 0.5 + 0.5 * sin(uTime * 0.7 + vSeed * 6.28);
        vec3 col = mix(uInk, uAccent, clamp(vGlow * 1.4 + pulse * 0.22, 0.0, 1.0));
        float a = alpha * (0.16 + vSeed * 0.22 + vGlow * 0.6);
        gl_FragColor = vec4(col, a);
      }
    `,
  });

  const points = new THREE.Points(geo, mat);
  points.rotation.x = -0.35;
  scene.add(points);

  // 尺寸
  function resize() {
    const w = canvas.clientWidth || innerWidth;
    const h = canvas.clientHeight || innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  addEventListener('resize', resize);

  // 鼠标 → 世界坐标近似映射
  const mouseTarget = new THREE.Vector2(99, 99);
  addEventListener('pointermove', (e) => {
    const nx = (e.clientX / innerWidth) * 2 - 1;
    const ny = -((e.clientY / innerHeight) * 2 - 1);
    mouseTarget.set(nx * W * 0.42, ny * H * 0.5);
  });
  addEventListener('pointerleave', () => mouseTarget.set(99, 99));

  // 滚动进度(hero 区间)
  let scrollN = 0;
  addEventListener('scroll', () => {
    scrollN = Math.min(scrollY / innerHeight, 1.5);
  }, { passive: true });

  const clock = new THREE.Clock();
  let visible = true;
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0 })
    .observe(canvas);

  (function tick() {
    requestAnimationFrame(tick);
    if (!visible) return;
    const t = clock.getElapsedTime();
    uniforms.uTime.value = t;
    uniforms.uScroll.value += (scrollN - uniforms.uScroll.value) * 0.06;
    uniforms.uMouse.value.lerp(mouseTarget, 0.08);
    points.rotation.z = Math.sin(t * 0.05) * 0.04;
    renderer.render(scene, camera);
  })();
})();
