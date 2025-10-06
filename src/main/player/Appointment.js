import { Player } from "../core/Player.js";

/**
 * Appointment 📅
 * 
 * A scheduled Player that emits a specified event at a given time.
 * Once triggered, it pauses itself and removes itself from its ensemble.
 */
export class Appointment extends Player {

  /**
   * @param {number} time - Timestamp in milliseconds when the appointment should fire
   * @param {string} eventName - Event name to emit on trigger
   * @param {any} [payload] - Optional payload for the emitted event
   */
  constructor(time, eventName, payload = undefined) {
    super();
    this.time = time;
    this.eventName = eventName;
    this.payload = payload;
    this.timeout = undefined;
  }

  /**
   * Remaining time in milliseconds until the appointment fires
   * @returns {number}
   */
  get remaining() {
    return Math.max(0, this.time - Date.now());
  }

  /**
   * Whether the appointment is still pending
   * @returns {boolean}
   */
  isPending() {
    return Date.now() < this.time;
  }

  /**
   * Start the Appointment and schedule its trigger
   * @returns {this}
   */
  play() {
    if (!this.playing && this.isPending()) {
      this.timeout = setTimeout(() => this.fire(), this.remaining);
      super.play();
    }
    return this;
  }

  /**
   * Cancel the Appointment if it hasn't fired yet
   * @returns {this}
   */
  pause() {
    if (this.playing) {
      clearTimeout(this.timeout);
      this.timeout = undefined;
      super.pause();
    }
    return this;
  }

  /**
   * Trigger the appointment event
   */
  fire() {
    this.emit(this.eventName, this.payload ?? this);
    this.pause();
    this.ensemble?.remove(this.name);
  }
}
