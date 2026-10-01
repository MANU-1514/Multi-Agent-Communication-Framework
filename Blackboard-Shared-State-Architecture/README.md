# Blackboard / Shared-State Multi-Agent Architecture

An independent, frontend-only implementation of a **Blackboard / Shared-State Multi-Agent Communication Architecture** using React and Vite.

---

## 🏛️ Architectural Overview

In this blackboard architecture:
- Agents **do NOT communicate directly** with each other, nor is there a centralized coordinator dictating agent-to-agent message steps.
- All collaboration is mediated through a central, passive **Shared Blackboard Memory**.
- When new knowledge is posted to the Blackboard (e.g. by the User or upstream agents), specialist agents observe the state mutation, evaluate whether their execution preconditions are met, and commit their findings back to the shared memory.

```
                 Agent 1 (Data Agent)
                    ↓ (Write/Read)
                    ↓
User ──────► [ S H A R E D   B L A C K B O A R D ] ──────► Final Result
                    ↑
                    ↑ (Write/Read)
           Agent 2 & Agent 3 (Analysis & Response)
```

---

## 📁 Directory Structure

```
Blackboard-Shared-State-Architecture/
├── package.json
├── vite.config.js
├── index.html
├── README.md
└── src/
    ├── agents/
    │   ├── DataAgent.js          # Reads raw telemetry from Blackboard, writes structured facts
    │   ├── AnalysisAgent.js      # Reads DataAgent facts from Blackboard, writes risk diagnostics
    │   └── ResponseAgent.js      # Reads diagnostics from Blackboard, writes final directives & alert
    ├── communication/
    │   └── Blackboard.js         # Reactive shared memory store & pub/sub event logs
    ├── components/
    │   ├── Header.jsx
    │   ├── SensorControls.jsx
    │   ├── AgentCard.jsx
    │   ├── BlackboardPanel.jsx   # Dedicated live inspection of shared blackboard memory
    │   ├── ArchitectureDiagram.jsx
    │   └── CommunicationLog.jsx
    ├── App.jsx
    ├── index.css
    └── main.jsx
```

---

## 🚀 How to Run

```bash
# 1. Navigate to the project directory
cd Blackboard-Shared-State-Architecture

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

---

## 🔬 Demonstration Features

- **Dedicated Shared Blackboard Inspection Panel**: Real-time display of memory slots (`blackboard.task`, `blackboard.agent1Output`, `blackboard.agent2Output`, `blackboard.finalResult`), revision counter, and status register.
- **Radial Architecture Topology Diagram**: Visualizes decoupled read/write access streams between agents and the central blackboard.
- **Interactive Telemetry Sliders**: Adjust Temperature, Pressure, and Humidity in real time.
- **Preset Scenarios**:
  - Critical Overheat & Pressure Spike (85°C, 7.2 bar, 80%)
  - Moisture Condensation Risk (45°C, 4.8 bar, 88%)
  - Nominal Steady State (24°C, 2.5 bar, 45%)
- **Blackboard Access Log**: Chronological audit trail of `READ_STATE`, `WRITE_STATE`, and `FINAL_RESULT` operations.
