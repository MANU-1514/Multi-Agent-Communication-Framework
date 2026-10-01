/**
 * Agent 3 – Response Agent (Blackboard / Shared-State Architecture)
 * 
 * In this architecture, Agent 3 reads the diagnostic findings from the shared Blackboard,
 * formulates actionable directives and emergency alert protocols, and writes
 * the finalized conclusion and status directly onto the shared Blackboard.
 */
export class ResponseAgent {
  constructor(blackboard, options = {}) {
    this.blackboard = blackboard;
    this.name = 'Response Agent';
    this.key = 'agent3';
    this.role = 'Shared-State Directive Synthesizer & Alert Generator';
    this.delay = options.delay || 1500;
  }

  /**
   * Determine if agent should activate based on Blackboard state
   */
  canExecute(state) {
    return state.agent2Output && !state.agent3Output;
  }

  /**
   * Read from Blackboard, formulate directives, and commit final response to Blackboard
   */
  async execute() {
    const state = this.blackboard.getState();
    if (!this.canExecute(state)) return null;

    // Signal Read
    this.blackboard.log(
      this.name,
      'Blackboard',
      'READ_STATE',
      `${this.name} read Agent 2 diagnostic findings from shared blackboard memory.`
    );
    this.blackboard.onPacketTransfer({ from: 'blackboard', to: this.name, type: 'READ_STATE' });

    // Mark status PROCESSING
    this.blackboard.updateAgentStatus(this.key, 'PROCESSING');

    // Async delay
    await new Promise(r => setTimeout(r, this.delay));

    const { riskLevel, riskScore, diagnosticSummary, primaryFailure } = state.agent2Output;

    let alertRequired = false;
    let alertLevel = 'INFO';
    let actionDirectives = [];
    let executiveDecision = '';

    if (riskLevel === 'CRITICAL') {
      alertRequired = true;
      alertLevel = 'EMERGENCY_ALERT';
      actionDirectives = [
        '🚨 DIRECTIVE 1: Immediately throttle turbine intake valves to 20% limit.',
        '❄️ DIRECTIVE 2: Trigger auxiliary coolant manifold booster pump.',
        '💨 DIRECTIVE 3: Open emergency pneumatic relief valve EV-202.',
        '📢 DIRECTIVE 4: Post incident alert to SCADA central alarm system.'
      ];
      executiveDecision = 'EMERGENCY ALERT: High thermal and pressure signature requires immediate throttle back and venting.';
    } else if (riskLevel === 'ELEVATED' || riskLevel === 'MODERATE') {
      alertRequired = true;
      alertLevel = 'MAINTENANCE_WARNING';
      actionDirectives = [
        '⚠️ DIRECTIVE 1: Dispatch plant maintenance technician for physical vibration scan.',
        '🔍 DIRECTIVE 2: Monitor telemetry parameters with high-frequency logging.',
        '🌬️ DIRECTIVE 3: Adjust HVAC air handling to normalize moisture level.'
      ];
      executiveDecision = 'MAINTENANCE WARNING: Operational parameters exceed baseline safety margins.';
    } else {
      alertRequired = false;
      alertLevel = 'NOMINAL';
      actionDirectives = [
        '✅ DIRECTIVE 1: System stable. Continue steady-state power operations.',
        '📊 DIRECTIVE 2: Maintain standard telemetry logging intervals.'
      ];
      executiveDecision = 'NOMINAL STATE: All turbine parameters verified within standard operating thresholds.';
    }

    const output = {
      alertRequired,
      alertLevel,
      riskScore,
      primaryFailure,
      diagnosticSummary,
      actionDirectives,
      executiveDecision,
      finalStatus: alertRequired ? 'ALERT ISSUED' : 'NOMINAL',
      timestamp: new Date().toLocaleTimeString()
    };

    // Commit to Blackboard
    this.blackboard.appendIntermediateResult(executiveDecision, this.name);
    this.blackboard.write('agent3Output', output, this.name);
    this.blackboard.write('finalResult', output, this.name);
    this.blackboard.updateAgentStatus(this.key, 'COMPLETED');

    return output;
  }
}
