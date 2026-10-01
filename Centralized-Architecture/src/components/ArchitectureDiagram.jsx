import React from 'react';
import { User, Cpu, Database, Activity, ShieldAlert, ArrowRight, ArrowLeft } from 'lucide-react';

export function ArchitectureDiagram({
  coordinatorStatus = 'WAITING',
  agentStatuses = {},
  activePacket = null
}) {
  const isAgentActive = (agentId) => agentStatuses[agentId]?.status === 'PROCESSING';

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={20} color="var(--accent-cyan)" />
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>
            Centralized Topology & Active Flow Diagram
          </h2>
        </div>
        <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
          Topology: Hub & Spoke Orchestration
        </span>
      </div>

      {/* SVG Diagram Canvas */}
      <div
        style={{
          background: 'rgba(10, 15, 29, 0.7)',
          borderRadius: '12px',
          padding: '2rem 1.5rem',
          border: '1px solid var(--border-subtle)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2.5rem',
          overflow: 'hidden'
        }}
      >
        {/* Top Level: User and Central Coordinator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3rem', width: '100%', maxWidth: '600px' }}>
          {/* User Node */}
          <div
            style={{
              padding: '12px 18px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#e2e8f0',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          >
            <User size={18} color="#94a3b8" />
            <span>User Client</span>
          </div>

          {/* Bi-directional Flow Indicator */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', color: 'var(--accent-cyan)' }}>
            <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Task / Result</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <ArrowRight size={16} />
              <ArrowLeft size={16} />
            </div>
          </div>

          {/* Central Coordinator Node */}
          <div
            className={coordinatorStatus === 'PROCESSING' ? 'animate-pulse-glow' : ''}
            style={{
              padding: '14px 24px',
              borderRadius: '14px',
              background: coordinatorStatus === 'PROCESSING'
                ? 'linear-gradient(135deg, rgba(0, 240, 255, 0.25), rgba(14, 165, 233, 0.25))'
                : 'rgba(15, 23, 42, 0.8)',
              border: coordinatorStatus === 'PROCESSING' ? '2px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
              boxShadow: coordinatorStatus === 'PROCESSING' ? '0 0 25px rgba(0, 240, 255, 0.4)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.3s ease'
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(0, 240, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Cpu size={20} color="var(--accent-cyan)" />
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>Central Coordinator</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                {coordinatorStatus === 'PROCESSING' ? 'ORCHESTRATING...' : coordinatorStatus === 'COMPLETED' ? 'WORKFLOW DONE' : 'IDLE'}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Visual Beams to Subordinate Agents */}
        <div style={{ width: '100%', maxWidth: '800px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', position: 'relative' }}>
          {/* Agent 1 Node */}
          <div
            className={isAgentActive('agent-data') ? 'animate-pulse-glow' : ''}
            style={{
              padding: '14px',
              borderRadius: '12px',
              background: isAgentActive('agent-data') ? 'rgba(0, 240, 255, 0.15)' : 'rgba(15, 23, 42, 0.7)',
              border: isAgentActive('agent-data') ? '2px solid #00f0ff' : '1px solid var(--border-subtle)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Database size={22} color="#00f0ff" />
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>Agent 1: Data Agent</div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Ingestion & Validation</div>
            <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: '#00f0ff' }}>
              {agentStatuses['agent-data']?.status || 'WAITING'}
            </div>
          </div>

          {/* Agent 2 Node */}
          <div
            className={isAgentActive('agent-analysis') ? 'animate-pulse-glow' : ''}
            style={{
              padding: '14px',
              borderRadius: '12px',
              background: isAgentActive('agent-analysis') ? 'rgba(139, 92, 246, 0.15)' : 'rgba(15, 23, 42, 0.7)',
              border: isAgentActive('agent-analysis') ? '2px solid #8b5cf6' : '1px solid var(--border-subtle)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Activity size={22} color="#8b5cf6" />
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>Agent 2: Analysis Agent</div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Failure Risk Modeling</div>
            <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: '#8b5cf6' }}>
              {agentStatuses['agent-analysis']?.status || 'WAITING'}
            </div>
          </div>

          {/* Agent 3 Node */}
          <div
            className={isAgentActive('agent-response') ? 'animate-pulse-glow' : ''}
            style={{
              padding: '14px',
              borderRadius: '12px',
              background: isAgentActive('agent-response') ? 'rgba(16, 185, 129, 0.15)' : 'rgba(15, 23, 42, 0.7)',
              border: isAgentActive('agent-response') ? '2px solid #10b981' : '1px solid var(--border-subtle)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ShieldAlert size={22} color="#10b981" />
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>Agent 3: Response Agent</div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Mitigation Directives</div>
            <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: '#10b981' }}>
              {agentStatuses['agent-response']?.status || 'WAITING'}
            </div>
          </div>
        </div>

        {/* Active Communication Channel Toast / Banner */}
        {activePacket && (
          <div
            className="animate-slide-up"
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              background: 'rgba(0, 240, 255, 0.15)',
              border: '1px solid var(--accent-cyan)',
              color: '#f8fafc',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 0 15px rgba(0, 240, 255, 0.3)'
            }}
          >
            <span style={{ fontWeight: 700, color: '#00f0ff' }}>TRANSMITTING:</span>
            <span>{activePacket.from} ➔ {activePacket.to}</span>
            <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', background: 'rgba(0,0,0,0.4)', padding: '2px 6px', borderRadius: '4px' }}>
              [{activePacket.type}]
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
