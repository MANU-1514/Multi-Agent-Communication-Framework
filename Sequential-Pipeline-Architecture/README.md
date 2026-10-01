# Sequential / Pipeline Multi-Agent Architecture

An independent, frontend-only implementation of a **Direct Sequential Pipeline Multi-Agent Communication Architecture** using React and Vite.

---

## 🏛️ Architectural Overview

In this pipeline architecture:
- There is **NO central coordinator**.
- Communication proceeds strictly in a linear stage-by-stage pipeline.
- **Agent 1 (Data Agent)** processes raw input and directly forwards its output to **Agent 2 (Analysis Agent)**.
- **Agent 2** analyzes failure modes and directly forwards its report to **Agent 3 (Response Agent)**.
- **Agent 3** synthesizes the final operational mitigation directive and returns the result directly to the User.

```
User → Agent 1 (Data Agent) → Agent 2 (Analysis Agent) → Agent 3 (Response Agent) → Final Response (User)
```

---

## 📁 Directory Structure

```
Sequential-Pipeline-Architecture/
├── package.json
├── vite.config.js
├── index.html
├── README.md
└── src/
    ├── agents/
    │   ├── DataAgent.js      # Stage 1: Ingestion & extraction
    │   ├── AnalysisAgent.js  # Stage 2: Correlation & failure modeling
    │   └── ResponseAgent.js  # Stage 3: Operational directive generation
    ├── communication/
    │   └── Pipeline.js       # Linear pipeline handoff orchestration
    ├── components/
    │   ├── Header.jsx
    │   ├── SensorControls.jsx
    │   ├── AgentCard.jsx
    │   ├── PipelineDiagram.jsx
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
cd Sequential-Pipeline-Architecture

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

---

## 🔬 Demonstration Features

- **Direct Sequential Handoffs**: Visualizes point-to-point packet delivery between adjacent stages.
- **Telemetry Adjusters**: Real-time sliders for Temperature, Pressure, and Humidity.
- **Preset Scenarios**:
  - Critical Overheat & Pressure Spike (85°C, 7.2 bar, 80%)
  - Moisture Condensation Risk (45°C, 4.8 bar, 88%)
  - Nominal Steady State (24°C, 2.5 bar, 45%)
- **Speed Adjustment**: 0.5x, 1x, 2x simulation speed selector.
- **Protocol Communication Log**: Detailed record of `PIPELINE_INIT`, `PIPELINE_HANDOFF`, and `FINAL_RESPONSE` packets.
- **Stage Payload Inspector**: Collapsible JSON inspector on each agent stage card.
