import React from 'react';
import { Send, ArrowRight, CheckCircle2, Radio, CornerDownRight } from 'lucide-react';

export function MessageAnimation({ activeMessage }) {
  if (!activeMessage) return null;

  const isRequest = activeMessage.type === 'REQUEST';
  const isResponse = activeMessage.type === 'RESPONSE';
  const isFinal = activeMessage.type === 'FINAL_RESPONSE';

  const getTagColor = () => {
    if (isRequest) return '#00f0ff';
    if (isResponse) return '#8b5cf6';
    if (isFinal) return '#10b981';
    return '#f59e0b';
  };

  return (
    <div
      className="glass-panel animate-slide-up"
      style={{
        padding: '1rem 1.25rem',
        marginBottom: '1.5rem',
        border: `1px solid ${getTagColor()}66`,
        boxShadow: `0 0 20px ${getTagColor()}25`,
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(10, 15, 29, 0.95))'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Radio size={16} color={getTagColor()} className="animate-spin-slow" />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Communication Transit
          </span>
        </div>

        <div
          style={{
            fontSize: '0.7rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '4px',
            background: `${getTagColor()}22`,
            color: getTagColor(),
            border: `1px solid ${getTagColor()}44`
          }}
        >
          {activeMessage.type}
        </div>
      </div>

      {/* Transit Visualizer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', color: '#f8fafc', fontWeight: 600, marginBottom: '6px' }}>
        <span style={{ color: '#00f0ff' }}>{activeMessage.sender}</span>
        <ArrowRight size={16} color="var(--text-muted)" />
        <span style={{ color: '#8b5cf6' }}>{activeMessage.receiver}</span>
      </div>

      <p style={{ fontSize: '0.825rem', color: '#cbd5e1', lineHeight: 1.4 }}>
        {activeMessage.message}
      </p>
    </div>
  );
}
