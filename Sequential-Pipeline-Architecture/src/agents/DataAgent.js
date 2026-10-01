/**
 * Agent 1 – Data Agent (Sequential / Pipeline Architecture)
 * 
 * In this architecture, Agent 1 receives raw input directly from the User,
 * parses and validates the telemetry envelope, and forwards its output
 * DIRECTLY to Agent 2 (Analysis Agent) in a sequential handoff.
 */
export class DataAgent {
  constructor(options = {}) {
    this.name = 'Data Agent';
    this.id = 'agent-data';
    this.stage = 1;
    this.role = 'Pipeline Stage 1: Telemetry Ingestion & Threshold Detection';
    this.delay = options.delay || 1500;
  }

  /**
   * Process raw input and generate intermediate packet for Stage 2
   * @param {Object} rawInput - { task, temperature, pressure, humidity }
   * @returns {Promise<Object>} Processed telemetry payload
   */
  async process(rawInput) {
    const { temperature, pressure, humidity, task } = rawInput;

    // Realistic asynchronous simulation delay
    await new Promise(resolve => setTimeout(resolve, this.delay));

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
        desc: `Thermal reading exceeded baseline by ${(tempVal - 75).toFixed(1)}°C`
      });
    }

    if (pressVal > 6.0) {
      anomalies.push({
        parameter: 'Pressure',
        value: `${pressVal} bar`,
        threshold: '6.0 bar',
        severity: pressVal > 7.0 ? 'CRITICAL' : 'ELEVATED',
        desc: `Chamber pressure exceeded safety envelope by ${(pressVal - 6.0).toFixed(1)} bar`
      });
    }

    if (humVal > 70) {
      anomalies.push({
        parameter: 'Humidity',
        value: `${humVal}%`,
        threshold: '70%',
        severity: humVal > 85 ? 'HIGH' : 'MODERATE',
        desc: `Ambient moisture level is high (${humVal}%), risking condensation`
      });
    }

    const hasAnomalies = anomalies.length > 0;
    const summary = hasAnomalies
      ? `Stage 1 parsed: ${anomalies.length} anomaly detected (${anomalies.map(a => a.parameter).join(', ')}). Passing to Stage 2.`
      : `Stage 1 parsed: All telemetry within normal ranges. Passing clean data to Stage 2.`;

    return {
      stage: 1,
      sender: this.name,
      timestamp: new Date().toLocaleTimeString(),
      data: {
        task,
        telemetry,
        anomalies,
        hasAnomalies,
        anomaliesCount: anomalies.length,
        summary
      }
    };
  }
}
