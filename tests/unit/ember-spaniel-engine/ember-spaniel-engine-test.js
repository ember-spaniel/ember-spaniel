import EmberSpanielEngine from "spaniel";
import { module, test } from "qunit";

const noopFn = () => {};

module("Unit | ember-spaniel-engine", {
  beforeEach() {
    this.engine = EmberSpanielEngine.getGlobalEngine();
  }
});

test("test scheduleRead and flushReadQueue", function(assert) {
  this.engine.scheduleRead(noopFn);
  assert.equal(
    this.engine.reads.length,
    1,
    "It schedules a callback in the read queue"
  );
  this.engine.flushReadQueue();
  assert.equal(
    this.engine.reads.length,
    0,
    "It cancels all callbacks in the read queue"
  );
});

test("test scheduleWork and flushWorkQueue", function(assert) {
  this.engine.scheduleWork(noopFn);
  assert.equal(
    this.engine.work.length,
    1,
    "It schedules a callback in the work queue"
  );
  this.engine.flushWorkQueue();
  assert.equal(
    this.engine.work.length,
    0,
    "It cancels all callbacks in the work queue"
  );
});

test("test flushAll", function(assert) {
  this.engine.scheduleRead(noopFn);
  this.engine.scheduleWork(noopFn);

  this.engine.flushAll();
  assert.equal(
    this.engine.work.length,
    0,
    "It cancels all callbacks in the work queue"
  );
  assert.equal(
    this.engine.reads.length,
    0,
    "It cancels all callbacks in the read queue"
  );
});
