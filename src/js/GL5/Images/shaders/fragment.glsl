varying vec2 vUv;

uniform sampler2D uTexture;
uniform float effectVelocity;

float map(float value, float inMin, float inMax, float outMin, float outMax) {
   return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

void main() {

   vec2 uv = vUv;

   vec4 tex = texture2D(uTexture, uv);

   float curveLevel = min(1., effectVelocity * .5);
   float nUvY = pow(1. - uv.y * 1.2, 10.) * curveLevel;

   if(nUvY < .001) {

      gl_FragColor = texture2D(uTexture, uv);

   } 
   else {
      float curve = max(0., nUvY) + 1.;
      curve = map(curve, 1., 5., 1., 2.);
      uv.x = uv.x / curve + ((curve - 1.) / 2. / curve);

      //Curve generation
      tex = texture2D(uTexture, clamp(uv, vec2(0.), vec2(1.)));

      //Pixel displace
      uv.y += tex.r * nUvY * .7;

      if(uv.y < 1.) {

         tex = texture2D(uTexture, uv);
      }

      // RGB shift
      uv.y += 0.15 * nUvY;

      if(uv.y < 1.) {

         tex.g = texture2D(uTexture, uv).g;
      }

      uv.y += 0.10 * nUvY;

      if(uv.y < 1.) {

         tex.b = texture2D(uTexture, uv).b;
      }

      gl_FragColor = tex;

   }
}