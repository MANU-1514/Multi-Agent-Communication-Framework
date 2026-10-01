import { DataAgent } from '../agents/DataAgent';
import { AnalysisAgent } from '../agents/AnalysisAgent';
import { ResponseAgent } from '../agents/ResponseAgent';

/**
 * Central Coordinator (Centralized Multi-Agent Architecture)
 * 
 * Controls all message dispatching, routing, agent lifecycle states, and telemetry orchestration.
 * Agents NEVER communicate with each other directly; every message passes through this coordinator.
 */
export class CentralCoordinator {
  constructor(callbacks = {}, options = {}) {
    this.speedMultiplier = options.speedMultiplier || 1.0;
    this.onLogMessage = callbacks.onLogMessage || (() => {});
    this.onAgentStateChange = callbacks.onAgentStateChange || (() => {});
    this.onCoordinatorStateChange = callbacks.onCoordinatorStateChange || (() => {});
    this.onPacketTransfer = callbacks.onPacketTransfer || (() => {});
    this.onComplete = callbacks.onComplete || (() => {});

    // Instantiate isolated agents with dynamic delay adjusted by speed
    const baseDelay = Math.round(1400 / this.speedMultiplier);
    this.dataAgent = new DataAgent({ delay: baseDelay });
    this.analysisAgent = new AnalysisAgent({ delay: baseDelay });
    this.responseAgent = new ResponseAgent({ delay: baseDelay });

    this.isRunning = false;
    this.isAborted = false;
  }

  setSpeed(multiplier) {
    this.speedMultiplier = multiplier;
    const baseDelay = Math.round(1400 / this.speedMultiplier);
    this.dataAgent.delay = baseDelay;
    this.analysisAgent.delay = baseDelay;
    this.responseAgent.delay = baseDelay;
  }

  abort() {
    this.isAborted = true;
    this.isRunning = false;
  }

  /**
   * Helper to format timestamps
   */
  getTimestamp() {
    const now = new Date();
    return now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
  }

  /**
   * Dispatch log message to UI
   */
  log(sender, receiver, type, message, payload = null, status = 'COMPLETED') {
    const logEntry = {
      id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      timestamp: this.getTimestamp(),
      sender,
      receiver,
      type,
      message,
      payload,
      status
    };
    this.onLogMessage(logEntry);
    return logEntry;
  }

  /**
   * Execute the centralized multi-agent workflow
   * @param {Object} input - { task, temperature, pressure, humidity }
   */
  async execute(input) {
    if (this.isRunning) return;
    this.isRunning = true;
    this.isAborted = false;

    const transitDelay = Math.round(700 / this.speedMultiplier);

    try {
      // Step 0: User submits task to Coordinator
      this.onCoordinatorStateChange('PROCESSING');
      this.log(
        'User',
        'Central Coordinator',
        'TASK_SUBMIT',
        `Task initiated: "${input.task}" [T: ${input.temperature}°C, P: ${input.pressure} bar, H: ${input.humidity}%]`,
        input
      );
      this.onPacketTransfer({ from: 'user', to: 'coordinator', type: 'TASK_SUBMIT' });
      await new Promise(r => setTimeout(r, transitDelay));
      if (this.isAborted) return;

      // ==========================================
      // STEP 1: Coordinator -> Agent 1 (Data Agent)
      // ==========================================
      this.log(
        'Central Coordinator',
        'Agent 1 (Data Agent)',
        'REQUEST',
        'Dispatching sensor telemetry for boundary parsing and anomaly filtering.',
        input
      );
      this.onPacketTransfer({ from: 'coordinator', to: 'agent-data', type: 'REQUEST' });
      this.onAgentStateChange('agent-data', 'PROCESSING', null);
      await new Promise(r => setTimeout(r, transitDelay));
      if (this.isAborted) return;

      const dataResult = await this.dataAgent.process(input);
      if (this.isAborted) return;
      this.onAgentStateChange('agent-data', 'COMPLETED', dataResult.output);

      // STEP 1 Response: Agent 1 -> Coordinator
      this.log(
        'Agent 1 (Data Agent)',
        'Central Coordinator',
        'RESPONSE',
        `Telemetry parsed. ${dataResult.output.summary}`,
        dataResult.output
      );
      this.onPacketTransfer({ from: 'agent-data', to: 'coordinator', type: 'RESPONSE' });
      await new Promise(r => setTimeout(r, transitDelay));
      if (this.isAborted) return;

      // ==============================================
      // STEP 2: Coordinator -> Agent 2 (Analysis Agent)
      // ==============================================
      this.log(
        'Central Coordinator',
        'Agent 2 (Analysis Agent)',
        'REQUEST',
        'Transmitting parsed telemetry anomalies to evaluate multi-variable failure risks.',
        dataResult.output
      );
      this.onPacketTransfer({ from: 'coordinator', to: 'agent-analysis', type: 'REQUEST' });
      this.onAgentStateChange('agent-analysis', 'PROCESSING', null);
      await new Promise(r => setTimeout(r, transitDelay));
      if (this.isAborted) return;

      const analysisResult = await this.analysisAgent.process(dataResult.output);
      if (this.isAborted) return;
      this.onAgentStateChange('agent-analysis', 'COMPLETED', analysisResult.output);

      // STEP 2 Response: Agent 2 -> Coordinator
      this.log(
        'Agent 2 (Analysis Agent)',
        'Central Coordinator',
        'RESPONSE',
        `Analysis complete. Risk Grade: [${analysisResult.output.riskLevel}] - ${analysisResult.output.diagnosticSummary}`,
        analysisResult.output
      );
      this.onPacketTransfer({ from: 'agent-analysis', to: 'coordinator', type: 'RESPONSE' });
      await new Promise(r => setTimeout(r, transitDelay));
      if (this.isAborted) return;

      // ==============================================
      // STEP 3: Coordinator -> Agent 3 (Response Agent)
      // ==============================================
      this.log(
        'Central Coordinator',
        'Agent 3 (Response Agent)',
        'REQUEST',
        'Forwarding risk assessment and diagnostic summary to synthesize operational directive.',
        analysisResult.output
      );
      this.onPacketTransfer({ from: 'coordinator', to: 'agent-response', type: 'REQUEST' });
      this.onAgentStateChange('agent-response', 'PROCESSING', null);
      await new Promise(r => setTimeout(r, transitDelay));
      if (this.isAborted) return;

      const responseResult = await this.responseAgent.process(analysisResult.output);
      if (this.isAborted) return;
      this.onAgentStateChange('agent-response', 'COMPLETED', responseResult.output);

      // STEP 3 Response: Agent 3 -> Coordinator
      this.log(
        'Agent 3 (Response Agent)',
        'Central Coordinator',
        'RESPONSE',
        `Directives synthesized: ${responseResult.output.finalStatus}`,
        responseResult.output
      );
      this.onPacketTransfer({ from: 'agent-response', to: 'coordinator', type: 'RESPONSE' });
      await new Promise(r => setTimeout(r, transitDelay));
      if (this.isAborted) return;

      // ==============================================
      // STEP 4: Coordinator -> User (Final Delivery)
      // ==============================================
      this.onCoordinatorStateChange('COMPLETED');
      this.log(
        'Central Coordinator',
        'User',
        'FINAL_RESPONSE',
        `Simulation concluded. ${responseResult.output.executiveDecision}`,
        {
          telemetrySummary: dataResult.output.summary,
          riskAssessment: analysisResult.output.diagnosticSummary,
          finalDecision: responseResult.output.executiveDecision,
          actionDirectives: responseResult.output.actionDirectives,
          alertRequired: responseResult.output.alertRequired,
          alertLevel: responseResult.output.alertLevel
        }
      );
      this.onPacketTransfer({ from: 'coordinator', to: 'user', type: 'FINAL_RESPONSE' });

      this.onComplete({
        dataResult: dataResult.output,
        analysisResult: analysisResult.output,
        responseResult: responseResult.output
      });

    } catch (err) {
      this.onCoordinatorStateChange('ERROR');
      this.log('Central Coordinator', 'User', 'ERROR', `Error executing workflow: ${err.message}`, null, 'ERROR');
    } finally {
      this.isRunning = false;
    }
  }
}
