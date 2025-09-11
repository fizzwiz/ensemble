import { Player } from "../core/Player.js";

/**
 * TicketPlayer 🎟️
 * 
 * A Player with a limited lifetime. 
 * Once its ticket expires, it pauses itself automatically.
 */
export class TicketPlayer extends Player {
  
  endTime;
  remove;
  timeout;

  constructor(remove=true, endtime=undefined) {
    super();
    this.endTime = endtime;
    this.remove = remove;
    this.timeout = undefined;
  }

/**
 * Extend the remaining lifetime of this TicketPlayer by a given TTL.
 *
 * @param {number} ttl - Time to live in milliseconds.
 * @returns {this} Returns the instance for chaining.
 */
 ttl(ttl) {
    this.endTime = Date.now() + ttl;
    return this;
  }
  

  get ttl() {
    return Math.max(0, this.endTime - Date.now());
  }

  isValid() {
    return this.endTime > Date.now();
  }
  
  play() {
    if (!this.playing) {
      const delay = Math.max(0, this.endTime - Date.now());
      this.timeout = setTimeout(() => this.handleTimeout(), delay);
      super.play();
    }
    return this;
  }

  handleTimeout() {
    this.emit('ticket-expired', this);    
    this.pause();
    if (this.remove) this.ensemble?.remove(this.name);
  }

  pause() {
    if (this.playing) {
      clearTimeout(this.timeout);
      this.timeout = undefined;
      super.pause();
    }
    return this;
  }
}
