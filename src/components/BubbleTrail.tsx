"use client";

import { useEffect } from "react";

export default function BubbleTrail() {
  useEffect(() => {
    const trailContainer = document.createElement("div");
    trailContainer.style.position = "fixed";
    trailContainer.style.top = "0";
    trailContainer.style.left = "0";
    trailContainer.style.width = "100%";
    trailContainer.style.height = "100%";
    trailContainer.style.pointerEvents = "none";
    trailContainer.style.zIndex = "9999";
    document.body.appendChild(trailContainer);

    // --- Configuration for the dissolving particle effect ---
    const PARTICLE_COUNT = 15; // Number of particles per "burst"
    const PARTICLE_BASE_SIZE = 6; // Base size of each particle square
    const DURATION = 1500; // How long particles last, in milliseconds
    const SPREAD = 50; // How far the particles spread out
    const SPAWN_CHANCE = 0.25; // Higher chance to create a denser trail

    // Luminous, golden colors to match the video
    const colors = ["#FFD700", "#FFC700", "#FFB700", "#FFAA00"];

    const spawnParticles = (x: number, y: number) => {
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const particle = document.createElement("div");
        
        const size = PARTICLE_BASE_SIZE * (0.5 + Math.random() * 0.8);
        const duration = DURATION * (0.8 + Math.random() * 0.4);

        particle.style.position = "absolute";
        // Center the particle on the cursor's initial position
        particle.style.left = `${x - size / 2}px`;
        particle.style.top = `${y - size / 2}px`;

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Use a background color to create the solid particle look
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        // A very slight border radius, but mostly square like the video
        particle.style.borderRadius = "2px";
        
        // A subtle glow effect for each particle
        particle.style.boxShadow = `0 0 5px ${particle.style.background}`;

        particle.style.pointerEvents = "none";
        particle.style.opacity = "1";

        // Smooth transition for the particle's animation
        particle.style.transition = `
          transform ${duration}ms cubic-bezier(0.1, 0.8, 0.2, 1),
          opacity ${duration}ms ease-out
        `;

        trailContainer.appendChild(particle);

        // Animate the particle on the next available frame
        requestAnimationFrame(() => {
          // Random final position creates the "burst" effect
          const finalX = (Math.random() - 0.5) * SPREAD * 2;
          const finalY = -(SPREAD * 0.8) - (Math.random() * SPREAD * 1.2);

          // Animate by moving, shrinking (scale), and fading (opacity)
          particle.style.transform = `translate(${finalX}px, ${finalY}px) scale(0)`;
          particle.style.opacity = "0";
        });

        // Remove the particle from the DOM after its animation is complete
        setTimeout(() => {
          if (trailContainer.contains(particle)) {
            trailContainer.removeChild(particle);
          }
        }, duration);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (Math.random() < SPAWN_CHANCE) {
        spawnParticles(e.clientX, e.clientY);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Cleanup function
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (document.body.contains(trailContainer)) {
        document.body.removeChild(trailContainer);
      }
    };
  }, []);

  return null;
}