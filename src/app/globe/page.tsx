"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { FiBarChart2, FiAlertTriangle, FiChevronDown } from "react-icons/fi";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

// --- Helper Function ---
const generateSpeciesConnections = (speciesData: { species: string; locations: { lat: number; lng: number }[] }) => {
  const hotspots = speciesData.locations.slice(0, 10);
  if (hotspots.length < 2) return [];

  const arcs = [];
  for (let i = 0; i < hotspots.length; i++) {
    for (let j = i + 1; j < hotspots.length; j++) {
      const start = hotspots[i];
      const end = hotspots[j];
      
      const distance = Math.sqrt(Math.pow(start.lat - end.lat, 2) + Math.pow(start.lng - end.lng, 2));
      const similarity = Math.max(0.1, 1 - distance / 180);

      arcs.push({
        startLat: start.lat,
        startLng: start.lng,
        endLat: end.lat,
        endLng: end.lng,
        color: `rgba(0, 255, 150, ${similarity * 0.7})`,
        stroke: similarity * 0.6,
      });
    }
  }
  return arcs;
};

// --- Type Definitions ---
interface SpeciesGeoData {
  species: string;
  locations: { lat: number; lng: number }[];
}

// --- Main Component ---
export default function GlobePage() {
  const [allGeoData, setAllGeoData] = useState<SpeciesGeoData[]>([]);
  const [selectedSpecies, setSelectedSpecies] = useState<string>('');
  const [heatmapPoints, setHeatmapPoints] = useState<any[]>([]);
  const [arcs, setArcs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const globeRef = useRef<any>();

  useEffect(() => {
    try {
      const resultString = localStorage.getItem('analysisResult');
      if (!resultString) throw new Error("No analysis data found. Please upload a file first.");

      const result = JSON.parse(resultString);

      if (result.geo_profiles && result.geo_profiles.length > 0) {
        // --- CORRECTED LOGIC: This now properly handles the full list of coordinates ---
        const geoData: SpeciesGeoData[] = result.geo_profiles.map((profile: any) => {
          const locations = Array.isArray(profile.coordinates)
            ? profile.coordinates.map((coords: [number, number]) => ({ lat: coords[0], lng: coords[1] }))
            : [];
            
          return {
            species: profile.scientific_name,
            locations: locations
          };
        }).filter((s: any) => s.locations.length > 0);

        if (geoData.length === 0) {
          throw new Error("Analysis complete, but no valid coordinates were found for the identified species.");
        }

        setAllGeoData(geoData);
        setSelectedSpecies(geoData[0].species);

      } else {
        throw new Error("Analysis complete, but no geographic data could be found for the identified species.");
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!selectedSpecies || allGeoData.length === 0) {
      setHeatmapPoints([]);
      setArcs([]);
      return;
    };

    const speciesData = allGeoData.find(s => s.species === selectedSpecies);
    if (speciesData) {
      const pointsForHeatmap = speciesData.locations.map(loc => [loc.lat, loc.lng, 0.1]);
      setHeatmapPoints(pointsForHeatmap);

      const connectionArcs = generateSpeciesConnections(speciesData);
      setArcs(connectionArcs);
    }
  }, [selectedSpecies, allGeoData]);
  
  // --- Render Logic ---
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-gray-900 text-white">
        <p>Loading Analysis Data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-gray-900 text-white p-8 text-center">
        <FiAlertTriangle size={48} className="text-red-500 mb-4" />
        <h1 className="text-2xl font-semibold text-red-400">An Error Occurred</h1>
        <p className="text-gray-400 mt-2 max-w-md">{error}</p>
        <a href="/upload" className="mt-6 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-500">
          Go to Upload Page
        </a>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-black">
      <div className="absolute top-4 left-4 z-10 rounded-md bg-black/50 p-4 text-white backdrop-blur-sm max-w-sm">
        <h1 className="text-xl font-bold">Species Distribution Analysis</h1>

        <div className="mt-4">
          <label htmlFor="species-select" className="block text-sm font-medium text-gray-300">
            Displaying Hotspots For
          </label>
          <div className="relative mt-1">
            <select
              id="species-select"
              value={selectedSpecies}
              onChange={(e) => setSelectedSpecies(e.target.value)}
              className="w-full appearance-none rounded-md border-gray-600 bg-gray-800/80 py-2 pl-3 pr-10 text-base focus:border-cyan-500 focus:outline-none focus:ring-cyan-500 sm:text-sm"
            >
              {allGeoData.map(s => (
                <option key={s.species}>{s.species}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <FiChevronDown className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        <button
          onClick={() => router.push('/report')}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-blue-600/80 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500/80"
        >
          <FiBarChart2 /> View Analysis Insights
        </button>
      </div>

      <Globe
        ref={globeRef}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        atmosphereColor="cyan"
        atmosphereAltitude={0.2}

        heatmapData={heatmapPoints}
        heatmapPointLat={p => p[0]}
        heatmapPointLng={p => p[1]}
        heatmapPointWeight={p => p[2]}
        heatmapRadius={1.5}
        heatmapColorSaturation={1.0}

        arcsData={arcs}
        arcColor="color"
        arcStroke="stroke"
        arcDashLength={0.4}
        arcDashGap={0.2}
        arcDashAnimateTime={3000}
      />
    </div>
  );
}