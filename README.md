# Multi-Agent Communication Framework

A comprehensive, frontend-only interactive demonstration framework exploring how autonomous and specialized AI agents coordinate, pass messages, and resolve complex workflows using three foundational multi-agent communication architectures:

1. **Centralized Architecture** (Hub & Spoke / Central Orchestrator)
2. **Sequential / Pipeline Architecture** (Direct Linear Handoffs)
3. **Blackboard / Shared-State Architecture** (Shared Memory / Opportunistic Pub-Sub)

---

## 🎯 1. Project Objective

The primary objective of this framework is to provide an interactive, visual, and modular reference implementation demonstrating how multiple specialized agents send **requests, process data, manage internal state, and return structured responses**.

All three architectures are implemented as **100% frontend applications (React + Vite)** with realistic asynchronous execution delays, live interactive packet animations, telemetry controls, and chronological communication logs—requiring **zero backend servers, databases, or API keys**.

---

## 🤖 2. What is a Multi-Agent System (MAS)?

A **Multi-Agent System** is a computerized system composed of multiple interacting, intelligent, and autonomous agents. Rather than relying on a single monolithic model to perform an entire end-to-end task, a multi-agent approach decomposes complex objectives into specialized sub-tasks assigned to distinct agents with clear domain boundaries, such as:

- **Specialization**: Agents excel at specific roles (e.g., data ingestion, statistical analysis, decision formulation).
- **Modularity**: Agents can be updated, scaled, or replaced without rewriting the entire pipeline.
- **Explainability**: Intermediate thoughts, message payloads, and decision gates can be inspected at every step.

---

## 📡 3. What is Agent Communication?

**Agent Communication** is the protocol and mechanism by which agents exchange facts, requests, constraints, queries, and execution states. Communication requires:
- **Sender & Receiver Identifiers**: Clear agent addresses.
- **Message Type**: Purpose of packet (e.g., `REQUEST`, `RESPONSE`, `HANDOFF`, `STATE_UPDATE`, `EVENT_TRIGGER`).
- **Payload Schema**: Structured data passed between agents (JSON).
- **Protocol State**: Tracking delivery, processing acknowledgment, and status (`WAITING`, `PROCESSING`, `COMPLETED`, `ERROR`).

---

## 🏛️ 4. The Three Architectures

### Architecture 1: Centralized Architecture
- **Concept**: A dedicated **Central Coordinator** manages the entire lifecycle and message dispatching. Agents do not communicate directly with one another.
- **Flow**:
  ```text
                      ┌── Agent 1 (Data) ────┐
                      │                      │
  User → Coordinator ─┼── Agent 2 (Analysis) ┼→ Coordinator → User
                      │                      │
                      └── Agent 3 (Response) ┘
  ```
- **Strengths**: Strict central control, consolidated logging, dynamic branching, robust error recovery.

---

### Architecture 2: Sequential / Pipeline Architecture
- **Concept**: Agents are linked in a direct linear chain. Each agent directly passes its output as input to the next downstream agent.
- **Flow**:
  ```text
  User → Agent 1 (Data) → Agent 2 (Analysis) → Agent 3 (Response) → Final Response (User)
  ```
- **Strengths**: Minimal overhead, high throughput for deterministic workflows, zero coordinator bottleneck.

---

### Architecture 3: Blackboard / Shared-State Architecture
- **Concept**: Agents communicate indirectly by reading from and writing to a central, passive **Shared Blackboard**.
- **Flow**:
  ```text
                   ┌─── Agent 1 (Data) ───┐
                   │       (Write/Read)   │
                   ▼                      ▼
  User ──────► [  S H A R E D   B L A C K B O A R D  ] ──────► Final Result
                   ▲                      ▲
                   │       (Write/Read)   │
                   └─── Agent 2 / Agent 3 ┘
  ```
- **Strengths**: Loose coupling, opportunistic problem-solving, real-time shared state observability.

---

## 📂 5. Project Folder Structure

Each architecture is implemented as an **independent, self-contained frontend application**:

```text
Multi-Agent-Communication-Framework/
│
├── README.md                                  # Root documentation (this file)
├── comparison.md                              # Detailed architecture comparison matrix
│
├── Centralized-Architecture/                  # Independent React App 1
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── README.md
│   └── src/
│       ├── agents/ (DataAgent.js, AnalysisAgent.js, ResponseAgent.js)
│       ├── communication/ (CentralCoordinator.js)
│       ├── components/ (AgentCard, ArchitectureDiagram, CommunicationLog, etc.)
│       ├── App.jsx, index.css, main.jsx
│
├── Sequential-Pipeline-Architecture/          # Independent React App 2
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── README.md
│   └── src/
│       ├── agents/ (DataAgent.js, AnalysisAgent.js, ResponseAgent.js)
│       ├── communication/ (Pipeline.js)
│       ├── components/ (AgentCard, PipelineDiagram, CommunicationLog, etc.)
│       ├── App.jsx, index.css, main.jsx
│
└── Blackboard-Shared-State-Architecture/      # Independent React App 3
    ├── package.json
    ├── vite.config.js
    ├── index.html
    ├── README.md
    └── src/
        ├── agents/ (DataAgent.js, AnalysisAgent.js, ResponseAgent.js)
        ├── communication/ (Blackboard.js)
        ├── components/ (AgentCard, BlackboardPanel, ArchitectureDiagram, etc.)
        ├── App.jsx, index.css, main.jsx
```

---

## 🚀 6. How to Run Each Architecture

Each architecture folder has its own `package.json` and dev server. You can run any of them independently:

### Option A: Running Centralized Architecture
```bash
cd Centralized-Architecture
npm install
npm run dev
```

### Option B: Running Sequential / Pipeline Architecture
```bash
cd Sequential-Pipeline-Architecture
npm install
npm run dev
```

### Option C: Running Blackboard / Shared-State Architecture
```bash
cd Blackboard-Shared-State-Architecture
npm install
npm run dev
```

---

## 🔬 7. Demonstration Task & Sample Data

### Task Objective:
**"Analyze industrial turbine sensor readings and determine whether the system requires an emergency or maintenance alert."**

### Default Sample Telemetry:
- **Temperature**: `85°C` (Normal Threshold: $\le 75^\circ\text{C}$)
- **Pressure**: `7.0 bar` (Normal Threshold: $\le 6.0\text{ bar}$)
- **Humidity**: `80%` (Normal Threshold: $\le 70\%$)

### Presets Available in UI:
1. 🚨 **Critical Overheating & Pressure Spike** (85°C, 7.2 bar, 82%)
2. ⚠️ **High Humidity & Condensation Risk** (42°C, 3.1 bar, 88%)
3. ✅ **Nominal Steady State** (24°C, 2.4 bar, 45%)
4. ⚡ **Custom Values** (Interactive real-time sliders)

---

## 📋 8. Expected Agent Processing Output

1. **Agent 1 – Data Agent**:
   - Parses telemetry units, verifies boundary limits, and flags high temperature (85°C > 75°C), high pressure (7.0 bar > 6.0 bar), and high humidity (80% > 70%).
   - *Output*: `"Temperature and Pressure exceeded normal operational thresholds."`

2. **Agent 2 – Analysis Agent**:
   - Cross-analyzes multi-variable telemetry, calculating thermal expansion risk and mechanical stress factors.
   - *Output*: `"Critical correlation detected: High thermal stress combined with elevated chamber pressure indicates potential seal degradation and thermal runaway hazard."`

3. **Agent 3 – Response Agent**:
   - Generates actionable mitigation directives, safety protocols, and incident severity rating.
   - *Output*: `"🚨 CRITICAL ALERT: Immediate turbine throttle down recommended. Initiate auxiliary cooling cycle and notify engineering team."`

---

## 📖 9. Architectural Comparison Summary

For a full breakdown of trade-offs, scalability, and error-handling characteristics, see [comparison.md](./comparison.md).
