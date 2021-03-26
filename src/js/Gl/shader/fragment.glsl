uniform sampler2D uTexture;
uniform sampler2D uColorTexture;
uniform float uDistortion;
uniform float uScale;
uniform float uTime;
varying vec2 vUv;

#define PI 3.14159265359

float Sphere(vec2 uv, float r, float blur) {
	float d = length(uv);
	return smoothstep(r, r - blur, d);
}

void main() {
	vec2 newUv = vUv - 0.5;
	vec2 uv2 = newUv - newUv * 0.5 * (1. - uScale);

	vec4 circleDist = vec4(vec3(Sphere(uv2, uDistortion, 0.15)), 1.0);

	uv2 += (sin(newUv.x*20. + (uTime / 5.)) / 50.) * (1. - uScale);
	uv2 += (sin(newUv.y*10. + (uTime / 5.)) / 50.) * (1. - uScale);

	float roundblend = sin(PI*circleDist.r);
	float roundblend2 = sin(PI*uScale);

	vec4 bwTexture = texture2D(uTexture, vUv);
	vec4 colorTexture = texture2D(uColorTexture, uv2 * circleDist.r + 0.5);

	vec4 mixTexture = mix(colorTexture, bwTexture, 1.0 - circleDist);

	vec4 multiplyTexture = mixTexture * roundblend * 0.8;
	vec4 multiplyTexture2 = mixTexture * roundblend2 * 0.1;

	gl_FragColor = mixTexture + multiplyTexture + multiplyTexture2;
}