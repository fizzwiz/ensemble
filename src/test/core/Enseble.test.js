import { describe, it, beforeEach } from 'mocha';
import assert from 'assert';
import { Ensemble } from '../../main/core/Ensemble.js'; // Adjust the path
import { Player } from '../../main/core/Player.js';

describe('Ensemble', () => {
  let ensemble;

  beforeEach(() => {
    ensemble = new Ensemble();
  });

  it('should add and get a player by name', () => {
    const player = new Player();
    ensemble.add(player, 'a');
    const got = ensemble.get('a');
    assert.strictEqual(got, player);
    assert.strictEqual(got.name, 'a');
    assert.strictEqual(got.ensemble, ensemble);
  });

  it('should throw when adding a player with duplicate name', () => {
    const p1 = new Player();
    const p2 = new Player();
    ensemble.add(p1, 'dup');
    assert.throws(() => ensemble.add( p2, 'dup'), /already in this Ensemble/);
  });

  it('should create nested Ensemble if `creating` is true in get()', () => {
    const nested = ensemble.get('x', true);
    assert(nested instanceof Ensemble);
    assert(ensemble.has('x'));
  });

  it('should remove a player', () => {
    const player = new Player();
    ensemble.add(player, 'a');
    const removed = ensemble.remove('a');
    assert.strictEqual(removed, true);
    assert.strictEqual(player.ensemble, undefined);
    assert.strictEqual(player.name, undefined);
    assert.strictEqual(ensemble.has('a'), false);
  });

  it('should rotate players in round-robin', () => {
    const p1 = new Player();
    const p2 = new Player();
    ensemble.add(p1, 'one');
    ensemble.add(p2, 'two');

    const first = ensemble.rotate();
    assert.strictEqual(first, p1);
    assert.deepStrictEqual([...ensemble.players.keys()], ['two', 'one']);
  });

  it('should rotate a player by name', () => {
    const p1 = new Player();
    const p2 = new Player();
    ensemble.add(p1, 'a');
    ensemble.add(p2, 'b');

    const rotated = ensemble.rotate('a');
    assert.strictEqual(rotated, p1);
    assert.deepStrictEqual([...ensemble.players.keys()], ['b', 'a']);
  });

  it('should sort players by custom comparator and return trimmed ones if limited', () => {
    const p1 = new Player();
    const p2 = new Player();
    const p3 = new Player();

    ensemble.add(p1, 'z');
    ensemble.add(p2, 'x');
    ensemble.add(p3, 'y');

    const trimmed = ensemble.sort(([a], [b]) => a.localeCompare(b), 2);
    assert.deepStrictEqual([...ensemble.players.keys()], ['x', 'y']);
    assert.strictEqual(trimmed.length, 1);
    assert.strictEqual(trimmed[0][0], 'z');
  });

  it('should generate a unique name not already used', () => {
    const name = ensemble.uniqueName();
    assert.strictEqual(typeof name, 'string');
    assert(!ensemble.has(name));
  });

  it('should list descendants including nested ensembles', () => {
    const root = new Ensemble();
    const p1 = new Player();
    const p2 = new Player();
    const nested = new Ensemble();
    const p3 = new Player();

    root.add(p1, 'a');
    root.add(nested, 'b');
    nested.add(p2, 'c');
    nested.add(p3, 'd');

    const all = root.descendants(true);
    assert.strictEqual(all.length, 4);
    assert(all.includes(p1));
    assert(all.includes(p2));
    assert(all.includes(p3));
  });

  it('should play and pause all players', () => {
    const p1 = new Player();
    const p2 = new Player();
    ensemble.add(p1, 'a').add(p2, 'b');

    ensemble.play();
    assert.strictEqual(p1.playing, true);
    assert.strictEqual(p2.playing, true);

    ensemble.pause();
    assert.strictEqual(p1.playing, false);
    assert.strictEqual(p2.playing, false);
  });

  it('play() and pause() should not double-activate or deactivate', () => {
    const p = new Player();
    ensemble.add(p, 'x');
    ensemble.play();
    ensemble.play();
    assert.strictEqual(p.playing, true);

    ensemble.pause();
    ensemble.pause();
    assert.strictEqual(p.playing, false);
  });
});
