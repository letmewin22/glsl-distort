varying vec2 vUv;
varying vec3 pos;
varying float vRate;
uniform vec2 uResolution;

void main() {
  if (uResolution.y <= uResolution.x) {
    vRate = uResolution.y / uResolution.x;
  }

  if (uResolution.y > uResolution.x) {
    vRate = uResolution.x / uResolution.y;
  }

  vec2 _uv = uv - 0.5;
  vUv = _uv;
  vUv*= vRate;
  vUv += 0.5;

  vUv = uv;
  pos = position;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}


