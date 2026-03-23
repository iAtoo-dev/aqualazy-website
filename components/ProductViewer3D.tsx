'use client';

import { useEffect, useRef } from 'react';

/* ─── 4×4 matrix helpers ─────────────────────────────────────── */
type M4 = Float32Array;
const m4 = (): M4 => new Float32Array(16);

function identity(m: M4): M4 {
  m.fill(0); m[0] = m[5] = m[10] = m[15] = 1; return m;
}
function perspective(m: M4, fovY: number, aspect: number, near: number, far: number): M4 {
  const f = 1 / Math.tan(fovY / 2);
  m.fill(0); m[0] = f/aspect; m[5] = f;
  m[10] = (far+near)/(near-far); m[11] = -1; m[14] = 2*far*near/(near-far); return m;
}
function multiply(a: M4, b: M4): M4 {
  const o = m4();
  for (let i=0; i<4; i++) for (let j=0; j<4; j++) { let s=0; for(let k=0;k<4;k++) s+=a[i+k*4]*b[k+j*4]; o[i+j*4]=s; }
  return o;
}
function rotateY(m: M4, a: number): M4 {
  const c=Math.cos(a), s=Math.sin(a);
  const [a0,a1,a2,a3,a8,a9,a10,a11]=[m[0],m[1],m[2],m[3],m[8],m[9],m[10],m[11]];
  m[0]=c*a0+s*a8; m[1]=c*a1+s*a9; m[2]=c*a2+s*a10; m[3]=c*a3+s*a11;
  m[8]=-s*a0+c*a8; m[9]=-s*a1+c*a9; m[10]=-s*a2+c*a10; m[11]=-s*a3+c*a11; return m;
}
function rotateX(m: M4, a: number): M4 {
  const c=Math.cos(a), s=Math.sin(a);
  const [a4,a5,a6,a7,a8,a9,a10,a11]=[m[4],m[5],m[6],m[7],m[8],m[9],m[10],m[11]];
  m[4]=c*a4+s*a8; m[5]=c*a5+s*a9; m[6]=c*a6+s*a10; m[7]=c*a7+s*a11;
  m[8]=-s*a4+c*a8; m[9]=-s*a5+c*a9; m[10]=-s*a6+c*a10; m[11]=-s*a7+c*a11; return m;
}
function rotateZ(m: M4, a: number): M4 {
  const c=Math.cos(a), s=Math.sin(a);
  const [a0,a1,a2,a3,a4,a5,a6,a7]=[m[0],m[1],m[2],m[3],m[4],m[5],m[6],m[7]];
  m[0]=c*a0-s*a4; m[1]=c*a1-s*a5; m[2]=c*a2-s*a6; m[3]=c*a3-s*a7;
  m[4]=s*a0+c*a4; m[5]=s*a1+c*a5; m[6]=s*a2+c*a6; m[7]=s*a3+c*a7; return m;
}
function setScale(m: M4, sx: number, sy: number, sz: number): M4 {
  m[0]*=sx; m[1]*=sx; m[2]*=sx;
  m[4]*=sy; m[5]*=sy; m[6]*=sy;
  m[8]*=sz; m[9]*=sz; m[10]*=sz; return m;
}
function setTranslate(m: M4, tx: number, ty: number, tz: number): M4 {
  m[12]=m[0]*tx+m[4]*ty+m[8]*tz+m[12];
  m[13]=m[1]*tx+m[5]*ty+m[9]*tz+m[13];
  m[14]=m[2]*tx+m[6]*ty+m[10]*tz+m[14];
  m[15]=m[3]*tx+m[7]*ty+m[11]*tz+m[15]; return m;
}

/* ─── GLSL shaders ───────────────────────────────────────────── */
const VERT = `
attribute vec3 a_pos;
attribute vec3 a_norm;
uniform mat4 u_mvp;
uniform mat4 u_model;
varying vec3 vN;
void main() {
  vN = normalize((u_model * vec4(a_norm, 0.0)).xyz);
  gl_Position = u_mvp * vec4(a_pos, 1.0);
}`;

const FRAG = `
precision mediump float;
uniform float u_t;
uniform vec3  u_col;
uniform vec3  u_emit;
uniform float u_emi;
varying vec3  vN;
void main() {
  vec3 l1 = normalize(vec3(1.5, 2.0, 2.0));
  vec3 l2 = normalize(vec3(-1.5,-1.0, 1.0));
  float d1 = max(dot(vN, l1), 0.0);
  float d2 = max(dot(vN, l2), 0.0) * 0.5;
  float rim = pow(1.0 - abs(dot(vN, vec3(0,0,1))), 3.0);
  float pulse = sin(u_t * 1.5) * 0.2 + 0.8;
  vec3 col = u_col * (d1*1.2 + d2*0.6 + 0.15)
           + u_emit * u_emi * pulse
           + vec3(0.494,0.843,1.0) * rim * 0.6;
  col = col/(col+0.6);
  col = pow(max(col,0.0), vec3(1.0/2.2));
  gl_FragColor = vec4(col, 0.9);
}`;

/* ─── Geometry builders ──────────────────────────────────────── */
function icosphere(subdivs = 2) {
  const T = (1+Math.sqrt(5))/2;
  const verts = [
    [-1,T,0],[1,T,0],[-1,-T,0],[1,-T,0],
    [0,-1,T],[0,1,T],[0,-1,-T],[0,1,-T],
    [T,0,-1],[T,0,1],[-T,0,-1],[-T,0,1],
  ].map(([x,y,z])=>{ const l=Math.sqrt(x*x+y*y+z*z); return [x/l,y/l,z/l]; });

  let tris: [number,number,number][] = [
    [0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],
    [1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],
    [3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],
    [4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1],
  ];

  function mid(a: number[], b: number[]) {
    const m = [(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2];
    const l = Math.sqrt(m[0]*m[0]+m[1]*m[1]+m[2]*m[2]);
    return [m[0]/l,m[1]/l,m[2]/l];
  }

  for (let s=0; s<subdivs; s++) {
    const next: [number,number,number][] = [];
    const cache = new Map<string,number>();
    const get = (i: number,j: number) => {
      const k=`${Math.min(i,j)}_${Math.max(i,j)}`;
      if (!cache.has(k)) { cache.set(k, verts.length); verts.push(mid(verts[i],verts[j])); }
      return cache.get(k)!;
    };
    for (const [a,b,c] of tris) {
      const ab=get(a,b), bc=get(b,c), ac=get(a,c);
      next.push([a,ab,ac],[b,bc,ab],[c,ac,bc],[ab,bc,ac]);
    }
    tris = next;
  }

  const pos: number[]=[], nor: number[]=[];
  for (const [a,b,c] of tris) {
    for (const i of [a,b,c]) { pos.push(...verts[i]); nor.push(...verts[i]); }
  }
  return { pos: new Float32Array(pos), nor: new Float32Array(nor) };
}

function torus(R: number, r: number, segR=64, segT=16) {
  const pos: number[]=[], nor: number[]=[];
  for (let i=0; i<segR; i++) for (let j=0; j<segT; j++) {
    for (const [si,sj] of [[i,j],[i+1,j],[i,j+1],[i+1,j],[i+1,j+1],[i,j+1]]) {
      const phi   = (si/segR)*Math.PI*2, theta = (sj/segT)*Math.PI*2;
      const nx=Math.cos(phi)*Math.cos(theta), ny=Math.sin(phi)*Math.cos(theta), nz=Math.sin(theta);
      pos.push(R*Math.cos(phi)+r*nx, R*Math.sin(phi)+r*ny, r*nz);
      nor.push(nx, ny, nz);
    }
  }
  return { pos: new Float32Array(pos), nor: new Float32Array(nor) };
}

/* ─── Component ──────────────────────────────────────────────── */
export default function ProductViewer3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: false });
    if (!gl) return;

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0,0,0,0);

    /* compile program */
    const mkShader = (type: number, src: string) => {
      const s = gl.createShader(type)!; gl.shaderSource(s,src); gl.compileShader(s); return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, mkShader(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, mkShader(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);

    const aPos  = gl.getAttribLocation(prog, 'a_pos');
    const aNorm = gl.getAttribLocation(prog, 'a_norm');
    const uMVP  = gl.getUniformLocation(prog, 'u_mvp');
    const uMod  = gl.getUniformLocation(prog, 'u_model');
    const uT    = gl.getUniformLocation(prog, 'u_t');
    const uCol  = gl.getUniformLocation(prog, 'u_col');
    const uEmit = gl.getUniformLocation(prog, 'u_emit');
    const uEmi  = gl.getUniformLocation(prog, 'u_emi');

    /* build meshes */
    const mkBufs = (g: { pos: Float32Array; nor: Float32Array }) => {
      const pb = gl.createBuffer()!; gl.bindBuffer(gl.ARRAY_BUFFER, pb); gl.bufferData(gl.ARRAY_BUFFER, g.pos, gl.STATIC_DRAW);
      const nb = gl.createBuffer()!; gl.bindBuffer(gl.ARRAY_BUFFER, nb); gl.bufferData(gl.ARRAY_BUFFER, g.nor, gl.STATIC_DRAW);
      return { pb, nb, n: g.pos.length/3 };
    };
    const outer  = mkBufs(icosphere(3));
    const inner  = mkBufs(icosphere(2));
    const ring1  = mkBufs(torus(1.25, 0.025));
    const ring2  = mkBufs(torus(1.35, 0.012));
    const dropGeo= mkBufs(icosphere(1));

    const drops = Array.from({length:12},(_,i)=>({
      angle: (i/12)*Math.PI*2,
      radius: 1.8+Math.sin(i*1.3)*0.3,
      y: Math.sin(i*0.7)*0.6,
      scale: 0.06+(i%3)*0.02,
    }));

    const proj = m4(); const view = m4(); identity(view); setTranslate(view, 0, 0, -3.5);

    const drawMesh = (buf: typeof outer, model: M4, col: [number,number,number], emit: [number,number,number], emi: number, t: number) => {
      const mvp = multiply(multiply(proj, view), model);
      gl.useProgram(prog);
      gl.uniformMatrix4fv(uMVP, false, mvp);
      gl.uniformMatrix4fv(uMod, false, model);
      gl.uniform1f(uT, t);
      gl.uniform3f(uCol,  ...col);
      gl.uniform3f(uEmit, ...emit);
      gl.uniform1f(uEmi,  emi);
      gl.bindBuffer(gl.ARRAY_BUFFER, buf.pb); gl.enableVertexAttribArray(aPos);  gl.vertexAttribPointer(aPos,  3, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, buf.nb); gl.enableVertexAttribArray(aNorm); gl.vertexAttribPointer(aNorm, 3, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLES, 0, buf.n);
    };

    const start = performance.now();
    const render = () => {
      const t = (performance.now()-start)/1000;
      const w = canvas.clientWidth || 400, h = canvas.clientHeight || 480;
      canvas.width = w; canvas.height = h;
      gl.viewport(0, 0, w, h);
      perspective(proj, Math.PI/3, w/h, 0.1, 20);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // Outer
      const mo = identity(m4()); rotateY(mo, t*0.2); rotateX(mo, Math.sin(t*.4)*.1); setScale(mo, .92,.92,.92);
      drawMesh(outer, mo, [0.102,0.294,0.486], [0.051,0.188,0.376], 0.3, t);

      // Inner
      const mi = identity(m4()); rotateY(mi, -t*0.3); rotateX(mi, Math.sin(t*.5)*.1); setScale(mi, .6,.6,.6);
      drawMesh(inner, mi, [0.494,0.843,1.0], [0.647,0.945,1.0], 0.6, t);

      // Ring 1
      const mr1 = identity(m4()); rotateX(mr1, Math.PI/2+Math.sin(t*.3)*.05); rotateY(mr1, t*.15);
      drawMesh(ring1, mr1, [0.494,0.843,1.0], [0.647,0.945,1.0], 1.2, t);

      // Ring 2
      const mr2 = identity(m4()); rotateZ(mr2, Math.PI/3);
      drawMesh(ring2, mr2, [0.647,0.945,1.0], [0.494,0.843,1.0], 0.8, t);

      // Droplets
      for (const d of drops) {
        const o = d.angle + t*0.4;
        const md = identity(m4());
        setTranslate(md, Math.cos(o)*d.radius, d.y+Math.sin(t*1.5+d.angle)*.15, Math.sin(o)*d.radius);
        setScale(md, d.scale, d.scale, d.scale);
        drawMesh(dropGeo, md, [0.647,0.945,1.0], [0.494,0.843,1.0], 0.8, t);
      }

      rafRef.current = requestAnimationFrame(render);
    };
    rafRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <canvas ref={canvasRef} style={{ width:'100%', height:'100%', display:'block', background:'transparent' }} />
  );
}
