'use client';

import { useEffect, useRef, useCallback } from 'react';

/* ─────────────────────────────────────────────────────────────
   WATER VERTEX SHADER (full-screen quad)
───────────────────────────────────────────────────────────── */
const VERT_SRC = `
attribute vec2 a_position;
varying vec2 vUv;
void main() {
  vUv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

/* ─────────────────────────────────────────────────────────────
   WATER FRAGMENT SHADER
   - Caustics via iterative FBM noise
   - God rays (radial streaks)
   - Ripple propagation (8 sources)
   - Scroll-based wave warp
   - Mouse micro-distortion
   - Chromatic aberration on edges
───────────────────────────────────────────────────────────── */
const FRAG_SRC = `
precision highp float;

uniform float uTime;
uniform vec2  uResolution;
uniform vec2  uMouse;
uniform float uScrollY;
uniform float uScrollVel;
uniform vec4  uRipples[8];

varying vec2 vUv;

/* ── Hash & Noise ─────────────────────────────────────── */
vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(dot(hash2(i + vec2(0,0)), f - vec2(0,0)),
        dot(hash2(i + vec2(1,0)), f - vec2(1,0)), u.x),
    mix(dot(hash2(i + vec2(0,1)), f - vec2(0,1)),
        dot(hash2(i + vec2(1,1)), f - vec2(1,1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5, f = 1.0;
  for (int i = 0; i < 6; i++) { v += a * noise(p * f); f *= 2.1; a *= 0.48; }
  return v;
}

/* ── Caustics ─────────────────────────────────────────── */
float caustics(vec2 uv, float t) {
  vec2 p = uv * 4.0 + t * 0.08;
  float c = 0.0, amp = 1.0;
  for (int i = 0; i < 4; i++) {
    p = abs(p) / max(dot(p, p), 0.001) - 1.0;
    c += abs(length(p) - amp) * amp;
    amp *= 0.6;
  }
  return pow(clamp(1.0 - c * 0.5, 0.0, 1.0), 3.0);
}

/* ── Single ripple contribution ───────────────────────── */
float rippleAt(vec2 uv, vec4 r) {
  if (r.z < 0.0) return 0.0;
  float age  = uTime - r.z;
  float dist = length(uv - r.xy) * 4.0;
  float rad  = age * 2.0;
  float env  = exp(-age * 1.2) * r.w;
  float wave = sin((dist - rad) * 30.0) * exp(-pow(dist - rad, 2.0) / 0.0016);
  return wave * env * step(0.01, dist);
}

/* ── God rays ─────────────────────────────────────────── */
float godRays(vec2 uv, float t) {
  float rays = 0.0;
  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    float angle = fi * 1.2566 + t * 0.05;
    vec2 dir = vec2(cos(angle), sin(angle) * 0.3);
    float d = dot(uv - vec2(0.5, 1.2), dir);
    float w = sin(d * 14.0 + t * 0.3 + fi) * 0.5 + 0.5;
    rays += w * exp(-abs(d) * 5.0) * 0.18;
  }
  return rays;
}

void main() {
  vec2 uv = vUv;
  float t = uTime;

  /* scroll warp */
  float scrollUV = uScrollY * 0.00025;
  float warpAmp  = 0.012 + abs(uScrollVel) * 0.004;
  uv.y += scrollUV;

  float wx = fbm(uv * 2.5 + vec2(t * 0.04, 0.0)) * warpAmp;
  float wy = fbm(uv * 2.5 + vec2(0.0, t * 0.04) + 3.7) * warpAmp;
  vec2  wuv = uv + vec2(wx, wy);

  /* mouse micro-ripple */
  float md = length(vUv - uMouse);
  float mr = sin(md * 40.0 - t * 4.0) * exp(-md * 6.0) * 0.015;
  wuv += normalize(vUv - uMouse + 0.0001) * mr;

  /* procedural ripple rings */
  float totalRipple = 0.0;
  for (int i = 0; i < 8; i++) totalRipple += rippleAt(vUv, uRipples[i]);
  wuv += normalize(vec2(totalRipple) + 0.001) * totalRipple * 0.008;

  /* base ocean color */
  vec3 deep    = vec3(0.039, 0.145, 0.251);
  vec3 mid     = vec3(0.051, 0.188, 0.376);
  vec3 shallow = vec3(0.102, 0.294, 0.486);
  float depth  = smoothstep(0.0, 1.0, vUv.y);
  vec3 col     = mix(deep, mix(mid, shallow, depth * 0.7), depth);

  /* caustics */
  float c1 = caustics(wuv * 1.0, t);
  float c2 = caustics(wuv * 1.7 + vec2(0.5, 0.3), t * 1.2);
  float caus = c1 * 0.6 + c2 * 0.35;
  col = mix(col, col + vec3(0.494, 0.843, 1.0) * 0.22, caus * 0.8);

  /* god rays */
  col += vec3(0.494, 0.843, 1.0) * godRays(wuv, t) * 0.35;

  /* surface foam */
  float foam = fbm(wuv * 6.0 + t * 0.06);
  col += vec3(1.0) * smoothstep(0.55, 0.75, foam) * 0.15;

  /* ripple brightness */
  col += vec3(0.494, 0.843, 1.0) * abs(totalRipple) * 0.35;

  /* chromatic aberration */
  float eDist = length(vUv - 0.5) * 2.0;
  float aberr = smoothstep(0.6, 1.0, eDist) * 0.005;
  vec2  aDir  = normalize(vUv - 0.5);
  col.r += (fbm((vUv + aDir * aberr) * 2.5 + t * 0.04) - 0.5) * 0.015;
  col.b += (fbm((vUv - aDir * aberr) * 2.5 + t * 0.04) - 0.5) * 0.015;

  /* vignette + tone map + gamma */
  col *= clamp(1.0 - eDist * 0.4, 0.65, 1.0);
  col  = col / (col + 0.6);
  col  = pow(max(col, 0.0), vec3(1.0 / 2.2));

  gl_FragColor = vec4(col, 1.0);
}
`;

/* ─── WebGL helpers ──────────────────────────────────────────── */
function compileShader(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error('Shader error:', gl.getShaderInfoLog(sh));
  }
  return sh;
}

function createProgram(gl: WebGLRenderingContext) {
  const prog = gl.createProgram()!;
  gl.attachShader(prog, compileShader(gl, gl.VERTEX_SHADER, VERT_SRC));
  gl.attachShader(prog, compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(prog));
  }
  return prog;
}

/* ─────────────────────────────────────────────────────────────
   Main component – pure vanilla WebGL, zero React Three Fiber
───────────────────────────────────────────────────────────── */
export default function WaterBackground() {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const rafRef      = useRef<number>(0);
  const stateRef    = useRef({
    scrollY: 0, scrollVel: 0, lastScrollY: 0,
    mouse: [0.5, 0.5] as [number, number],
    ripples: Array.from({ length: 8 }, () => [0, 0, -999, 0]) as [number, number, number, number][],
    rippleIdx: 0,
    lastRippleTime: 0,
  });

  const addRipple = useCallback((x: number, y: number, strength = 1.0) => {
    const s = stateRef.current;
    const now = performance.now() / 1000;
    const idx = s.rippleIdx % 8;
    s.ripples[idx] = [x, y, now, strength];
    s.rippleIdx++;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      antialias: false, alpha: false,
      powerPreference: 'high-performance',
      stencil: false, depth: false,
    });
    if (!gl) return;

    const prog  = createProgram(gl);
    const aPos  = gl.getAttribLocation(prog, 'a_position');
    const uTime = gl.getUniformLocation(prog, 'uTime');
    const uRes  = gl.getUniformLocation(prog, 'uResolution');
    const uMouse= gl.getUniformLocation(prog, 'uMouse');
    const uSY   = gl.getUniformLocation(prog, 'uScrollY');
    const uSV   = gl.getUniformLocation(prog, 'uScrollVel');
    const uRips = Array.from({ length: 8 }, (_, i) =>
      gl.getUniformLocation(prog, `uRipples[${i}]`)
    );

    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

    const dpr = Math.min(window.devicePixelRatio, 1.5);

    function resize() {
      canvas!.width  = Math.floor(window.innerWidth  * dpr);
      canvas!.height = Math.floor(window.innerHeight * dpr);
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    let startTime = performance.now();

    function render() {
      const s = stateRef.current;
      const t = (performance.now() - startTime) / 1000;

      gl!.useProgram(prog);
      gl!.bindBuffer(gl!.ARRAY_BUFFER, vbo);
      gl!.enableVertexAttribArray(aPos);
      gl!.vertexAttribPointer(aPos, 2, gl!.FLOAT, false, 0, 0);

      gl!.uniform1f(uTime,  t);
      gl!.uniform2f(uRes,   canvas!.width, canvas!.height);
      gl!.uniform2f(uMouse, s.mouse[0], s.mouse[1]);
      gl!.uniform1f(uSY,    s.scrollY);
      gl!.uniform1f(uSV,    s.scrollVel);

      for (let i = 0; i < 8; i++) {
        const r = s.ripples[i];
        gl!.uniform4f(uRips[i]!, r[0], r[1], r[2], r[3]);
      }

      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
      rafRef.current = requestAnimationFrame(render);
    }
    rafRef.current = requestAnimationFrame(render);

    /* ── Event listeners ───────────────────────────────── */
    let rippleTimer = 0;

    function onScroll() {
      const s = stateRef.current;
      s.scrollVel = window.scrollY - s.lastScrollY;
      s.lastScrollY = window.scrollY;
      s.scrollY = window.scrollY;

      const now = performance.now();
      if (now - rippleTimer > 400 && Math.abs(s.scrollVel) > 3) {
        rippleTimer = now;
        addRipple(0.5, 0.35 + Math.random() * 0.3, Math.min(Math.abs(s.scrollVel) * 0.04, 1.2));
      }
    }

    function onMouseMove(e: MouseEvent) {
      stateRef.current.mouse = [e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight];
    }

    function onTouch(e: TouchEvent) {
      const t = e.touches[0];
      const x = t.clientX / window.innerWidth;
      const y = 1 - t.clientY / window.innerHeight;
      stateRef.current.mouse = [x, y];
      addRipple(x, y, 0.8);
    }

    function onClick(e: MouseEvent) {
      addRipple(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight, 1.4);
    }

    window.addEventListener('scroll',    onScroll,    { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouch,     { passive: true });
    window.addEventListener('click',     onClick,     { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize',    resize);
      window.removeEventListener('scroll',    onScroll);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('click',     onClick);
      gl.deleteProgram(prog);
      gl.deleteBuffer(vbo);
    };
  }, [addRipple]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        display: 'block',
      }}
      aria-hidden
    />
  );
}
