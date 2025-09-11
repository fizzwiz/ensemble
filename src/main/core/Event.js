/**
 * Event
 * -------------
 * A unified event object used by Players and Ensembles.
 * Encapsulates:
 * - the emitter (a Player instance)
 * - the event type
 * - a reference to the original event (for propagation)
 */
export class Event {
  /**
   * @param {*} emitter - The player emitting this event.
   * @param {string} type - The event type.
   * @param {Array<*>} args - Arguments passed with the event.
   * @param {Event|null} [sourceEvent=undefined] - Optional original event (for propagation).
   */
  constructor(emitter, type, args = [], sourceEvent = undefined) {
    /** @type {*} */
    this.emitter = emitter;

    /** @type {string} */
    this.type = type;

    /** @type {Array<*>} */
    this.args = Array.isArray(args) ? args : [args];

    /** @type {Event|null} */
    this.source = sourceEvent;

    /** @type {number} */
    this.timestamp = Date.now();
  }

    /**
     * Returns true if this event or any of its source events was emitted by the given emitter.
     * @param {Player | Ensemble} emitter
     * @returns {boolean}
     */
    wasEmittedBy(emitter) {
        return this.emitter === emitter || this.source?.wasEmittedBy(emitter);
    }

    /**
     * Returns the chain of emitters that have propagated this event,
     * from the original source to the current emitter.
     * @returns {Array<Player>} ordered list of emitters
     */
    get propagationPath() {
        const path = [];
        let event = this;
        while (event) {
        path.unshift(event.emitter);
        event = event.source;
        }
        return path;
    }  

    /**
     * Returns the original event in the propagation chain.
     * @returns {Event}
     */
    get origin() {
        return this.source?.origin ?? this;
    }  
      
}
