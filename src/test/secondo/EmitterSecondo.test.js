import assert from 'assert';
import { EventEmitter } from 'events';
import { EmitterSecondo } from '../../main/secondo/EmitterSecondo.js';

describe('EmitterSecondo', () => {
  let emitter;
  let secondo;

  beforeEach(() => {
    emitter = new EventEmitter();
  });

  it('should propagate events with correct type', done => {
    secondo = new EmitterSecondo(emitter, ['ping']);
    secondo.on('ping', e => {
      assert.strictEqual(e.type, 'ping');
      done();
    });

    secondo.play();
    emitter.emit('ping');
  });

  it('should detach handlers on pause', () => {
    secondo = new EmitterSecondo(emitter, ['foo']);
    let count = 0;

    secondo.on('foo', () => count++);
    secondo.play();

    emitter.emit('foo');
    secondo.pause();
    emitter.emit('foo');

    assert.strictEqual(count, 1);
  });

  it('should map to multiple subtypes using mapEventToSubtypes', done => {
    const mapper = (eventName, payload) => [eventName, `sub:${payload}`];
    secondo = new EmitterSecondo(emitter, ['task'], mapper);

    let calls = [];

    secondo.on('task', () => calls.push('task'));
    secondo.on('sub:run', () => {
      calls.push('sub:run');
      assert.deepStrictEqual(calls, ['task', 'sub:run']);
      done();
    });

    secondo.play();
    emitter.emit('task', 'run');
  });

  it('should handle multiple events independently', () => {
    secondo = new EmitterSecondo(emitter, ['foo', 'bar']);
    let fooCalls = 0;
    let barCalls = 0;

    secondo.on('foo', () => fooCalls++);
    secondo.on('bar', () => barCalls++);

    secondo.play();

    emitter.emit('foo');
    emitter.emit('bar');
    emitter.emit('foo');

    assert.strictEqual(fooCalls, 2);
    assert.strictEqual(barCalls, 1);
  });

  it('should toggle playing state correctly', () => {
    secondo = new EmitterSecondo(emitter, ['state']);
    assert.strictEqual(secondo.playing, false);
    secondo.play();
    assert.strictEqual(secondo.playing, true);
    secondo.pause();
    assert.strictEqual(secondo.playing, false);
  });
});
