import { Secondo } from '../player/Secondo.js';
import { Cue } from '../player/Cue.js';
import { Event } from '../core/Event.js';

/**
 * EmitterSecondo
 * --------------
 * A specialized `Secondo` that adapts external event sources —
 * either a DOM `EventTarget` (e.g. HTMLElement) or a Node.js-style `EventEmitter` —
 * into the Ensemble system.
 *
 * Responsibilities:
 * - Attaches to an external emitter and listens for configured events.
 * - Maps raw event types and arguments into one or more semantic Ensemble events.
 * - Wraps each emitted event into an `Event` object for uniform handling.
 *
 * Example usage:
 * ```js
 * const button = document.querySelector("button");
 * const buttonSecondo = new EmitterSecondo(button, ["click"]);
 *
 * buttonSecondo.on("click", (evt) => {
 *   console.log("Button clicked:", evt);
 * });
 *
 * buttonSecondo.play(); // starts listening
 * ```
 */
export class EmitterSecondo extends Secondo {
  /**
   * The list of event names to listen to from the underlying emitter.
   * @type {string[]}
   */
  events;

  /**
   * Function mapping a raw event type (and optional args) into one or more semantic event names.
   * This allows splitting or remapping generic events (e.g. `"message"`) into multiple cues
   * (e.g. `["chat", "system"]`).
   *
   * @type {function(string, ...*): string[]}
   */
  subTypeMapper;

  /**
   * Bound event handler references for each configured event.
   * Used for add/remove listener symmetry.
   *
   * @type {Function[]}
   * @private
   */
  _eventHandlers;

  /**
   * Extra options passed to `Cue.addListener` / `Cue.removeListener`.
   * @type {object}
   * @private
   */
  _opts;

  /**
   * @param {EventTarget|EventEmitter} emitter - The event source.
   * @param {string[]} events - The list of event names to listen to.
   * @param {function(string, ...args) : string[]} [mapEventToSubtypes] - Optional mapper function to derive sub-event names.
   * @param {object} [opts={}] - Extra options for attaching/removing listeners.
   */
  constructor(emitter, events, mapEventToSubtypes = (type, ...args) => [type], opts = {}) {
    super(emitter);

    this.events = events;
    this.subTypeMapper = mapEventToSubtypes;
    this._opts = opts;

    // Pre-bind handlers for proper attach/detach symmetry
    this._eventHandlers = events.map(event =>
      this.propagate.bind(this, event)
    );
  }

  /**
   * Starts listening to the configured events on the emitter.
   * Enables this Secondo to participate in cue propagation.
   */
  play() {
    let i = 0;
    for (const event of this.events) {
      Cue.addListener(this.primo, event, this._eventHandlers[i++], this._opts);
    }
    this.playing = true;
  }

  /**
   * Stops listening to the configured events on the emitter.
   * Safe to call multiple times.
   */
  pause() {
    let i = 0;
    for (const event of this.events) {
      Cue.removeListener(this.primo, event, this._eventHandlers[i++], this._opts);
    }
    this.playing = false;
  }

  /**
   * Propagates an incoming raw event by mapping it into one or more semantic Ensemble events.
   *
   * Each mapped sub-event is re-emitted from this Secondo as an `Event` instance,
   * preserving the original event and its arguments.
   *
   * @param {string} srcEventName - The raw source event name.
   * @param {...any} args - Arguments accompanying the source event.
   * @returns {this}
   */
  propagate(srcEventName, ...args) {
    const subEvents = this.subTypeMapper(srcEventName, ...args);
    const srcEvent = new Event(this.primo, srcEventName, args);

    for (const eventName of subEvents) {
      const wrapped = new Event(this, eventName, [], srcEvent);
      this.emit(eventName, wrapped);
    }

    return this;
  }
}
