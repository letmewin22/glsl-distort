varying vec2 vUv;

uniform sampler2D uTexture;
uniform float uDistortion;
uniform float uScale;
uniform float uClicked;
uniform float uTime;


vec4 tex(in vec2 st) { return texture2D(uTexture, st); }


vec4 transition(float ratio, in vec2 st) {
    vec2 p = st*2.-1.;
    float l = pow(length(p),0.5)/sqrt(2.0);
    float ll = smoothstep(l-0.04, l+0.04, ratio);
    
    float w = .2;
    vec2 p1 = p*(1.+smoothstep(l-w, l+w, ratio));
    vec2 p2 = p*smoothstep(l-w, l+w, ratio);
    
    vec2 uv1 = p1*0.5+0.5;
    vec2 uv2 = p2*0.5+0.5;

    vec2 dir = uv2 - vec2(0.5);
    float dist = distance(uv2, vec2(0.5));
    vec2 offset = dir * (sin(dist * 20.0 - uTime * 0.2) + 0.5) * 0.035 * uDistortion * (1. - uClicked);
    uv2 = uv2 + offset;

    uv2 += (sin(uv1.x * 20. + (uTime / 5.)) / 50.) * (1. - uScale);
    uv2 += (sin(uv1.y * 10. + (uTime / 5.)) / 50.) * (1. - uScale);
    

    return mix(tex(uv1), tex(uv2), ll);
}

void main() {
    vec2 uv = vUv;

    float ratio = uDistortion;

    float roundblend = sin(PI * uDistortion);
    float roundblend2 = sin(PI * uScale);
    float roundblend3 = sin(PI * uClicked);
    vec4 img = transition(ratio, uv);

    vec4 multiplyTexture = img.rrra * roundblend * 0.1;
    vec4 multiplyTexture2 = img.rrra * roundblend2 * 0.3;
    vec4 multiplyTexture3 = img.rrra * roundblend3 * 0.8;

    vec4 finalTexture = img + multiplyTexture + multiplyTexture2 + multiplyTexture3;

    
    gl_FragColor = finalTexture;
}
