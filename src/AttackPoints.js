import { useState, useEffect, useRef, useMemo } from "react";
import * as THREE from "three";
import circleFragmentShader from "./shaders/attackRings/fragment.js";
import circleVertexShader from "./shaders/attackRings/vertex.js";
import { useFrame } from "@react-three/fiber";
import CurvePath from "./CurvePath.js";
import "./AttackPoints.css";
import { Html } from "@react-three/drei";
// import bezel from "./images/bezel.png";
// import scanlines from "./images/scanlines.png";

const cyberAttacks = [
  {
    id: 1,
    latitude: -26.2041,
    longitude: 28.047304,

    attackType: "Phishing",
    severity: "Medium",
    description: "Phishing attack reported in Johannesburg, South Africa.",
    timestamp: "2023-11-17T08:45:00Z",
  },

  {
    id: 2,
    latitude: 20.507351,
    longitude: -8.118,

    attackType: "Phishing",
    severity: "Medium",
    description: "A phishing attempt reported in London, UK.",
    timestamp: "2023-11-15T15:45:00Z",
  },
  {
    id: 3,
    latitude: 36.8065,
    longitude: 10.1815,

    attackType: "DDoS",
    severity: "Critical",
    description: "A severe DDoS attack affecting Tunis, Tunisia.",
    timestamp: "2023-11-15T18:20:00Z",
  },
];

function convertTo3DCoordinates(latitude, longitude) {
  // convert latitude and longitude to radians
  const latRad = (latitude * Math.PI) / 180;
  const lonRad = (longitude * Math.PI) / 180;

  const radius = 5.2;

  // calculate cartisian coordinates
  const x = radius * Math.cos(latRad) * Math.cos(lonRad);
  const y = radius * Math.sin(latRad);
  const z = radius * Math.cos(latRad) * Math.sin(lonRad);

  return [x, y, z];
}

export default function AttackPoints() {
  // const { ringRotation } = useControls({
  //   ringRotation: {
  //     value: { x: Math.PI * 0.5, y: 0, z: 0 },
  //     step: 0.1,
  //   },
  // });

  const [points, setPoints] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [selectedAttack, setSelectedAttack] = useState(null);
  const [visible, setvisible] = useState(false);

  const meshRefs = useRef([]);

  const centerOfEarth = new THREE.Vector3(0, 0, 0);
  const radius = 5.2;

  const attackPointClick = (attackId) => {
    const clickedAttack = points.find((point) => point.id === attackId);
    // toggle the visibility of the text
    setvisible((prevVisible) => !prevVisible);
    // Set the selected attack only if the text is visible
    setSelectedAttack((prevSelectedAttack) =>
      prevSelectedAttack === clickedAttack ? null : clickedAttack
    );
  };

  useFrame(({ clock, camera }) => {
    meshRefs.current.forEach((mesh) => {
      if (mesh.material) {
        mesh.material.uniforms.time.value = clock.elapsedTime;
        mesh.lookAt(centerOfEarth);
      }
    });

    /**
     * camera
     */
    // if (points.length > 0) {
    //   const firstAttackPosition = new THREE.Vector3(...points[0].position);
    //   const cameraPosition = new THREE.Vector3();
    //   cameraPosition.copy(firstAttackPosition);
    //   cameraPosition.z += 8.25;
    //   cameraPosition.y += -2;

    //   const cameraTarget = new THREE.Vector3();
    //   cameraTarget.copy(firstAttackPosition);
    //   cameraTarget.y += 0.2;

    //   camera.position.copy(cameraPosition);
    //   camera.lookAt(cameraTarget);
    // }
  });

  useEffect(() => {
    const newPoints = cyberAttacks.map((attack) => {
      const [x, y, z] = convertTo3DCoordinates(
        attack.latitude,
        attack.longitude
      );

      return {
        id: attack.id,
        position: [x, y, z],
        info: {
          attackType: attack.attackType,
          severity: attack.severity,
          description: attack.description,
          timestamp: attack.timestamp,
        },
      };
    });

    setPoints(newPoints);
    setIsReady(true);
  }, []);

  const ringMaterial = useMemo(
    () => (
      <shaderMaterial
        side={THREE.DoubleSide}
        vertexShader={circleVertexShader}
        fragmentShader={circleFragmentShader}
        uniforms={{
          time: { value: 0 },
        }}
      />
    ),
    []
  );

  const handlePointerEnter = (index) => {
    if (meshRefs.current[index]) {
      meshRefs.current[index].scale.set(1.3, 1.3, 1.3);
    }
  };

  const handlePointerLeave = (index) => {
    if (meshRefs.current[index]) {
      meshRefs.current[index].scale.set(1, 1, 1); // Reset scale
    }
  };

  return (
    <>
      {isReady && points.length > 0 && (
        <group>
          <CurvePath
            points={points.map((p) => new THREE.Vector3(...p.position))}
            radius={radius}
          />

          {points.map((point, index) => (
            <mesh
              onPointerEnter={() => {
                document.body.style.cursor = "pointer";
                handlePointerEnter(index);
              }}
              onPointerLeave={() => {
                document.body.style.cursor = "default";
                handlePointerLeave(index);
              }}
              onClick={() => attackPointClick(point.id)}
              position={point.position}
              key={point.id}
              ref={(ref) => (meshRefs.current[index] = ref)}
            >
              <planeGeometry args={[1, 1]} />
              {ringMaterial}
            </mesh>
          ))}
        </group>
      )}
      {selectedAttack && visible && (
        <Html>
          <div className="card">
            <img
              className="scanImage noselect"
              src="/images/scanlines.png"
              alt="scanlines image"
            ></img>
            <img
              className="bezel noselect"
              src="/images/bezel.png"
              alt="bezels image"
            ></img>
            <div className="inside_card">
              <div className="card_header">
                <h2>ATTACK INFO</h2>
              </div>
              <div className="card_info">
                <ul className="attackList">
                  {Object.keys(selectedAttack.info).map((key) => (
                    <li className="attacks" key={key}>
                      {key}: {selectedAttack.info[key]}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Html>
      )}
    </>
  );
}
