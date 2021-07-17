varying vec2 vUv;

uniform sampler2D uTexture;
uniform float uTime;
uniform float uDistortion;


void main() {

   
   vec2 uv = vUv;


    vec2 dir = uv - vec2(0.5);
    float dist = distance(uv, vec2(0.5));
    vec2 offset = dir * (sin(dist * 20.0 - uTime * 0.2) + 0.5) * 0.035 * uDistortion;
    uv = uv + offset;

    gl_FragColor = texture2D(uTexture, uv);
}
