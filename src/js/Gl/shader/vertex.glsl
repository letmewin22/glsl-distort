varying vec2 vUv;
uniform vec2 uSize;
uniform vec2 uResolution;

void main() {
  vec2 _uv = uv - 0.5;
  vUv = _uv;

  float aspect = uSize.x / uSize.y;
  float imageAspect = uResolution.x / uResolution.y;

  if (aspect < imageAspect) {
    vUv.x *= aspect / imageAspect;
    vUv.y = _uv.y;
  } else {
    vUv.y *= imageAspect / aspect;
    vUv.x = _uv.x;
  }


  _uv += 0.5;
  vUv += 0.5;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}


