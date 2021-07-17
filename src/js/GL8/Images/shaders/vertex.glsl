varying vec2 vUv;

uniform float uDepth;
uniform float uStrength;
uniform float uNbDividers;
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

  vec2 perspVertices = vec2(0.0);

  for(int i = 0; i < 8; i++) {
    float index = float(i);
    float step = index / uNbDividers;
    float acc = index / (uNbDividers - 1.0);

    if(abs(pos.y) >= step) {
        perspVertices.y = acc;
      }
  }

  perspVertices = 1.0 - perspVertices;

  float perspective = min(perspVertices.x, perspVertices.y);

  pos.z = uStrength * perspective * -uDepth;


  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}