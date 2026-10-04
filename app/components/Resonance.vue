<script setup lang="ts">
// Fullscreen "Resonance" scene: a warp tunnel whose rings step forward exactly on the beat grid, with a circular
// spectrum around a glowing core. Colours follow the track's key (Camelot wheel), every track has its own pattern seed,
// and during a mix the old pattern cross-fades into the new one over the real transition length.
import { onMounted, onBeforeUnmount } from 'vue'
import { Mesh, PlaneGeometry, ShaderMaterial, Color, DataTexture, RedFormat, UnsignedByteType, LinearFilter, SRGBColorSpace } from 'three'
import { usePlayerStore } from '~/stores/player'
import { keyPalette, hashString } from '~/utils/palette'

const player = usePlayerStore()
const BANDS = 64

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

const fragmentShader = `
precision highp float;
varying vec2 vUv;

uniform float u_time;
uniform float u_aspect;
uniform float u_phase;      // 0..1 within the beat
uniform float u_travel;     // monotonic beat travel (steps forward on each beat, eased)
uniform float u_beatInBar;  // 0..3
uniform float u_bass;
uniform float u_mid;
uniform float u_high;
uniform float u_energy;
uniform float u_speed;
uniform float u_density;
uniform float u_flash;
uniform float u_xfade;      // 0 = old pattern, 1 = new pattern
uniform float u_seedNew;
uniform float u_seedOld;
uniform vec3 u_color_a;
uniform vec3 u_color_b;
uniform vec3 u_color_c;
uniform sampler2D u_spectrum;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
             mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 4; i++) {
    v += a * vnoise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}

// One tunnel layer; the seed decides segment count, twist and which cells light up, so every track looks different.
vec3 tunnel(vec2 uv, float seed, float travel, float rot) {
  float r = length(uv);
  float a = atan(uv.y, uv.x) + rot + seed * 6.2831853;
  float segs = max(3.0, floor((5.0 + fract(seed * 7.31) * 8.0) * u_density));
  a += (0.2 + 0.3 * fract(seed * 3.17)) * r * (1.0 + u_mid * 1.5);

  float z = 2.0 / (r + 0.1) + travel;
  float x = a / 6.2831853 * segs;

  float gx = smoothstep(0.455, 0.5, abs(fract(x) - 0.5));
  float gz = smoothstep(0.43, 0.5, abs(fract(z) - 0.5));
  float cell = hash21(floor(vec2(x, z)) + seed * 17.0);
  float lit = step(0.84 - u_energy * 0.3, cell) * (0.5 + 0.5 * sin(z * 2.0 + u_time * 1.3 + cell * 6.0)) * smoothstep(1.0, 0.2, r);

  vec3 col = mix(u_color_a, u_color_b, fract(cell * 3.0 + z * 0.04));
  float v = max(gx, gz) * 0.6 + lit * 0.7;
  float fog = smoothstep(0.05, 0.6, r) * (0.35 + 0.65 * smoothstep(1.7, 0.2, r));
  return col * v * fog;
}

void main() {
  vec2 uv = (vUv - 0.5) * vec2(u_aspect, 1.0) * 2.0;

  float kick = pow(1.0 - u_phase, 3.0);
  float down = u_beatInBar < 0.5 ? 1.0 : 0.0;

  // punch the camera in on the kick, harder on the downbeat
  uv *= 1.0 - 0.035 * kick * (0.6 + 0.7 * down) - u_bass * 0.05;
  float rot = u_time * 0.05 * u_speed;
  float t = u_time * u_speed;

  // nebula background
  vec2 q = uv * 1.3;
  float n = fbm(q + vec2(t * 0.03, 0.0) + fbm(q * 2.0 - t * 0.02) * 1.5 + u_seedNew * 10.0);
  vec3 col = mix(u_color_a, u_color_b, n) * n * n * 0.85 * (0.3 + u_energy * 0.9);

  // tunnels: new pattern, plus the old one while a mix is in progress
  float travel = u_travel * 0.5 + t * 0.1;
  float wNew = smoothstep(0.0, 1.0, u_xfade);
  col += tunnel(uv, u_seedNew, travel, rot) * wNew * (0.8 + u_bass * 1.2);
  if (wNew < 0.999) {
    col += tunnel(uv, u_seedOld, travel, -rot * 1.7) * (1.0 - wNew) * (0.8 + u_bass * 1.2);
  }

  float r = length(uv);
  float ang = atan(uv.x, uv.y); // 0 at the top

  // glowing core
  float core = exp(-r * 7.0) * (0.5 + u_bass * 2.0 + kick * 0.8);
  col += mix(u_color_b, vec3(1.0), 0.25) * core * 0.55;

  // shockwave leaving the core on every beat (stronger on the downbeat)
  float swR = 0.15 + sqrt(u_phase) * 1.15;
  col += u_color_c * smoothstep(0.035, 0.0, abs(r - swR)) * kick * (0.45 + down * 0.9);

  // circular spectrum, mirrored left/right, lows at the top
  float R0 = 0.30 + u_bass * 0.05;
  float bin = abs(ang) / 3.14159265;
  float nb = ${BANDS}.0;
  float cellIdx = floor(bin * nb);
  float s = texture2D(u_spectrum, vec2((cellIdx + 0.5) / nb, 0.5)).r;
  float local = fract(bin * nb);
  float barMask = smoothstep(0.1, 0.22, local) * smoothstep(0.9, 0.78, local);
  float h = s * s * 0.2 + 0.01;
  float inBar = step(R0, r) * step(r, R0 + h);
  float tip = smoothstep(0.02, 0.0, abs(r - (R0 + h)));
  vec3 barCol = mix(u_color_a * 1.4, u_color_c, bin);
  col += barCol * (inBar * 0.55 + tip * 1.0) * barMask * (0.45 + s * 0.8);
  col += u_color_b * smoothstep(0.004, 0.0, abs(r - (R0 - 0.012))) * 0.6;

  // mix: an iris of light sweeps outward while the old pattern turns into the new one
  float mixing = u_xfade * (1.0 - u_xfade) * 4.0;
  col += u_color_c * smoothstep(0.06, 0.0, abs(r - u_xfade * 1.9)) * mixing * 0.9;

  // twinkling stars that respond to the highs
  vec2 sp = uv * 14.0;
  vec2 id = floor(sp);
  float hs = hash21(id);
  vec2 off = (vec2(hash21(id + 3.0), hash21(id + 7.0)) - 0.5) * 0.6;
  float star = smoothstep(0.08 * (0.5 + hs), 0.0, length(fract(sp) - 0.5 - off)) * step(0.92, hs);
  col += star * (0.5 + 0.5 * sin(u_time * 3.0 + hs * 40.0)) * (0.25 + u_high * 1.5);
  col += u_color_c * u_high * 0.06 * u_flash * kick;

  // soft tone-map, vignette, grain
  col = 1.0 - exp(-col * 1.15);
  col *= smoothstep(2.1, 0.45, r);
  col += (hash21(gl_FragCoord.xy + fract(u_time)) - 0.5) * 0.02;

  gl_FragColor = vec4(max(col, 0.0), 1.0);
  #include <colorspace_fragment>
}
`

const spectrumData = new Uint8Array(BANDS)
const spectrumTex = new DataTexture(spectrumData, BANDS, 1, RedFormat, UnsignedByteType)
spectrumTex.minFilter = LinearFilter
spectrumTex.magFilter = LinearFilter
spectrumTex.needsUpdate = true

const material = new ShaderMaterial({
  vertexShader,
  fragmentShader,
  depthTest: false,
  depthWrite: false,
  uniforms: {
    u_time: { value: 0 },
    u_aspect: { value: 1 },
    u_phase: { value: 0 },
    u_travel: { value: 0 },
    u_beatInBar: { value: 1 },
    u_bass: { value: 0 },
    u_mid: { value: 0 },
    u_high: { value: 0 },
    u_energy: { value: 0 },
    u_speed: { value: 1 },
    u_density: { value: 1 },
    u_flash: { value: 1 },
    u_xfade: { value: 1 },
    u_seedNew: { value: 0.37 },
    u_seedOld: { value: 0.37 },
    u_color_a: { value: new Color('#3f3089') },
    u_color_b: { value: new Color('#00bcff') },
    u_color_c: { value: new Color('#ff5fa8') },
    u_spectrum: { value: spectrumTex }
  }
})

const mesh = new Mesh(new PlaneGeometry(2, 2), material)
mesh.frustumCulled = false

const clamp01 = (x: number) => Math.min(1, Math.max(0, x))

// --- per-frame state (plain variables: nothing here should be reactive) ---
const curA = new Color('#3f3089')
const curB = new Color('#00bcff')
const curC = new Color('#ff5fa8')
const tgtA = new Color()
const tgtB = new Color()
const tgtC = new Color()
let lastNow = performance.now() / 1000
let seedKey = ''
let xfStart = -1e9
let xfLen = 1.5
let beatInt = 0
let lastPhase = 0
let travel = 0
let bass = 0
let mid = 0
let high = 0
let energy = 0
let raf = 0

/** Accent colour for palettes that only define two colours: the base hue rotated, and lighter. */
function accentFrom(base: Color, out: Color) {
  const hsl = { h: 0, s: 0, l: 0 }
  base.getHSL(hsl, SRGBColorSpace)
  out.setHSL((hsl.h + 0.4) % 1, Math.max(0.7, hsl.s), 0.62, SRGBColorSpace)
}

function frame() {
  raf = requestAnimationFrame(frame)
  const u = material.uniforms
  const now = performance.now() / 1000
  const dt = Math.min(0.1, now - lastNow)
  lastNow = now

  // What the visuals should look like: the incoming track as soon as a mix starts, otherwise the current one
  const ts = player.transitionState
  const cur = player.currentTrack
  const target = ts.active
    ? { name: ts.toName, key: ts.toKey, vibe: ts.toVibe }
    : { name: player.trackList[cur.index]?.name ?? '', key: cur.key, vibe: cur.vibe }

  // --- palette ---
  const tau = Math.max(0.5, (ts.active ? ts.length : 2) * 0.3)
  const k = 1 - Math.exp(-dt / tau)
  if (player.isVibeAuto) {
    const pal = keyPalette(target.key)
    if (pal) {
      tgtA.setHSL(pal.a[0], pal.a[1], pal.a[2], SRGBColorSpace)
      tgtB.setHSL(pal.b[0], pal.b[1], pal.b[2], SRGBColorSpace)
      tgtC.setHSL(pal.c[0], pal.c[1], pal.c[2], SRGBColorSpace)
    } else {
      const vibe = target.vibe ?? { colorA: '#3f3089', colorB: '#00bcff' }
      tgtA.set(vibe.colorA)
      tgtB.set(vibe.colorB)
      accentFrom(tgtA, tgtC)
    }
    curA.lerp(tgtA, k)
    curB.lerp(tgtB, k)
    curC.lerp(tgtC, k)
    // keep the UI's theme chips in sync with what is on screen
    const hexA = '#' + curA.getHexString(SRGBColorSpace)
    const hexB = '#' + curB.getHexString(SRGBColorSpace)
    if (player.uniforms.u_color_a.value !== hexA) player.uniforms.u_color_a.value = hexA
    if (player.uniforms.u_color_b.value !== hexB) player.uniforms.u_color_b.value = hexB
  } else {
    curA.set(player.uniforms.u_color_a.value)
    curB.set(player.uniforms.u_color_b.value)
    accentFrom(curB, curC)
  }
  u.u_color_a!.value.copy(curA)
  u.u_color_b!.value.copy(curB)
  u.u_color_c!.value.copy(curC)

  // --- pattern seeds: a new track (or the incoming track of a mix) fades its pattern in over the old one ---
  if (target.name !== seedKey) {
    seedKey = target.name
    u.u_seedOld!.value = u.u_seedNew!.value
    u.u_seedNew!.value = target.name ? hashString(target.name) : 0.37
    xfStart = now
    xfLen = ts.active ? Math.max(2, ts.length) : 1.5
  }
  u.u_xfade!.value = clamp01((now - xfStart) / xfLen)

  // --- audio ---
  const ctx = player.getAudioContext()
  const running = !!ctx && ctx.state === 'running' && !!player.analyser
  if (running) {
    const f = player.getFrequencyData()
    // fast attack, slow release
    bass = Math.max(f.bass * f.bass, bass * 0.86)
    mid = Math.max(f.mid, mid * 0.9)
    high = Math.max(player.isFlashEnabled ? f.high : 0, high * 0.88)
    energy += (player.analyser!.getAverageFrequency() / 255 - energy) * 0.15
    player.getSpectrum(spectrumData)
    spectrumTex.needsUpdate = true
  } else {
    bass *= 0.9; mid *= 0.9; high *= 0.9; energy *= 0.95
  }

  // --- beat: phase is exact (beat grid + file position); travel only ever moves forward ---
  let phase = 0
  let beatInBar = 1
  if (running && player.isPlaying) {
    const pos = player.getBeatPos()
    phase = ((pos % 1) + 1) % 1
    beatInBar = ((Math.floor(pos) % 4) + 4) % 4
    if (phase < lastPhase - 0.5) beatInt++
    lastPhase = phase
    travel = Math.max(travel, beatInt + 1 - Math.pow(1 - phase, 3))
  }

  u.u_time!.value += dt
  u.u_aspect!.value = window.innerWidth / Math.max(1, window.innerHeight)
  u.u_phase!.value = phase
  u.u_travel!.value = travel
  u.u_beatInBar!.value = beatInBar
  u.u_bass!.value = bass
  u.u_mid!.value = mid
  u.u_high!.value = high
  u.u_energy!.value = energy
  u.u_speed!.value = player.uniforms.u_speed.value
  u.u_density!.value = player.uniforms.u_partical_size.value / 265
  u.u_flash!.value = player.isFlashEnabled ? 1 : 0
}

onMounted(() => { raf = requestAnimationFrame(frame) })
onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  material.dispose()
  spectrumTex.dispose()
})
</script>

<template>
  <primitive :object="mesh" />
</template>
