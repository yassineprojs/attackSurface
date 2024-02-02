import * as THREE from "three";

import globeVertexShader from "./shaders/atmosphere/vertex.js";
import globeFragmentShader from "./shaders/atmosphere/fragment.js";
import glowFragmentShader from "./shaders/glowingAtmo/fragmentGlow.js";
import glowVertexShader from "./shaders/glowingAtmo/vertexGlow.js";

import { useFrame } from "@react-three/fiber";
import React, { useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";

import AttackPoints from "./AttackPoints.js";

export function Model(props) {
  const group = useRef();

  const { nodes, materials } = useGLTF("./models/earth2/earth2.gltf");

  const pointlight = useRef();
  const sphereRef = useRef();
  const earthRef = useRef();
  const lightRef = useRef();

  const [time, setTime] = useState(0);

  // useFrame((state, delta) => {
  //   group.current.rotation.y += delta * 0.1;
  //   lightRef.current.uTime += delta * 0.5;
  //   setTime((prevTime) => prevTime + delta * 0.1);
  // });

  return (
    <group ref={group} {...props} dispose={null}>
      {/* <pointLight intensity={200} position={[10, 5, 10]} /> */}
      {/* <ambientLight intensity={10} position={[10, 5, -10]} /> */}
      <group name="Sketchfab_Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
          <group
            name="3f0d8c1a7c7c45138e5b99b56838fcb9fbx"
            rotation={[Math.PI / 2, 0, 0]}
          >
            <group name="Object_2">
              <group name="RootNode">
                <group name="Earth" rotation={[-Math.PI / 2, 0, 0]}>
                  <mesh
                    ref={earthRef}
                    name="Earth_Material_#50_0"
                    geometry={nodes["Earth_Material_#50_0"].geometry}
                    material={materials.Material_50}
                  />
                </group>
                <group
                  name="EarthClouds"
                  rotation={[-Math.PI / 2, -Math.PI / 9, 0]}
                  scale={1.01}
                >
                  <mesh
                    name="EarthClouds_Material_#62_0"
                    geometry={nodes["EarthClouds_Material_#62_0"].geometry}
                    material={materials.Material_62}
                  />
                </group>
                {/* glowing atmo */}
                <mesh>
                  <sphereGeometry args={[5.1, 88, 88]} />
                  <shaderMaterial
                    vertexShader={glowVertexShader}
                    fragmentShader={glowFragmentShader}
                    blending={THREE.AdditiveBlending}
                    side={THREE.BackSide}
                    transparent
                  />
                </mesh>

                {/* atmo */}

                <mesh position={[0, 0, 0]}>
                  <sphereGeometry
                    args={[5.1, 48, 48]}
                    ref={sphereRef}
                  ></sphereGeometry>
2
                  <shaderMaterial
                    ref={lightRef}
                    vertexShader={globeVertexShader}
                    fragmentShader={globeFragmentShader}
                    transparent
                    uniforms={{
                      lightPosition: { value: new THREE.Vector3(5, 10, 5) }, // Example light position
                      lightIntensity: { value: 80 }, // Example light intensity
                      surfaceRadius: { value: 6 },
                      atmoRadius: { value: 7 },
                      // uTime: { value: time },
                    }}
                  />
                </mesh>

                {/* attack points */}

                <AttackPoints />
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("./models/earth2/earth2.gltf");
