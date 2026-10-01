import React, { useState } from 'react';
import { Terminal, Copy, Check, Trash2, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

export function CommunicationLog({ logs = [], onClear }) {
  const [copied, setCopied] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const handleCopy = () => {
    const text = logs
      .map(
        (l) =>
          `[${l.timestamp}] ${l.sender} -> ${l.receiver} | TYPE: ${l.type} | STATUS: ${l.status}\nMESSAGE: ${l.message}\n${
            l.payload ? JSON.stringify(l.payload, null, 2) : ''
          }\n----------------------------------------`
      )
      .join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTypeStyle = (type) => {
    switch (type) {
      case 'PIPELINE_INIT':
        return { color: '#00f0ff', bg: 'rgba(0, 240, 255, 0.15)', border: 'rgba(0, 240, 255, 0.4)' };
      case 'PIPELINE_HANDOFF':
        return { color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)', border: 'rgba(139, 92, 246, 0.4)' };
      case 'FINAL_RESPONSE':
        return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.4)' };
      default:
        return { color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.15)', border: 'rgba(148, 163, 184, 0.4)' };
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Terminal size={20} color="var(--accent-violet)" />
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>
            Sequential Pipeline Communication Protocol Log
          </h2>
          <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.08)', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
            {logs.length} events
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={handleCopy}
            disabled={logs.length === 0}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: logs.length === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            <span>{copied ? 'Copied Log' : 'Copy Log'}</span>
          </button>

          <button
            type="button"
            onClick={onClear}
            disabled={logs.length === 0}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              background: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              borderRadius: '6px',
              color: '#fda4af',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: logs.length === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            <Trash2 size={14} />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Log Feed */}
      <div
        style={{
          background: 'rgba(5, 8, 18, 0.75)',
          borderRadius: '10px',
          border: '1px solid var(--border-subtle)',
          padding: '1rem',
          maxHeight: '400px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}
      >
        {logs.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.825rem', fontStyle: 'italic', textAlign: 'center', padding: '2rem 0' }}>
            No pipeline events recorded. Click "Run Pipeline Simulation" to observe sequential agent handoffs.
          </div>
        ) : (
          logs.map((log) => {
            const typeStyle = getTypeStyle(log.type);
            const isExpanded = expandedId === log.id;

            return (
              <div
                key={log.id}
                className="animate-slide-up"
                style={{
                  background: 'rgba(16, 24, 45, 0.65)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                {/* Log Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {log.timestamp}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700 }}>
                      <span style={{ color: '#00f0ff' }}>{log.sender}</span>
                      <ArrowRight size={13} color="var(--accent-violet)" />
                      <span style={{ color: '#c4b5fd' }}>{log.receiver}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: typeStyle.bg,
                        color: typeStyle.color,
                        border: `1px solid ${typeStyle.border}`
                      }}
                    >
                      {log.type}
                    </span>

                    <span
                      style={{
                        fontSize: '0.65rem',
                        fontFamily: 'var(--font-mono)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: '#10b981'
                      }}
                    >
                      {log.status}
                    </span>
                  </div>
                </div>

                {/* Log Content */}
                <p style={{ fontSize: '0.825rem', color: '#e2e8f0', lineHeight: 1.4 }}>
                  {log.message}
                </p>

                {/* Payload Accordion */}
                {log.payload && (
                  <div>
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : log.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--accent-violet)',
                        fontSize: '0.7rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      <span>{isExpanded ? 'Hide Pipeline Payload' : 'Inspect Pipeline Payload'}</span>
                      {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>

                    {isExpanded && (
                      <pre
                        className="animate-slide-up"
                        style={{
                          marginTop: '6px',
                          background: 'rgba(0, 0, 0, 0.5)',
                          padding: '8px',
                          borderRadius: '6px',
                          fontSize: '0.7rem',
                          color: '#c4b5fd',
                          maxHeight: '140px',
                          overflowY: 'auto'
                        }}
                      >
                        {JSON.stringify(log.payload, null, 2)}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
