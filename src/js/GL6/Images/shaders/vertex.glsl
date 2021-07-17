varying vec2 vUv;
uniform float uTime;
uniform float uDistortion;


void main() {
  vec3 pos = position;
  vUv = bgCover(size, resolution, uv);

  vec3 dir = pos - vec3(pos / 2.);
  float dist = distance(pos, vec3(0.5));
  vec3 offset = dir * (sin(dist * 10.0 - uTime * 0.1) + 0.5) * 0.035 * uDistortion;
  pos = pos + offset;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}