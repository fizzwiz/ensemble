import { Player } from "../core/Player.js";

/**
 * Ticket 🎟️
 * 
 * A Player with a limited lifetime (e.g. an OTP).  
 * Once its lifetime expires, it pauses itself automatically and optionally removes itself from its ensemble.
 */
export class Ticket extends Player {
  
  /** Expiration timestamp in milliseconds */
  endTime;

  /** Whether to remove from ensemble upon expiration */
  exit;

  /** Timeout ID for automatic expiration */
  timeout;

  /**
   * @param {number} [endTime] Expiration timestamp
   * @param {boolean} [exit=true] Remove from ensemble when expired
   */
  constructor(endTime, exit = true) {
    super();
    this.endTime = endTime;
    this.exit = exit;
    this.timeout = undefined;
  }

  /**
   * Extend the remaining lifetime of this Ticket.
   * @param {number} ttl Time to live in milliseconds
   * @returns {this}
   */
  ttl(ttl) {
    this.endTime = Date.now() + ttl;
    return this;
  }

  /**
   * Remaining lifetime in milliseconds
   * @returns {number}
   */
  get ttl() {
    return Math.max(0, this.endTime - Date.now());
  }

  /**
   * Start the Ticket and schedule automatic expiration
   * @returns {this}
   */
  play() {
    if (!this.playing) {
      const delay = Math.max(0, this.endTime - Date.now());
      this.timeout = setTimeout(() => this.handleExpiration(), delay);
      super.play();
    }
    return this;
  }

  /**
   * Handle automatic expiration of the Ticket
   */
  handleExpiration() {
    this.emit('ticket-expired', this);
    this.pause();
    if (this.exit) this.ensemble?.remove(this.name);
  }

  /**
   * Pause the Ticket and cancel automatic expiration
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
}
