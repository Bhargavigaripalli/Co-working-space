/* ==========================================================================
   WORKNEST - FLOORPLAN.JS
   Interactive Blueprint / Co-Working Pod Zone Visualizer
   ========================================================================== */

(function () {
  "use strict";

  const zoneData = {
    focus: {
      title: "Silent Focus Pods",
      badge: "Ultra-Quiet Zone",
      status: "🟢 4 Pods Available",
      desc: "Sound-dampening acoustic dividers, Herman Miller Aeron ergonomic seating, and dual monitor plug-and-play docks for deep undistracted work.",
      image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80",
      noise: "< 32 dB (Whisper Silent)",
      capacity: "24 Dedicated Desks",
      amenity: "Dual 4K Monitors, Wireless Charging"
    },
    collab: {
      title: "Collaborative Agile Hub",
      badge: "Team Synergy",
      status: "🟡 Moderate Traffic",
      desc: "Modular height-adjustable team tables, mobile magnetic whiteboards, presentation screens, and relaxed sofa clusters for fluid team sprints.",
      image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=800&q=80",
      noise: "50-60 dB (Creative Buzz)",
      capacity: "Up to 35 Creators",
      amenity: "Digital Smartboards & Mobile Power Banks"
    },
    meeting: {
      title: "Executive Boardroom & AV Studio",
      badge: "Soundproof Enclosure",
      status: "🟢 Available to Book",
      desc: "Full acoustic isolation with 4K Polycom video conferencing, directional ceiling mics, 85-inch interactive touch display, and executive leather seating.",
      image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80",
      noise: "0 dB Leakage (Acoustic Glass)",
      capacity: "16 Person Conference",
      amenity: "Polycom 4K Cam, Motorized Blinds"
    },
    booth: {
      title: "Acoustic Video & Phone Booths",
      badge: "Private Call Pods",
      status: "🟢 2 Booths Empty Now",
      desc: "Individual soundproof capsules equipped with diffused ring lighting, ergonomic perch stool, ultra-quiet ventilation, and high-speed ethernet connection.",
      image: "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?auto=format&fit=crop&w=800&q=80",
      noise: "35 dB Attenuation",
      capacity: "1 Person Private Pod",
      amenity: "Studio Ring Light, Silent Airflow"
    },
    cafe: {
      title: "Barista Espresso & Social Lounge",
      badge: "Community Hub",
      status: "☕ Barista on Duty",
      desc: "Freshly roasted single-origin specialty espresso, nitro cold brew on tap, organic teas, and comfortable banquette seating for casual breaks.",
      image: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=800&q=80",
      noise: "Ambient Lo-Fi Music",
      capacity: "50+ Members",
      amenity: "La Marzocco Espresso, Kombucha Tap"
    }
  };

  const zonePaths = document.querySelectorAll(".floorplan-zone-path");
  const zoneImg = document.getElementById("zonePreviewImg");
  const zoneTitle = document.getElementById("zoneTitle");
  const zoneStatus = document.getElementById("zoneStatusPill");
  const zoneDesc = document.getElementById("zoneDesc");
  const zoneNoise = document.getElementById("zoneNoiseVal");
  const zoneCapacity = document.getElementById("zoneCapacityVal");

  function selectZone(zoneKey) {
    const data = zoneData[zoneKey];
    if (!data) return;

    zonePaths.forEach((path) => {
      if (path.getAttribute("data-zone") === zoneKey) {
        path.classList.add("active");
      } else {
        path.classList.remove("active");
      }
    });

    if (zoneImg) {
      zoneImg.style.opacity = "0.3";
      setTimeout(() => {
        zoneImg.src = data.image;
        zoneImg.alt = data.title;
        zoneImg.style.opacity = "1";
      }, 150);
    }

    if (zoneTitle) zoneTitle.textContent = data.title;
    if (zoneStatus) zoneStatus.textContent = data.status;
    if (zoneDesc) zoneDesc.textContent = data.desc;
    if (zoneNoise) zoneNoise.textContent = data.noise;
    if (zoneCapacity) zoneCapacity.textContent = data.capacity;
  }

  zonePaths.forEach((path) => {
    path.addEventListener("click", () => {
      const key = path.getAttribute("data-zone");
      selectZone(key);
    });

    path.addEventListener("mouseenter", () => {
      const key = path.getAttribute("data-zone");
      selectZone(key);
    });
  });

  // Default selection
  selectZone("focus");
})();
