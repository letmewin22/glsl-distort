varying vec2 vUv;
varying vec2 vDUv;
varying float vParallax;

uniform float uStrength;
uniform float uClicked;
uniform float uDistortion;
uniform float uViewportY;
uniform float uScrollPos;
uniform float uScrollHeight;
uniform float uTime;


float distort(float action, vec3 pos) {
  float roundblend = sin(PI * action);

  float wavesCount = 4.;
  float scale = 60.;

  float waveCoords = ((action / 45.0) * 3.5) - 1.75;

  float distanceToWave = distance(vec2(pos.x - 1., 0.0), vec2(waveCoords, 0.0));



  float displacement = sin(PI * sin(wavesCount * distanceToWave + uTime / 10.));

  

  return scale * roundblend * displacement;
}


void main() {
  vec3 pos = position;
  vUv = bgCover(size, resolution, uv);
  vDUv = uv;

  // float activator = uClicked;
  // float roundblend = sin(PI * activator);

  // pos.x = (pos.x) * 10.;
  // pos.y = pos.x - 1.;

  // float dist = length(pos);
  // float displacement = smoothstep(roundblend, activator + (activator * 24.), dist);

  // pos.z -= displacement * 500. * roundblend;

  pos.z += distort(uDistortion, pos);

      // float waveCoords = ((uClicked / 45.0) * 3.5) - 1.75;

      // float distanceToWave = distance(vec2(pos.x, 0.0), vec2(waveCoords, 0.0));

      // pos.z -= (cos(clamp(distanceToWave, 0.0, 0.75) * PI) - cos(0.75 * PI) + (2.0 * sin(PI * uClicked))) * 20.25;


  vParallax = uScrollPos / uScrollHeight * 0.2 * uClicked;

  pos.y += vParallax;


  vec4 newPosition = modelViewMatrix * vec4(pos, 1.0);

  float scrollValue = -uStrength * 20. * (1. - uClicked);

  newPosition.z += sin(newPosition.y / uViewportY * 2. * PI + PI / 2.0) * scrollValue;

  // float startPos = (newPosition.y - 1.);
  // float roundblend = sin(2.*PI*uClicked);

  // newPosition.z += sin(startPos / 1920. * PI * 3. + (uTime / 10.)) * roundblend * 150.;

  gl_Position = projectionMatrix * newPosition;
}


