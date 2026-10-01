import React, { useState } from 'react';
import { Bot, Loader2, CheckCircle2, Clock, AlertCircle, ChevronDown, ChevronUp, Code2 } from 'lucide-react';

export function AgentCard({
  agentId,
  title,
  role,
  icon: Icon = Bot,
  accentColor = '#00f0ff',
  status = 'WAITING',
  output = null,
  isHighlighted = false
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
        border: isHighlighted
          ? `1px solid ${accentColor}`
          : status === 'PROCESSING'
          ? `1px solid ${accentColor}`
          : status === 'COMPLETED'
          ? '1px solid rgba(16, 185, 129, 0.4)'
          : '1px solid var(--border-subtle)',
        boxShadow: isHighlighted || status === 'PROCESSING'
          ? `0 0 25px ${accentColor}33`
          : 'var(--shadow-card)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Top Bar: Icon, Name, and Status */}
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
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{role}</p>
          </div>
        </div>

        <div>{getStatusBadge()}</div>
      </div>

      {/* Output Content Area */}
      <div
        style={{
          background: 'rgba(10, 15, 29, 0.6)',
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
            <Clock size={14} /> Standing by for coordinator request...
          </div>
        )}

        {status === 'PROCESSING' && (
          <div style={{ color: accentColor, fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Loader2 size={16} className="animate-spin-slow" />
            <span>Analyzing domain data & generating payload...</span>
          </div>
        )}

        {status === 'COMPLETED' && output && (
          <div className="animate-slide-up" style={{ fontSize: '0.825rem', color: 'var(--text-primary)' }}>
            {output.summary && (
              <p style={{ marginBottom: '6px', color: '#e2e8f0', lineHeight: 1.4 }}>
                <strong>Finding:</strong> {output.summary}
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

            {/* Quick Metrics Tags */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
              {output.anomaliesCount !== undefined && (
                <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: output.anomaliesCount > 0 ? 'rgba(244, 63, 94, 0.2)' : 'rgba(16, 185, 129, 0.2)', borderRadius: '4px', color: output.anomaliesCount > 0 ? '#fda4af' : '#6ee7b7', fontFamily: 'var(--font-mono)' }}>
                  Anomalies: {output.anomaliesCount}
                </span>
              )}
              {output.riskLevel && (
                <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: output.riskLevel === 'CRITICAL' ? 'rgba(244, 63, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)', borderRadius: '4px', color: output.riskLevel === 'CRITICAL' ? '#fda4af' : '#fcd34d', fontFamily: 'var(--font-mono)' }}>
                  Risk: {output.riskLevel} ({output.riskScore}/100)
                </span>
              )}
              {output.alertLevel && (
                <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: 'rgba(0, 240, 255, 0.15)', borderRadius: '4px', color: '#00f0ff', fontFamily: 'var(--font-mono)' }}>
                  Level: {output.alertLevel}
                </span>
              )}
            </div>
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
            <span>{showJson ? 'Hide JSON Payload' : 'Inspect JSON Payload'}</span>
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
                color: '#38bdf8',
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
