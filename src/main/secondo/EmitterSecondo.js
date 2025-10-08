import { Secondo } from '../player/Secondo.js';
import { Cue } from '../player/Cue.js';

/**
 * EmitterSecondo 🎶
 * ----------------
 * A specialized `Secondo` that adapts external event sources —
 * either a DOM `EventTarget` or a Node.js-style `EventEmitter` —
 * into the Ensemble system.
 *
 * Responsibilities:
 * - Attaches to an external emitter and listens for configured events.
 * - Re-emits incoming events to the Ensemble hierarchy.
 * - Appends itself as the last argument to propagated events, allowing
 *   listeners to access both the `EmitterSecondo` and the underlying emitter.
 *
 * Example usage:
 * ```js
 * const button = document.querySelector('button');
 * const buttonSecondo = new EmitterSecondo(button, ['click']);
 *
 * buttonSecondo.on('click', (event, secondo) => {
 *   console.log('Clicked element:', secondo.primo);
 * });
 *
 * buttonSecondo.play();
 * ```
 */
export class EmitterSecondo extends Secondo {
  /** Names of events to listen to on the emitter @type {string[]} */
  events;

  /** Immutable collection of internal Cue instances @type {Cue[]} */
  _cues;

  /**
   * @param {EventTarget|EventEmitter} emitter - The source of events.
   * @param {string[]} events - List of event names to listen for.
   * @param {object} [opts={}] - Optional configuration for Cue listeners.
   */
  constructor(emitter, events, opts = {}) {
    super(emitter, opts);

    this.events = [...events]

    // Pre-create Cue instances bound to propagate, immutable for safety
    this._cues = Object.freeze(
      events.map(event => new Cue(emitter, event, this.propagate.bind(this, event), this.opts))
    );

  }

  /**
   * Read-only access to internal Cue instances.
   * @returns {Cue[]}
   */
  get cues() {
    return this._cues;
  }

  /**
   * Starts listening to all configured events.
   * Safe to call multiple times.
   * @returns {this}
   */
  play() {
    if (this.playing) return this;
    this.cues.forEach(cue => cue.play());
    super.play();
    return this;
  }

  /**
   * Stops listening to all configured events.
   * Safe to call multiple times.
   * @returns {this}
   */
  pause() {
    if (!this.playing) return this;

    this.cues.forEach(cue => cue.pause());
    super.pause();
    return this;
  }

  /**
   * Propagates an event to the Ensemble hierarchy.
   * Appends this `EmitterSecondo` as the last argument for reference.
   *
   * @param {string} event - Event name.
   * @param {...any} args - Arguments from the source event.
   * @returns {this}
   */
  propagate(event, ...args) {
    this.emit(event, ...args, this);
    return this;
  }
}

