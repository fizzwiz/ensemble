import { EventEmitter } from 'events';

/**
 * Base class for all participants in an Ensemble.
 *
 * A `Player` represents a live, asynchronous actor that can be started and stopped
 * via `play()` and `pause()`. It participates in an `Ensemble`, emits property change
 * events, and is designed for dynamic composition and coordination.
 *
 * Subclasses must implement `play()` and `pause()`. The base implementation just set playing = true/false;
 *
 * @abstract
 * @emits Player#propertyChanging
 * @emits Player#propertyChanged
 * 
 */
export class Player extends EventEmitter {
	playing;
	name;
	ensemble;
	
	constructor(name) {
		super();
		this.playing = false;
		this.name = name;
		this.ensemble = undefined;
	}

	/**
	 * Simply sets `this.playing = true` when activated.
	 * Subclasses must implement their own logic.
	 */
	play() {
		this.playing = true;
		return this;
	}

	pause() {
		this.playing = false;
		return this;
	}

	/**
	 * Updates a public property and emits `propertyChanging` and `propertyChanged` events.
	 *
	 * This method is intended for use with public fields only.
	 * It compares the current value to the new value, and if different:
	 * - Emits a `propertyChanging` event with the old and new values.
	 * - Sets the new value.
	 * - Emits a `propertyChanged` event with the old and new values.
	 *
	 * @param {string} name - The name of the property to update.
	 * @param {*} value - The new value to assign to the property.
	 * @returns {this} - Returns the instance for chaining.
	 *
	 * @fires PropertyChangeEvent
	 */
	let(name, value) {
		const oldValue = this[name];
		if (oldValue === value) return this;
	
		this[name] = value;
	
		this.emit('propertyChanged', name, oldValue, value);
	
		return this;
	}  
  
	/**
	 * Emits an event from this Player and bubbles it up to the Ensemble, if present.
	 *
	 * @param {string | symbol} event - The event type.
	 * @param {...any} args - Arguments to include in the event.
	 * @returns {Player} This player (for chaining).
	 */
	emit(event, ...args) {
		super.emit(event, ...args);		
	
		this.ensemble?.emit(event, ...args);
	
		return this;
	}

  /**
   * Emits an event and logs it to the console in a structured, readable way.
   *
   * - Logs the event name, timestamp, and all arguments.
   * - Objects are logged directly (not stringified), preserving their structure.
   * - Errors are clearly shown in the log output.
   *
   * @param {string} event - The event name (e.g., "info", "error", "state").
   * @param {...any} args - Arguments to log and emit with the event.
   *
   * @example
   * this.notify("info", "Connected successfully");
   * this.notify("error", new Error("Connection failed"));
   * this.notify("state", { id: "sprite42", vibes: 5 });
   */
  notify(event, ...args) {
    const tag = `[${this.constructor.name}]`;
    const time = new Date().toISOString();

    console.log(`${time} ${tag} ${event}:`, ...args);

    this.emit(event, ...args);
  }

	  
  
}

  
