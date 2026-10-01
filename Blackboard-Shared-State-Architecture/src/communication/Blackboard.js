/**
 * Shared Blackboard Store (Blackboard / Shared-State Architecture)
 * 
 * Manages the central passive shared memory where all agents read facts and write conclusions.
 * Agents do not talk to each other; they mutate and observe this shared blackboard state.
 */
export class Blackboard {
  constructor(callbacks = {}) {
    this.onStateChange = callbacks.onStateChange || (() => {});
    this.onLogMessage = callbacks.onLogMessage || (() => {});
    this.onPacketTransfer = callbacks.onPacketTransfer || (() => {});

    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      task: '',
      sensorData: null,
      agent1Output: null,
      agent2Output: null,
      agent3Output: null,
      intermediateResults: [],
      agentStatus: {
        agent1: 'WAITING',
        agent2: 'WAITING',
        agent3: 'WAITING'
      },
      finalResult: null,
      revision: 0,
      lastUpdatedBy: 'System'
    };
  }

  getTimestamp() {
    const now = new Date();
    return now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
  }

  getState() {
    return { ...this.state };
  }

  reset() {
    this.state = this.getInitialState();
    this.notify();
  }

  log(sender, receiver, type, message, payload = null, status = 'COMPLETED') {
    const logEntry = {
      id: 'bb-msg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
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
   * Write data to a key on the blackboard
   * @param {string} key - property name
   * @param {*} value - payload value
   * @param {string} actor - agent or user performing the write
   */
  write(key, value, actor = 'System') {
    this.state[key] = value;
    this.state.revision += 1;
    this.state.lastUpdatedBy = actor;

    this.log(
      actor,
      'Blackboard',
      'WRITE_STATE',
      `[Rev #${this.state.revision}] ${actor} committed update to '${key}'`,
      value
    );

    this.onPacketTransfer({ from: actor, to: 'blackboard', type: 'WRITE_STATE', key });
    this.notify();
  }

  /**
   * Set status of a specific agent
   */
  updateAgentStatus(agentKey, status, actor = null) {
    this.state.agentStatus = {
      ...this.state.agentStatus,
      [agentKey]: status
    };
    this.state.revision += 1;
    this.notify();
  }

  /**
   * Append an intermediate result to the shared solution workspace
   */
  appendIntermediateResult(result, actor) {
    this.state.intermediateResults = [
      ...this.state.intermediateResults,
      {
        revision: this.state.revision + 1,
        actor,
        timestamp: this.getTimestamp(),
        data: result
      }
    ];
  }

  notify() {
    this.onStateChange({ ...this.state });
  }
}
