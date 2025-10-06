import { Ensemble } from './Ensemble.js';
import { Cue } from "../player/Cue.js";
import { Ostinato } from "../player/Ostinato.js";
import { Ticket } from '../player/Ticket.js';

/**
 * Solo 🎭
 * -----
 * A `Solo` is a self-contained, modular unit of reactive logic.
 *
 * It aggregates three types of internal players:
 * - **Cues**: reactive listeners to external events
 * - **Ostinatos**: repeating, infinite or finite tasks
 * - **Tickets**: time-limited objects affecting the behavior (e.g. OTPs)
 *
 * Calling `play()` or `pause()` on a Solo toggles all its internal players.
 * External source emitters are unaffected; only the internal players are controlled.
 */
export class Solo extends Ensemble {

  /**
   * Creates a new Solo instance.
   *
   * Initializes three internal ensembles to manage:
   * - `cues`: reactive event listeners
   * - `ostinatos`: repeating tasks
   * - `tickets`: time-limited objects
   *
   * These internal ensembles are automatically managed by `play()` and `pause()`.
   */
  constructor() {
    super();

    // Internal ensembles for cues, ostinatos, and tickets
    this.add('cues', new Ensemble())
        .add('ostinatos', new Ensemble())
        .add('tickets', new Ensemble());
  }

  /** @type {Ensemble<Cue>} Internal collection of Cues */
  get cues() {
    return this.get('cues');
  }

  /** @type {Ensemble<Ostinato>} Internal collection of Ostinatos */
  get ostinatos() {
    return this.get('ostinatos');
  }

  /** @type {Ensemble<Ticket>} Internal collection of Tickets */
  get tickets() {
    return this.get('tickets');
  }

  /**
   * Adds a new Cue to this Solo.
   *
   * @param {string} cueName Name of the Cue
   * @param {EventEmitter} srcEmitter Source emitter to listen on
   * @param {string} srcEventName Event name to listen for
   * @param {Function} listener Callback invoked when the event occurs
   * @param {object} [opts] Optional configuration for the Cue
   * @returns {this} Returns the Solo instance for chaining
   */
  cue(cueName, srcEmitter, srcEventName, listener, opts) {
    this.cues.add(cueName, new Cue(srcEmitter, srcEventName, listener, opts));
    return this;
  }

  /**
   * Adds a repeating task (Ostinato) to this Solo.
   *
   * @param {string} name Name of the Ostinato
   * @param {Function} refrain Function to repeat
   * @param {number} [nTimes=Infinity] Number of repetitions
   * @param {number} [baseDelay=1000] Base delay in milliseconds between repetitions
   * @param {number} [factor=1] Scaling factor for dynamic delays
   * @param {number} [maxDelay=Infinity] Maximum delay allowed
   * @returns {this} Returns the Solo instance for chaining
   */
  ostinato(name, refrain, nTimes = Infinity, baseDelay = 1000, factor = 1, maxDelay = Infinity) {
    this.ostinatos.add(name, new Ostinato(refrain, nTimes, baseDelay, factor, maxDelay));
    return this;
  }

  /**
   * Adds a Ticket (time-limited Player) to this Solo.
   *
   * @param {string} name Name of the Ticket
   * @param {number} endTime Expiration timestamp in milliseconds
   * @param {boolean} [exit=true] Whether to remove the Ticket from the Ensemble upon expiration
   * @returns {this} Returns the Solo instance for chaining
   */
  ticket(name, endTime, exit = true) {
    this.tickets.add(name, new Ticket(endTime, exit));
    return this;
  }
}
