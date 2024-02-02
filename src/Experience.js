import {
  OrbitControls,
  PivotControls,
  Sky,
  TransformControls,
  Stars,
} from "@react-three/drei";
import * as THREE from "three";
import { Model } from "./Globe";
import { Perf } from "r3f-perf";

export default function Experience() {
  return (
    <>
      <Perf position="top-left" />
      <color args={["#000000"]} attach="background" />
      <Stars
        radius={100}
        depth={50}
        count={50000}
        factor={4}
        saturation={0}
        fade
        speed={1.7}
      />
      <OrbitControls makeDefault />;
      <Model />
    </>
  );
}
