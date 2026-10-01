import React from 'react';
import { User, Database, Activity, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';

export function PipelineDiagram({
  agentStatuses = {},
  activePacket = null
}) {
  const isStageActive = (agentId) => agentStatuses[agentId]?.status === 'PROCESSING';
  const isStageDone = (agentId) => agentStatuses[agentId]?.status === 'COMPLETED';

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={20} color="var(--accent-violet)" />
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>
            Sequential Pipeline Architecture Flow
          </h2>
        </div>
        <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
          Topology: Direct Linear Pipeline (No Coordinator)
        </span>
      </div>

      {/* Horizontal Flow Container */}
      <div
        style={{
          background: 'rgba(9, 13, 26, 0.7)',
          borderRadius: '12px',
          padding: '2rem 1.5rem',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          overflowX: 'auto',
          minWidth: '700px'
        }}
      >
        {/* Step 0: User */}
        <div
          style={{
            padding: '14px 18px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            minWidth: '110px'
          }}
        >
          <User size={22} color="#94a3b8" />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0' }}>User Client</span>
          <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Initiator</span>
        </div>

        {/* Handoff Connector 0 -> 1 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#8b5cf6', minWidth: '40px' }}>
          <ArrowRight size={22} color={activePacket?.from === 'user' ? '#00f0ff' : 'var(--border-subtle)'} />
        </div>

        {/* Stage 1: Data Agent */}
        <div
          className={isStageActive('agent-data') ? 'animate-pulse-glow' : ''}
          style={{
            padding: '16px 20px',
            borderRadius: '12px',
            background: isStageActive('agent-data')
              ? 'linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(139, 92, 246, 0.2))'
              : isStageDone('agent-data')
              ? 'rgba(16, 185, 129, 0.15)'
              : 'rgba(15, 23, 42, 0.7)',
            border: isStageActive('agent-data')
              ? '2px solid #00f0ff'
              : isStageDone('agent-data')
              ? '1px solid rgba(16, 185, 129, 0.5)'
              : '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            minWidth: '160px',
            textAlign: 'center'
          }}
        >
          <Database size={24} color={isStageActive('agent-data') ? '#00f0ff' : '#94a3b8'} />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>Stage 1: Data Agent</span>
          <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Ingestion & Validation</span>
          <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: '#00f0ff' }}>
            {agentStatuses['agent-data']?.status || 'WAITING'}
          </span>
        </div>

        {/* Handoff Connector 1 -> 2 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#8b5cf6', minWidth: '40px' }}>
          <span style={{ fontSize: '0.6rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '2px' }}>Direct</span>
          <ArrowRight size={22} color={activePacket?.from === 'agent-data' ? '#8b5cf6' : 'var(--border-subtle)'} />
        </div>

        {/* Stage 2: Analysis Agent */}
        <div
          className={isStageActive('agent-analysis') ? 'animate-pulse-glow' : ''}
          style={{
            padding: '16px 20px',
            borderRadius: '12px',
            background: isStageActive('agent-analysis')
              ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(99, 102, 241, 0.25))'
              : isStageDone('agent-analysis')
              ? 'rgba(16, 185, 129, 0.15)'
              : 'rgba(15, 23, 42, 0.7)',
            border: isStageActive('agent-analysis')
              ? '2px solid #8b5cf6'
              : isStageDone('agent-analysis')
              ? '1px solid rgba(16, 185, 129, 0.5)'
              : '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            minWidth: '160px',
            textAlign: 'center'
          }}
        >
          <Activity size={24} color={isStageActive('agent-analysis') ? '#8b5cf6' : '#94a3b8'} />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>Stage 2: Analysis Agent</span>
          <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Risk & Correlation</span>
          <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: '#8b5cf6' }}>
            {agentStatuses['agent-analysis']?.status || 'WAITING'}
          </span>
        </div>

        {/* Handoff Connector 2 -> 3 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#8b5cf6', minWidth: '40px' }}>
          <span style={{ fontSize: '0.6rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '2px' }}>Direct</span>
          <ArrowRight size={22} color={activePacket?.from === 'agent-analysis' ? '#10b981' : 'var(--border-subtle)'} />
        </div>

        {/* Stage 3: Response Agent */}
        <div
          className={isStageActive('agent-response') ? 'animate-pulse-glow' : ''}
          style={{
            padding: '16px 20px',
            borderRadius: '12px',
            background: isStageActive('agent-response')
              ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(5, 150, 105, 0.25))'
              : isStageDone('agent-response')
              ? 'rgba(16, 185, 129, 0.15)'
              : 'rgba(15, 23, 42, 0.7)',
            border: isStageActive('agent-response')
              ? '2px solid #10b981'
              : isStageDone('agent-response')
              ? '1px solid rgba(16, 185, 129, 0.5)'
              : '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            minWidth: '160px',
            textAlign: 'center'
          }}
        >
          <ShieldAlert size={24} color={isStageActive('agent-response') ? '#10b981' : '#94a3b8'} />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>Stage 3: Response Agent</span>
          <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Directive Synthesis</span>
          <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: '#10b981' }}>
            {agentStatuses['agent-response']?.status || 'WAITING'}
          </span>
        </div>

        {/* Handoff Connector 3 -> Final */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#10b981', minWidth: '40px' }}>
          <ArrowRight size={22} color={activePacket?.from === 'agent-response' ? '#10b981' : 'var(--border-subtle)'} />
        </div>

        {/* Final Response Node */}
        <div
          style={{
            padding: '14px 18px',
            borderRadius: '12px',
            background: isStageDone('agent-response') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
            border: isStageDone('agent-response') ? '1px solid #10b981' : '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            minWidth: '110px'
          }}
        >
          <CheckCircle2 size={22} color={isStageDone('agent-response') ? '#10b981' : '#94a3b8'} />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0' }}>Final Output</span>
          <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: isStageDone('agent-response') ? '#10b981' : 'var(--text-muted)' }}>
            {isStageDone('agent-response') ? 'DELIVERED' : 'WAITING'}
          </span>
        </div>
      </div>
    </div>
  );
}
