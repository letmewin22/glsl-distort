varying vec2 vUv;
uniform float uClicked;


void main() {
  vec3 pos = position;
  vUv = bgCover(size, resolution, uv);

  vUv -= 0.5;
  vUv *= 0.95;
  vUv += 0.5;

  float activator = uClicked;
  float roundblend = sin(PI * activator);

  vec2 newUv = vUv;

  newUv.x = (vUv.x + vUv.y) * 10.;
  newUv.y = vUv.y - 1.;

  float dist = length(newUv);
  float displacement = smoothstep(roundblend * 6., activator + (activator * 24.), dist);

  pos.z -= displacement * 590. * roundblend;


  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}