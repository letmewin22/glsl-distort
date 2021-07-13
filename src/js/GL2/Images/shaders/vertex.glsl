varying vec2 vUv;
uniform float uClicked;
uniform float uHide;


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

  pos.z -= displacement * 590. * roundblend;
  pos.y += uHide;

  // pos.x += 1.;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}