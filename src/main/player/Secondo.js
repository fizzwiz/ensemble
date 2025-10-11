import { Solo } from "../core/Solo.js";

/**
 * Secondo
 * -------
 * A `Solo` that wraps a non-Player event source and forwards its events alike emissions,
 * making it compatible with the `Ensemble` system.
 *
 * This enables integrating third-party or native event emitters (e.g., WebSocket, DOM elements, etc.)
 * into the Ensemble-based cueing and propagation framework.
 * 
 * The Solo inherited capabilities allow to easily defines cues and ostinatos upon the 
 */
export class Secondo extends Solo {
  /**
   * Constructs a Secondo instance.
   *
   * @param {*} primo - The original event emitter to adapt.
   * @param {Object} [opts = {}] - Optional configuration properties
   */
  constructor(primo, opts = {}) {
    super();
    this.primo = primo;
    this.opts = { ...opts };
  }
}
