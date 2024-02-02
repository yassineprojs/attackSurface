import { Canvas } from "@react-three/fiber";
import Experience from "./Experience.js";
import { Loader } from "@react-three/drei";

import { Suspense } from "react";
export default function Main() {
  return (
    <>
      <Canvas
        camera={{
          fov: 15,
          near: 1,
          far: 1000,
          position: [30, 15, 30],
        }}
      >
        <Suspense fallback={null}>
          <Experience />
        </Suspense>
      </Canvas>
      <Loader />
    </>
  );
}
