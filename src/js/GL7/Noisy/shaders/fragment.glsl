varying vec2 vUv;

uniform float uTime;
uniform float uAlpha;


float rand(vec2 co){
  return -0.5 + fract(sin(dot(co.xy ,vec2(uTime + 12.9898,78.233))) * 43758.5453);
}


void main() {
    vec2 uv = vUv;

    vec3 color = fromRGB(vec3(253., 250., 243.));
    float gray = clamp(length(color) * rand(uv), 0.0, 1.0);

    gl_FragColor = vec4(gray, gray, gray, uAlpha);
}