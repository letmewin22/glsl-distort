@import ./parallax;

varying vec2 vUv;
varying vec2 vDUv;
varying float vParallax;

uniform float uStrength;
uniform float uClicked;
uniform float uViewportY;
uniform float uScrollHeight;
uniform float uOffsetY;


float transition(float ratio, in vec2 st) {
    vec2 p = st * 2. -1.;

    float l = pow(length(p) / 2., 0.5) / sqrt(2.0);
    float ll = smoothstep(l - 0.04, l + 0.04, ratio);

    return ll;
}


void main() {
  vec3 pos = position;
  vUv = bgCover(size, resolution, uv);
  vDUv = uv;

  float scale = 800.;
  float d = uClicked;

  pos.z += d * (transition(d, vUv) * scale - scale * d);


  vParallax = parallax(uOffsetY, uScrollHeight, uClicked);
  pos.y += vParallax;
  pos.z += clamp(vParallax * 500., 1., 750.);


  vec4 newPosition = modelViewMatrix * vec4(pos, 1.0);

  float scrollValue = -uStrength * 20. * (1. - uClicked);

  newPosition.z += sin(newPosition.y / uViewportY * 2. * PI + PI / 2.0) * scrollValue;


  gl_Position = projectionMatrix * newPosition;
}


