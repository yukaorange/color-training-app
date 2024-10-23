uniform float uTime;
uniform float uOrder;
uniform float uActiveExplanation;
uniform float uAnimationProgress;
uniform bool uIsSquare;
uniform bool uIsCircle;
uniform vec2 uResolution;
uniform vec3 uColor;

varying float vDistFromCenter;
varying vec2 vUv;
varying vec3 vWorldPosition;

#pragma glslify: cnoise = require('../util/perlin-noise.glsl');
#pragma glslify: hsl2rgb = require('../util/hsl2rgb.glsl');

void main() {

  float explanation = mod((uActiveExplanation - 1.0), 4.0);

  vec3 color = vec3(0.0);

  color = uColor;

  if(explanation == 1.0) {
    color = uColor;
  }
  if(explanation == 2.0) {

    float normalizedOrder = uOrder / 35.0;
    normalizedOrder = normalizedOrder;

    float gradientStep = normalizedOrder;

    float noise = cnoise(vec3(vWorldPosition.xy * 0.1, uTime * 0.1));

    float wave = noise + sin(uTime * 0.5) * 2.0;
    if(uIsCircle) {
      gradientStep += wave;
    }
    if(uIsSquare) {
      gradientStep -= wave;
    }

    float hue = mod(gradientStep * 360.0 + uTime * 1.0, 360.0);

    vec3 hslColor = vec3(hue / 360.0, 0.7, 0.5);
    vec3 rgbColor = hsl2rgb(hslColor);

    color = mix(uColor, rgbColor, uAnimationProgress);

    color = vec3(color);
  }
  if(explanation == 3.0) {
    if(uOrder == 2.0 || uOrder == 3.0 || uOrder == 7.0 || uOrder == 10.0 || uOrder == 14.0 || uOrder == 21.0 || uOrder == 25.0 || uOrder == 28.0 || uOrder == 32.0 || uOrder == 33.0) {
      color = vec3(0.0);
    } else {
      color = vec3(0.47, 0.91, 0.11);
    }

    color = mix(uColor, color, uAnimationProgress);

  }

  if(explanation == 0.0) {
    if(uOrder == 4.0 || uOrder == 11.0 || uOrder == 13.0 || uOrder == 14.0 || uOrder == 15.0 || uOrder == 17.0 || uOrder == 18.0 || uOrder == 19.0 || uOrder == 20.0 || uOrder == 21.0 || uOrder == 22.0 || uOrder == 23.0 || uOrder == 24.0 || uOrder == 25.0 || uOrder == 26.0 || uOrder == 27.0 || uOrder == 28.0 || uOrder == 29.0 || uOrder == 31.0 || uOrder == 32.0 || uOrder == 33.0 || uOrder == 34.0) {
      color = vec3(0.0);
    } else {
      color = vec3(0.81);
    }

    color = mix(uColor, color, uAnimationProgress);
  }

  gl_FragColor = vec4(color, 1.0);
}