'use client';

import { PerspectiveCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';

import { ResponsiveCells } from '@/components/Editor/VirtualGrid/ResponsiveCells';

import '@/components/Editor/VirtualGrid/styles/virtual-grid.scss';

interface VirtualGridProps {
  gridRef: React.RefObject<HTMLDivElement>;
}

export const VirtualGrid = ({ gridRef }: VirtualGridProps) => {
  return (
    <div className="virtual-grid">
      <Suspense fallback={<Loading />}>
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <ResponsiveCells gridRef={gridRef} />
        </Canvas>
      </Suspense>
    </div>
  );
};

import '@/components/Editor/VirtualGrid/styles/loading-grid.scss';

const Loading = () => {
  return <div className="loading-grid">Loading...</div>;
};
