// Core abstractions
import { Player } from './core/Player.js';
import { Ensemble } from './core/Ensemble.js';
import { Solo } from './core/Solo.js';

// Player types
import { Cue } from './player/Cue.js';
import { Secondo } from './player/Secondo.js';
import { Appointment } from './player/Appointment.js';
import { Ostinato } from './player/Ostinato.js';

// Secondo adapters
import {
  ObserverSecondo,
  MutationObserverSecondo,
  IntersectionObserverSecondo,
  ResizeObserverSecondo
} from './secondo/ObserverSecondo.js';
import { EmitterSecondo } from './secondo/EmitterSecondo.js';

export {
  // Core
  Player,
  Ensemble,
  Solo,

  // Player types
  Cue,
  Secondo,
  Appointment,
  Ostinato,

  // Secondo adapters
  ObserverSecondo,
  MutationObserverSecondo,
  IntersectionObserverSecondo,
  ResizeObserverSecondo,
  EmitterSecondo
};

/**
 * 🎼 Core module
 *
 * Provides the foundational abstractions of the `@fizzwiz/ensemble` framework.
 * These classes form the "core" on which other parts of the system perform:
 *
 * - {@link Player} — Base performer with a lifecycle (`play()`, `pause()`).
 * - {@link Ensemble} — A group of players performing together in coordination.
 * - {@link Solo} — Self-contained performer orchestrating internal cues like a miniature ensemble.
 * @module core
 */

/**
 * 🎶 Secondos module
 *
 * Adapters that integrate third-party or external event sources into the Ensemble system.
 * They listen to native or custom emitters and re-broadcast their activity as Ensemble events
 * propagated through hierarchies of Ensembles.
 *
 * Variants include:
 * - {@link ObserverSecondo} — Base wrapper for observer APIs.
 * - {@link MutationObserverSecondo}
 * - {@link IntersectionObserverSecondo}
 * - {@link ResizeObserverSecondo}
 * - {@link EmitterSecondo} — Adapts DOM EventTargets or Node.js EventEmitters.
 * @module secondo
 */

/**
 * 🎵 Player module
 *
 * Specialized Player types that encapsulate different forms of timed or event-driven behaviors:
 *
 * - {@link Secondo} — Adapts and echoes events from external sources.
 * - {@link Cue} — Reacts to an external event once or repeatedly.
 * - {@link Appointment} — A scheduled event that fires at a specific time.
 * - {@link Ostinato} — A repeating task with configurable timing and repetitions.
 * @module player
 */
