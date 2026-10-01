import React from 'react';
import { Database, User, Activity, ShieldAlert, ArrowDown, ArrowUp, ArrowRight, ArrowLeft } from 'lucide-react';

export function ArchitectureDiagram({ blackboardState, activePacket }) {
  const { agentStatus = {}, revision = 0 } = blackboardState || {};

  const isAgentActive = (key) => agentStatus[key] === 'PROCESSING';

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Database size={20} color="var(--accent-emerald)" />
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>
            Shared-State Blackboard Topology Diagram
          </h2>
        </div>
        <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
          Topology: Decoupled Shared Memory Read / Write
        </span>
      </div>

      {/* Central Blackboard Hub Layout */}
      <div
        style={{
          background: 'rgba(7, 15, 20, 0.75)',
          borderRadius: '12px',
          padding: '2.5rem 1.5rem',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2rem',
          position: 'relative'
        }}
      >
        {/* Top Agent: Data Agent */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div
            className={isAgentActive('agent1') ? 'animate-pulse-glow' : ''}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              background: isAgentActive('agent1') ? 'rgba(0, 240, 255, 0.2)' : 'rgba(12, 26, 33, 0.8)',
              border: isAgentActive('agent1') ? '2px solid #00f0ff' : '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <Database size={20} color="#00f0ff" />
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>Agent 1 – Data Agent</div>
              <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: '#00f0ff' }}>
                Status: {agentStatus.agent1 || 'WAITING'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#00f0ff' }}>
            <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)' }}>Read Telemetry / Write Output</span>
            <div style={{ display: 'flex', gap: '2px' }}>
              <ArrowDown size={14} />
              <ArrowUp size={14} />
            </div>
          </div>
        </div>

        {/* Middle Row: User, Central Blackboard Hub, and Agent 2 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', width: '100%', flexWrap: 'wrap' }}>
          {/* User Node */}
          <div
            style={{
              padding: '12px 18px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.8rem',
              fontWeight: 600
            }}
          >
            <User size={18} color="#94a3b8" />
            <div>
              <div style={{ color: '#e2e8f0' }}>User Client</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Writes initial task</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-emerald)' }}>
            <ArrowRight size={18} />
          </div>

          {/* Central Shared Blackboard Hub */}
          <div
            style={{
              padding: '20px 32px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(5, 150, 105, 0.25))',
              border: '2px solid var(--accent-emerald)',
              boxShadow: '0 0 35px rgba(16, 185, 129, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              minWidth: '220px',
              textAlign: 'center'
            }}
          >
            <Database size={32} color="#10b981" />
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.01em' }}>
                SHARED BLACKBOARD
              </div>
              <div style={{ fontSize: '0.75rem', color: '#a7f3d0', fontFamily: 'var(--font-mono)' }}>
                Passive Central Memory (Rev #{revision})
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#8b5cf6' }}>
            <ArrowLeft size={16} />
            <ArrowRight size={16} />
          </div>

          {/* Agent 2 Node */}
          <div
            className={isAgentActive('agent2') ? 'animate-pulse-glow' : ''}
            style={{
              padding: '12px 20px',
              borderRadius: '12px',
              background: isAgentActive('agent2') ? 'rgba(139, 92, 246, 0.2)' : 'rgba(12, 26, 33, 0.8)',
              border: isAgentActive('agent2') ? '2px solid #8b5cf6' : '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <Activity size={20} color="#8b5cf6" />
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>Agent 2 – Analysis Agent</div>
              <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: '#8b5cf6' }}>
                Status: {agentStatus.agent2 || 'WAITING'}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row: Agent 3 (Response Agent) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981' }}>
            <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)' }}>Read Analysis / Write Final Result</span>
            <div style={{ display: 'flex', gap: '2px' }}>
              <ArrowUp size={14} />
              <ArrowDown size={14} />
            </div>
          </div>

          <div
            className={isAgentActive('agent3') ? 'animate-pulse-glow' : ''}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              background: isAgentActive('agent3') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(12, 26, 33, 0.8)',
              border: isAgentActive('agent3') ? '2px solid #10b981' : '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <ShieldAlert size={20} color="#10b981" />
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>Agent 3 – Response Agent</div>
              <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: '#10b981' }}>
                Status: {agentStatus.agent3 || 'WAITING'}
              </div>
            </div>
          </div>
        </div>

        {/* Active Communication Event Toast */}
        {activePacket && (
          <div
            className="animate-slide-up"
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid var(--accent-emerald)',
              color: '#f8fafc',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 0 15px rgba(16, 185, 129, 0.3)'
            }}
          >
            <span style={{ fontWeight: 700, color: '#10b981' }}>BLACKBOARD I/O:</span>
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
