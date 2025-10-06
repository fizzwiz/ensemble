import { Player } from './core/Player.js';
import { Ensemble } from './core/Ensemble.js';
import { Event } from './core/Event.js';
import { Cue } from './player/Cue.js';
import { Secondo } from './player/Secondo.js';
import {
  ObserverSecondo,
  MutationObserverSecondo,
  IntersectionObserverSecondo,
  ResizeObserverSecondo
} from './secondo/ObserverSecondo.js';
import { EmitterSecondo } from './secondo/EmitterSecondo.js';
import { Solo } from './core/Solo.js';
import { Ticket } from './player/Ticket.js';
import { Ostinato } from './player/Ostinato.js';

export {
  Player,
  Cue,
  Ensemble,
  Event,
  Secondo,
  ObserverSecondo,
  MutationObserverSecondo,
  IntersectionObserverSecondo,
  ResizeObserverSecondo,
  EmitterSecondo,
  Solo,
  Ticket,
  Ostinato
};

/**
 * 
 * 🎼 The `core` module defines the foundational abstractions
 * of the `@fizzwiz/ensemble` framework.
 *
 * These classes form the "score" on which other parts of the system perform:
 *
 * - {@link Player} — The base performer with a lifecycle (`play()`, `pause()`).
 * - {@link Ensemble} — A group of players performing together in coordination.
 * - {@link Event} — A rich event object that tracks origin and propagation.
 * - {@link Solo} — A self-contained performer orchestrating internal cues like a miniature ensemble.
 * @module core
 */

/**
 * 
 * 🎶 Secondos are adapter-players that integrate third-party or external event sources
 * into the Ensemble system. They listen to native or custom emitters and
 * re-broadcast their activity as Ensemble events propagated through hierarchies of Ensembles.
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
 * - {@link Secondo} — A player that echoes/adapts events from external sources.
 * - {@link Cue} — A note in time: listens to an external source and triggers reactions.
 * - {@link Ticket}
 * - {@link Ostinato}
 * @module player
 */
