"use client";

import { useEffect, useRef } from "react";

/**
 * Renders the hero background video through a WebGL water-ripple shader.
 * The video plays underneath (as the texture source and as the pre-WebGL
 * fallback) and the canvas draws the rippled, opaque result on top.
 *
 * Adapted from a still-image ripple shader: the texture is refreshed from the
 * <video> each frame (downsampled through an offscreen canvas so the 4K upload
 * stays cheap), the fixed/fullscreen chrome and file-picker are removed, and the
 * output fills the frame instead of fading at the edges.
 */

type RippleParams = {
  blueish: number;
  scale: number;
  illumination: number;
  surfaceDistortion: number;
  waterDistortion: number;
};

const DEFAULTS: RippleParams = {
  blueish: 0.6,
  // Barely-there water: near-zero distortion so the image stays undistorted;
  // the illumination sheen carries the effect.
  scale: 1.5,
  illumination: 0.09,
  surfaceDistortion: 0.003,
  waterDistortion: 0.003,
};

/** Cap the texture width — the ripple hides fine detail, so 4K upload is waste. */
const TEXTURE_CAP = 1440;

const VERT = `
precision mediump float;
varying vec2 vUv;
attribute vec2 a_position;
void main() {
  vUv = .5 * (a_position + 1.);
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAG = `
precision mediump float;

varying vec2 vUv;
uniform sampler2D u_image_texture;
uniform float u_time;
uniform float u_ratio;
uniform float u_img_ratio;
uniform float u_blueish;
uniform float u_scale;
uniform float u_illumination;
uniform float u_surface_distortion;
uniform float u_water_distortion;

vec3 mod289(vec3 x) { return x - floor(x * (1. / 289.)) * 289.; }
vec2 mod289(vec2 x) { return x - floor(x * (1. / 289.)) * 289.; }
vec3 permute(vec3 x) { return mod289(((x*34.)+1.)*x); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1., 0.) : vec2(0., 1.);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0., i1.y, 1.)) + i.x + vec3(0., i1.x, 1.));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.);
  m = m*m;
  m = m*m;
  vec3 x = 2. * fract(p * C.www) - 1.;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130. * dot(m, g);
}

mat2 rotate2D(float r) {
  return mat2(cos(r), sin(r), -sin(r), cos(r));
}

float surface_noise(vec2 uv, float t, float scale) {
  vec2 n = vec2(.1);
  vec2 N = vec2(.1);
  mat2 m = rotate2D(.5);
  for (int j = 0; j < 10; j++) {
    uv *= m;
    n *= m;
    vec2 q = uv * scale + float(j) + n + (.5 + .5 * float(j)) * (mod(float(j), 2.) - 1.) * t;
    n += sin(q);
    N += cos(q) / scale;
    scale *= 1.2;
  }
  return (N.x + N.y + .1);
}

void main() {
  vec2 uv = vUv;
  uv.y = 1. - uv.y;
  uv.x *= u_ratio;

  float t = .002 * u_time;

  float outer_noise = snoise((.3 + .1 * sin(t)) * uv + vec2(0., .2 * t));
  vec2 surface_noise_uv = 2. * uv + (outer_noise * .2);

  float surf = surface_noise(surface_noise_uv, t, u_scale);
  surf *= pow(uv.y, .3);
  surf = pow(surf, 2.);

  // Cover-fit the video into the canvas, with a small zoom so the distortion
  // stays within the texture (no clamped-edge smearing).
  vec2 img_uv = vUv;
  img_uv -= .5;
  if (u_ratio > u_img_ratio) {
    img_uv.y = img_uv.y * u_img_ratio / u_ratio;
  } else {
    img_uv.x = img_uv.x * u_ratio / u_img_ratio;
  }
  float scale_factor = 1.22;
  img_uv *= scale_factor;
  img_uv += .5;
  img_uv.y = 1. - img_uv.y;

  // Confine the ripple to the frame edges — keep the centre (the subject) clean.
  vec2 ec = abs(vUv - .5) * 2.;
  float edge = smoothstep(.55, .98, max(ec.x, ec.y));

  img_uv += (u_water_distortion * outer_noise) * edge;
  img_uv += (u_surface_distortion * surf) * edge;

  vec3 color = vec3(0.);
  vec4 img = texture2D(u_image_texture, img_uv);
  img *= (1. + u_illumination * surf * edge);
  color += img.rgb;
  color += u_illumination * vec3(1. - u_blueish, 1., 1.) * surf * edge;

  gl_FragColor = vec4(color, 1.0);
}
`;

function compileShader(gl: WebGLRenderingContext, src: string, type: number) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(sh);
    gl.deleteShader(sh);
    throw new Error(`Shader compile error: ${info || "unknown"}`);
  }
  return sh;
}

function createProgram(gl: WebGLRenderingContext, vs: string, fs: string) {
  const v = compileShader(gl, vs, gl.VERTEX_SHADER);
  const f = compileShader(gl, fs, gl.FRAGMENT_SHADER);
  const prog = gl.createProgram()!;
  gl.attachShader(prog, v);
  gl.attachShader(prog, f);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(prog);
    gl.deleteProgram(prog);
    throw new Error(`Program link error: ${info || "unknown"}`);
  }
  return prog;
}

export function HeroRipple({
  className = "",
  params,
}: {
  className?: string;
  params?: Partial<RippleParams>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const p = { ...DEFAULTS, ...params };
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Serve the lighter 1080p encode to phones, 4K to larger screens.
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    video.src = mobile ? "/assets/hero-bg-mobile.mp4" : "/assets/hero-bg.mp4";

    // Autoplay may be blocked until a gesture — retry once on the first.
    const kick = () => {
      void video.play().catch(() => {});
    };
    kick();
    const gestureEvents = [
      "pointerdown",
      "touchstart",
      "scroll",
      "keydown",
    ] as const;
    gestureEvents.forEach((e) =>
      window.addEventListener(e, kick, { once: true, passive: true }),
    );

    const gl =
      canvas.getContext("webgl", { alpha: true, antialias: true }) ||
      (canvas.getContext(
        "experimental-webgl",
      ) as WebGLRenderingContext | null);

    // No WebGL → leave the plain video visible as the graceful fallback.
    if (!gl) {
      video.style.visibility = "visible";
      canvas.style.display = "none";
      return () =>
        gestureEvents.forEach((e) => window.removeEventListener(e, kick));
    }

    let program: WebGLProgram | null = null;
    try {
      program = createProgram(gl, VERT, FRAG);
    } catch (err) {
      console.error(err);
      video.style.visibility = "visible";
      canvas.style.display = "none";
      return () =>
        gestureEvents.forEach((e) => window.removeEventListener(e, kick));
    }
    gl.useProgram(program);

    const uniforms: Record<string, WebGLUniformLocation | null> = {};
    const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < uniformCount; i++) {
      const info = gl.getActiveUniform(program, i);
      if (!info) continue;
      uniforms[info.name] = gl.getUniformLocation(program, info.name);
    }

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // Static ripple params (distortion zeroed under reduced-motion → plain video).
    gl.uniform1f(uniforms["u_blueish"], p.blueish);
    gl.uniform1f(uniforms["u_scale"], p.scale);
    gl.uniform1f(uniforms["u_illumination"], reduceMotion ? 0 : p.illumination);
    gl.uniform1f(
      uniforms["u_surface_distortion"],
      reduceMotion ? 0 : p.surfaceDistortion,
    );
    gl.uniform1f(
      uniforms["u_water_distortion"],
      reduceMotion ? 0 : p.waterDistortion,
    );
    gl.uniform1i(uniforms["u_image_texture"], 0);

    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // Offscreen canvas used to downsample each video frame before upload.
    const off = document.createElement("canvas");
    const offCtx = off.getContext("2d", { willReadFrequently: false })!;
    let allocated = false;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const w = Math.floor(window.innerWidth * dpr);
      const h = Math.floor(window.innerHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(uniforms["u_ratio"], canvas.width / canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    const start = performance.now();
    const render = () => {
      const vw = video.videoWidth;
      const vh = video.videoHeight;
      if (video.readyState >= 2 && vw && vh) {
        const tw = Math.min(TEXTURE_CAP, vw);
        const th = Math.round((tw * vh) / vw);
        if (off.width !== tw || off.height !== th) {
          off.width = tw;
          off.height = th;
          allocated = false;
        }
        offCtx.drawImage(video, 0, 0, tw, th);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        if (!allocated) {
          gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            off,
          );
          gl.uniform1f(uniforms["u_img_ratio"], vw / vh);
          allocated = true;
        } else {
          gl.texSubImage2D(
            gl.TEXTURE_2D,
            0,
            0,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            off,
          );
        }
      }
      gl.uniform1f(
        uniforms["u_time"],
        reduceMotion ? 0 : performance.now() - start,
      );
      // Only draw once a real video frame is in the texture; until then the
      // canvas stays transparent so the poster/plain video shows underneath.
      if (allocated) gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      gestureEvents.forEach((e) => window.removeEventListener(e, kick));
      window.removeEventListener("resize", resize);
      if (raf) cancelAnimationFrame(raf);
      if (texture) gl.deleteTexture(texture);
      if (vbo) gl.deleteBuffer(vbo);
      gl.useProgram(null);
      if (program) gl.deleteProgram(program);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        poster="/assets/hero-poster.jpg"
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        className="absolute inset-0 block h-full w-full object-cover"
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full ${className}`}
      />
    </>
  );
}
