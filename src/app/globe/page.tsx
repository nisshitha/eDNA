"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import * as THREE from "three";

// Dynamically import react-globe.gl (disable SSR)
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

export default function GlobePage() {
  const [points, setPoints] = useState<any[]>([]);
  const [polygons, setPolygons] = useState<any[]>([]);

  useEffect(() => {
    // Hardcoded species points
    setPoints([
      { lat: -75, lng: 0, species: "Orca", wiki: "https://en.wikipedia.org/wiki/Orca", confidence: 0.9 },
      { lat: 30, lng: -40, species: "Tuna", wiki: "https://en.wikipedia.org/wiki/Yellowfin_tuna", confidence: 0.7 },
      { lat: 10, lng: 100, species: "Clownfish", wiki: "https://en.wikipedia.org/wiki/Clownfish", confidence: 0.6 },
    ]);

    // Hardcoded habitat polygons (glowing)
    setPolygons([
      { lat: -75, lng: 0, radius: 15, name: "Orca Habitat" },
      { lat: 30, lng: -40, radius: 10, name: "Tuna Habitat" },
    ]);
  }, []);

  useEffect(() => {
    // Bubble trail effect
    const trailContainer = document.createElement("div");
    trailContainer.style.position = "absolute";
    trailContainer.style.top = "0";
    trailContainer.style.left = "0";
    trailContainer.style.width = "100%";
    trailContainer.style.height = "100%";
    trailContainer.style.pointerEvents = "none";
    document.body.appendChild(trailContainer);

    const bubbles: HTMLDivElement[] = [];

    const createBubble = (x: number, y: number) => {
      const bubble = document.createElement("div");
      bubble.style.position = "absolute";
      bubble.style.left = `${x}px`;
      bubble.style.top = `${y}px`;
      bubble.style.width = `${Math.random() * 10 + 5}px`;
      bubble.style.height = bubble.style.width;
      bubble.style.borderRadius = "50%";
      bubble.style.background = "rgba(173,216,230,0.5)";
      bubble.style.pointerEvents = "none";
      bubble.style.transition = "transform 1s ease-out, opacity 1s ease-out";
      trailContainer.appendChild(bubble);
      bubbles.push(bubble);

      requestAnimationFrame(() => {
        bubble.style.transform = `translateY(-50px) scale(0)`;
        bubble.style.opacity = "0";
      });

      setTimeout(() => {
        trailContainer.removeChild(bubble);
        bubbles.shift();
      }, 1000);
    };

    const handleMouseMove = (e: MouseEvent) => {
      createBubble(e.clientX, e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      trailContainer.remove();
    };
  }, []);

  return (
    <div className="w-full h-screen">
      <Globe
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        pointsData={points}
        pointLat="lat"
        pointLng="lng"
        pointColor={(point) => {
          if (point.species === "Orca") return "blue";
          if (point.species === "Tuna") return "orange";
          return "green";
        }}
        pointAltitude={(point) => 0.01 + point.confidence * 0.05}
        pointRadius={(point) => 0.5 + point.confidence * 1}
        pointLabel={(point) => `Species: ${point.species}\nClick to learn more!`}
        onPointClick={(point) => window.open(point.wiki, "_blank")}
        polygonsData={polygons}
        polygonCapColor={() => "rgba(0,0,255,0.4)"}
        polygonSideColor={() => "rgba(0,0,255,0.2)"}
        polygonAltitude={0.01}
        polygonLabel={(poly) => poly.name}
        backgroundColor="rgba(0,0,0,0.8)"
      />
    </div>
  );
}
