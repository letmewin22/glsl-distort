varying vec2 vUv;

uniform float uTime;
uniform float uAlpha;


float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
    vec2 uv = vUv;
    vec3 col = 0.5 + 0.5 * cos(uTime + uv.xyx + vec3(0, 2, 4));
    gl_FragColor = vec4(rand(vec2(rand(col.xy))), rand(vec2(rand(col.xy))), rand(vec2(rand(col.xy))), uAlpha);
}