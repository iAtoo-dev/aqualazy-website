'use client';

import { useEffect, useRef } from 'react';

/* ─────────────────────────────────────────────────────────────
   HERO RIPPLE
   Strategy:
   - CPU: 2D wave equation on a Float32 grid (prev/curr/next)
   - GPU: upload packed uint8 texture each frame, render with
          a GLSL shader that unpacks heights → gradient → normals
          → specular highlight + caustic rings
   - Works on all WebGL1 devices (no float texture ext needed)
   - Covers hero section only; pointer-events:auto so clicks/
     touches are captured here and also bubble to buttons below.
───────────────────────────────────────────────────────────── */

const QUAD_VERT = `
attribute vec2 a_pos;
varying vec2 vUv;
void main() {
  vUv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

/* Height packed as uint8 r channel: 0..255 → -1..1
   Gradient → surface normal → specular highlight only.
   Uses ADDITIVE blending on the JS side so the ripple
   adds light on top of the hero colours without washing them out. */
const RENDER_FRAG = `
precision highp float;
uniform sampler2D uTex;
uniform vec2 uTexel;
varying vec2 vUv;

float h(vec2 uv) {
  return texture2D(uTex, uv).r * 2.0 - 1.0;
}

void main() {
  float l = h(vUv + vec2(-uTexel.x,  0.0));
  float r = h(vUv + vec2( uTexel.x,  0.0));
  float t = h(vUv + vec2( 0.0,  uTexel.y));
  float b = h(vUv + vec2( 0.0, -uTexel.y));
  float c = h(vUv);

  /* tighter gradient → sharper normals */
  vec2  grad = vec2(l - r, t - b) * 6.0;
  vec3  N    = normalize(vec3(grad, 1.0));
  vec3  L    = normalize(vec3(0.35, 0.6, 1.0));

  /* tight specular highlight (power 24 = very sharp glint) */
  float spec  = pow(max(dot(N, L), 0.0), 24.0);

  /* thin caustic ring only at wave crests, not the whole body */
  float crest = smoothstep(0.06, 0.10, abs(c)) * smoothstep(0.18, 0.10, abs(c));

  /* aqua-white light colour */
  vec3  col   = vec3(0.72, 0.93, 1.0) * spec
              + vec3(0.55, 0.85, 1.0) * crest * 0.35;

  /* alpha: ONLY the glints and caustic rings — zero everywhere else.
     No abs(c) term so the flat wave body stays invisible. */
  float alpha = clamp(spec * 0.75 + crest * 0.30, 0.0, 0.65);

  gl_FragColor = vec4(col * alpha, alpha);
}`;

export default function HeroRipple() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: true, antialias: false, depth: false, stencil: false,
      premultipliedAlpha: false, powerPreference: 'high-performance',
    });
    if (!gl) return;

    /* ── compile & link ──────────────────────────────── */
    function mkShader(type: number, src: string) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src); gl!.compileShader(s); return s;
    }
    const prog = gl.createProgram()!;
    gl.attachShader(prog, mkShader(gl.VERTEX_SHADER,   QUAD_VERT));
    gl.attachShader(prog, mkShader(gl.FRAGMENT_SHADER, RENDER_FRAG));
    gl.linkProgram(prog);

    const aPos   = gl.getAttribLocation(prog,  'a_pos');
    const uTex   = gl.getUniformLocation(prog, 'uTex');
    const uTexel = gl.getUniformLocation(prog, 'uTexel');

    /* ── quad VBO ────────────────────────────────────── */
    const vbo = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

    /* ── simulation grid ─────────────────────────────── */
    const SCALE = 0.3; // sim resolution relative to canvas
    let   W = 1, H = 1;
    let   prev: Float32Array, curr: Float32Array, next: Float32Array;
    let   rgba: Uint8Array;

    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    function allocSim(w: number, h: number) {
      W = w; H = h;
      prev = new Float32Array(W * H);
      curr = new Float32Array(W * H);
      next = new Float32Array(W * H);
      rgba = new Uint8Array(W * H * 4);
    }

    function resize() {
      const w = canvas!.offsetWidth  || window.innerWidth;
      const h = canvas!.offsetHeight || window.innerHeight;
      canvas!.width  = w;
      canvas!.height = h;
      gl!.viewport(0, 0, w, h);
      const nW = Math.max(Math.floor(w * SCALE), 64);
      const nH = Math.max(Math.floor(h * SCALE), 64);
      if (nW !== W || nH !== H) allocSim(nW, nH);
    }
    allocSim(64, 64); // default before first resize
    resize();

    /* ── wave step (CPU) ─────────────────────────────── */
    const DAMP = 0.983;
    function step() {
      for (let y = 1; y < H - 1; y++) {
        for (let x = 1; x < W - 1; x++) {
          const i = y * W + x;
          next[i] = ((curr[i-1] + curr[i+1] + curr[i-W] + curr[i+W]) * 0.5 - prev[i]) * DAMP;
        }
      }
      prev.set(curr);
      curr.set(next);
    }

    /* ── pack + upload ───────────────────────────────── */
    function upload() {
      for (let i = 0; i < W * H; i++) {
        rgba[i*4]   = Math.floor((Math.max(-1, Math.min(1, curr[i])) + 1.0) * 0.5 * 255);
        rgba[i*4+1] = rgba[i*4+2] = 0;
        rgba[i*4+3] = 255;
      }
      gl!.bindTexture(gl!.TEXTURE_2D, tex);
      gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, W, H, 0, gl!.RGBA, gl!.UNSIGNED_BYTE, rgba);
    }

    /* ── splat a drop into sim grid ──────────────────── */
    function splat(nx: number, ny: number, strength: number) {
      const px = Math.floor(nx * W);
      const py = Math.floor((1 - ny) * H);
      const r  = Math.max(2, Math.ceil(W * 0.045));
      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          const d = Math.sqrt(dx*dx + dy*dy);
          if (d > r) continue;
          const x = px + dx, y = py + dy;
          if (x < 0 || x >= W || y < 0 || y >= H) continue;
          curr[y * W + x] += strength * (1 - d / r);
        }
      }
    }

    /* ── input state ─────────────────────────────────── */
    const pending: Array<[number, number, number]> = [];
    let lastMove = 0;
    let lastTouch = 0;

    function fromClient(cx: number, cy: number): [number, number] {
      const r = canvas!.getBoundingClientRect();
      return [(cx - r.left) / r.width, (cy - r.top) / r.height];
    }

    function onMouseMove(e: MouseEvent) {
      const now = performance.now();
      if (now - lastMove < 20) return; // ~50fps throttle
      lastMove = now;
      const [nx, ny] = fromClient(e.clientX, e.clientY);
      if (nx >= 0 && nx <= 1 && ny >= 0 && ny <= 1)
        pending.push([nx, ny, 0.30]);
    }
    function onMouseDown(e: MouseEvent) {
      const [nx, ny] = fromClient(e.clientX, e.clientY);
      if (nx >= 0 && nx <= 1 && ny >= 0 && ny <= 1)
        pending.push([nx, ny, 1.0]);
    }
    function onTouchStart(e: TouchEvent) {
      for (let i = 0; i < e.touches.length; i++) {
        const [nx, ny] = fromClient(e.touches[i].clientX, e.touches[i].clientY);
        if (nx >= 0 && nx <= 1 && ny >= 0 && ny <= 1)
          pending.push([nx, ny, 1.1]);
      }
    }
    function onTouchMove(e: TouchEvent) {
      const now = performance.now();
      if (now - lastTouch < 30) return;
      lastTouch = now;
      for (let i = 0; i < e.touches.length; i++) {
        const [nx, ny] = fromClient(e.touches[i].clientX, e.touches[i].clientY);
        if (nx >= 0 && nx <= 1 && ny >= 0 && ny <= 1)
          pending.push([nx, ny, 0.55]);
      }
    }

    canvas.addEventListener('mousemove',  onMouseMove,  { passive: true });
    canvas.addEventListener('mousedown',  onMouseDown,  { passive: true });
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchmove',  onTouchMove,  { passive: true });
    window.addEventListener('resize',     resize,       { passive: true });

    /* ── render loop ─────────────────────────────────── */
    gl.enable(gl.BLEND);
    /* Additive blending: ripple light is ADDED on top of the scene,
       never desaturates / whitens the underlying hero colours.
       Equivalent to Photoshop "Screen" / "Add" layer mode. */
    gl.blendFunc(gl.ONE, gl.ONE);

    let raf = 0;
    function loop() {
      // Apply pending input
      for (const [x, y, s] of pending) splat(x, y, s);
      pending.length = 0;

      step();
      upload();

      gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
      gl!.clearColor(0, 0, 0, 0);
      gl!.clear(gl!.COLOR_BUFFER_BIT);

      gl!.useProgram(prog);
      gl!.bindBuffer(gl!.ARRAY_BUFFER, vbo);
      gl!.enableVertexAttribArray(aPos);
      gl!.vertexAttribPointer(aPos, 2, gl!.FLOAT, false, 0, 0);

      gl!.activeTexture(gl!.TEXTURE0);
      gl!.bindTexture(gl!.TEXTURE_2D, tex);
      gl!.uniform1i(uTex, 0);
      gl!.uniform2f(uTexel, 1 / W, 1 / H);

      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);

      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener('mousemove',  onMouseMove);
      canvas.removeEventListener('mousedown',  onMouseDown);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove',  onTouchMove);
      window.removeEventListener('resize',     resize);
      gl.deleteProgram(prog);
      gl.deleteBuffer(vbo);
      gl.deleteTexture(tex);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 5,
        display: 'block',
        // pointer-events ON so we capture mouse/touch,
        // buttons above (z-10) still receive clicks correctly
        pointerEvents: 'auto',
      }}
      aria-hidden
    />
  );
}
