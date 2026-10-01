import React from 'react';
import { Database, ShieldCheck, Share2 } from 'lucide-react';

export function Header() {
  return (
    <header className="glass-panel" style={{ padding: '1.25rem 2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ 
          width: '48px', 
          height: '48px', 
          borderRadius: '12px', 
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(5, 150, 105, 0.25))', 
          border: '1px solid rgba(16, 185, 129, 0.4)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(16, 185, 129, 0.25)'
        }}>
          <Share2 size={28} color="#10b981" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, background: 'linear-gradient(to right, #ffffff, #a7f3d0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}>
            Multi-Agent Communication Framework
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Blackboard / Shared-State Multi-Agent Architecture
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
          background: 'rgba(16, 185, 129, 0.15)', 
          border: '1px solid rgba(16, 185, 129, 0.4)',
          color: '#a7f3d0',
          fontSize: '0.8rem',
          fontWeight: 600
        }}>
          <Database size={15} />
          <span>Shared Memory Blackboard</span>
        </div>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px', 
          padding: '6px 12px', 
          borderRadius: '8px', 
          background: 'rgba(0, 240, 255, 0.1)', 
          border: '1px solid rgba(0, 240, 255, 0.3)',
          color: '#00f0ff',
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
