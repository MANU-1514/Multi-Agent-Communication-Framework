# Centralized Multi-Agent Architecture

An independent, frontend-only implementation of a **Hub-and-Spoke Centralized Multi-Agent Communication Architecture** using React and Vite.

---

## 🏛️ Architectural Overview

In this centralized architecture:
- A dedicated **Central Coordinator** receives user tasks and governs all communications.
- Subordinate agents (**Data Agent**, **Analysis Agent**, **Response Agent**) **never communicate directly** with each other.
- All requests, intermediate data payloads, and diagnostic conclusions are passed exclusively through the coordinator.

```
                    ┌── Agent 1 (Data Agent) ─────┐
                    │                             │
User → Coordinator ─┼── Agent 2 (Analysis Agent) ─┼→ Coordinator → User
                    │                             │
                    └── Agent 3 (Response Agent) ─┘
```

---

## 📁 Directory Structure

```
Centralized-Architecture/
├── package.json
├── vite.config.js
├── index.html
├── README.md
└── src/
    ├── agents/
    │   ├── DataAgent.js          # Ingests & validates telemetry
    │   ├── AnalysisAgent.js      # Assesses failure risks & correlations
    │   └── ResponseAgent.js      # Synthesizes directives & emergency alerts
    ├── communication/
    │   └── CentralCoordinator.js # Hub managing dispatching & protocol logs
    ├── components/
    │   ├── Header.jsx
    │   ├── SensorControls.jsx
    │   ├── AgentCard.jsx
    │   ├── ArchitectureDiagram.jsx
    │   ├── MessageAnimation.jsx
    │   └── CommunicationLog.jsx
    ├── App.jsx
    ├── index.css
    └── main.jsx
```

---

## 🚀 How to Run

```bash
# 1. Navigate to the project directory
cd Centralized-Architecture

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

---

## 🔬 Demonstration Features

- **Interactive Telemetry Inputs**: Real-time sliders for Temperature, Pressure, and Humidity.
- **Preset Scenarios**: 
  - Critical Overheat & Pressure Spike (85°C, 7.2 bar, 80%)
  - Moisture Condensation Risk (45°C, 4.8 bar, 88%)
  - Nominal Steady State (24°C, 2.5 bar, 45%)
- **Speed Adjustment**: 0.5x, 1x, 2x simulation speed selector.
- **Live Communication Log**: Timestamped record of every `REQUEST`, `RESPONSE`, and `FINAL_RESPONSE` message passing through the coordinator.
- **JSON Inspector**: Inspect raw telemetry and analysis payloads at every step.
