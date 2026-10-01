import React from 'react';
import { GitCommit, ShieldCheck, ArrowRight } from 'lucide-react';

export function Header() {
  return (
    <header className="glass-panel" style={{ padding: '1.25rem 2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ 
          width: '48px', 
          height: '48px', 
          borderRadius: '12px', 
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(99, 102, 241, 0.25))', 
          border: '1px solid rgba(139, 92, 246, 0.4)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(139, 92, 246, 0.25)'
        }}>
          <GitCommit size={28} color="#8b5cf6" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, background: 'linear-gradient(to right, #ffffff, #c4b5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}>
            Multi-Agent Communication Framework
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Sequential / Pipeline Multi-Agent Architecture
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px', 
          padding: '6px 12px', 
          borderRadius: '8px', 
          background: 'rgba(139, 92, 246, 0.15)', 
          border: '1px solid rgba(139, 92, 246, 0.4)',
          color: '#c4b5fd',
          fontSize: '0.8rem',
          fontWeight: 600
        }}>
          <ArrowRight size={15} />
          <span>Direct Linear Handoffs (No Coordinator)</span>
        </div>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px', 
          padding: '6px 12px', 
          borderRadius: '8px', 
          background: 'rgba(16, 185, 129, 0.1)', 
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#10b981',
          fontSize: '0.8rem',
          fontWeight: 600
        }}>
          <ShieldCheck size={15} />
          <span>100% Frontend-Only</span>
        </div>
      </div>
    </header>
  );
}
