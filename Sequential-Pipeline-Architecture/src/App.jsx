import React, { useState, useRef } from 'react';
import { Header } from './components/Header';
import { SensorControls } from './components/SensorControls';
import { AgentCard } from './components/AgentCard';
import { PipelineDiagram } from './components/PipelineDiagram';
import { MessageAnimation } from './components/MessageAnimation';
import { CommunicationLog } from './components/CommunicationLog';
import { Pipeline } from './communication/Pipeline';
import { Database, Activity, ShieldAlert, CheckCircle2, AlertOctagon } from 'lucide-react';

export default function App() {
  const [task, setTask] = useState('Analyze industrial turbine sensor readings and determine whether the system requires an alert.');
  const [temperature, setTemperature] = useState(85);
  const [pressure, setPressure] = useState(7.2);
  const [humidity, setHumidity] = useState(80);
  const [speed, setSpeed] = useState(1.0);

  const [isRunning, setIsRunning] = useState(false);
  const [agentStatuses, setAgentStatuses] = useState({
    'agent-data': { status: 'WAITING', output: null },
    'agent-analysis': { status: 'WAITING', output: null },
    'agent-response': { status: 'WAITING', output: null }
  });

  const [activeMessage, setActiveMessage] = useState(null);
  const [activePacket, setActivePacket] = useState(null);
  const [logs, setLogs] = useState([]);
  const [finalResult, setFinalResult] = useState(null);

  const pipelineRef = useRef(null);

  const handleRun = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setFinalResult(null);

    setAgentStatuses({
      'agent-data': { status: 'WAITING', output: null },
      'agent-analysis': { status: 'WAITING', output: null },
      'agent-response': { status: 'WAITING', output: null }
    });

    const pipeline = new Pipeline(
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

    pipelineRef.current = pipeline;

    await pipeline.execute({
      task,
      temperature,
      pressure,
      humidity
    });
  };

  const handleReset = () => {
    if (pipelineRef.current) {
      pipelineRef.current.abort();
    }
    setIsRunning(false);
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        {/* Sensor and Goal Controls */}
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

        {/* Message Transit Visualizer */}
        <MessageAnimation activeMessage={activeMessage} />

        {/* Horizontal Pipeline Flow Diagram */}
        <PipelineDiagram
          agentStatuses={agentStatuses}
          activePacket={activePacket}
        />

        {/* Sequential Agent Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          <AgentCard
            stage={1}
            agentId="agent-data"
            title="Agent 1 – Data Agent"
            role="Pipeline Ingestion & Extraction"
            icon={Database}
            accentColor="#00f0ff"
            status={agentStatuses['agent-data']?.status}
            output={agentStatuses['agent-data']?.output}
            isHighlighted={activePacket?.to === 'agent-data' || activePacket?.from === 'agent-data'}
            nextStageName="Agent 2 (Analysis)"
          />

          <AgentCard
            stage={2}
            agentId="agent-analysis"
            title="Agent 2 – Analysis Agent"
            role="Pipeline Failure Correlation"
            icon={Activity}
            accentColor="#8b5cf6"
            status={agentStatuses['agent-analysis']?.status}
            output={agentStatuses['agent-analysis']?.output}
            isHighlighted={activePacket?.to === 'agent-analysis' || activePacket?.from === 'agent-analysis'}
            nextStageName="Agent 3 (Response)"
          />

          <AgentCard
            stage={3}
            agentId="agent-response"
            title="Agent 3 – Response Agent"
            role="Direct Final Synthesis & Alert"
            icon={ShieldAlert}
            accentColor="#10b981"
            status={agentStatuses['agent-response']?.status}
            output={agentStatuses['agent-response']?.output}
            isHighlighted={activePacket?.to === 'agent-response' || activePacket?.from === 'agent-response'}
            nextStageName="User Final Output"
          />
        </div>

        {/* Final Pipeline Result Directive */}
        {finalResult && (
          <div
            className="glass-panel animate-slide-up"
            style={{
              padding: '1.5rem',
              border: finalResult.stage3?.alertRequired ? '2px solid #f43f5e' : '2px solid #10b981',
              boxShadow: finalResult.stage3?.alertRequired ? '0 0 30px rgba(244, 63, 94, 0.3)' : '0 0 30px rgba(16, 185, 129, 0.3)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
              {finalResult.stage3?.alertRequired ? (
                <AlertOctagon size={28} color="#f43f5e" />
              ) : (
                <CheckCircle2 size={28} color="#10b981" />
              )}
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: finalResult.stage3?.alertRequired ? '#fda4af' : '#6ee7b7' }}>
                  {finalResult.stage3?.executiveDecision}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Synthesized via Direct Sequential Pipeline Handoff (Stage 1 ➔ Stage 2 ➔ Stage 3)
                </p>
              </div>
            </div>

            {finalResult.stage3?.actionDirectives && (
              <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Pipeline Action Directives:
                </h4>
                <ul style={{ listStyleType: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {finalResult.stage3.actionDirectives.map((dir, i) => (
                    <li key={i} style={{ fontSize: '0.825rem', color: '#e2e8f0' }}>
                      {dir}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Live Pipeline Protocol Communication Log */}
        <CommunicationLog logs={logs} onClear={handleClearLogs} />
      </div>
    </div>
  );
}
