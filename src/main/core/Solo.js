import { Ensemble } from './Ensemble.js';
import { Cue } from "../player/Cue.js";
import { Ostinato } from "../player/Ostinato.js";
import { Appointment } from '../player/Appointment.js';

/**
 * Solo 🎭
 * -----
 * A `Solo` is a self-contained, modular unit of reactive logic.
 *
 * It aggregates three types of internal players:
 * - **Cues**: reactive listeners to external events
 * - **Ostinatos**: repeating, infinite or finite tasks
 * - **Appointments**: scheduled events that fire at specific times
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
   * - `agenda`: scheduled appointments
   *
   * These internal ensembles are automatically managed by `play()` and `pause()`.
   */
  constructor() {
    super();

    // Internal ensembles for cues, ostinatos, and appointments
    this.add('cues', new Ensemble())
        .add('ostinatos', new Ensemble())
        .add('agenda', new Ensemble());
  }

  /** Internal Ensemble of Cues */
  get cues() {
    return this.get('cues');
  }

  /** Internal Ensemble of Ostinatos */
  get ostinatos() {
    return this.get('ostinatos');
  }

  /** Internal Ensemble of Appointments */
  get agenda() {
    return this.get('agenda');
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
   * Adds an Appointment (scheduled event) to this Solo's agenda.
   *
   * @param {string} name Name of the Appointment
   * @param {number} time Timestamp in milliseconds when the appointment should fire
   * @param {string} eventName Event name to emit on trigger
   * @param {any} [payload] Optional payload for the event
   * @returns {this} Returns the Solo instance for chaining
   */
  appointment(name, time, eventName, payload) {
    this.agenda.add(name, new Appointment(time, eventName, payload));
    return this;
  }
}
