import EmberSpanielEngine from "spaniel";
import { module, test } from "qunit";

const noopFn = () => {};

module("Unit | ember-spaniel-engine", {
  beforeEach() {
    this.engine = EmberSpanielEngine.getGlobalEngine();
  }
});

test("test scheduleRead and resetReadQueue", function(assert) {
  this.engine.scheduleRead(noopFn);
  assert.equal(
    this.engine.reads.length,
    1,
    "It schedules a callback in the read queue"
  );
  this.engine.resetReadQueue();
  assert.equal(
    this.engine.reads.length,
    0,
    "It cancels all callbacks in the read queue"
  );
});

test("test scheduleWork and resetWorkQueue", function(assert) {
  this.engine.scheduleWork(noopFn);
  assert.equal(
    this.engine.work.length,
    1,
    "It schedules a callback in the work queue"
  );
  this.engine.resetWorkQueue();
  assert.equal(
    this.engine.work.length,
    0,
    "It cancels all callbacks in the work queue"
  );
});

test("test resetAll", function(assert) {
  this.engine.scheduleRead(noopFn);
  this.engine.scheduleWork(noopFn);

  this.engine.resetAll();
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
