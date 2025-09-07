"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import * as THREE from "three";
import { FiX } from "react-icons/fi"; // Import a close icon

// Dynamically import react-globe.gl (disable SSR)
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

// Define the structure of our data points
interface SpeciesPoint {
  lat: number;
  lng: number;
  species: string;
  wiki: string;
  confidence: number;
}

interface HabitatPolygon {
  lat: number;
  lng: number;
  radius: number;
  name: string;
}

export default function GlobePage() {
  const [points, setPoints] = useState<SpeciesPoint[]>([]);
  const [polygons, setPolygons] = useState<HabitatPolygon[]>([]);
  const [arcs, setArcs] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [hoveredPoint, setHoveredPoint] = useState<SpeciesPoint | null>(null); // State for info panel
  const [panelPosition, setPanelPosition] = useState({ x: 0, y: 0 }); // State for panel position

  // Ref to control the globe's animation loop
  const globeRef = useRef<any>(null);

  // --- EFFECT 1: Simulate Data Loading and Analysis ---
  useEffect(() => {
    // Simulate a delay for backend processing
    const timer = setTimeout(() => {
      // --- Hardcoded Data (as a stand-in for your AI model's output) ---
      const speciesData: SpeciesPoint[] = [
        { lat: -75, lng: 0, species: "Orca", wiki: "https://en.wikipedia.org/wiki/Orca", confidence: 0.9 },
        { lat: 30, lng: -40, species: "Yellowfin Tuna", wiki: "https://en.wikipedia.org/wiki/Yellowfin_tuna", confidence: 0.7 },
        { lat: 10, lng: 100, species: "Clownfish", wiki: "https://en.wikipedia.org/wiki/Clownfish", confidence: 0.6 },
      ];
      setPoints(speciesData);

      const habitatData: HabitatPolygon[] = [
        { lat: -75, lng: 0, radius: 15, name: "Orca Habitat" },
        { lat: 30, lng: -40, radius: 10, name: "Tuna Habitat" },
      ];
      setPolygons(habitatData);

      // --- Create animated arcs from an analysis center to each species ---
      const analysisCenter = { lat: 37.7749, lng: -122.4194 }; // San Francisco
      const arcData = speciesData.map(point => ({
        startLat: analysisCenter.lat,
        startLng: analysisCenter.lng,
        endLat: point.lat,
        endLng: point.lng,
        color: ['rgba(0, 255, 255, 0.4)', 'rgba(255, 255, 0, 0.4)'],
        label: `Analysis Result: ${point.species}`
      }));
      setArcs(arcData);

      setIsAnalyzing(false); // End loading state
    }, 3000); // 3-second delay

    return () => clearTimeout(timer);
  }, []);


  // --- EFFECT 2: Animate Habitat Polygons ---
  useEffect(() => {
    // This effect creates a "breathing" animation for the habitat polygons
    const globe = globeRef.current;
    if (!globe || isAnalyzing) return;

    let frameId: number;
    const animate = () => {
      const time = new Date().getTime();
      // Oscillate altitude between 0.01 and 0.06 over ~4 seconds
      const altitude = 0.01 + (Math.sin(time / 1000) * 0.5 + 0.5) * 0.05;
      globe.polygonAltitude(() => altitude);
      frameId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(frameId);
  }, [isAnalyzing]);


  // --- UI Rendering ---
  if (isAnalyzing) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-gray-900 text-white">
        <div className="dna-loader"></div>
        <h1 className="mt-8 text-2xl font-semibold tracking-wider">Analyzing DNA Sample...</h1>
        <p className="text-gray-400">Mapping genetic origins across the globe.</p>
        <style jsx>{`
          .dna-loader {
            width: 80px;
            height: 80px;
            border: 4px solid #4A5568;
            border-radius: 50%;
            position: relative;
            animation: rotate 1s linear infinite;
          }
          .dna-loader::before, .dna-loader::after {
            content: "";
            position: absolute;
            width: 10px;
            height: 10px;
            background: #4299E1;
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
          .dna-loader::after {
            animation: helix 1s ease-in-out infinite alternate;
          }
          @keyframes rotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          @keyframes helix { 0% { top: 25%; } 100% { top: 75%; } }
        `}</style>
      </div>
    );
  }

  // --- Function to handle interactions and position the info panel ---
  const handleInteraction = (point: SpeciesPoint | null) => {
    if (point) {
      const screenCoords = globeRef.current?.getScreenCoords(point.lat, point.lng);
      if (screenCoords) {
        setPanelPosition({ x: screenCoords.x, y: screenCoords.y });
      }
    }
    setHoveredPoint(point);
  };

  return (
    <div className="relative w-full h-screen">
      <div className="absolute top-4 left-4 z-10 rounded-md bg-black/50 p-4 text-white backdrop-blur-sm">
        <h1 className="text-xl font-bold">DNA Origin Analysis</h1>
        <p className="text-sm text-gray-300">Found {points.length} potential species origins.</p>
      </div>

      {/* Interactive Information Panel */}
      {hoveredPoint && (
        <div
          className="absolute z-20 w-64 rounded-lg border border-cyan-400/50 bg-gray-900/70 p-4 text-white shadow-lg backdrop-blur-lg transition-opacity duration-300"
          style={{
            left: panelPosition.x,
            top: panelPosition.y,
            transform: 'translate(20px, -50%)', // Offset from the beacon
            pointerEvents: 'auto', // Allow interaction with the panel
          }}
        >
          <button onClick={() => setHoveredPoint(null)} className="absolute top-2 right-2 text-gray-400 hover:text-white">
            <FiX size={18} />
          </button>
          <h3 className="text-lg font-bold text-cyan-300">{hoveredPoint.species}</h3>
          <p className="text-sm text-gray-300">
            Confidence Score: <span className="font-semibold text-yellow-400">{(hoveredPoint.confidence * 100).toFixed(0)}%</span>
          </p>
          <a
            href={hoveredPoint.wiki}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block rounded-md bg-cyan-600/50 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-cyan-500/50"
          >
            Learn More
          </a>
        </div>
      )}

      <Globe
        ref={globeRef}
        // --- Globe Appearance ---
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        atmosphereColor="cyan"
        atmosphereAltitude={0.2}

        // --- Species Beacons (replacing points) ---
        pointsData={points} // CHANGED from customLayerData
        pointThreeObject={(d: any) => { // CHANGED from customThreeObject
          const group = new THREE.Group();
          const color = d.species === "Orca" ? 0x00ffff : d.species === "Yellowfin Tuna" ? 0xffa500 : 0x00ff00;
          const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.6 });
          const ring = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.1, 16, 100), material);
          ring.rotation.x = Math.PI / 2;
          group.add(ring);
          const cone = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1, 32), material);
          cone.rotation.x = Math.PI / 2;
          group.add(cone);
          return group;
        }}
        pointThreeObjectUpdate={(obj: any, d: any) => { // CHANGED from customThreeObjectUpdate
          const time = new Date().getTime();
          const pulse = Math.sin(time / 500 + d.lat) * 0.5 + 0.5;
          const scale = 0.5 + d.confidence * (0.5 + pulse * 0.5);
          obj.scale.set(scale, scale, scale);
          Object.assign(obj.position, globeRef.current?.getCoords(d.lat, d.lng, 0.01));
        }}

        // --- Animated Arcs ---
        arcsData={arcs}
        arcColor="color"
        arcDashLength={0.4}
        arcDashGap={0.1}
        arcDashAnimateTime={2000}
        arcStroke={0.5}

        // --- Habitat Polygons ---
        polygonsData={polygons}
        polygonCapColor={() => "rgba(0, 100, 255, 0.2)"}
        polygonSideColor={() => "rgba(0, 255, 255, 0.1)"}
        polygonLabel={(poly: any) => `<b>${poly.name}</b>`}

        // --- Interactivity ---
        onPointClick={(d, event) => handleInteraction(d as SpeciesPoint | null)} // CHANGED from onCustomLayerClick
        onPointHover={(d, prevD) => handleInteraction(d as SpeciesPoint | null)} // CHANGED from onCustomLayerHover
      />
    </div>
  );
}

