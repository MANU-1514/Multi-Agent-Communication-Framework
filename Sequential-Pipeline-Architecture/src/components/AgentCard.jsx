import React, { useState } from 'react';
import { Bot, Loader2, CheckCircle2, Clock, AlertCircle, ChevronDown, ChevronUp, Code2, ArrowRight } from 'lucide-react';

export function AgentCard({
  stage,
  title,
  role,
  icon: Icon = Bot,
  accentColor = '#8b5cf6',
  status = 'WAITING',
  output = null,
  isHighlighted = false,
  nextStageName = null
}) {
  const [showJson, setShowJson] = useState(false);

  const getStatusBadge = () => {
    switch (status) {
      case 'PROCESSING':
        return (
          <span className="badge-status status-processing">
            <Loader2 size={13} className="animate-spin-slow" />
            PROCESSING
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="badge-status status-completed">
            <CheckCircle2 size={13} />
            COMPLETED
          </span>
        );
      case 'ERROR':
        return (
          <span className="badge-status status-error">
            <AlertCircle size={13} />
            ERROR
          </span>
        );
      case 'WAITING':
      default:
        return (
          <span className="badge-status status-waiting">
            <Clock size={13} />
            WAITING
          </span>
        );
    }
  };

  return (
    <div
      className={`glass-panel ${status === 'PROCESSING' ? 'animate-pulse-glow' : ''}`}
      style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        border: isHighlighted || status === 'PROCESSING'
          ? `1px solid ${accentColor}`
          : status === 'COMPLETED'
          ? '1px solid rgba(16, 185, 129, 0.4)'
          : '1px solid var(--border-subtle)',
        boxShadow: isHighlighted || status === 'PROCESSING'
          ? `0 0 25px ${accentColor}33`
          : 'var(--shadow-card)',
        position: 'relative'
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: `${accentColor}18`,
              border: `1px solid ${accentColor}55`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 12px ${accentColor}25`
            }}
          >
            <Icon size={20} color={accentColor} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', background: `${accentColor}22`, color: accentColor, padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                STAGE {stage}
              </span>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h3>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{role}</p>
          </div>
        </div>

        <div>{getStatusBadge()}</div>
      </div>

      {/* Output Content Area */}
      <div
        style={{
          background: 'rgba(9, 13, 26, 0.65)',
          borderRadius: '8px',
          padding: '10px 12px',
          border: '1px solid var(--border-subtle)',
          minHeight: '85px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        {status === 'WAITING' && (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={14} /> Waiting for handoff from previous stage...
          </div>
        )}

        {status === 'PROCESSING' && (
          <div style={{ color: accentColor, fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Loader2 size={16} className="animate-spin-slow" />
            <span>Processing pipeline stage payload...</span>
          </div>
        )}

        {status === 'COMPLETED' && output && (
          <div className="animate-slide-up" style={{ fontSize: '0.825rem', color: 'var(--text-primary)' }}>
            {output.summary && (
              <p style={{ marginBottom: '6px', color: '#e2e8f0', lineHeight: 1.4 }}>
                <strong>Output:</strong> {output.summary}
              </p>
            )}
            {output.diagnosticSummary && (
              <p style={{ marginBottom: '6px', color: '#e2e8f0', lineHeight: 1.4 }}>
                <strong>Diagnostic:</strong> {output.diagnosticSummary}
              </p>
            )}
            {output.executiveDecision && (
              <p style={{ marginBottom: '6px', color: output.alertRequired ? '#fda4af' : '#6ee7b7', lineHeight: 1.4, fontWeight: 600 }}>
                {output.executiveDecision}
              </p>
            )}

            {/* Stage Direct Handoff Badge */}
            {nextStageName && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#c4b5fd', marginTop: '6px', fontWeight: 600 }}>
                <span>Passed directly to:</span>
                <span style={{ color: '#ffffff', background: 'rgba(139, 92, 246, 0.25)', padding: '2px 6px', borderRadius: '4px' }}>
                  {nextStageName}
                </span>
                <ArrowRight size={12} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Collapsible JSON Inspector */}
      {output && (
        <div>
          <button
            type="button"
            onClick={() => setShowJson(!showJson)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              padding: '2px 0'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <Code2 size={13} />
            <span>{showJson ? 'Hide Stage Payload' : 'Inspect Stage Payload'}</span>
            {showJson ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>

          {showJson && (
            <pre
              className="animate-slide-up"
              style={{
                marginTop: '6px',
                background: 'rgba(0, 0, 0, 0.45)',
                padding: '8px 10px',
                borderRadius: '6px',
                fontSize: '0.7rem',
                color: '#c4b5fd',
                maxHeight: '160px',
                overflowY: 'auto',
                border: '1px solid var(--border-subtle)'
              }}
            >
              {JSON.stringify(output, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
