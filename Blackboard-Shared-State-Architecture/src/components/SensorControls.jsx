import React from 'react';
import { Play, RotateCcw, Sliders, Flame, Gauge, Droplets, CheckCircle2 } from 'lucide-react';

export function SensorControls({
  task,
  setTask,
  temperature,
  setTemperature,
  pressure,
  setPressure,
  humidity,
  setHumidity,
  speed,
  setSpeed,
  isRunning,
  onRun,
  onReset
}) {
  const presets = [
    {
      name: '🚨 Critical Overheat & Pressure',
      icon: Flame,
      temp: 85,
      press: 7.2,
      hum: 80,
      task: 'Analyze industrial turbine sensor readings and determine whether the system requires an alert.',
      color: '#f43f5e'
    },
    {
      name: '⚠️ Moisture Condensation Hazard',
      icon: Droplets,
      temp: 45,
      press: 4.8,
      hum: 88,
      task: 'Analyze environmental sensor telemetry for humidity-induced electronics degradation.',
      color: '#f59e0b'
    },
    {
      name: '✅ Normal Steady State',
      icon: CheckCircle2,
      temp: 24,
      press: 2.5,
      hum: 45,
      task: 'Perform routine baseline health check across all operational sensor nodes.',
      color: '#10b981'
    }
  ];

  const applyPreset = (preset) => {
    if (isRunning) return;
    setTemperature(preset.temp);
    setPressure(preset.press);
    setHumidity(preset.hum);
    setTask(preset.task);
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sliders size={20} color="var(--accent-emerald)" />
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Shared Task Specification & Sensor Inputs
          </h2>
        </div>

        {/* Speed Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.05)', padding: '4px 8px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Speed:</span>
          {[0.5, 1.0, 2.0].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSpeed(s)}
              disabled={isRunning}
              style={{
                background: speed === s ? 'var(--accent-emerald)' : 'transparent',
                color: speed === s ? '#041f17' : 'var(--text-secondary)',
                border: 'none',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: isRunning ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Preset Selectors */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {presets.map((p, idx) => {
          const Icon = p.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(p)}
              disabled={isRunning}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${p.color}33`,
                borderRadius: '8px',
                color: 'var(--text-primary)',
                cursor: isRunning ? 'not-allowed' : 'pointer',
                textAlign: 'left',
                fontSize: '0.8rem',
                fontWeight: 600,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!isRunning) e.currentTarget.style.borderColor = p.color;
              }}
              onMouseLeave={(e) => {
                if (!isRunning) e.currentTarget.style.borderColor = `${p.color}33`;
              }}
            >
              <Icon size={16} color={p.color} />
              <span>{p.name}</span>
            </button>
          );
        })}
      </div>

      {/* Custom Task Text */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 600 }}>
          Blackboard Initial Task Directive:
        </label>
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          disabled={isRunning}
          placeholder="Enter goal to write onto blackboard..."
          style={{
            width: '100%',
            padding: '10px 14px',
            background: 'rgba(7, 15, 20, 0.8)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            color: 'var(--text-primary)',
            fontSize: '0.9rem',
            fontFamily: 'var(--font-sans)',
            outline: 'none'
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--accent-emerald)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
        />
      </div>

      {/* Sensor Sliders */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        {/* Temperature */}
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Flame size={16} color="#f43f5e" /> Temperature
            </span>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: temperature > 75 ? '#f43f5e' : 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
              {temperature}°C
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="120"
            step="1"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            disabled={isRunning}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            <span>0°C</span>
            <span style={{ color: 'var(--accent-amber)' }}>Threshold: 75°C</span>
            <span>120°C</span>
          </div>
        </div>

        {/* Pressure */}
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Gauge size={16} color="#10b981" /> Pressure
            </span>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: pressure > 6.0 ? '#10b981' : 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
              {pressure.toFixed(1)} bar
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="12.0"
            step="0.1"
            value={pressure}
            onChange={(e) => setPressure(parseFloat(e.target.value))}
            disabled={isRunning}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            <span>0.5 bar</span>
            <span style={{ color: 'var(--accent-amber)' }}>Threshold: 6.0 bar</span>
            <span>12.0 bar</span>
          </div>
        </div>

        {/* Humidity */}
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Droplets size={16} color="#00f0ff" /> Humidity
            </span>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: humidity > 70 ? '#00f0ff' : 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
              {humidity}%
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            step="1"
            value={humidity}
            onChange={(e) => setHumidity(parseFloat(e.target.value))}
            disabled={isRunning}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            <span>10%</span>
            <span style={{ color: 'var(--accent-amber)' }}>Threshold: 70%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          className="btn-primary"
          onClick={onRun}
          disabled={isRunning}
        >
          <Play size={18} fill="#041f17" />
          <span>{isRunning ? 'Agents Collaborating on Blackboard...' : 'Run Blackboard Simulation'}</span>
        </button>

        <button
          type="button"
          className="btn-secondary"
          onClick={onReset}
          disabled={isRunning}
        >
          <RotateCcw size={16} />
          <span>Reset Blackboard</span>
        </button>
      </div>
    </div>
  );
}
