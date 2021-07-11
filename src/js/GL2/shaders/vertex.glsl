attribute vec2 uv;
attribute vec3 position;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying vec2 vUv;
uniform vec2 uSize;
uniform vec2 uResolution;
uniform float uClicked;
uniform float uHide;

#define PI 3.14159265359

vec2 bgCover(vec2 planeSize, vec2 imageSize, vec2 uv) {

  uv -= 0.5;

  float aspect = planeSize.x / planeSize.y;
  float imageAspect = imageSize.x / imageSize.y;

  if(aspect < imageAspect) {
    uv.x *= aspect / imageAspect;
  } else {
    uv.y *= imageAspect / aspect;
  }

  uv += 0.5;
  return uv;
}

void main() {
  vec3 pos = position;
  vUv = bgCover(uSize, uResolution, uv);

  float activator = uClicked;
  float roundblend = sin(PI * activator);

  vec2 newUv = vUv;

  newUv.x = (vUv.x + vUv.y) * 10.;
  newUv.y = vUv.y - 1.;

  float dist = length(newUv);
  float displacement = smoothstep(roundblend * 6., activator + (activator * 24.), dist);

  pos.z -= displacement * 590. * roundblend;
  pos.y += uHide;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}