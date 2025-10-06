import { Ensemble } from './Ensemble.js';
import { Cue } from "../player/Cue.js";
import { Ostinato } from "../player/Ostinato.js";

/**
 * Solo 🎭
 * -----
 * A `Solo` is a self-contained, modular unit of reactive logic.
 *
 * Like a solo performer on stage, it listens to events from other players
 * and reacts accordingly. Internally, it manages:
 * - Cues: reactive listeners to events
 * - Ostinatos: repeating, infinite or finite tasks
 *
 * `play()` and `pause()` start or stop all internal players.
 * The source emitters are **unaffected**; only the internal tasks are toggled.
 */
export class Solo extends Ensemble {

  /**
   * @param {string} [name] Optional name if this Solo is added to a parent Ensemble
   */
  constructor(name) {
    super();
    if (name) this.name = name;

    // Internal ensembles for cues and ostinatos
    this.add('cues', new Ensemble())
        .add('ostinatos', new Ensemble());
  }

  /** @type {Ensemble<Cue>} Internal collection of Cues */
  get cues() {
    return this.get('cues');
  }

  /** @type {Ensemble<Ostinato>} Internal collection of Ostinatos */
  get ostinatos() {
    return this.get('ostinatos');
  }

  /**
   * Adds a new Cue to this Solo.
   *
   * @param {string} cueName Name of the Cue
   * @param {EventEmitter} srcEmitter Source emitter
   * @param {string} srcEventName Event name
   * @param {Function} listener Listener callback
   * @param {object} [opts] Optional options for the Cue
   * @returns {this}
   */
  cue(cueName, srcEmitter, srcEventName, listener, opts) {
    this.cues.add(cueName, new Cue(srcEmitter, srcEventName, listener, opts));
    return this;
  }

  /**
   * Adds a repeating task (Ostinato) to this Solo.
   *
   * @param {string} name Name of the Ostinato
   * @param {Function} refrain Task function to repeat
   * @param {number} [nTimes=Infinity] Number of repetitions
   * @param {number} [baseDelay=100] Base delay in milliseconds
   * @param {number} [factor=1] Scaling factor for dynamic delays
   * @param {number} [maxDelay=Infinity] Maximum delay
   * @returns {this}
   */
  ostinato(name, refrain, nTimes = Infinity, baseDelay = 100, factor = 1, maxDelay = Infinity) {
    this.ostinatos.add(name, new Ostinato(refrain, nTimes, baseDelay, factor, maxDelay));
    return this;
  }
}
