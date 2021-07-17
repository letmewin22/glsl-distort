varying vec2 vUv;
varying float vParallax;

uniform float uStrength;
uniform float uClicked;
uniform float uViewportY;
uniform float uScrollPos;
uniform float uScrollHeight;



void main() {
  vec3 pos = position;
  vUv = bgCover(size, resolution, uv);

  float activator = uClicked;
  float roundblend = sin(PI * activator);

  vec2 newUv = vUv;

  newUv.x = (vUv.x + vUv.y) * 10.;
  newUv.y = vUv.y - 1.;

  float dist = length(newUv);
  float displacement = smoothstep(roundblend * 6., activator + (activator * 24.), dist);

  pos.z -= displacement * 700. * roundblend;

  vParallax = uScrollPos / uScrollHeight * 0.2 * uClicked;
  
  pos.y += vParallax;

  vec4 newPosition = modelViewMatrix * vec4(pos, 1.0);

  float scrollValue = -uStrength *20. * (1. - uClicked);

  newPosition.z += sin(newPosition.y / uViewportY * 2. * PI + PI / 2.0) * scrollValue;

  // float startPos = (newPosition.y - 1.);
  // float roundblend = sin(2.*PI*uClicked);

  // newPosition.z += sin(startPos / 1920. * PI * 3. + (uTime / 10.)) * roundblend * 150.;


  gl_Position = projectionMatrix * newPosition;
}
