import { describe, it } from 'mocha';
import assert from 'assert';
import EventEmitter from 'events';
import { Cue } from '../../main/core/Cue.js'; // Adjust the path as needed

describe('Cue', () => {
  it('should resolve when predicate returns a truthy value', async () => {
    const emitter = new EventEmitter();
    let resolvedValue;

    await Promise.all([
      new Cue(emitter, 'event', data => data).promise(500).then(result => {
        resolvedValue = result;
      }),
      new Promise(resolve => setTimeout(() => {
        emitter.emit('event', 'foo');
        resolve();
      }, 50))
    ]);

    assert.strictEqual(resolvedValue, 'foo', 'Cue should resolve with correct value');
  });

  it('should reject with timeout error when predicate returns undefined', async () => {
    const emitter = new EventEmitter();
    let caughtError;

    await Promise.all([
      new Cue(emitter, 'event', () => undefined).promise(200).catch(err => {
        caughtError = err;
      }),
      new Promise(resolve => setTimeout(() => {
        emitter.emit('event', 'bar');
        resolve();
      }, 50))
    ]);

    assert.ok(caughtError instanceof Error, 'Expected an Error to be thrown');
    assert.match(caughtError.message, /Timeout/, 'Expected a timeout error message');
  });

});
