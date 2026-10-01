import { DataAgent } from '../agents/DataAgent';
import { AnalysisAgent } from '../agents/AnalysisAgent';
import { ResponseAgent } from '../agents/ResponseAgent';

/**
 * Pipeline Orchestrator (Sequential / Pipeline Architecture)
 * 
 * In this architecture, there is NO central coordinator.
 * Communication flows strictly in a linear pipeline:
 * User -> Agent 1 -> Agent 2 -> Agent 3 -> Final Response (User)
 * 
 * Each agent receives output directly from the preceding agent and sends its output directly to the next.
 */
export class Pipeline {
  constructor(callbacks = {}, options = {}) {
    this.speedMultiplier = options.speedMultiplier || 1.0;
    this.onLogMessage = callbacks.onLogMessage || (() => {});
    this.onAgentStateChange = callbacks.onAgentStateChange || (() => {});
    this.onPacketTransfer = callbacks.onPacketTransfer || (() => {});
    this.onComplete = callbacks.onComplete || (() => {});

    const baseDelay = Math.round(1400 / this.speedMultiplier);
    this.agent1 = new DataAgent({ delay: baseDelay });
    this.agent2 = new AnalysisAgent({ delay: baseDelay });
    this.agent3 = new ResponseAgent({ delay: baseDelay });

    this.isRunning = false;
    this.isAborted = false;
  }

  setSpeed(multiplier) {
    this.speedMultiplier = multiplier;
    const baseDelay = Math.round(1400 / this.speedMultiplier);
    this.agent1.delay = baseDelay;
    this.agent2.delay = baseDelay;
    this.agent3.delay = baseDelay;
  }

  abort() {
    this.isAborted = true;
    this.isRunning = false;
  }

  getTimestamp() {
    const now = new Date();
    return now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
  }

  log(sender, receiver, type, message, payload = null, status = 'COMPLETED') {
    const logEntry = {
      id: 'pipe-msg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
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
   * Execute the linear pipeline
   * @param {Object} input - { task, temperature, pressure, humidity }
   */
  async execute(input) {
    if (this.isRunning) return;
    this.isRunning = true;
    this.isAborted = false;

    const transitDelay = Math.round(700 / this.speedMultiplier);

    try {
      // Step 1: User sends initial request directly to Agent 1 (Data Agent)
      this.log(
        'User',
        'Agent 1 (Data Agent)',
        'PIPELINE_INIT',
        `User dispatched task directly to Pipeline Stage 1: "${input.task}"`,
        input
      );
      this.onPacketTransfer({ from: 'user', to: 'agent-data', type: 'PIPELINE_INIT' });
      this.onAgentStateChange('agent-data', 'PROCESSING', null);
      await new Promise(r => setTimeout(r, transitDelay));
      if (this.isAborted) return;

      // Agent 1 executes
      const stage1Output = await this.agent1.process(input);
      if (this.isAborted) return;
      this.onAgentStateChange('agent-data', 'COMPLETED', stage1Output.data);

      // Step 2: Agent 1 hands off DIRECTLY to Agent 2 (Analysis Agent)
      this.log(
        'Agent 1 (Data Agent)',
        'Agent 2 (Analysis Agent)',
        'PIPELINE_HANDOFF',
        `Stage 1 complete. Direct pipeline handoff of parsed telemetry to Stage 2: ${stage1Output.data.summary}`,
        stage1Output.data
      );
      this.onPacketTransfer({ from: 'agent-data', to: 'agent-analysis', type: 'PIPELINE_HANDOFF' });
      this.onAgentStateChange('agent-analysis', 'PROCESSING', null);
      await new Promise(r => setTimeout(r, transitDelay));
      if (this.isAborted) return;

      // Agent 2 executes
      const stage2Output = await this.agent2.process(stage1Output);
      if (this.isAborted) return;
      this.onAgentStateChange('agent-analysis', 'COMPLETED', stage2Output.data);

      // Step 3: Agent 2 hands off DIRECTLY to Agent 3 (Response Agent)
      this.log(
        'Agent 2 (Analysis Agent)',
        'Agent 3 (Response Agent)',
        'PIPELINE_HANDOFF',
        `Stage 2 complete. Direct pipeline handoff of diagnostic findings to Stage 3: ${stage2Output.data.diagnosticSummary}`,
        stage2Output.data
      );
      this.onPacketTransfer({ from: 'agent-analysis', to: 'agent-response', type: 'PIPELINE_HANDOFF' });
      this.onAgentStateChange('agent-response', 'PROCESSING', null);
      await new Promise(r => setTimeout(r, transitDelay));
      if (this.isAborted) return;

      // Agent 3 executes
      const stage3Output = await this.agent3.process(stage2Output);
      if (this.isAborted) return;
      this.onAgentStateChange('agent-response', 'COMPLETED', stage3Output.data);

      // Step 4: Agent 3 returns final response directly to User
      this.log(
        'Agent 3 (Response Agent)',
        'User',
        'FINAL_RESPONSE',
        `Pipeline complete. Delivering finalized operational directive directly to User: ${stage3Output.data.executiveDecision}`,
        stage3Output.data
      );
      this.onPacketTransfer({ from: 'agent-response', to: 'user', type: 'FINAL_RESPONSE' });

      this.onComplete({
        stage1: stage1Output.data,
        stage2: stage2Output.data,
        stage3: stage3Output.data
      });

    } catch (err) {
      this.log('Pipeline', 'User', 'ERROR', `Pipeline execution failed: ${err.message}`, null, 'ERROR');
    } finally {
      this.isRunning = false;
    }
  }
}
