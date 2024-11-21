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

    float timeOffset = floor(uTime * 0.1);

    float random = fract(sin(dot(vec2(gridX + timeOffset, gridY + timeOffset), vec2(12.9898, 78.233))) * 43758.5453);

    // ランダム値に基づいて、一部のブロックだけを選択 (参考：edge 0.7で約30%のブロックが選択される)
    float isSelected = step(0.9, random);

    // アニメーションの進行度に応じて高さを調整
    float maxHeight = 0.3;
    float animationValue = 0.0;

    if(isSelected > 0.5) {
        // イーズアウト関数を使用してスムーズな上昇
      float progress = easeOutCubic(uAnimationProgress);
      animationValue = progress * maxHeight;
    }

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