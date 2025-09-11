import { Player } from "./Player.js";

/**
 * Cue represents the engagement between an event emitter (e.g., DOM, WebSocket, Node.js EventEmitter)
 * and a listener (e.g., a Performer awaiting a signal).
 * 
 * 🎭 In the theatrical metaphor, a Cue is the moment an action is triggered, and the player (listener)
 * responds. Cues can be played (attached) or paused (detached), just like actors entering or exiting a scene.
 * 
 * 📌 Key Features:
 * - Supports DOM, EventEmitter, WebSocket, and similar event interfaces
 * - Automatically binds the listener's context (`this`) to the Cue instance
 * - Can be composed into larger "Ensembles" of logic (groups of coordinated Players)
 * - 🧠 Simplifies asynchronous event coordination with `.promise(timeoutMillis, predicate)`
 * 
 * 🔗 Hierarchical Context:
 * The bound listener is invoked with `this` set to the Cue instance itself. Since Cue extends Player,
 * it can be part of an **Ensemble** — a structure composed of multiple Players or Cues. This makes the listener:
 * - aware of sibling Cues within the same Ensemble
 * - capable of accessing or modifying shared state
 * - able to delegate behavior across the hierarchy
 * 
 * 🧠 Async Flow Coordination:
 * With a Cue, waiting for an event with a timeout becomes declarative and reusable:
 * ```js
 * const result = await cue.promise(2000);
 * ```
 */
export class Cue extends Player {
  _emitter;
  _event;
  _rawListener;
  _boundListener;
  _opts;
  _attached;

  /**
   * @param {*} emitter - The event source (DOM element, EventEmitter, WebSocket, etc.)
   * @param {string} event - Event name (e.g., 'click', 'message')
   * @param {Function} listener - Listener function (bound automatically to Cue)
   * @param {object} [opts={}] - Optional options for add/remove listener
   */
  constructor(emitter, event, listener, opts = {}) {
    super();

    if (typeof event !== 'string') throw new TypeError("event must be a string");
    if (typeof listener !== 'function') throw new TypeError("listener must be a function");

    this._emitter = emitter;
    this._event = event;
    this._rawListener = listener;
    this._boundListener = listener.bind(this);
    this._opts = opts;
    this._attached = false;
  }

  get emitter() { return this._emitter; }
  get event() { return this._event; }
  get boundListener() { return this._boundListener; }
  get attached() { return this._attached; }
  set attached(value) { this._attached = value; }

  /**
   * Attaches the listener to the emitter, if not already attached.
   */
  play() {
    if (this.attached) return;

    const { emitter, event, boundListener, _opts: opts } = this;
    if (opts.prepend && typeof emitter.prependListener === 'function') {
      emitter.prependListener(event, boundListener);
    } else {
      Cue.addListener(emitter, event, boundListener, opts);
    }

    this.attached = true;
  }

  /**
   * Detaches the listener from the emitter, if attached.
   */
  pause() {
    if (!this.attached) return;

    const { emitter, event, boundListener, _opts: opts } = this;
    Cue.removeListener(emitter, event, boundListener, opts);

    this.attached = false;
  }

  /**
   * Waits for one occurrence of the event, using this._rawListener to transform the args.
   * The result is passed to an optional predicate before resolving.
   *
   * Automatically detaches the listener after resolution or timeout.
   *
   * @param {number} timeoutMillis - Timeout in ms (0 disables timeout).
   * @param {Function} [predicate = result => result] - Optional filter for the processed result.
   * @returns {Promise<*>} Resolves with the processed result.
   */
  promise(timeoutMillis = 1000, predicate = result => undefined !== result) {
    if (typeof timeoutMillis !== 'number' || isNaN(timeoutMillis)) {
      throw new TypeError('timeoutMillis must be a number');
    }

    return new Promise((resolve, reject) => {
      let timeoutId;

      const handler = (...args) => {
        try {
          const result = this._rawListener(...args);
          if (!predicate(result)) return;

          Cue.removeListener(this._emitter, this._event, handler, this._opts);
          clearTimeout(timeoutId);
          resolve(result);
        } catch (err) {
          Cue.removeListener(this._emitter, this._event, handler, this._opts);
          clearTimeout(timeoutId);
          reject(err);
        }
      };

      Cue.addListener(this._emitter, this._event, handler, this._opts);

      if (timeoutMillis > 0) {
        timeoutId = setTimeout(() => {
          Cue.removeListener(this._emitter, this._event, handler, this._opts);
          reject(new Error(`Timeout waiting for event '${this.event}'`));
        }, timeoutMillis);
      }
    });
  }


  /**
   * Adds a listener compatible with DOM or Node-style emitters.
   * Supports `opts.prepend` for Node.js-style emitters.
   * 
   * @param {any} emitter - The target emitter
   * @param {string} event - Event name
   * @param {Function} listener - Listener function
   * @param {Object} [opts={}] - Options object; may include `prepend`
   */
  static addListener(emitter, event, listener, opts = {}) {
    if (typeof emitter.addEventListener === 'function') {
      emitter.addEventListener(event, listener, opts);
    } else if (typeof emitter.prependListener === 'function' && opts.prepend) {
      emitter.prependListener(event, listener);
    } else if (typeof emitter.on === 'function') {
      emitter.on(event, listener);
    } else if (typeof emitter.addListener === 'function') {
      emitter.addListener(event, listener);
    } else {
      throw new Error('Unsupported emitter interface for addListener');
    }
  }

  /**
   * Removes a listener from DOM or Node-style emitters.
   * Options are ignored for Node-style removals.
   * 
   * @param {any} emitter - The target emitter
   * @param {string} event - Event name
   * @param {Function} listener - Listener function
   * @param {Object} [opts={}] - Options object; may include `capture` for DOM
   */
  static removeListener(emitter, event, listener, opts = {}) {
    if (typeof emitter.removeEventListener === 'function') {
      emitter.removeEventListener(event, listener, opts);
    } else if (typeof emitter.off === 'function') {
      emitter.off(event, listener);
    } else if (typeof emitter.removeListener === 'function') {
      emitter.removeListener(event, listener);
    } else {
      throw new Error('Unsupported emitter interface for removeListener');
    }
  }

}
