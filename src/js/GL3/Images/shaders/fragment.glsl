varying vec2 vUv;
uniform sampler2D uTexture;
uniform sampler2D uColorTexture;
uniform float uTime;
uniform float uDistortion;




void main() {

   vec2 uv = vUv;

    float th = uDistortion;
    
    float tex = ((texture2D(uTexture, uv).r -.5) + 2. * uv.x ) / 3.;
    float mask = smoothstep( th - .1, th, tex);
    float dist = smoothstep( th - .3, th + .05, tex);
    float col = pow( smoothstep( th - .2, th + .15, tex), 3.);
    
    vec3 color = texture2D(uTexture, uv * (.7 + pow(dist, 2.) * .3 )).rgb;
    vec3 disTexture = texture2D(uColorTexture, uv).rgb;
    
	   gl_FragColor = vec4( mix(disTexture, color, disTexture) * mask, 1.0);
}