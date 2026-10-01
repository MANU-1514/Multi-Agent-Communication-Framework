import React, { useState, useRef } from 'react';
import { Header } from './components/Header';
import { SensorControls } from './components/SensorControls';
import { AgentCard } from './components/AgentCard';
import { ArchitectureDiagram } from './components/ArchitectureDiagram';
import { MessageAnimation } from './components/MessageAnimation';
import { CommunicationLog } from './components/CommunicationLog';
import { CentralCoordinator } from './communication/CentralCoordinator';
import { Database, Activity, ShieldAlert, CheckCircle2, AlertTriangle, AlertOctagon, Terminal } from 'lucide-react';

export default function App() {
  // Input parameters
  const [task, setTask] = useState('Analyze industrial turbine sensor readings and determine whether the system requires an alert.');
  const [temperature, setTemperature] = useState(85);
  const [pressure, setPressure] = useState(7.2);
  const [humidity, setHumidity] = useState(80);
  const [speed, setSpeed] = useState(1.0);

  // Execution states
  const [isRunning, setIsRunning] = useState(false);
  const [coordinatorStatus, setCoordinatorStatus] = useState('WAITING');
  const [agentStatuses, setAgentStatuses] = useState({
    'agent-data': { status: 'WAITING', output: null },
    'agent-analysis': { status: 'WAITING', output: null },
    'agent-response': { status: 'WAITING', output: null }
  });

  const [activeMessage, setActiveMessage] = useState(null);
  const [activePacket, setActivePacket] = useState(null);
  const [logs, setLogs] = useState([]);
  const [finalResult, setFinalResult] = useState(null);

  const coordinatorRef = useRef(null);

  const handleRun = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setFinalResult(null);

    // Reset agent states to WAITING
    setAgentStatuses({
      'agent-data': { status: 'WAITING', output: null },
      'agent-analysis': { status: 'WAITING', output: null },
      'agent-response': { status: 'WAITING', output: null }
    });

    const coordinator = new CentralCoordinator(
      {
        onLogMessage: (log) => {
          setLogs((prev) => [log, ...prev]);
          setActiveMessage(log);
        },
        onAgentStateChange: (agentId, status, output) => {
          setAgentStatuses((prev) => ({
            ...prev,
            [agentId]: { status, output }
          }));
        },
        onCoordinatorStateChange: (status) => {
          setCoordinatorStatus(status);
        },
        onPacketTransfer: (packet) => {
          setActivePacket(packet);
        },
        onComplete: (summary) => {
          setFinalResult(summary);
          setIsRunning(false);
          setActivePacket(null);
        }
      },
      { speedMultiplier: speed }
    );

    coordinatorRef.current = coordinator;

    await coordinator.execute({
      task,
      temperature,
      pressure,
      humidity
    });
  };

  const handleReset = () => {
    if (coordinatorRef.current) {
      coordinatorRef.current.abort();
    }
    setIsRunning(false);
    setCoordinatorStatus('WAITING');
    setAgentStatuses({
      'agent-data': { status: 'WAITING', output: null },
      'agent-analysis': { status: 'WAITING', output: null },
      'agent-response': { status: 'WAITING', output: null }
    });
    setActiveMessage(null);
    setActivePacket(null);
    setFinalResult(null);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      <Header />

      {/* Main Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        {/* Top Controls */}
        <SensorControls
          task={task}
          setTask={setTask}
          temperature={temperature}
          setTemperature={setTemperature}
          pressure={pressure}
          setPressure={setPressure}
          humidity={humidity}
          setHumidity={setHumidity}
          speed={speed}
          setSpeed={setSpeed}
          isRunning={isRunning}
          onRun={handleRun}
          onReset={handleReset}
        />

        {/* Live Message Transit Banner */}
        <MessageAnimation activeMessage={activeMessage} />

        {/* Central Architecture Topology Diagram */}
        <ArchitectureDiagram
          coordinatorStatus={coordinatorStatus}
          agentStatuses={agentStatuses}
          activePacket={activePacket}
        />

        {/* Agent Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          <AgentCard
            agentId="agent-data"
            title="Agent 1 – Data Agent"
            role="Telemetry Parsing & Boundary Validation"
            icon={Database}
            accentColor="#00f0ff"
            status={agentStatuses['agent-data']?.status}
            output={agentStatuses['agent-data']?.output}
            isHighlighted={activePacket?.to === 'agent-data' || activePacket?.from === 'agent-data'}
          />

          <AgentCard
            agentId="agent-analysis"
            title="Agent 2 – Analysis Agent"
            role="Failure Mode & Correlation Modeling"
            icon={Activity}
            accentColor="#8b5cf6"
            status={agentStatuses['agent-analysis']?.status}
            output={agentStatuses['agent-analysis']?.output}
            isHighlighted={activePacket?.to === 'agent-analysis' || activePacket?.from === 'agent-analysis'}
          />

          <AgentCard
            agentId="agent-response"
            title="Agent 3 – Response Agent"
            role="Mitigation Directives & Alert Dispatch"
            icon={ShieldAlert}
            accentColor="#10b981"
            status={agentStatuses['agent-response']?.status}
            output={agentStatuses['agent-response']?.output}
            isHighlighted={activePacket?.to === 'agent-response' || activePacket?.from === 'agent-response'}
          />
        </div>

        {/* Final Result Directive Banner */}
        {finalResult && (
          <div
            className="glass-panel animate-slide-up"
            style={{
              padding: '1.5rem',
              border: finalResult.responseResult?.alertRequired ? '2px solid #f43f5e' : '2px solid #10b981',
              boxShadow: finalResult.responseResult?.alertRequired ? '0 0 30px rgba(244, 63, 94, 0.3)' : '0 0 30px rgba(16, 185, 129, 0.3)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
              {finalResult.responseResult?.alertRequired ? (
                <AlertOctagon size={28} color="#f43f5e" />
              ) : (
                <CheckCircle2 size={28} color="#10b981" />
              )}
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: finalResult.responseResult?.alertRequired ? '#fda4af' : '#6ee7b7' }}>
                  {finalResult.responseResult?.executiveDecision}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Synthesized via Central Coordinator from 3 specialized agent responses
                </p>
              </div>
            </div>

            {/* Directives list */}
            {finalResult.responseResult?.actionDirectives && (
              <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Prescribed Mitigation Directives:
                </h4>
                <ul style={{ listStyleType: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {finalResult.responseResult.actionDirectives.map((dir, i) => (
                    <li key={i} style={{ fontSize: '0.825rem', color: '#e2e8f0' }}>
                      {dir}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Live Protocol Communication Log */}
        <CommunicationLog logs={logs} onClear={handleClearLogs} />
      </div>
    </div>
  );
}
