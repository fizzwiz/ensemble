import { Player } from "../core/Player.js";
import { AsyncWhat } from "@fizzwiz/fluent";

/**
 * Ostinato 🎵
 *
 * A Player that performs a repeating action indefinitely (or a fixed number of times).
 * 
 * Musically, an *ostinato* is a short phrase or rhythm that is persistently repeated.
 * In this class, the repeated task is represented by a periodic `AsyncWhat`
 * that can be started or stopped via `play()` and `pause()`.
 * 
 * Complements `Finale`, which represents a finite-duration performance.
 */
export class Ostinato extends Player {

  /**
   * The repeating asynchronous task managed by AsyncWhat.
   * @type {AsyncWhat}
   * @private
   */
  _what;

  /**
   * @param {Function} refrain - The asynchronous or synchronous task to repeat.
   * @param {number} [nTimes=Infinity] - Number of repetitions (default infinite).
   * @param {number} [baseDelay=100] - Base delay in ms between repetitions.
   * @param {number} [factor=2] - Multiplicative factor to scale the delay dynamically.
   * @param {number} [maxDelay=Infinity] - Maximum delay (ms) between repetitions.
   */
  constructor(refrain, nTimes = Infinity, baseDelay = 100, factor = 2, maxDelay = Infinity) {
    super();

    if (typeof refrain !== "function") {
      throw new TypeError("Ostinato requires a function as the refrain.");
    }

    // Build the stoppable, repeating AsyncWhat chain
    this._what = AsyncWhat.as(refrain).self(nTimes, baseDelay, factor, maxDelay);
  }

  /**
   * Begin repeating the refrain.
   * If already playing, restarts the repetition loop.
   * @returns {this}
   */
  play() {
    if (this._what?.stopped) this._what.stopped = false;
    this._what?.();
    super.play();
    return this;
  }

  /**
   * Stop the repetition (pause indefinitely).
   * @returns {this}
   */
  pause() {
    if (this._what) this._what.stopped = true;
    super.pause();
    return this;
  }
}
