import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { SensorControls } from './components/SensorControls';
import { AgentCard } from './components/AgentCard';
import { BlackboardPanel } from './components/BlackboardPanel';
import { ArchitectureDiagram } from './components/ArchitectureDiagram';
import { CommunicationLog } from './components/CommunicationLog';
import { Blackboard } from './communication/Blackboard';
import { DataAgent } from './agents/DataAgent';
import { AnalysisAgent } from './agents/AnalysisAgent';
import { ResponseAgent } from './agents/ResponseAgent';
import { Database, Activity, ShieldAlert, CheckCircle2, AlertOctagon } from 'lucide-react';

export default function App() {
  const [task, setTask] = useState('Analyze industrial turbine sensor readings and determine whether the system requires an alert.');
  const [temperature, setTemperature] = useState(85);
  const [pressure, setPressure] = useState(7.2);
  const [humidity, setHumidity] = useState(80);
  const [speed, setSpeed] = useState(1.0);

  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [activePacket, setActivePacket] = useState(null);

  const blackboardRef = useRef(null);
  const agentsRef = useRef({});
  const isAbortedRef = useRef(false);

  // Initialize Blackboard and reactive state
  const [blackboardState, setBlackboardState] = useState(() => {
    const bb = new Blackboard();
    return bb.getState();
  });

  useEffect(() => {
    const bb = new Blackboard({
      onStateChange: (newState) => {
        setBlackboardState(newState);
      },
      onLogMessage: (log) => {
        setLogs((prev) => [log, ...prev]);
      },
      onPacketTransfer: (packet) => {
        setActivePacket(packet);
      }
    });

    const baseDelay = Math.round(1400 / speed);
    const a1 = new DataAgent(bb, { delay: baseDelay });
    const a2 = new AnalysisAgent(bb, { delay: baseDelay });
    const a3 = new ResponseAgent(bb, { delay: baseDelay });

    blackboardRef.current = bb;
    agentsRef.current = { a1, a2, a3 };
    setBlackboardState(bb.getState());
  }, []);

  // Update speed multipliers on agents
  useEffect(() => {
    if (agentsRef.current.a1) {
      const baseDelay = Math.round(1400 / speed);
      agentsRef.current.a1.delay = baseDelay;
      agentsRef.current.a2.delay = baseDelay;
      agentsRef.current.a3.delay = baseDelay;
    }
  }, [speed]);

  const handleRun = async () => {
    if (isRunning || !blackboardRef.current) return;
    setIsRunning(true);
    isAbortedRef.current = false;

    const bb = blackboardRef.current;
    const { a1, a2, a3 } = agentsRef.current;
    const transitDelay = Math.round(600 / speed);

    // Reset current blackboard state for fresh execution
    bb.reset();

    try {
      // Step 1: User writes Task & Sensor Data onto the Shared Blackboard
      bb.write('task', task, 'User');
      bb.write('sensorData', { temperature, pressure, humidity }, 'User');
      await new Promise((r) => setTimeout(r, transitDelay));
      if (isAbortedRef.current) return;

      // Step 2: Agent 1 opportunistically activates
      if (a1.canExecute(bb.getState())) {
        await a1.execute();
        await new Promise((r) => setTimeout(r, transitDelay));
      }
      if (isAbortedRef.current) return;

      // Step 3: Agent 2 opportunistically activates
      if (a2.canExecute(bb.getState())) {
        await a2.execute();
        await new Promise((r) => setTimeout(r, transitDelay));
      }
      if (isAbortedRef.current) return;

      // Step 4: Agent 3 opportunistically activates
      if (a3.canExecute(bb.getState())) {
        await a3.execute();
        await new Promise((r) => setTimeout(r, transitDelay));
      }

    } catch (err) {
      bb.log('Blackboard', 'System', 'ERROR', `Execution failed: ${err.message}`, null, 'ERROR');
    } finally {
      setIsRunning(false);
      setActivePacket(null);
    }
  };

  const handleReset = () => {
    isAbortedRef.current = true;
    setIsRunning(false);
    setActivePacket(null);
    if (blackboardRef.current) {
      blackboardRef.current.reset();
    }
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  const finalResult = blackboardState.finalResult;

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      <Header />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        {/* Sensor & Task Input Controls */}
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

        {/* Dedicated Live Shared Blackboard State Panel */}
        <BlackboardPanel blackboardState={blackboardState} />

        {/* Blackboard Radial Topology Diagram */}
        <ArchitectureDiagram
          blackboardState={blackboardState}
          activePacket={activePacket}
        />

        {/* Agent Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          <AgentCard
            agentKey="agent1"
            title="Agent 1 – Data Agent"
            role="Blackboard Telemetry Processor"
            icon={Database}
            accentColor="#00f0ff"
            status={blackboardState.agentStatus?.agent1}
            output={blackboardState.agent1Output}
            memorySlotName="agent1Output"
            isHighlighted={activePacket?.from === 'Data Agent' || activePacket?.to === 'Data Agent'}
          />

          <AgentCard
            agentKey="agent2"
            title="Agent 2 – Analysis Agent"
            role="Blackboard Risk & Correlation Engine"
            icon={Activity}
            accentColor="#8b5cf6"
            status={blackboardState.agentStatus?.agent2}
            output={blackboardState.agent2Output}
            memorySlotName="agent2Output"
            isHighlighted={activePacket?.from === 'Analysis Agent' || activePacket?.to === 'Analysis Agent'}
          />

          <AgentCard
            agentKey="agent3"
            title="Agent 3 – Response Agent"
            role="Blackboard Directive Synthesizer"
            icon={ShieldAlert}
            accentColor="#10b981"
            status={blackboardState.agentStatus?.agent3}
            output={blackboardState.agent3Output}
            memorySlotName="agent3Output / finalResult"
            isHighlighted={activePacket?.from === 'Response Agent' || activePacket?.to === 'Response Agent'}
          />
        </div>

        {/* Final Blackboard Result Banner */}
        {finalResult && (
          <div
            className="glass-panel animate-slide-up"
            style={{
              padding: '1.5rem',
              border: finalResult.alertRequired ? '2px solid #f43f5e' : '2px solid #10b981',
              boxShadow: finalResult.alertRequired ? '0 0 30px rgba(244, 63, 94, 0.3)' : '0 0 30px rgba(16, 185, 129, 0.3)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
              {finalResult.alertRequired ? (
                <AlertOctagon size={28} color="#f43f5e" />
              ) : (
                <CheckCircle2 size={28} color="#10b981" />
              )}
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: finalResult.alertRequired ? '#fda4af' : '#6ee7b7' }}>
                  {finalResult.executiveDecision}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Synthesized via Blackboard Shared State Evolution (Revision #{blackboardState.revision})
                </p>
              </div>
            </div>

            {finalResult.actionDirectives && (
              <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Committed Action Directives on Blackboard:
                </h4>
                <ul style={{ listStyleType: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {finalResult.actionDirectives.map((dir, i) => (
                    <li key={i} style={{ fontSize: '0.825rem', color: '#e2e8f0' }}>
                      {dir}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Live Blackboard Read/Write Communication Log */}
        <CommunicationLog logs={logs} onClear={handleClearLogs} />
      </div>
    </div>
  );
}
