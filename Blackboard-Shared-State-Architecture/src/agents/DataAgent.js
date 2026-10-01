/**
 * Agent 1 – Data Agent (Blackboard / Shared-State Architecture)
 * 
 * In this architecture, Agent 1 reads sensor data from the shared Blackboard,
 * processes the telemetry boundaries, and writes its structured findings
 * back onto the Blackboard memory.
 */
export class DataAgent {
  constructor(blackboard, options = {}) {
    this.blackboard = blackboard;
    this.name = 'Data Agent';
    this.key = 'agent1';
    this.role = 'Shared-State Telemetry Extractor';
    this.delay = options.delay || 1500;
  }

  /**
   * Determine if agent should activate based on Blackboard state
   */
  canExecute(state) {
    return state.task && state.sensorData && !state.agent1Output;
  }

  /**
   * Read from Blackboard, process, and commit back to Blackboard
   */
  async execute() {
    const state = this.blackboard.getState();
    if (!this.canExecute(state)) return null;

    // Signal Read
    this.blackboard.log(
      this.name,
      'Blackboard',
      'READ_STATE',
      `${this.name} read task and raw sensor telemetry from shared blackboard memory.`
    );
    this.blackboard.onPacketTransfer({ from: 'blackboard', to: this.name, type: 'READ_STATE' });

    // Mark status PROCESSING
    this.blackboard.updateAgentStatus(this.key, 'PROCESSING');

    // Async delay
    await new Promise(r => setTimeout(r, this.delay));

    const { temperature, pressure, humidity } = state.sensorData;
    const tempVal = parseFloat(temperature);
    const pressVal = parseFloat(pressure);
    const humVal = parseFloat(humidity);

    const anomalies = [];
    const telemetry = {
      temperature: { value: tempVal, unit: '°C', threshold: 75 },
      pressure: { value: pressVal, unit: 'bar', threshold: 6.0 },
      humidity: { value: humVal, unit: '%', threshold: 70 }
    };

    if (tempVal > 75) {
      anomalies.push({
        parameter: 'Temperature',
        value: `${tempVal}°C`,
        threshold: '75°C',
        severity: tempVal > 85 ? 'CRITICAL' : 'ELEVATED',
        desc: `Temperature exceeded threshold by ${(tempVal - 75).toFixed(1)}°C`
      });
    }

    if (pressVal > 6.0) {
      anomalies.push({
        parameter: 'Pressure',
        value: `${pressVal} bar`,
        threshold: '6.0 bar',
        severity: pressVal > 7.0 ? 'CRITICAL' : 'ELEVATED',
        desc: `Chamber pressure exceeded threshold by ${(pressVal - 6.0).toFixed(1)} bar`
      });
    }

    if (humVal > 70) {
      anomalies.push({
        parameter: 'Humidity',
        value: `${humVal}%`,
        threshold: '70%',
        severity: humVal > 85 ? 'HIGH' : 'MODERATE',
        desc: `Humidity is elevated at ${humVal}%`
      });
    }

    const hasAnomalies = anomalies.length > 0;
    const summary = hasAnomalies
      ? `Data Agent verified ${anomalies.length} anomaly: ${anomalies.map(a => a.parameter).join(', ')}.`
      : `Data Agent verified: All sensor telemetry parameters operate within nominal range.`;

    const output = {
      telemetry,
      anomalies,
      hasAnomalies,
      anomaliesCount: anomalies.length,
      summary,
      timestamp: new Date().toLocaleTimeString()
    };

    // Commit to Blackboard
    this.blackboard.appendIntermediateResult(summary, this.name);
    this.blackboard.write('agent1Output', output, this.name);
    this.blackboard.updateAgentStatus(this.key, 'COMPLETED');

    return output;
  }
}
