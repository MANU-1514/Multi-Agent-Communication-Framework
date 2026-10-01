import React from 'react';
import { Cpu, Network, ShieldCheck, Sparkles } from 'lucide-react';

export function Header() {
  return (
    <header className="glass-panel" style={{ padding: '1.25rem 2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ 
          width: '48px', 
          height: '48px', 
          borderRadius: '12px', 
          background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(139, 92, 246, 0.2))', 
          border: '1px solid rgba(0, 240, 255, 0.4)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(0, 240, 255, 0.25)'
        }}>
          <Network size={28} color="#00f0ff" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, background: 'linear-gradient(to right, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}>
            Multi-Agent Communication Framework
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Agent Communication Architecture Demonstration
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
          background: 'rgba(0, 240, 255, 0.1)', 
          border: '1px solid rgba(0, 240, 255, 0.3)',
          color: '#00f0ff',
          fontSize: '0.8rem',
          fontWeight: 600
        }}>
          <Cpu size={15} />
          <span>Centralized Hub-and-Spoke</span>
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
