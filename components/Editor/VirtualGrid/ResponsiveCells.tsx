'use client';

import React, { useRef, useState, useMemo, useCallback, useEffect, Suspense } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';

import { GLTF } from 'three-stdlib';
import { useGLTF } from '@react-three/drei';
import { useSnapshot } from 'valtio';
import { actions, editorStore } from '@/store/editorStore';

interface ResponsiveCellsProps {
  gridRef: React.RefObject<HTMLDivElement>;
}

export const ResponsiveCells = ({ gridRef }: ResponsiveCellsProps) => {
  const { size, camera } = useThree();
  const [isInitialized, setIsInitialized] = useState(false);
  const cellPositionsRef = useRef<
    { position: [number, number, number]; scale: [number, number, number] }[]
  >([]);
  const lastClickTimeRef = useRef(0);
  const { activeCell, tempCellColors } = useSnapshot(editorStore);
  const { setActiveCell, openColorPicker } = actions;

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

      cellPositionsRef.current = Array.from(cellElements).map((cell, index) => {
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

      if (!isInitialized) {
        setIsInitialized(true);
      }
    }
  }, [size, camera, gridRef, isInitialized]);

  useFrame(() => {
    updateCellPositions();
  });

  const handleClick = useCallback((index: number) => {
    const now = performance.now();
    if (now - lastClickTimeRef.current > 300) {
      lastClickTimeRef.current = now;
      setActiveCell(index);
      openColorPicker();
    }
  }, []);

  const cells = useMemo(() => {
    return cellPositionsRef.current.map((_, index) => (
      <GridCell
        key={index}
        index={index}
        cellPositionsRef={cellPositionsRef}
        onClick={() => handleClick(index)}
        isActive={activeCell === index}
        colors={tempCellColors[index]}
      />
    ));
  }, [isInitialized, activeCell, cellPositionsRef, handleClick, tempCellColors]);

  return <group>{cells}</group>;
};

interface GridCellProps {
  index: number;
  cellPositionsRef: React.MutableRefObject<
    { position: [number, number, number]; scale: [number, number, number] }[]
  >;
  onClick: () => void;
  isActive: boolean;
  colors: { square: string; circle: string };
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
 *
 */
const GridCell = React.memo(
  ({ index, cellPositionsRef, onClick, isActive, colors }: GridCellProps) => {
    const { nodes, materials } = useGLTF('/models/cell.glb') as GLTFResult;
    const groupRef = useRef<THREE.Group>(null);

    const squareMaterial = useMemo(() => {
      return new THREE.MeshBasicMaterial({
        color: colors.square,
      });
    }, [colors.square]);

    const circleMaterial = useMemo(() => {
      return new THREE.MeshBasicMaterial({
        color: colors.circle,
      });
    }, [colors.circle]);

    const frameMaterial = useMemo(() => {
      return new THREE.MeshBasicMaterial({
        color: '#000000',
        opacity: 0.5,
        transparent: true,
      });
    }, []);

    useFrame(() => {
      if (groupRef.current && cellPositionsRef.current[index]) {
        const { position, scale } = cellPositionsRef.current[index];

        const activeScale = isActive ? 1.1 : 1.0;
        const activeZoom = isActive ? 0.01 : 0;
        const activeFrame = isActive ? 1.1 : 0;

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
      }
    });

    return (
      <group ref={groupRef} onClick={onClick} dispose={null}>
        <mesh geometry={nodes.circle.geometry} material={circleMaterial} name="circle" />
        <mesh geometry={nodes.square.geometry} material={squareMaterial} name="square" />
        <mesh geometry={nodes.squareFrame.geometry} material={frameMaterial} name="squareFrame" />
      </group>
    );
  }
);

useGLTF.preload('/models/cell.glb');
