# 3D色彩トレーニングアプリのパフォーマンス最適化ガイド（更新版）

## 1. はじめに

このガイドは、blenderで作成したカスタムモデルを使用する3D色彩トレーニングアプリのパフォーマンス最適化について説明します。6x6のグリッドに配置された36個のカスタムキューブモデルを効率的に扱うための方法を提案します。

## 2. パフォーマンス測定ツール

### 2.1 ブラウザの開発者ツール
- Chrome DevTools のPerformanceタブ
- Firefox の開発者ツールのパフォーマンス

### 2.2 React専用ツール
- React DevTools のProfilerタブ

### 2.3 Three.js専用ツール
- Three.js Inspector
- stats.js

## 3. パフォーマンス測定の実施

### 3.1 FPSモニタリング

stats.jsを使用したFPSモニタリングの実装例：

```tsx
import React, { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import Stats from 'stats.js';

const PerformanceMonitor: React.FC = () => {
  const statsRef = useRef<Stats>();

  useEffect(() => {
    statsRef.current = new Stats();
    statsRef.current.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(statsRef.current.dom);

    return () => {
      document.body.removeChild(statsRef.current!.dom);
    };
  }, []);

  useEffect(() => {
    if (statsRef.current) {
      const animate = () => {
        statsRef.current!.update();
        requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, []);

  return null;
};

const App: React.FC = () => (
  <>
    <Canvas>
      {/* 3Dシーンのコンテンツ */}
    </Canvas>
    <PerformanceMonitor />
  </>
);

export default App;
```

## 4. パフォーマンス最適化テクニック

### 4.1 ジオメトリの共有

カスタムblenderモデルのジオメトリを共有することで、メモリ使用量を削減します。

```tsx
const sharedGeometry = useMemo(() => {
  const originalMesh = gltf.scene.children[0] as THREE.Mesh;
  return originalMesh.geometry.clone();
}, [gltf]);
```

### 4.2 効率的なマテリアル管理

色ごとに異なるマテリアルを作成し、再利用します。

```tsx
const materials = useMemo(() => {
  return colors.map(color => new THREE.MeshStandardMaterial({
    color: color.bg,
    // カスタムシェーダーを使用する場合はここで適用
  }));
}, [colors]);
```

### 4.3 個別のメッシュ作成

各キューブを個別のメッシュとして作成し、グループ化します。

```tsx
const ColorCubes: React.FC<ColorCubesProps> = ({ colors, onSelect }) => {
  const groupRef = useRef<THREE.Group>(null);

  const cubes = useMemo(() => {
    return colors.map((color, index) => {
      const mesh = new THREE.Mesh(sharedGeometry, materials[index]);
      mesh.position.set((index % 6) - 2.5, Math.floor(index / 6) - 2.5, 0);
      return mesh;
    });
  }, [sharedGeometry, materials, colors]);

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.clear();
      cubes.forEach(cube => groupRef.current!.add(cube));
    }
  }, [cubes]);

  // ... その他のコード
};
```

### 4.4 イベント委譲

グループレベルでクリックイベントを処理することで、効率的なイベント管理を実現します。

```tsx
const handleClick = (event: THREE.Event) => {
  event.stopPropagation();
  const clickedCube = event.object as THREE.Mesh;
  const index = cubes.indexOf(clickedCube);
  if (index !== -1) {
    onSelect(index);
  }
};

return (
  <group ref={groupRef} onClick={handleClick}>
    {cubes.map((cube, index) => (
      <primitive key={index} object={cube} />
    ))}
  </group>
);
```

### 4.5 レンダリングの最適化

フレームレートの制限を実装して、不要な再描画を防ぎます。

```tsx
import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';

const FPSLimiter: React.FC<{ fps: number }> = ({ fps }) => {
  const { invalidate } = useThree();
  const lastUpdateRef = useRef(0);

  useFrame(({ clock }) => {
    const currentTime = clock.getElapsedTime();
    const timeSinceLastUpdate = currentTime - lastUpdateRef.current;
    
    if (timeSinceLastUpdate >= 1 / fps) {
      lastUpdateRef.current = currentTime;
      invalidate();
    }
  });

  return null;
};

// 使用例
const Scene: React.FC = () => (
  <Canvas>
    <FPSLimiter fps={30} />
    {/* その他の3Dオブジェクト */}
  </Canvas>
);
```

## 5. 追加の最適化テクニック

### 5.1 レベルオブディテール（LOD）

遠くのキューブには簡略化されたジオメトリを使用することで、描画負荷を軽減します。

```tsx
import { LOD } from 'three';
import { useFrame } from '@react-three/fiber';

const LodCube: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const lodRef = useRef<LOD>(null);

  useEffect(() => {
    if (lodRef.current) {
      const highDetailMesh = new THREE.Mesh(highDetailGeometry, material);
      const lowDetailMesh = new THREE.Mesh(lowDetailGeometry, material);
      
      lodRef.current.addLevel(highDetailMesh, 0);
      lodRef.current.addLevel(lowDetailMesh, 5);
    }
  }, []);

  useFrame(({ camera }) => {
    if (lodRef.current) {
      lodRef.current.update(camera);
    }
  });

  return <lOD ref={lodRef} position={position} />;
};
```

### 5.2 オクルージョンカリング

画面外のキューブをレンダリングしないようにすることで、パフォーマンスを向上させます。

```tsx
import { Frustum, Matrix4 } from 'three';
import { useFrame } from '@react-three/fiber';

const OcclusionCulling: React.FC = ({ children }) => {
  const groupRef = useRef<THREE.Group>(null);
  const frustum = useMemo(() => new Frustum(), []);
  const matrix = useMemo(() => new Matrix4(), []);

  useFrame(({ camera }) => {
    if (groupRef.current) {
      frustum.setFromProjectionMatrix(
        matrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
      );
      
      groupRef.current.children.forEach((child) => {
        if (child instanceof THREE.Mesh) {
          child.visible = frustum.intersectsObject(child);
        }
      });
    }
  });

  return <group ref={groupRef}>{children}</group>;
};
```

## 6. パフォーマンス最適化の進め方

1. ベースラインパフォーマンスの測定
2. ボトルネックの特定
3. 最適化の実施
4. 再測定と効果の確認
5. 繰り返し

## 7. 結論

3D色彩トレーニングアプリのパフォーマンス最適化は、ユーザー体験を向上させる重要な要素です。カスタムblenderモデルを使用する場合でも、ジオメトリの共有、効率的なマテリアル管理、適切なメッシュ作成とグループ化など、様々な最適化テクニックを適用することで、スムーズで快適なアプリケーションを実現できます。

パフォーマンス最適化は継続的なプロセスであり、新機能の追加や変更のたびに再評価することが重要です。ユーザーのフィードバックも積極的に取り入れ、実際の使用環境でのパフォーマンスも考慮しましょう。

適切な測定ツールを使用し、定期的にパフォーマンスを確認することで、アプリケーションの品質と使いやすさを維持・向上させることができます。