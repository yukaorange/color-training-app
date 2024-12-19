'use client';

import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import React, { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';
import { useSnapshot } from 'valtio';

import fragmentShader from '@/shader/virtualgird/fragment.glsl';
import vertexShader from '@/shader/virtualgird/vertex.glsl';
import { actions, editorStore } from '@/store/editorStore';

interface ResponsiveCellsProps {
  gridRef: React.RefObject<HTMLDivElement>;
  activeExplanation: number;
}

export const ResponsiveCells = ({ gridRef, activeExplanation }: ResponsiveCellsProps) => {
  const { size, camera } = useThree();
  const [isInitialized, setIsInitialized] = useState(false);

  // セルの位置情報をキャッシュするRef
  // useRefを使用する理由：
  // 1. レンダリングサイクル間でのデータ永続化
  // 2. 不要な再レンダリングの防止
  // 3. アニメーションフレーム間での値の保持
  const cellPositionsRef = useRef<
    { position: [number, number, number]; scale: [number, number, number] }[]
  >([]);
  // クリックのデバウンス処理用
  const lastClickTimeRef = useRef(0);

  // グリッドの解像度を追跡
  // 動的なサイズ変更に対応するため
  const gridResolutionRef = useRef(new THREE.Vector2(1, 1));

  // Valtioストアからの状態取得
  // プロキシを使用することで効率的な更新を実現
  const { activeCell, tempCellColors } = useSnapshot(editorStore);
  const { setActiveCell, openColorPicker } = actions;

  // セルの位置を更新するロジック
  // カメラの視野角とアスペクト比に基づいて
  // WebGLの座標系に変換
  const updateCellPositions = useCallback(() => {
    if (gridRef.current && camera instanceof THREE.PerspectiveCamera) {
      const cellElements = gridRef.current.querySelectorAll('[data-ui-name="cell"]');

      const aspect = size.width / size.height;
      const vFov = camera.fov;
      const height = 2 * camera.position.z * Math.tan((vFov * Math.PI) / 180 / 2);
      const width = height * aspect;

      const standardPosition = {
        x: -width / 2,
        y: height / 2,
      };

      cellPositionsRef.current = Array.from(cellElements).map((cell) => {
        const cellRect = cell.getBoundingClientRect();

        const scaleX = (cellRect.width / size.width) * width;
        const scaleY = (cellRect.height / size.height) * height;

        const x = (cellRect.left / size.width) * width + standardPosition.x + scaleX / 2;
        const y = -(cellRect.top / size.height) * height + standardPosition.y - scaleY / 2;

        return {
          position: [x, y, 0] as [number, number, number],
          scale: [scaleX, scaleY, 1] as [number, number, number],
        };
      });

      if (cellPositionsRef.current) {
        const lastCell = cellPositionsRef.current[cellPositionsRef.current.length - 1];
        const firstCell = cellPositionsRef.current[0];
        const gridWidth =
          Math.abs(lastCell.position[0] - firstCell.position[0]) + lastCell.scale[0];

        const gridHeight =
          Math.abs(firstCell.position[1] - lastCell.position[1]) + lastCell.scale[1];

        gridResolutionRef.current.set(gridWidth, gridHeight);
      }

      if (!isInitialized) {
        setIsInitialized(true);
      }
    }
  }, [size, camera, gridRef, isInitialized]);

  useFrame(() => {
    updateCellPositions();
  });

  // クリックハンドラ
  // デバウンス処理により連続クリックを防止
  const handleClick = useCallback((index: number) => {
    const now = performance.now();
    if (now - lastClickTimeRef.current > 300) {
      lastClickTimeRef.current = now;
      setActiveCell(index);
      openColorPicker();
    }
  }, []);

  // セルコンポーネントの生成
  // useMemoによりパフォーマンスを最適化
  const cells = useMemo(() => {
    return cellPositionsRef.current.map((_, index) => (
      <GridCell
        key={index}
        index={index}
        cellPositionsRef={cellPositionsRef}
        onClick={() => handleClick(index)}
        gridResolution={gridResolutionRef.current}
        isActive={activeCell === index}
        colors={tempCellColors[index]}
        activeExplanation={activeExplanation}
      />
    ));
  }, [isInitialized, activeCell, cellPositionsRef, handleClick, tempCellColors, activeExplanation]);

  return <group>{cells}</group>;
};

interface GridCellProps {
  index: number;
  cellPositionsRef: React.MutableRefObject<
    { position: [number, number, number]; scale: [number, number, number] }[]
  >;
  onClick: () => void;
  gridResolution: THREE.Vector2;
  isActive: boolean;
  colors: { square: string; circle: string };
  activeExplanation: number;
}

type GLTFResult = GLTF & {
  nodes: {
    circle: THREE.Mesh;
    square: THREE.Mesh;
    squareFrame: THREE.Mesh;
  };
  materials: {
    Material: THREE.MeshStandardMaterial;
    frame: THREE.MeshStandardMaterial;
  };
};

/**
 *グリッドセルコンポーネント
 * React.memoで最適化：プロップスが変更されない限り再レンダリングを防止
 */
const GridCell = React.memo(
  ({
    index,
    cellPositionsRef,
    onClick,
    gridResolution,
    isActive,
    colors,
    activeExplanation,
  }: GridCellProps) => {
    const { nodes } = useGLTF('/models/cell.glb') as GLTFResult;
    const groupRef = useRef<THREE.Group>(null);
    const squareRef = useRef<THREE.Mesh>(null);
    const circleRef = useRef<THREE.Mesh>(null);

    // アニメーション制御用の参照
    const animationProgressRef = useRef(0);
    const isAnimationRef = useRef(false);
    const prevActiveExplanationRef = useRef(activeExplanation);

    // 四角形用のシェーダーユニフォーム
    // useMemoで最適化：依存値が変更されない限りキャッシュを使用
    const uniformsForSquare = useMemo(() => {
      return {
        uTime: { value: 0 },
        uOrder: { value: index },
        uResolution: { value: gridResolution },
        uIsSquare: { value: true },
        uIsCircle: { value: false },
        uColor: { value: new THREE.Color(colors.square) },
        uActiveExplanation: {
          value: activeExplanation,
        },
        uAnimationProgress: { value: 0 },
      };
    }, [colors.square, activeExplanation, gridResolution]);

    // 円形用のシェーダーユニフォーム
    const uniformsForCircle = useMemo(() => {
      return {
        uTime: { value: 0 },
        uOrder: { value: index },
        uResolution: { value: gridResolution },
        uIsSquare: { value: false },
        uIsCircle: { value: true },
        uColor: { value: new THREE.Color(colors.circle) },
        uActiveExplanation: {
          value: activeExplanation,
        },
        uAnimationProgress: { value: 0 },
      };
    }, [colors.circle, activeExplanation, gridResolution]);

    // シェーダーマテリアルの生成
    // カスタムシェーダーを使用してGPUベースの描画を実現
    const squareMaterial = useMemo(() => {
      const squareShaderMaterial = new THREE.ShaderMaterial({
        uniforms: uniformsForSquare,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
      });
      return squareShaderMaterial;
    }, [uniformsForSquare]);

    // フレーム用のマテリアル
    // 半透明の黒色フレームを作成
    const circleMaterial = useMemo(() => {
      const circleShaderMaterial = new THREE.ShaderMaterial({
        uniforms: uniformsForCircle,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
      });
      return circleShaderMaterial;
    }, [uniformsForCircle]);

    const frameMaterial = useMemo(() => {
      return new THREE.MeshBasicMaterial({
        color: '#000000',
        opacity: 0.5,
        transparent: true,
      });
    }, []);

    // アニメーション状態の更新
    useEffect(() => {
      if (activeExplanation !== prevActiveExplanationRef.current) {
        animationProgressRef.current = 0;
        isAnimationRef.current = true;
        prevActiveExplanationRef.current = activeExplanation;
      }
    }, [activeExplanation]);

    const easeInOutCubic = (t: number): number => {
      // const value = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      const value = 1 - (1 - t) * (1 - t);

      return value;
    };

    useFrame((state, delta) => {
      const { clock } = state;

      if (groupRef.current && cellPositionsRef.current[index]) {
        const { position, scale } = cellPositionsRef.current[index];

        // アクティブ状態に応じたスケールとZ位置の調整
        const activeScale = isActive ? 1.1 : 1.0;
        const activeZoom = isActive ? 0.01 : 0;
        const activeFrame = isActive ? 1.1 : 0;

        // スムーズな補間によるアニメーション
        const targetScaleX = THREE.MathUtils.lerp(
          groupRef.current.scale.x,
          scale[0] * activeScale,
          0.05
        );
        const targetScaleY = THREE.MathUtils.lerp(
          groupRef.current.scale.y,
          scale[1] * activeScale,
          0.05
        );

        groupRef.current.position.set(position[0], position[1], position[2] + activeZoom);

        groupRef.current.scale.set(targetScaleX, targetScaleY, scale[2]);

        groupRef.current.traverse((child) => {
          if (child.type === 'Mesh' && child.name === 'squareFrame') {
            const scale = THREE.MathUtils.lerp(child.scale.x, activeFrame, 0.2);

            child.scale.set(scale, scale, scale);
          }
        });

        if (isAnimationRef.current) {
          animationProgressRef.current += delta * 0.8;

          if (animationProgressRef.current >= 1) {
            animationProgressRef.current = 1;
            isAnimationRef.current = false;
          }
        }

        const easedProgress = easeInOutCubic(animationProgressRef.current);

        const animationProgress = isAnimationRef.current
          ? Math.sin(easedProgress * Math.PI) //0 -> 1 -> 0
          : 0;

        if (squareRef.current) {
          const shaderMaterial = squareRef.current.material as THREE.ShaderMaterial;

          shaderMaterial.uniforms.uTime.value = clock.getElapsedTime();
          shaderMaterial.uniforms.uAnimationProgress.value = animationProgress;
          shaderMaterial.uniforms.uActiveExplanation.value = activeExplanation;
        }

        if (circleRef.current) {
          const shaderMaterial = circleRef.current.material as THREE.ShaderMaterial;

          shaderMaterial.uniforms.uTime.value = clock.getElapsedTime();
          shaderMaterial.uniforms.uAnimationProgress.value = animationProgress;
          shaderMaterial.uniforms.uActiveExplanation.value = activeExplanation;
        }
      }
    });

    return (
      <group ref={groupRef} onClick={onClick} dispose={null}>
        <mesh
          geometry={nodes.circle.geometry}
          material={circleMaterial}
          name="circle"
          ref={circleRef}
        />
        <mesh
          geometry={nodes.square.geometry}
          material={squareMaterial}
          name="square"
          ref={squareRef}
        />
        <mesh geometry={nodes.squareFrame.geometry} material={frameMaterial} name="squareFrame" />
      </group>
    );
  }
);

GridCell.displayName = 'GridCell';

useGLTF.preload('/models/cell.glb');
