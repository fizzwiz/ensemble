import { Secondo } from "../player/Secondo.js";

/**
 * Abstract base class for all DOM observer Secondos.
 * Converts low-level observer callbacks into Ensemble events.
 *
 * Responsibilities:
 * - Holds one or more observed DOM nodes.
 * - Provides lifecycle methods to play/pause observation.
 * - Delegates concrete observer instantiation to subclasses.
 */
export class ObserverSecondo extends Secondo {
  /**
   * @param {Node|Node[]} observed - Single or multiple DOM nodes to observe.
   * @param {object} [opts={}] - Options passed to the observer (ignored by some observers).
   */
  constructor(observed, opts = {}) {
    super(undefined, opts);

    /** @type {Node[]} */
    this.observed = Array.isArray(observed) ? observed : [observed];

    /** @type {MutationObserver|IntersectionObserver|ResizeObserver|null} */
    this.primo = null;
  }

  /**
   * Returns the underlying observer instance.
   * @returns {MutationObserver|IntersectionObserver|ResizeObserver|null}
   */
  get observer() {
    return this.primo;
  }

  /**
   * Abstract method to instantiate the concrete observer.
   * Must assign the observer to `this.primo`.
   * @abstract
   * @throws {Error} if not implemented by subclass.
   */
  instantiateObserver() {
    throw new Error("instantiateObserver() must be implemented by subclass");
  }

  /**
   * Connects the observer to all target nodes.
   */
  connectObserver() {
    if (!this.primo) return;
    this.observed.forEach(node => this.primo.observe?.(node, this.opts)); // some observers may ignore the opts arguments here
  }

  /**
   * Disconnects the observer from all target nodes.
   */
  disconnectObserver() {
    if (!this.primo) return;
    this.primo.disconnect?.();
    this.observed.forEach(node => this.primo.unobserve?.(node));
  }

  /**
   * Starts the observation process.
   * Instantiates the observer if not yet created.
   * @throws {Error} if no target nodes are defined.
   */
  play() {
    if (!this.observed.length) throw new Error("No target nodes specified");
    if (!this.observer) this.instantiateObserver();
    this.connectObserver();
    super.play();
    return this;
  }

  /**
   * Stops the observation process.
   */
  pause() {
    this.disconnectObserver();
    super.pause();
    return this;
  }
}

/**
 * ObserverSecondo for MutationObserver.
 * Emits a "mutation" event for each MutationRecord.
 */
export class MutationObserverSecondo extends ObserverSecondo {
  instantiateObserver() {
    this.primo = new MutationObserver((mutations) => {
      mutations.forEach(mutation => this.emit("mutation", mutation));
    });
  }
}

/**
 * ObserverSecondo for IntersectionObserver.
 * Emits an "intersection" event for each IntersectionObserverEntry.
 */
export class IntersectionObserverSecondo extends ObserverSecondo {
  /**
   * @param {Node|Node[]} observed - DOM nodes to observe.
   * @param {IntersectionObserverInit} opts - IntersectionObserver options.
   */
  constructor(observed, opts = {}) {
    super(observed, opts);
  }

  instantiateObserver() {
    this.primo = new IntersectionObserver((entries) => {
      entries.forEach(entry => this.emit("intersection", entry));
    }, this.opts);
  }
}

/**
 * ObserverSecondo for ResizeObserver.
 * Emits a "resize" event for each ResizeObserverEntry.
 */
export class ResizeObserverSecondo extends ObserverSecondo {
  instantiateObserver() {
    this.primo = new ResizeObserver((entries) => {
      entries.forEach(entry => this.emit("resize", entry));
    });
  }
}
