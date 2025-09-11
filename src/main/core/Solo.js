import { Cue } from "./Cue.js";
import { Player } from "./Player.js";
import { Ensemble } from './Ensemble.js';

/**
 * Solo
 * ----
 * A `Solo` is a self-contained, modular unit of reactive logic.
 *
 * Like a solo performer on stage, it listens to events from other players
 * and reacts accordingly. Internally, it manages a collection of `Cue` instances
 * through an `Ensemble`. A Solo may also maintain internal state and emit custom
 * events to represent state transitions.
 *
 * ### Key Concepts:
 * - `cue(...)` creates a `Cue` that listens to a source emitter and reacts.
 * - All cues are stored in the internal `cues` ensemble.
 * - `play()` and `pause()` start or stop all internal cues.
 *
 * The source emitters are **unaffected** by play/pause; only the cue listeners are toggled.
 */

export class Solo extends Player {

  /** 
   * Internal collection of cues 
   * @type {Ensemble} 
   */
  cues;

  /**
   * @param {Ensemble} cues - A container (e.g., Ensemble) managing the Cue instances
   */
  constructor(cues = new Ensemble()) {
    super();
    this.cues = cues;
  }

  /**
   * Adds a new Cue to the Solo.
   *
   * @param {EventEmitter} srcEmitter - The source emitter to listen on.
   * @param {string} srcEventName - The event name to listen for.
   * @param {function(...args) : any} listener - The listener reacting to the event.
   * @param {string} [cueName] - Optional name for the Cue; auto-generated if omitted.
   */
  cue(srcEmitter, srcEventName, listener, opts, cueName = this.cues.uniqueName()) {
    this.cues.add(new Cue(srcEmitter, srcEventName, listener, opts), cueName);
  }

  /**
   * Starts all internal cues (listeners).
   * @returns {this}
   */
  play() {
    this.cues.play();
    return this;
  }

  /**
   * Stops all internal cues (listeners).
   * @returns {this}
   */
  pause() {
    this.cues.pause();
    return this;
  }
}
