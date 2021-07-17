varying vec2 vUv;

void main() {
  vec3 pos = position;
  vUv = bgCover(size, resolution, uv);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}