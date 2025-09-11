import { EventEmitter } from 'events';
import { Event } from './Event.js';

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
	
		this.emit(new PropertyChangeEvent(this, name, oldValue, value));
	
		return this;
	}  
  
	/**
	 * Emits an event from this Player and bubbles it up to the Ensemble, if present.
	 *
	 * The event is wrapped in a custom `Event` object containing the emitter, type,
	 * arguments, and (if propagated) the source event. When part of an ensemble,
	 * the ensemble receives a new propagated Event referencing the original.
	 *
	 * @param {string | symbol} event - The event type.
	 * @param {...any} args - Arguments to include in the event.
	 * @returns {Player} This player (for chaining).
	 */
	emit(event, ...args) {
		const srcEvent = new Event(this, event, args);
		super.emit(event, srcEvent);		
	
		if (this.ensemble) {
			const bubbled = new Event(this.ensemble, event, [], srcEvent);
			this.ensemble.emit(event, bubbled);
		}
	
		return this;
	}
  
}


export class PropertyChangeEvent extends Event {
  
	constructor(emitter, propertyName, oldValue, newValue) {
	  super(emitter, 'propertychange', [propertyName, oldValue, newValue]);
	}
  
	get propertyName() {
	  return this.args[0];
	}
  
	get oldValue() {
	  return this.args[1];
  
	}
  
	get newValue() {
	  return this.args[2];
	  
	}
  }
  
  
  
