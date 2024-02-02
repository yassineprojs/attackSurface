import * as THREE from "three";
import curveFragmentShader from "./shaders/curve/fragment.js";
import curveVertexShader from "./shaders/curve/vertex.js";
import { useFrame, extend } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { shaderMaterial } from "@react-three/drei";

export default function CurvePath({ points, radius }) {
  const curveMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        vertexShader: curveVertexShader,
        fragmentShader: curveFragmentShader,
        uniforms: {
          uTime: { value: 0 },
        },
      }),
    []
  );
  const curveMaterialRef = useRef(curveMaterial);

  useFrame((state, delta) => {
    curveMaterialRef.current.uniforms.uTime.value += delta * 5;
  });

  const numPoints = points.length * 20; // Increase the number of points for smoother curve
  const curvePoints = [];

  for (let i = 0; i < numPoints; i++) {
    const t = i / numPoints; // interpolation factor
    const index = Math.floor(t * (points.length - 1));

    const p1 = points[index];
    const p2 = points[index + 1];

    const alpha = t * (points.length - 1) - index;

    const interpolatedPoint = new THREE.Vector3().lerpVectors(p1, p2, alpha);
    const normalizedPoint = interpolatedPoint
      .clone()
      .normalize()
      .multiplyScalar(radius);

    // Use sine function to create a wave-like pattern
    const waveFactor = 1 + 0.05 * Math.sin((Math.PI * i) / numPoints);
    normalizedPoint.multiplyScalar(waveFactor);

    curvePoints.push(normalizedPoint);
  }

  const path = new THREE.CatmullRomCurve3(curvePoints);

  return (
    <mesh>
      <tubeGeometry args={[path, numPoints, 0.04, 8, true]} />
      <primitive object={curveMaterialRef.current} attach="material" />
    </mesh>
  );
}
