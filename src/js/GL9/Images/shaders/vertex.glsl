varying vec2 vUv;

uniform float uStrength;
uniform float uTime;
uniform float uClicked;
uniform float uViewportY;

// float distort(float value, vec3 pos, float time) {
//   float roundblend = sin(PI*value);
// 	float stepblend = clamp(pos.y * value, 0.,1.);

//   float timeSpeed = uTime / time;
//   float displacement = sin(pos.y * value + timeSpeed);

//   return 40. * stepblend +  roundblend * 20. * displacement;
// }

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


  vec4 newPosition = modelViewMatrix * vec4(pos, 1.0);

  newPosition.z += sin(newPosition.y / uViewportY * 2. * PI + PI / 2.0) * -uStrength*20.;

  gl_Position = projectionMatrix * newPosition;
}