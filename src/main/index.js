import { Player } from './core/Player.js';
import { Cue } from './core/Cue.js';
import { Ensemble } from './core/Ensemble.js';
import { Event } from './core/Event.js';
import { Secondo } from './core/Secondo.js';
import {
  ObserverSecondo,
  MutationObserverSecondo,
  IntersectionObserverSecondo,
  ResizeObserverSecondo
} from './secondo/ObserverSecondo.js';
import { EmitterSecondo } from './secondo/EmitterSecondo.js';
import { Solo } from './core/Solo.js';
import { TicketPlayer } from './player/TicketPlayer.js';

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
  TicketPlayer
};

/**
 * 
 * 🎼 The `core` module defines the foundational abstractions
 * of the `@fizzwiz/ensemble` framework.
 *
 * These classes form the "score" on which other parts of the system perform:
 *
 * - {@link Player} — The base performer with a lifecycle (`play()`, `pause()`).
 * - {@link Cue} — A note in time: listens to an external source and triggers reactions.
 * - {@link Ensemble} — A group of players performing together in coordination.
 * - {@link Event} — A rich event object that tracks origin and propagation.
 * - {@link Secondo} — A player that echoes/adapts events from external sources.
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
 * - {@link TicketPlayer}
 * @module player
 */
