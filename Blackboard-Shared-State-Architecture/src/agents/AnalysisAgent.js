/**
 * Agent 2 – Analysis Agent (Blackboard / Shared-State Architecture)
 * 
 * In this architecture, Agent 2 reads Agent 1's output from the shared Blackboard,
 * analyzes multi-variable failure mechanisms, and writes its diagnostic conclusions
 * back onto the Blackboard memory.
 */
export class AnalysisAgent {
  constructor(blackboard, options = {}) {
    this.blackboard = blackboard;
    this.name = 'Analysis Agent';
    this.key = 'agent2';
    this.role = 'Shared-State Risk & Diagnostic Evaluator';
    this.delay = options.delay || 1500;
  }

  /**
   * Determine if agent should activate based on Blackboard state
   */
  canExecute(state) {
    return state.agent1Output && !state.agent2Output;
  }

  /**
   * Read from Blackboard, analyze, and commit back to Blackboard
   */
  async execute() {
    const state = this.blackboard.getState();
    if (!this.canExecute(state)) return null;

    // Signal Read
    this.blackboard.log(
      this.name,
      'Blackboard',
      'READ_STATE',
      `${this.name} read Agent 1 output from shared blackboard memory for failure correlation.`
    );
    this.blackboard.onPacketTransfer({ from: 'blackboard', to: this.name, type: 'READ_STATE' });

    // Mark status PROCESSING
    this.blackboard.updateAgentStatus(this.key, 'PROCESSING');

    // Async delay
    await new Promise(r => setTimeout(r, this.delay));

    const { telemetry, anomalies, hasAnomalies } = state.agent1Output;
    const tempVal = telemetry?.temperature?.value || 0;
    const pressVal = telemetry?.pressure?.value || 0;
    const humVal = telemetry?.humidity?.value || 0;

    let riskLevel = 'LOW';
    let riskScore = 10;
    const failureMechanisms = [];
    let diagnosticSummary = '';

    if (tempVal > 80 && pressVal > 6.5) {
      riskLevel = 'CRITICAL';
      riskScore = 96;
      failureMechanisms.push({
        name: 'Combined Thermal Degradation & Seal Burst',
        probability: 'HIGH',
        desc: 'Elevated temperature lowers mechanical yield strength while chamber overpressure threatens seal integrity.'
      });
    } else if (tempVal > 75 || pressVal > 6.0) {
      riskLevel = 'ELEVATED';
      riskScore = 62;
      if (tempVal > 75) {
        failureMechanisms.push({
          name: 'Thermal Expansion Stress',
          probability: 'MEDIUM',
          desc: 'Rotor bearings experiencing elevated frictional thermal fatigue.'
        });
      }
      if (pressVal > 6.0) {
        failureMechanisms.push({
          name: 'Chamber Overpressurization',
          probability: 'MEDIUM',
          desc: 'Chamber pressure approaches maximum rated pneumatic limit.'
        });
      }
    }

    if (humVal > 75) {
      failureMechanisms.push({
        name: 'Condensation Ingress',
        probability: 'MODERATE',
        desc: 'Excess relative humidity increases sensor corrosion risk.'
      });
      riskScore = Math.max(riskScore, 50);
      if (riskLevel === 'LOW') riskLevel = 'MODERATE';
    }

    if (!hasAnomalies) {
      diagnosticSummary = 'Nominal status confirmed. Operating parameters well within design safety factors.';
    } else if (riskLevel === 'CRITICAL') {
      diagnosticSummary = 'CRITICAL state: Dangerous multi-variable correlation detected between thermal load and pneumatic pressure.';
    } else {
      diagnosticSummary = 'Elevated operating condition: Telemetry threshold excursions warrant operational observation.';
    }

    const output = {
      riskLevel,
      riskScore,
      failureMechanisms,
      primaryFailure: failureMechanisms[0]?.name || 'None',
      diagnosticSummary,
      timestamp: new Date().toLocaleTimeString()
    };

    // Commit to Blackboard
    this.blackboard.appendIntermediateResult(diagnosticSummary, this.name);
    this.blackboard.write('agent2Output', output, this.name);
    this.blackboard.updateAgentStatus(this.key, 'COMPLETED');

    return output;
  }
}
