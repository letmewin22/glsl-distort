#version 300 es
#define attribute in
#define varying out

attribute vec2 uv;
attribute vec3 position;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
varying vec2 vUv;

uniform float uTime;
void main() {

  vec3 pos = position;
	float M_PI = 3.1415926535897932384626433832795;

	// pos.x = pos.x + (cos(uv.y * M_PI) * uDistortion / 65.);
	pos.y = pos.y + sin((sin(uv.x * M_PI) * 10.) * uTime / 100.);

	vUv = uv;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}