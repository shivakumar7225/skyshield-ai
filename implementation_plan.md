# Implementation Plan: SkyShield AI Frontend Prototype

Build a polished, colorful, modern, responsive frontend prototype for **SkyShield AI — AI-Driven Hyper-Local Early Warning System for Severe Weather Nowcasting** (Smart India Hackathon project).

## User Review Required

> [!IMPORTANT]
> - **Frontend-Only Architecture**: All data and intelligence are simulated via clean mock data services (`weatherService`, `alertService`, `shelterService`, `sosService`, `officerService`). No live external backend/APIs will be queried.
> - **Demo State Controller**: A persistent floating/header Demo Control Bar will allow judges and developers to instantly switch between **NORMAL (🟢 Low Risk)**, **WARNING (🟠 Watch)**, and **SEVERE (🔴 High Risk Cloudburst)** states. All citizen and officer views react instantaneously.
> - **Technology Stack**: React 18 + Vite + Lucide Icons + Custom CSS design system (Tailored dark command center for officers, mobile-first responsive layout for citizens, high-fidelity SVG/Canvas geospatial weather & DEM map with radar sweeps and hazard zone overlays).

## Proposed Architecture & Directory Structure

```
VasrshDristhi/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── context/
    │   └── DemoContext.jsx           # Global state: demo mode (normal/watch/severe), current citizen, officer session, active SOS list, approved alerts
    ├── data/
    │   ├── mockWeatherData.js        # Normal, Warning, Severe risk datasets, radar layers, timeline forecast
    │   ├── mockAlerts.js             # Active & historical alerts (Cloudburst, Thunderstorm, Heavy Rain)
    │   ├── mockShelters.js           # Shelters with capacity, distance, coordinates, route waypoints
    │   ├── mockOfficerData.js        # Meteorological indicators (IWV, CAPE, CIN, CTT, QPE), terrain/DEM data, responders
    │   └── mockCitizenData.js        # Default citizen profile, saved locations, SOS categories
    ├── services/
    │   ├── weatherService.js         # getCurrentRisk(), getRiskMap(), getForecast(), getEventDetails()
    │   ├── alertService.js           # getAlerts(), createAlert(), approveAlert()
    │   ├── shelterService.js         # getNearbyShelters(), getRouteToShelter()
    │   ├── sosService.js             # createSOS(), getSOSRequests(), assignSOS()
    │   ├── officerService.js         # getActiveEvents(), getImpactAssessment(), getResponseStatus()
    │   └── userService.js            # citizenLogin(), officerLogin(), getProfile(), updateProfile()
    ├── components/
    │   ├── common/
    │   │   ├── DemoStateBar.jsx      # Sticky SIH Judge demo switcher [NORMAL] [WARNING] [SEVERE]
    │   │   ├── SimulationBadge.jsx   # "DEMO ALERT / SIMULATION" disclaimer badge
    │   │   ├── AnimatedCounter.jsx   # Smooth 0 -> 87% number counter
    │   │   ├── LoadingSkeleton.jsx   # Loading/empty states
    │   │   └── Modal.jsx             # Reusable accessible dialog
    │   ├── map/
    │   │   ├── GeoRiskMap.jsx        # Professional vector/canvas geospatial map with terrain, roads, hazard rings, radar sweep, zoom, hazard filters
    │   │   └── ShelterRouteMiniMap.jsx # Interactive route visualizer to nearest shelter
    │   └── officer/
    │       ├── OfficerHeader.jsx
    │       └── OfficerSidebar.jsx
    └── pages/
        ├── LandingPage.jsx           # Entry page with animated hero, value proposition, citizen/officer portal entries
        ├── citizen/
        │   ├── CitizenLogin.jsx      # Screen 1: Full Name + Mobile Number (No OTP)
        │   ├── CitizenLocation.jsx   # Screen 2: Location Setup (Kukatpally, Gachibowli, Secunderabad)
        │   ├── CitizenHome.jsx       # Screen 3: Home Dashboard with risk cards, 6h timeline, SOS button, 4-tab bottom nav
        │   ├── CitizenRiskMap.jsx    # Screen 4: Hyper-Local Risk Map with hazard filters & user pin
        │   ├── CitizenWarning.jsx    # Screen 5: Severe Weather Warning + AI Explanation modal
        │   ├── CitizenShelter.jsx    # Screen 6: Nearest Safe Shelters with simulated route view
        │   ├── CitizenAlerts.jsx     # Screen 7: Active & past alert list
        │   ├── CitizenSOS.jsx        # Screen 8: Emergency SOS trigger + category picker + confirmation #1048
        │   └── CitizenProfile.jsx    # Screen 9: Citizen Profile (opened from top-right icon)
        └── officer/
            ├── OfficerLogin.jsx      # Screen 1: Officer ID & Password with one-click Demo Login
            ├── OfficerCommandCenter.jsx # Screen 2: Map, side threats, animated metrics, quick actions
            ├── OfficerActiveEvent.jsx   # Screen 3: Cloudburst event drilldown & impact summary
            ├── OfficerAnalysis.jsx      # Screen 4: AI Confidence (87%) + Multi-source (91%) + Meteorological table + Spatial DEM terrain map
            ├── OfficerImpactAlert.jsx   # Screen 5: Impact assessment + AI response recommendations + Public alert approval
            └── OfficerLiveSOS.jsx       # Screen 6: Live response monitoring + risk trend + real-time SOS assignment queue
```

## Detailed Flow & Features

### 1. Global Navigation & Demo Control
- Top floating or pinned Demo Controller allows switching weather states in 1-click:
  - **Normal**: Low risk (18% Thunderstorm, 7% Cloudburst, 4% Flood), green badges.
  - **Warning**: Watch state (72% Thunderstorm, 78% Cloudburst, 45% Flood), orange badges.
  - **Severe**: Cloudburst imminent (82% Thunderstorm, 87% Cloudburst, 76% Flood, 2h 18m lead time), red pulsing badges.
- Judges can jump directly between Citizen view, Officer view, and Landing page at any time.

### 2. Citizen Experience (Mobile-First Polish)
- **Login**: Validates Name & Indian 10-digit mobile number, explicitly shows "No OTP required for prototype".
- **Location**: Quick selection cards for Hyderabad localities (Kukatpally, Gachibowli, etc.).
- **Home**:
  - No user name in top right (avatar icon only).
  - Prominent "CURRENT WEATHER RISK" with status badge, 3 breakdown cards, and "RISK IN NEXT 6 HOURS" timeline.
  - Glowing 🚨 EMERGENCY SOS button.
  - Fixed 4-item bottom navigation: `🏠 Home | 🗺️ Map | 🔔 Alerts | 🆘 SOS`.
- **Severe Warning & Shelter**: If severe state is active or triggered from alerts, shows high-impact red/orange screen with "WHAT YOU SHOULD DO", "WHY THIS WARNING?" (explainable AI drawer with IWV, cloud development, CAPE), and "NEAREST SHELTER" with route simulation.
- **SOS**: One-tap emergency request with category selection, generating verified Request ID `#1048` linked to officer dispatch.

### 3. Officer Experience (Command-Center Authority)
- **Dark command-center aesthetic**: Deep midnight blues (`#0B1120`, `#0F172A`), electric blue (`#38BDF8`), alert ambers/reds, glassmorphic cards.
- **Screen 2 Command Center**: Interactive live risk map, threat feeds, animated counter statistics (Active Threats: 3, High Risk Zones: 5, Pop: 38,420, Alerts: 12).
- **Screen 3 Active Event**: Drilldown on 87% Cloudburst with affected infrastructure breakdown.
- **Screen 4 Combined AI + Spatial Analysis**: Single integrated view with AI confidence gauges, 7 meteorological indicators (IWV, CAPE, CIN, Wind Convergence, Shear, CTT, QPE), and 3D-styled DEM terrain overlay (elevation 510-580m, slope, runoff).
- **Screen 5 Combined Impact + Response + Alert**: Impact numbers, 5 AI recommended actions, and live Public Alert Preview with `[EDIT]`, `[✓ APPROVE & SEND]`, and `[DISMISS]`.
- **Screen 6 Live Monitoring + SOS Dispatch**: Live 4-point risk escalation trend (42% → 55% → 68% → 87%), real-time SOS queue with `#1048` and `#1047`, and responder unit status (Rescue 01 DEPLOYED, Medical 02 AVAILABLE, Police 03 MONITORING).

## Verification Plan

### Automated Verification
- Run `npm.cmd run build` to verify clean JSX/ESBuild compilation without syntax or import errors.
- Validate zero runtime console errors in Vite dev server.

### Browser & UI Verification
- Test all Citizen journeys: Landing → Citizen Login → Location → Home → Map → Warning → AI Explanation → Nearest Shelter → Route → Alerts → SOS → Confirmation → Profile → Logout.
- Test all Officer journeys: Landing → Officer Login → Command Center → Active Event → AI Analysis → Impact/Response/Alert → Approve & Send → Live Monitoring + SOS → Assign rescue teams.
- Test responsive viewports: Citizen in mobile resolution (390px / 430px) and desktop resolution; Officer in widescreen command center.
- Verify Demo State Switcher toggles live between Normal, Warning, and Severe.
