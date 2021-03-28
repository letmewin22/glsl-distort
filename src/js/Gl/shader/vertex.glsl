@import ./bgCover;
@import ./snoise;

varying vec2 vUv;
uniform vec2 uSize;
uniform vec2 uResolution;
uniform float uTime;
uniform float uClicked;
uniform float uDistortion;
uniform vec2 uOffset;


float distort(float uType, vec3 pos, float multiplier, float time) {
  float roundblend = sin(M_PI*uType);
	float stepblend = clamp(2.*(-pos.x + pos.y) +5.*uType - 2., 0.,1.);

  float timeSpeed = uTime / time;
  float displacement = sin(2.*(-pos.x + pos.y) +3.*uType - 1. + timeSpeed);

  return multiplier*stepblend + roundblend*0.1*displacement;
}


void main() {
  vec3 pos = position; 

  vUv = bgCover(uSize, uResolution, uv);

  // float noiseFreq = 1.;
  // float noiseAmp = clamp((uOffset.x + uOffset.y) * 25., -1.25, 1.25); 
    
  // vec3 noisePos = vec3(pos.x * noiseFreq + (uTime / 60.), pos.y, pos.z);
  // pos.z += uClicked * snoise(noisePos) * 160. * noiseAmp;

  pos.z -= distort(uOffset.x, pos, 100., 50.);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}


