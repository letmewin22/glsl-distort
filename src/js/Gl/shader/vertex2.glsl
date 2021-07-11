@import ./bgCover;

varying vec2 vUv;
uniform vec2 uSize;
uniform vec2 uResolution;
uniform float uTime;
uniform float uClicked;
uniform float uScale;
uniform float uHide;

#define PI 3.14159265359

void main() {
  vec3 pos = position; 
  vUv = bgCover(uSize, uResolution, uv);

  float activator = uClicked;
  float roundblend = sin(PI*activator);

  vec2 newUv = vUv;

  newUv.x = (vUv.x + vUv.y)*10.;
  newUv.y = vUv.y - 1.;

  // newUv.x = ((vUv.x - 0.5) + (vUv.y - 0.5))*10.;
  // newUv.y = vUv.y - 1.;

  // newUv.x = (vUv.x)*10.;
  // newUv.y = vUv.y;

  float dist = length(newUv);
  float displacement = smoothstep(roundblend*6., activator + (activator * 24.), dist);

  pos.z -= displacement * 590. * roundblend;
  pos.y += uHide;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}


