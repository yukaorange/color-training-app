uniform float uTime;
uniform float uOrder;
uniform float uActiveExplanation;
uniform float uAnimationProgress;
uniform bool uIsSquare;
uniform bool uIsCircle;
uniform vec2 uResolution;

varying float vDistFromCenter;
varying vec2 vUv;
varying vec3 vWorldPosition;

#define PI 3.14159265359

float easeInCubic(float t) {
  return t * t * t;
}
float easeInQuad(float t) {
  return t * t;
}

float easeOutCubic(float t) {
  return 1.0 - pow(1.0 - t, 3.0);
}

void main() {
  vUv = uv;
  vec3 pos = position;

  float explanation = mod((uActiveExplanation - 1.0), 4.0);

  vec3 worldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;

  // Simple wave animation
  if(explanation == 1.0) {
    float gridX = mod(uOrder, 6.0);
    float gridY = floor(uOrder / 6.0);

    //正規化された左上からの距離
    float diagonalProgress = (gridX + gridY) / 10.0;//セルの項番縦横の最大値を加算している。5.0 +5.0 = 10.0

    float shiftedPeak = 0.1 + diagonalProgress * 0.8;

    float adjustedProgress = uAnimationProgress;
    // float adjustedProgress = min(uAnimationProgress * 2.0, 1.0);

    float remappedProgress;
    if(adjustedProgress < shiftedPeak) {
      remappedProgress = adjustedProgress / shiftedPeak;
    } else {
      remappedProgress = 1.0 - (adjustedProgress - shiftedPeak) / (1.0 - shiftedPeak);
    }

    remappedProgress = easeOutCubic(remappedProgress);

    float animationValue = smoothstep(0.0, 1.0, remappedProgress);

    float maxHeight = 0.5;

    animationValue = animationValue * maxHeight;

    pos.z += animationValue;
  }
  if(explanation == 2.0) {

  }
  if(explanation == 3.0) {

    float maxHeight = 0.25;

    float animationValue = uAnimationProgress * maxHeight;

    pos.z += animationValue;
  }
  if(explanation == 0.0) {
    float gridX = mod(uOrder, 6.0);
    float gridY = floor(uOrder / 6.0);
    vec2 gridCenter = vec2(2.5, 2.5);
    vec2 gridPosition = vec2(gridX, gridY);

    float distFromCenter = distance(gridPosition, gridCenter) / sqrt(2.0 * 2.5 * 2.5);//sqrt(2.0 * 2.5 * 2.5)は正方形における中心から最も遠い角までの距離

    float delay = smoothstep(0.0, 1.0, distFromCenter) * uAnimationProgress;

    float phase = 2.0 * PI * (uAnimationProgress - delay);

    float maxHeight = 0.1;

    float animationValue = sin(phase) * 0.5 + 0.5;

    animationValue = animationValue * maxHeight;

    pos.z += animationValue;
  }

  vWorldPosition = worldPosition;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}