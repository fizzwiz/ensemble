import { Player } from './Player.js';

/**
 * Represents a composite asynchronous behavior composed of multiple Players.
 * An Ensemble is itself a Player, capable of holding and coordinating others.
 */
export class Ensemble extends Player {

  players;

  constructor() {
    super();
    this.players = new Map();
  }

  /** Iterates this Ensemble */
  [Symbol.iterator]() {
    return this.players.values();
  }

  /**
   * Adds a Player to this Ensemble with a unique name.
   * The Player's `name` and `ensemble` properties are set automatically.
   *
   * @param {string} name - The unique name within this ensemble.
   * @param {Player} player - The Player instance to add.
   * @throws {Error} If the name already exists.
   * @returns {Ensemble} This ensemble for chaining.
   */
  add(name, player) {

    if (this.players.has(name)) {
      throw new Error(`A Player with the name "${name}" is already in this Ensemble.`);
    }
    this.players.set(name, player);
    player.let('name', name);
    player.let('ensemble', this);
    return this;
  }

  /**
   * Retrieves a Player by direct name.
   * Allows chaining this.get('a', true).get('b', true).add('c', player);
   * @param {string} name - The name of the Player to retrieve.
   * @param {boolean} creating - if true, a new Ensemble is created and added under the give name
   * @returns {Player | undefined}
   */
  get(name, creating = false) {
    let got = this.players.get(name);
    if (!got && creating) {
      got = new Ensemble();
      if (this.playing) got.play();
      this.add(name, got);
    }
    return got;
  }

  /**
   * Checks whether a Player with the given name exists.
   *
   * @param {string} name
   * @returns {boolean}
   */
  has(name) {
    return this.players.has(name);
  }

  /**
   * Removes a Player by name.
   *
   * @param {string} name
   * @returns {boolean} True if removed, false if not found.
   */
  remove(name) {
    const player = this.players.get(name);
    if (!player) return false;
    player.let('ensemble', undefined);
    player.let('name', undefined);
    return this.players.delete(name);
  }

  /**
   * Rotates a Player to the end of the Ensemble (like round-robin).
   *
   * - If `name` is provided, it rotates that specific Player.
   * - If omitted, rotates the first Player in insertion order.
   *
   * @param {string} [name] - Name of the Player to rotate.
   * @returns {Player | undefined} - The rotated Player, if any.
   */
  rotate(name = undefined) {
    if (!name && this.players.size > 0) {
      const firstPlayer = this.players.values().next().value;
      name = firstPlayer?.name;
    }

    const got = this.get(name);

    if (got) {
      this.remove(name);
      this.add(name, got);      
    }

    return got;
  }

  /**
   * Sorts Players in the Ensemble based on a comparator function.
   *
   * If a `limit` is provided, retains only the first `limit` sorted entries
   * and returns the rest (i.e., the discarded Players).
   *
   * @param {function(Array<*>, Array<*>): number} entryComparator - Comparator for [name, player] pairs.
   * @param {number} [limit] - Optional number of Players to retain after sorting.
   * @returns {Array<Array<*>>} - The trimmed/discarded entries, if any.
   */
  sort(entryComparator, limit = undefined) {
    const sorted = Array.from(this.players.entries()).sort(entryComparator);

    const trimmed = (limit !== undefined)
      ? sorted.splice(limit) // discard from index `limit` onward
      : [];

    this.players.clear();
    for (const [name, player] of sorted) {
      this.players.set(name, player);
    }

    return trimmed;
  }  

  /**
   * Returns all players rooted by this Ensemble, recursively.
   * 
   * @param {boolean} [ensembles = false] if true, nested Ensembles are also listed
   * @returns {Array<Player>} A flat array of all descendant players.
   */
  descendants(ensembles = false) {
    const got = [];

    for (const player of this.players.values()) {
      if (player instanceof Ensemble) {
        if (ensembles) got.push(player);
        got.push(...player.descendants(ensembles));
      } else {
        got.push(player);
      }
    }

    return got;
  }


  /**
   * Starts this Ensemble and all contained Players.
   */
  play() {
    if (this.playing) return;

    for (const player of this.players.values()) {
      if (typeof player.play === 'function' && !player.playing) {
        player.play();
      }
    }

    this.let('playing', true);
  }

  /**
   * Pauses this Ensemble and all contained Players.
   */
  pause() {
    if (!this.playing) return;

    for (const player of this.players.values()) {
      if (typeof player.pause === 'function' && player.playing) {
        player.pause();
      }
    }

    this.let('playing', false);
  }
}
