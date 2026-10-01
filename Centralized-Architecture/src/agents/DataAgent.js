/**
 * Agent 1 – Data Agent (Centralized Architecture)
 * 
 * Purpose:
 * Ingests raw telemetry and task parameters sent from the Central Coordinator.
 * Parses measurements, validates normal boundaries, and identifies parameter threshold excursions.
 */
export class DataAgent {
  constructor(options = {}) {
    this.name = 'Data Agent';
    this.id = 'agent-data';
    this.role = 'Telemetry Ingestion & Boundary Extraction';
    this.delay = options.delay || 1500;
  }

  /**
   * Process input data received from Central Coordinator
   * @param {Object} inputData - { task, temperature, pressure, humidity }
   * @returns {Promise<Object>} Processed sensor facts & anomalies
   */
  async process(inputData) {
    const { temperature, pressure, humidity, task } = inputData;
    
    // Realistic simulation delay
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
        limit: '75°C',
        severity: tempVal > 85 ? 'CRITICAL' : 'ELEVATED',
        detail: `Temperature is ${tempVal > 85 ? 'critically' : 'moderately'} above normal operational baseline (75°C)`
      });
    }

    if (pressVal > 6.0) {
      anomalies.push({
        parameter: 'Pressure',
        value: `${pressVal} bar`,
        limit: '6.0 bar',
        severity: pressVal > 7.0 ? 'CRITICAL' : 'ELEVATED',
        detail: `Internal chamber pressure exceeded safe threshold (6.0 bar)`
      });
    }

    if (humVal > 70) {
      anomalies.push({
        parameter: 'Humidity',
        value: `${humVal}%`,
        limit: '70%',
        severity: humVal > 85 ? 'HIGH' : 'MODERATE',
        detail: `Ambient humidity is elevated, presenting moisture condensation risks`
      });
    }

    const hasAnomalies = anomalies.length > 0;
    let summary = '';

    if (hasAnomalies) {
      const names = anomalies.map(a => a.parameter).join(', ');
      summary = `Telemetry boundaries breached: ${names} exceeded standard operational limits.`;
    } else {
      summary = `All telemetry parameters (Temperature, Pressure, Humidity) are within normal operational limits.`;
    }

    return {
      status: 'SUCCESS',
      agentId: this.id,
      agentName: this.name,
      timestamp: new Date().toLocaleTimeString(),
      output: {
        taskReceived: task,
        telemetry,
        anomaliesCount: anomalies.length,
        anomalies,
        hasAnomalies,
        summary
      }
    };
  }
}
