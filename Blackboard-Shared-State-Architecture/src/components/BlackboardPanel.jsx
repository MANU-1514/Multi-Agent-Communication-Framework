import React from 'react';
import { Database, Layers, CheckCircle2, Clock, Loader2, Sparkles, History, Code2 } from 'lucide-react';

export function BlackboardPanel({ blackboardState }) {
  const {
    task,
    sensorData,
    agent1Output,
    agent2Output,
    agent3Output,
    intermediateResults = [],
    agentStatus = {},
    finalResult,
    revision = 0,
    lastUpdatedBy = 'System'
  } = blackboardState || {};

  const getStatusDot = (st) => {
    switch (st) {
      case 'PROCESSING':
        return <Loader2 size={13} className="animate-spin-slow" color="#10b981" />;
      case 'COMPLETED':
        return <CheckCircle2 size={13} color="#10b981" />;
      case 'WAITING':
      default:
        return <Clock size={13} color="#94a3b8" />;
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Database size={22} color="var(--accent-emerald)" />
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>
            Active Shared Blackboard Memory State
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.3)', fontWeight: 700 }}>
            Revision: #{revision}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
            Last Writer: <strong style={{ color: '#ffffff' }}>{lastUpdatedBy}</strong>
          </span>
        </div>
      </div>

      {/* Blackboard Visual Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
        {/* Slot 1: Current Task & Sensor Inputs */}
        <div style={{ background: 'rgba(7, 15, 20, 0.8)', padding: '14px', borderRadius: '10px', border: task ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', fontFamily: 'var(--font-mono)' }}>
              SLOT: blackboard.task
            </span>
            <span style={{ fontSize: '0.65rem', background: 'rgba(255, 255, 255, 0.08)', padding: '2px 6px', borderRadius: '4px', color: 'var(--text-muted)' }}>
              Source: User
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: task ? '#f8fafc' : 'var(--text-muted)', lineHeight: 1.4, marginBottom: '8px' }}>
            {task || 'No active task written to blackboard memory.'}
          </p>
          {sensorData && (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}>
              <span style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#fda4af', padding: '2px 6px', borderRadius: '4px' }}>
                T: {sensorData.temperature}°C
              </span>
              <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7', padding: '2px 6px', borderRadius: '4px' }}>
                P: {sensorData.pressure} bar
              </span>
              <span style={{ background: 'rgba(0, 240, 255, 0.15)', color: '#38bdf8', padding: '2px 6px', borderRadius: '4px' }}>
                H: {sensorData.humidity}%
              </span>
            </div>
          )}
        </div>

        {/* Slot 2: Agent 1 Output */}
        <div style={{ background: 'rgba(7, 15, 20, 0.8)', padding: '14px', borderRadius: '10px', border: agent1Output ? '1px solid rgba(0, 240, 255, 0.4)' : '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#00f0ff', fontFamily: 'var(--font-mono)' }}>
              SLOT: blackboard.agent1Output
            </span>
            <span style={{ fontSize: '0.65rem', background: 'rgba(0, 240, 255, 0.1)', padding: '2px 6px', borderRadius: '4px', color: '#00f0ff' }}>
              Data Agent
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: agent1Output ? '#f8fafc' : 'var(--text-muted)', lineHeight: 1.4 }}>
            {agent1Output ? agent1Output.summary : 'Empty slot (Awaiting Data Agent processing...)'}
          </p>
        </div>

        {/* Slot 3: Agent 2 Output */}
        <div style={{ background: 'rgba(7, 15, 20, 0.8)', padding: '14px', borderRadius: '10px', border: agent2Output ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8b5cf6', fontFamily: 'var(--font-mono)' }}>
              SLOT: blackboard.agent2Output
            </span>
            <span style={{ fontSize: '0.65rem', background: 'rgba(139, 92, 246, 0.1)', padding: '2px 6px', borderRadius: '4px', color: '#c4b5fd' }}>
              Analysis Agent
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: agent2Output ? '#f8fafc' : 'var(--text-muted)', lineHeight: 1.4 }}>
            {agent2Output ? agent2Output.diagnosticSummary : 'Empty slot (Awaiting Analysis Agent evaluation...)'}
          </p>
        </div>

        {/* Slot 4: Agent 3 / Final Result Output */}
        <div style={{ background: 'rgba(7, 15, 20, 0.8)', padding: '14px', borderRadius: '10px', border: agent3Output ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', fontFamily: 'var(--font-mono)' }}>
              SLOT: blackboard.finalResult
            </span>
            <span style={{ fontSize: '0.65rem', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 6px', borderRadius: '4px', color: '#a7f3d0' }}>
              Response Agent
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: agent3Output ? (agent3Output.alertRequired ? '#fda4af' : '#6ee7b7') : 'var(--text-muted)', lineHeight: 1.4, fontWeight: agent3Output ? 600 : 400 }}>
            {agent3Output ? agent3Output.executiveDecision : 'Empty slot (Awaiting Response Agent decision...)'}
          </p>
        </div>
      </div>

      {/* Blackboard Internal Status Register */}
      <div style={{ background: 'rgba(0, 0, 0, 0.35)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Layers size={16} color="var(--accent-emerald)" />
          <span>Agent Status Register on Blackboard:</span>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
            {getStatusDot(agentStatus.agent1)}
            <span style={{ color: '#00f0ff' }}>Agent 1 (Data):</span>
            <strong style={{ color: agentStatus.agent1 === 'COMPLETED' ? '#10b981' : '#94a3b8' }}>
              {agentStatus.agent1 || 'WAITING'}
            </strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
            {getStatusDot(agentStatus.agent2)}
            <span style={{ color: '#8b5cf6' }}>Agent 2 (Analysis):</span>
            <strong style={{ color: agentStatus.agent2 === 'COMPLETED' ? '#10b981' : '#94a3b8' }}>
              {agentStatus.agent2 || 'WAITING'}
            </strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
            {getStatusDot(agentStatus.agent3)}
            <span style={{ color: '#10b981' }}>Agent 3 (Response):</span>
            <strong style={{ color: agentStatus.agent3 === 'COMPLETED' ? '#10b981' : '#94a3b8' }}>
              {agentStatus.agent3 || 'WAITING'}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}
