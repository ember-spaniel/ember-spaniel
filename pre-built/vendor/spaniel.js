define('spaniel', ['exports'], function (exports) { 'use strict';

    function calculateIsIntersecting(_a) {
      var intersectionRect = _a.intersectionRect;
      return intersectionRect.width > 0 || intersectionRect.height > 0;
    }
    function getBoundingClientRect(element) {
      try {
        return element.getBoundingClientRect();
      } catch (e) {
        if (typeof e === 'object' && e !== null && (e.number & 0xffff) === 16389) {
          return {
            top: 0,
            bottom: 0,
            left: 0,
            width: 0,
            height: 0,
            right: 0,
            x: 0,
            y: 0
          };
        } else {
          throw e;
        }
      }
    }

    /*
    Copyright 2017 LinkedIn Corp. Licensed under the Apache License,
    Version 2.0 (the "License"); you may not use this file except in
    compliance with the License. You may obtain a copy of the License
    at http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    */

    /*
    Copyright 2017 LinkedIn Corp. Licensed under the Apache License,
    Version 2.0 (the "License"); you may not use this file except in
    compliance with the License. You may obtain a copy of the License
    at http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    */
    var __extends = undefined && undefined.__extends || function () {
      var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function (d, b) {
          d.__proto__ = b;
        } || function (d, b) {
          for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };

        return extendStatics(d, b);
      };

      return function (d, b) {
        extendStatics(d, b);

        function __() {
          this.constructor = d;
        }

        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();

    var BaseQueue =
    /** @class */
    function () {
      function BaseQueue() {
        this.items = [];
      }

      BaseQueue.prototype.remove = function (identifier) {
        var len = this.items.length;

        for (var i = 0; i < len; i++) {
          if (this.removePredicate(identifier, this.items[i])) {
            this.items.splice(i, 1);
            i--;
            len--;
          }
        }
      };

      BaseQueue.prototype.clear = function () {
        this.items = [];
      };

      BaseQueue.prototype.push = function (element) {
        this.items.push(element);
      };

      BaseQueue.prototype.isEmpty = function () {
        return this.items.length === 0;
      };

      return BaseQueue;
    }();

    var Queue =
    /** @class */
    function (_super) {
      __extends(Queue, _super);

      function Queue() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      Queue.prototype.removePredicate = function (identifier, element) {
        if (typeof identifier === 'string') {
          return element.id === identifier;
        } else {
          return element.callback === identifier;
        }
      };

      return Queue;
    }(BaseQueue);

    var FunctionQueue =
    /** @class */
    function (_super) {
      __extends(FunctionQueue, _super);

      function FunctionQueue() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      FunctionQueue.prototype.removePredicate = function (identifier, element) {
        return element === identifier;
      };

      return FunctionQueue;
    }(BaseQueue);

    var DOMQueue =
    /** @class */
    function (_super) {
      __extends(DOMQueue, _super);

      function DOMQueue() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      DOMQueue.prototype.removePredicate = function (identifier, element) {
        if (typeof identifier === 'string') {
          return element.id === identifier;
        } else if (typeof identifier === 'function') {
          return element.callback === identifier;
        } else {
          return element.el === identifier;
        }
      };

      return DOMQueue;
    }(BaseQueue);

    /*
    Copyright 2017 LinkedIn Corp. Licensed under the Apache License,
    Version 2.0 (the "License"); you may not use this file except in
    compliance with the License. You may obtain a copy of the License
    at http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    */
    var nop = function () {
      return 0;
    };

    var hasDOM = !!(typeof window !== 'undefined' && window && typeof document !== 'undefined' && document);
    var hasRAF = hasDOM && !!window.requestAnimationFrame;
    var W = {
      hasDOM: hasDOM,
      hasRAF: hasRAF,
      getScrollTop: nop,
      getScrollLeft: nop,
      getHeight: nop,
      getWidth: nop,
      rAF: hasRAF ? window.requestAnimationFrame.bind(window) : function (callback) {
        callback();
      },
      meta: {
        width: 0,
        height: 0,
        scrollTop: 0,
        scrollLeft: 0,
        x: 0,
        y: 0,
        top: 0,
        left: 0
      },
      version: 0,
      lastVersion: 0,
      updateMeta: nop,

      get isDirty() {
        return W.version !== W.lastVersion;
      }

    };
    function invalidate() {
      ++W.version;
    } // Init after DOM Content has loaded

    function hasDomSetup() {
      var se = document.scrollingElement != null;
      W.getScrollTop = se ? function () {
        return document.scrollingElement.scrollTop;
      } : function () {
        return window.scrollY;
      };
      W.getScrollLeft = se ? function () {
        return document.scrollingElement.scrollLeft;
      } : function () {
        return window.scrollX;
      };
    }

    if (hasDOM) {
      // Set the height and width immediately because they will be available at this point
      W.getHeight = function () {
        return window.innerHeight;
      };

      W.getWidth = function () {
        return window.innerWidth;
      };

      W.updateMeta = function () {
        W.meta.height = W.getHeight();
        W.meta.width = W.getWidth();
        W.meta.scrollLeft = W.getScrollLeft();
        W.meta.scrollTop = W.getScrollTop();
        W.lastVersion = W.version;
      };

      W.updateMeta();

      if (document.readyState !== 'loading') {
        hasDomSetup();
      } else {
        document.addEventListener('DOMContentLoaded', hasDomSetup);
      }

      window.addEventListener('resize', invalidate, false);
      window.addEventListener('scroll', invalidate, false);
    }

    /*
    Copyright 2017 LinkedIn Corp. Licensed under the Apache License,
    Version 2.0 (the "License"); you may not use this file except in
    compliance with the License. You may obtain a copy of the License
    at http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    */

    var Engine =
    /** @class */
    function () {
      function Engine() {
        this.reads = [];
        this.work = [];
        this.running = false;
      }

      Engine.prototype.scheduleRead = function (callback) {
        this.reads.unshift(callback);
        this.run();
      };

      Engine.prototype.scheduleWork = function (callback) {
        this.work.unshift(callback);
        this.run();
      };

      Engine.prototype.run = function () {
        var _this = this;

        if (!this.running) {
          this.running = true;
          W.rAF(function () {
            _this.running = false;

            for (var i = 0, rlen = _this.reads.length; i < rlen; i++) {
              _this.reads.pop()();
            }

            for (var i = 0, wlen = _this.work.length; i < wlen; i++) {
              _this.work.pop()();
            }

            if (_this.work.length > 0 || _this.reads.length > 0) {
              _this.run();
            }
          });
        }
      };

      return Engine;
    }();
    var globalEngine = null;
    function setGlobalEngine(engine) {
      if (!!globalEngine) {
        return false;
      }

      globalEngine = engine;
      return true;
    }
    function getGlobalEngine() {
      return globalEngine || (globalEngine = new Engine());
    }

    /*
    Copyright 2017 LinkedIn Corp. Licensed under the Apache License,
    Version 2.0 (the "License"); you may not use this file except in
    compliance with the License. You may obtain a copy of the License
    at http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    */
    var __extends$1 = undefined && undefined.__extends || function () {
      var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function (d, b) {
          d.__proto__ = b;
        } || function (d, b) {
          for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };

        return extendStatics(d, b);
      };

      return function (d, b) {
        extendStatics(d, b);

        function __() {
          this.constructor = d;
        }

        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var TOKEN_SEED = 'xxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
          v = c === 'x' ? r : r & 0x3 | 0x8;
      return v.toString(16);
    });
    var tokenCounter = 0;

    var Frame =
    /** @class */
    function () {
      function Frame(timestamp, scrollTop, scrollLeft, width, height, x, y, top, left) {
        this.timestamp = timestamp;
        this.scrollTop = scrollTop;
        this.scrollLeft = scrollLeft;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.top = top;
        this.left = left;
      }

      Frame.generate = function (root) {
        if (root === void 0) {
          root = window;
        }

        var rootMeta = this.revalidateRootMeta(root);
        return new Frame(Date.now(), rootMeta.scrollTop, rootMeta.scrollLeft, rootMeta.width, rootMeta.height, rootMeta.x, rootMeta.y, rootMeta.top, rootMeta.left);
      };

      Frame.revalidateRootMeta = function (root) {
        if (root === void 0) {
          root = window;
        }

        var _clientRect = null;
        var _rootMeta = {
          width: 0,
          height: 0,
          scrollTop: 0,
          scrollLeft: 0,
          x: 0,
          y: 0,
          top: 0,
          left: 0
        }; // if root is dirty update the cached values

        if (W.isDirty) {
          W.updateMeta();
        }

        if (root === window) {
          _rootMeta.height = W.meta.height;
          _rootMeta.width = W.meta.width;
          _rootMeta.scrollLeft = W.meta.scrollLeft;
          _rootMeta.scrollTop = W.meta.scrollTop;
          return _rootMeta;
        }

        _clientRect = getBoundingClientRect(root);
        _rootMeta.scrollTop = root.scrollTop;
        _rootMeta.scrollLeft = root.scrollLeft;
        _rootMeta.width = _clientRect.width;
        _rootMeta.height = _clientRect.height;
        _rootMeta.x = _clientRect.x;
        _rootMeta.y = _clientRect.y;
        _rootMeta.top = _clientRect.top;
        _rootMeta.left = _clientRect.left;
        return _rootMeta;
      };

      return Frame;
    }();
    function generateToken() {
      return tokenCounter++ + TOKEN_SEED;
    }

    var BaseScheduler =
    /** @class */
    function () {
      function BaseScheduler(customEngine, root) {
        if (root === void 0) {
          root = window;
        }

        this.isTicking = false;
        this.toRemove = [];

        if (customEngine) {
          this.engine = customEngine;
        } else {
          this.engine = getGlobalEngine();
        }

        this.root = root;
      }

      BaseScheduler.prototype.tick = function () {
        if (this.queue.isEmpty()) {
          this.isTicking = false;
        } else {
          if (this.toRemove.length > 0) {
            for (var i = 0; i < this.toRemove.length; i++) {
              this.queue.remove(this.toRemove[i]);
            }

            this.toRemove = [];
          }

          this.applyQueue(Frame.generate(this.root));
          this.engine.scheduleRead(this.tick.bind(this));
        }
      };

      BaseScheduler.prototype.scheduleWork = function (callback) {
        this.engine.scheduleWork(callback);
      };

      BaseScheduler.prototype.scheduleRead = function (callback) {
        this.engine.scheduleRead(callback);
      };

      BaseScheduler.prototype.queryElement = function (el, callback) {
        var _this = this;

        var clientRect = null;
        var frame = null;
        this.engine.scheduleRead(function () {
          clientRect = getBoundingClientRect(el);
          frame = Frame.generate(_this.root);
        });
        this.engine.scheduleWork(function () {
          callback(clientRect, frame);
        });
      };

      BaseScheduler.prototype.unwatch = function (id) {
        this.toRemove.push(id);
      };

      BaseScheduler.prototype.unwatchAll = function () {
        this.queue.clear();
      };

      BaseScheduler.prototype.startTicking = function () {
        if (!this.isTicking) {
          this.isTicking = true;
          this.engine.scheduleRead(this.tick.bind(this));
        }
      };

      return BaseScheduler;
    }();

    var Scheduler =
    /** @class */
    function (_super) {
      __extends$1(Scheduler, _super);

      function Scheduler() {
        var _this = _super !== null && _super.apply(this, arguments) || this;

        _this.queue = new Queue();
        return _this;
      }

      Scheduler.prototype.applyQueue = function (frame) {
        for (var i = 0; i < this.queue.items.length; i++) {
          var _a = this.queue.items[i],
              id = _a.id,
              callback = _a.callback;
          callback(frame, id);
        }
      };

      Scheduler.prototype.watch = function (callback) {
        this.startTicking();
        var id = generateToken();
        this.queue.push({
          callback: callback,
          id: id
        });
        return id;
      };

      return Scheduler;
    }(BaseScheduler);

    var PredicatedScheduler =
    /** @class */
    function (_super) {
      __extends$1(PredicatedScheduler, _super);

      function PredicatedScheduler(predicate) {
        var _this = _super.call(this, null, window) || this;

        _this.predicate = predicate;
        return _this;
      }

      PredicatedScheduler.prototype.applyQueue = function (frame) {
        if (this.predicate(frame)) {
          _super.prototype.applyQueue.call(this, frame);
        }
      };

      return PredicatedScheduler;
    }(Scheduler);

    var ElementScheduler =
    /** @class */
    function (_super) {
      __extends$1(ElementScheduler, _super);

      function ElementScheduler(customEngine, root, ALLOW_CACHED_SCHEDULER) {
        if (ALLOW_CACHED_SCHEDULER === void 0) {
          ALLOW_CACHED_SCHEDULER = true;
        }

        var _this = _super.call(this, customEngine, root) || this;

        _this.lastVersion = W.version;

        if (ALLOW_CACHED_SCHEDULER === void 0) {
          ALLOW_CACHED_SCHEDULER = true;
        }

        _this.queue = new DOMQueue();
        _this.ALLOW_CACHED_SCHEDULER = ALLOW_CACHED_SCHEDULER;
        return _this;
      }

      Object.defineProperty(ElementScheduler.prototype, "isDirty", {
        get: function () {
          return W.version !== this.lastVersion;
        },
        enumerable: true,
        configurable: true
      });

      ElementScheduler.prototype.applyQueue = function (frame) {
        for (var i = 0; i < this.queue.items.length; i++) {
          var _a = this.queue.items[i],
              callback = _a.callback,
              el = _a.el,
              id = _a.id,
              clientRect = _a.clientRect;

          if (this.isDirty || !clientRect || !this.ALLOW_CACHED_SCHEDULER) {
            clientRect = this.queue.items[i].clientRect = getBoundingClientRect(el);
          }

          callback(frame, id, clientRect);
        }

        this.lastVersion = W.version;
      };

      ElementScheduler.prototype.watch = function (el, callback, id) {
        this.startTicking();
        id = id || generateToken();
        var clientRect = null;
        this.queue.push({
          el: el,
          callback: callback,
          id: id,
          clientRect: clientRect
        });
        return id;
      };

      return ElementScheduler;
    }(BaseScheduler);
    var globalScheduler = null;
    function getGlobalScheduler() {
      return globalScheduler || (globalScheduler = new Scheduler());
    }

    /*
    Copyright 2017 LinkedIn Corp. Licensed under the Apache License,
    Version 2.0 (the "License"); you may not use this file except in
    compliance with the License. You may obtain a copy of the License
    at http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    */

    var GenericEventRecord =
    /** @class */
    function () {
      function GenericEventRecord() {
        this.queue = new FunctionQueue();
      }

      GenericEventRecord.prototype.listen = function (callback) {
        this.queue.push(callback);
      };

      GenericEventRecord.prototype.unlisten = function (callback) {
        this.queue.remove(callback);
      };

      GenericEventRecord.prototype.trigger = function (value) {
        for (var i = 0; i < this.queue.items.length; i++) {
          this.queue.items[i](value);
        }
      };

      return GenericEventRecord;
    }();

    var RAFEventRecord =
    /** @class */
    function () {
      function RAFEventRecord(predicate) {
        this.scheduler = new PredicatedScheduler(predicate.bind(this));
      }

      RAFEventRecord.prototype.trigger = function (value) {};

      RAFEventRecord.prototype.listen = function (callback) {
        this.state = Frame.generate();
        this.scheduler.watch(callback);
      };

      RAFEventRecord.prototype.unlisten = function (cb) {
        this.scheduler.unwatch(cb);
      };

      return RAFEventRecord;
    }();

    var eventStore = null;

    function getEventStore() {
      return eventStore || (eventStore = {
        scroll: new RAFEventRecord(function (frame) {
          var _a = this.state,
              scrollTop = _a.scrollTop,
              scrollLeft = _a.scrollLeft;
          this.state = frame;
          return scrollTop !== frame.scrollTop || scrollLeft !== frame.scrollLeft;
        }),
        resize: new RAFEventRecord(function (frame) {
          var _a = this.state,
              width = _a.width,
              height = _a.height;
          this.state = frame;
          return height !== frame.height || width !== frame.width;
        }),
        destroy: new GenericEventRecord(),
        beforeunload: new GenericEventRecord(),
        hide: new GenericEventRecord(),
        show: new GenericEventRecord()
      });
    }

    if (W.hasDOM) {
      window.addEventListener('beforeunload', function (e) {
        // First fire internal event to fire any observer callbacks
        trigger('beforeunload'); // Then fire external event to allow flushing of any beacons

        trigger('destroy');
      });
      document.addEventListener('visibilitychange', function onVisibilityChange() {
        if (document.visibilityState === 'visible') {
          trigger('show');
        } else {
          trigger('hide');
        }
      });
    }

    function on$$1(eventName, callback) {
      var evt = getEventStore()[eventName];

      if (evt) {
        evt.listen(callback);
      }
    }
    function off$$1(eventName, callback) {
      if (eventStore) {
        var evt = eventStore[eventName];

        if (evt) {
          evt.unlisten(callback);
        }
      }
    }
    function trigger(eventName, value) {
      if (eventStore) {
        var evt = eventStore[eventName];

        if (evt) {
          evt.trigger(value);
        }
      }
    }
    /**
     * Schedule a callback to be batched along with other DOM read/query work.
     * Use to schedule any DOM reads. Doing so will avoid DOM thrashing.
     */

    function scheduleWork$$1(callback) {
      getGlobalScheduler().scheduleWork(callback);
    }
    /**
     * Schedule a callback to be batched along with other DOM write/mutation
     * work. Use to schedule any DOM changes. Doing so will avoid DOM thrashing.
     */

    function scheduleRead$$1(callback) {
      getGlobalScheduler().scheduleRead(callback);
    }

    /*
    Copyright 2017 LinkedIn Corp. Licensed under the Apache License,
    Version 2.0 (the "License"); you may not use this file except in
    compliance with the License. You may obtain a copy of the License
    at http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    */

    /*
    Copyright 2017 LinkedIn Corp. Licensed under the Apache License,
    Version 2.0 (the "License"); you may not use this file except in
    compliance with the License. You may obtain a copy of the License
    at http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    */

    function marginToRect(margin) {
      var left = margin.left,
          right = margin.right,
          top = margin.top,
          bottom = margin.bottom;
      return {
        left: left,
        top: top,
        bottom: bottom,
        right: right,
        width: right - left,
        height: bottom - top
      };
    }

    function rootMarginToDOMMargin(rootMargin) {
      var c = rootMargin.split(' ').map(function (n) {
        return parseInt(n, 10);
      });

      switch (c.length) {
        case 2:
          return {
            top: c[0],
            left: c[1],
            bottom: c[0],
            right: c[1]
          };

        case 3:
          return {
            top: c[0],
            left: c[1],
            bottom: c[2],
            right: c[1]
          };

        case 4:
          return {
            top: c[0],
            left: c[1],
            bottom: c[2],
            right: c[3]
          };

        default:
          return {
            top: 0,
            left: 0,
            bottom: 0,
            right: 0
          };
      }
    }

    var SpanielIntersectionObserver =
    /** @class */
    function () {
      function SpanielIntersectionObserver(callback, options) {
        if (options === void 0) {
          options = {};
        }

        this.records = {};
        this.callback = callback;
        this.id = generateToken();
        options.threshold = options.threshold || 0;
        this.rootMarginObj = rootMarginToDOMMargin(options.rootMargin || '0px');
        this.root = options.root;

        if (Array.isArray(options.threshold)) {
          this.thresholds = options.threshold;
        } else {
          this.thresholds = [options.threshold];
        }

        this.scheduler = new ElementScheduler(null, this.root, options.ALLOW_CACHED_SCHEDULER);
      }

      SpanielIntersectionObserver.prototype.observe = function (target) {
        var _this = this;

        var trackedTarget = target;
        var id = trackedTarget.__spanielId = trackedTarget.__spanielId || generateToken();
        this.scheduler.watch(target, function (frame, id, clientRect) {
          _this.onTick(frame, id, clientRect, trackedTarget);
        }, trackedTarget.__spanielId);
        return id;
      };

      SpanielIntersectionObserver.prototype.onTick = function (frame, id, clientRect, el) {
        var _this = this;

        var _a = this.generateEntryEvent(frame, clientRect, el),
            numSatisfiedThresholds = _a.numSatisfiedThresholds,
            entry = _a.entry;

        var record = this.records[id] || (this.records[id] = {
          entry: entry,
          numSatisfiedThresholds: 0
        });

        if (numSatisfiedThresholds !== record.numSatisfiedThresholds || entry.isIntersecting !== record.entry.isIntersecting) {
          record.numSatisfiedThresholds = numSatisfiedThresholds;
          record.entry = entry;
          this.scheduler.scheduleWork(function () {
            _this.callback([entry]);
          });
        }
      };

      SpanielIntersectionObserver.prototype.unobserve = function (target) {
        this.scheduler.unwatch(target.__spanielId);
        delete this.records[target.__spanielId];
      };

      SpanielIntersectionObserver.prototype.disconnect = function () {
        this.scheduler.unwatchAll();
        this.records = {};
      };

      SpanielIntersectionObserver.prototype.takeRecords = function () {
        return [];
      };

      SpanielIntersectionObserver.prototype.generateEntryEvent = function (frame, clientRect, el) {
        var count = 0;
        var entry = generateEntry(frame, clientRect, el, this.rootMarginObj);

        for (var i = 0; i < this.thresholds.length; i++) {
          var threshold = this.thresholds[i];

          if (entry.intersectionRatio >= threshold) {
            count++;
          }
        }

        return {
          numSatisfiedThresholds: count,
          entry: entry
        };
      };

      return SpanielIntersectionObserver;
    }();

    function addRatio(entryInit) {
      var time = entryInit.time,
          rootBounds = entryInit.rootBounds,
          boundingClientRect = entryInit.boundingClientRect,
          intersectionRect = entryInit.intersectionRect,
          target = entryInit.target;
      var boundingArea = boundingClientRect.height * boundingClientRect.width;
      var intersectionRatio = boundingArea > 0 ? intersectionRect.width * intersectionRect.height / boundingArea : 0;
      return {
        time: time,
        rootBounds: rootBounds,
        boundingClientRect: boundingClientRect,
        intersectionRect: intersectionRect,
        target: target,
        intersectionRatio: intersectionRatio,
        isIntersecting: calculateIsIntersecting({
          intersectionRect: intersectionRect
        })
      };
    }
    /*
    export class IntersectionObserverEntry implements IntersectionObserverEntryInit {
      time: DOMHighResTimeStamp;
      intersectionRatio: number;
      rootBounds: DOMRectReadOnly;
      boundingClientRect: DOMRectReadOnly;
      intersectionRect: DOMRectReadOnly;
      target: SpanielTrackedElement;

      constructor(entryInit: IntersectionObserverEntryInit) {
        this.time = entryInit.time;
        this.rootBounds = entryInit.rootBounds;
        this.boundingClientRect = entryInit.boundingClientRect;
        this.intersectionRect = entryInit.intersectionRect;
        this.target = entryInit.target;

        let {
          intersectionRect,
          boundingClientRect
        } = entryInit;
        let boundingArea = boundingClientRect.height * boundingClientRect.width;
        this.intersectionRatio = boundingArea > 0 ? (intersectionRect.width * intersectionRect.height) / boundingArea : 0;
      }
    };
    */


    function emptyRect() {
      return {
        bottom: 0,
        height: 0,
        left: 0,
        right: 0,
        top: 0,
        width: 0,
        x: 0,
        y: 0
      };
    }

    function generateEntry(frame, clientRect, el, rootMargin) {
      if (el.style.display === 'none') {
        return {
          boundingClientRect: emptyRect(),
          intersectionRatio: 0,
          intersectionRect: emptyRect(),
          isIntersecting: false,
          rootBounds: emptyRect(),
          target: el,
          time: frame.timestamp
        };
      }

      var bottom = clientRect.bottom,
          right = clientRect.right;
      var rootBounds = {
        left: frame.left + rootMargin.left,
        top: frame.top + rootMargin.top,
        bottom: rootMargin.bottom,
        right: rootMargin.right,
        width: frame.width - (rootMargin.right + rootMargin.left),
        height: frame.height - (rootMargin.bottom + rootMargin.top)
      };
      var intersectX = Math.max(rootBounds.left, clientRect.left);
      var intersectY = Math.max(rootBounds.top, clientRect.top);
      var width = Math.min(rootBounds.left + rootBounds.width, clientRect.right) - intersectX;
      var height = Math.min(rootBounds.top + rootBounds.height, clientRect.bottom) - intersectY;
      var intersectionRect = {
        left: width >= 0 ? intersectX : 0,
        top: intersectY >= 0 ? intersectY : 0,
        width: width,
        height: height,
        right: right,
        bottom: bottom
      };
      return addRatio({
        time: frame.timestamp,
        rootBounds: rootBounds,
        target: el,
        boundingClientRect: marginToRect(clientRect),
        intersectionRect: intersectionRect
      });
    }

    /*
    Copyright 2017 LinkedIn Corp. Licensed under the Apache License,
    Version 2.0 (the "License"); you may not use this file except in
    compliance with the License. You may obtain a copy of the License
    at http://www.apache.org/licenses/LICENSE-2.0
     
    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    */
    var emptyRect$1 = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };
    function DOMMarginToRootMargin(d) {
      return d.top + "px " + d.right + "px " + d.bottom + "px " + d.left + "px";
    }

    var SpanielObserver =
    /** @class */
    function () {
      function SpanielObserver(callback, options) {
        if (options === void 0) {
          options = {};
        }

        var _this = this;

        this.paused = false;
        this.queuedEntries = [];
        this.recordStore = {};
        this.callback = callback;
        var root = options.root,
            rootMargin = options.rootMargin,
            threshold = options.threshold,
            ALLOW_CACHED_SCHEDULER = options.ALLOW_CACHED_SCHEDULER;
        rootMargin = rootMargin || '0px';
        var convertedRootMargin = typeof rootMargin !== 'string' ? DOMMarginToRootMargin(rootMargin) : rootMargin;
        this.thresholds = threshold.sort(function (t) {
          return t.ratio;
        });
        var o = {
          root: root,
          rootMargin: convertedRootMargin,
          threshold: this.thresholds.map(function (t) {
            return t.ratio;
          }),
          ALLOW_CACHED_SCHEDULER: ALLOW_CACHED_SCHEDULER
        };
        this.observer = new SpanielIntersectionObserver(function (records) {
          return _this.internalCallback(records);
        }, o);
        this.onTabHidden = this._onTabHidden.bind(this);
        this.onWindowClosed = this._onWindowClosed.bind(this);
        this.onTabShown = this._onTabShown.bind(this);

        if (W.hasDOM) {
          on$$1('beforeunload', this.onWindowClosed);
          on$$1('hide', this.onTabHidden);
          on$$1('show', this.onTabShown);
        }
      }

      SpanielObserver.prototype._onWindowClosed = function () {
        this.onTabHidden();
      };

      SpanielObserver.prototype.setAllHidden = function () {
        var ids = Object.keys(this.recordStore);
        var time = Date.now();

        for (var i = 0; i < ids.length; i++) {
          this.handleRecordExiting(this.recordStore[ids[i]], time);
        }

        this.flushQueuedEntries();
      };

      SpanielObserver.prototype._onTabHidden = function () {
        this.paused = true;
        this.setAllHidden();
      };

      SpanielObserver.prototype._onTabShown = function () {
        this.paused = false;
        var ids = Object.keys(this.recordStore);
        var time = Date.now();

        for (var i = 0; i < ids.length; i++) {
          var entry = this.recordStore[ids[i]].lastSeenEntry;

          if (entry) {
            var intersectionRatio = entry.intersectionRatio,
                boundingClientRect = entry.boundingClientRect,
                rootBounds = entry.rootBounds,
                intersectionRect = entry.intersectionRect,
                isIntersecting = entry.isIntersecting,
                target = entry.target;
            this.handleObserverEntry({
              intersectionRatio: intersectionRatio,
              boundingClientRect: boundingClientRect,
              time: time,
              isIntersecting: isIntersecting,
              rootBounds: rootBounds,
              intersectionRect: intersectionRect,
              target: target
            });
          }
        }
      };

      SpanielObserver.prototype.internalCallback = function (records) {
        records.forEach(this.handleObserverEntry.bind(this));
      };

      SpanielObserver.prototype.flushQueuedEntries = function () {
        if (this.queuedEntries.length > 0) {
          this.callback(this.queuedEntries);
          this.queuedEntries = [];
        }
      };

      SpanielObserver.prototype.generateSpanielEntry = function (entry, state) {
        var intersectionRatio = entry.intersectionRatio,
            time = entry.time,
            rootBounds = entry.rootBounds,
            boundingClientRect = entry.boundingClientRect,
            intersectionRect = entry.intersectionRect,
            isIntersecting = entry.isIntersecting,
            target = entry.target;
        var record = this.recordStore[target.__spanielId];
        return {
          intersectionRatio: intersectionRatio,
          isIntersecting: isIntersecting,
          time: time,
          rootBounds: rootBounds,
          boundingClientRect: boundingClientRect,
          intersectionRect: intersectionRect,
          target: target,
          duration: 0,
          entering: null,
          payload: record.payload,
          label: state.threshold.label
        };
      };

      SpanielObserver.prototype.handleRecordExiting = function (record, time) {
        var _this = this;

        if (time === void 0) {
          time = Date.now();
        }

        record.thresholdStates.forEach(function (state) {
          _this.handleThresholdExiting({
            intersectionRatio: -1,
            isIntersecting: false,
            time: time,
            payload: record.payload,
            label: state.threshold.label,
            entering: false,
            rootBounds: emptyRect$1,
            boundingClientRect: emptyRect$1,
            intersectionRect: emptyRect$1,
            duration: time - state.lastVisible,
            target: record.target
          }, state);

          state.lastSatisfied = false;
          state.visible = false;
          state.lastEntry = null;
        });
      };

      SpanielObserver.prototype.handleThresholdExiting = function (spanielEntry, state) {
        var time = spanielEntry.time,
            intersectionRatio = spanielEntry.intersectionRatio;
        var hasTimeThreshold = !!state.threshold.time;

        if (state.lastSatisfied && (!hasTimeThreshold || hasTimeThreshold && state.visible)) {
          // Make into function
          spanielEntry.duration = time - state.lastVisible;
          spanielEntry.entering = false;
          state.visible = false;
          this.queuedEntries.push(spanielEntry);
        }

        clearTimeout(state.timeoutId);
      };

      SpanielObserver.prototype.handleObserverEntry = function (entry) {
        var _this = this;

        var time = entry.time;
        var target = entry.target;
        var record = this.recordStore[target.__spanielId];

        if (record) {
          record.lastSeenEntry = entry;

          if (!this.paused) {
            record.thresholdStates.forEach(function (state) {
              // Find the thresholds that were crossed. Since you can have multiple thresholds
              // for the same ratio, could be multiple thresholds
              var hasTimeThreshold = !!state.threshold.time;

              var spanielEntry = _this.generateSpanielEntry(entry, state);

              var ratioSatisfied = entry.intersectionRatio >= state.threshold.ratio;
              var isIntersecting = calculateIsIntersecting(entry);

              if (ratioSatisfied && !state.lastSatisfied && isIntersecting) {
                spanielEntry.entering = true;

                if (hasTimeThreshold) {
                  state.lastVisible = time;
                  var timerId = Number(setTimeout(function () {
                    state.visible = true;
                    spanielEntry.duration = Date.now() - state.lastVisible;

                    _this.callback([spanielEntry]);
                  }, state.threshold.time));
                  state.timeoutId = timerId;
                } else {
                  state.visible = true;

                  _this.queuedEntries.push(spanielEntry);
                }
              } else if (!ratioSatisfied) {
                _this.handleThresholdExiting(spanielEntry, state);
              }

              state.lastEntry = entry;
              state.lastSatisfied = ratioSatisfied;
            });
            this.flushQueuedEntries();
          }
        }
      };

      SpanielObserver.prototype.disconnect = function () {
        this.setAllHidden();
        this.observer.disconnect();
        this.recordStore = {};
      };
      /*
       * Must be called when the SpanielObserver is done being used.
       * This will prevent memory leaks.
       */


      SpanielObserver.prototype.destroy = function () {
        this.disconnect();

        if (W.hasDOM) {
          off$$1('beforeunload', this.onWindowClosed);
          off$$1('hide', this.onTabHidden);
          off$$1('show', this.onTabShown);
        }
      };

      SpanielObserver.prototype.unobserve = function (element) {
        var _this = this;

        var record = this.recordStore[element.__spanielId];

        if (record) {
          delete this.recordStore[element.__spanielId];
          this.observer.unobserve(element);
          scheduleWork$$1(function () {
            _this.handleRecordExiting(record);

            _this.flushQueuedEntries();
          });
        }
      };

      SpanielObserver.prototype.observe = function (target, payload) {
        if (payload === void 0) {
          payload = null;
        }

        var trackedTarget = target;
        var id = trackedTarget.__spanielId = trackedTarget.__spanielId || generateToken();
        this.recordStore[id] = {
          target: trackedTarget,
          payload: payload,
          lastSeenEntry: null,
          thresholdStates: this.thresholds.map(function (threshold) {
            return {
              lastSatisfied: false,
              lastEntry: null,
              threshold: threshold,
              visible: false,
              lastVisible: null
            };
          })
        };
        this.observer.observe(trackedTarget);
        return id;
      };

      return SpanielObserver;
    }();

    /*
    Copyright 2016 LinkedIn Corp. Licensed under the Apache License,
    Version 2.0 (the "License"); you may not use this file except in
    compliance with the License. You may obtain a copy of the License
    at http://www.apache.org/licenses/LICENSE-2.0
     
    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    */

    function onEntry(entries) {
      entries.forEach(function (entry) {
        var label = entry.label,
            duration = entry.duration,
            boundingClientRect = entry.boundingClientRect;
        var opts = {
          duration: duration,
          boundingClientRect: boundingClientRect
        };

        if (entry.entering) {
          entry.payload.callback(label, opts);
        } else if (entry.label === 'impressed') {
          opts.visibleTime = entry.time - entry.duration;
          entry.payload.callback('impression-complete', opts);
        }
      });
    }

    var Watcher =
    /** @class */
    function () {
      function Watcher(config) {
        if (config === void 0) {
          config = {};
        }

        var time = config.time,
            ratio = config.ratio,
            rootMargin = config.rootMargin,
            root = config.root,
            ALLOW_CACHED_SCHEDULER = config.ALLOW_CACHED_SCHEDULER;
        var threshold = [{
          label: 'exposed',
          time: 0,
          ratio: 0
        }];

        if (time) {
          threshold.push({
            label: 'impressed',
            time: time,
            ratio: ratio || 0
          });
        }

        if (ratio) {
          threshold.push({
            label: 'visible',
            time: 0,
            ratio: ratio
          });
        }

        this.observer = new SpanielObserver(onEntry, {
          rootMargin: rootMargin,
          threshold: threshold,
          root: root,
          ALLOW_CACHED_SCHEDULER: ALLOW_CACHED_SCHEDULER
        });
      }

      Watcher.prototype.watch = function (el, callback) {
        this.observer.observe(el, {
          callback: callback
        });
      };

      Watcher.prototype.unwatch = function (el) {
        this.observer.unobserve(el);
      };

      Watcher.prototype.disconnect = function () {
        this.observer.disconnect();
      };
      /*
       * Must be called when the Watcher is done being used.
       * This will prevent memory leaks.
       */


      Watcher.prototype.destroy = function () {
        this.observer.destroy();
      };

      return Watcher;
    }();

    /*
    Copyright 2017 LinkedIn Corp. Licensed under the Apache License,
    Version 2.0 (the "License"); you may not use this file except in
    compliance with the License. You may obtain a copy of the License
    at http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    */
    function queryElement(el, callback) {
      getGlobalScheduler().queryElement(el, callback);
    }
    function elementSatisfiesRatio(el, ratio, callback, rootMargin) {
      if (ratio === void 0) {
        ratio = 0;
      }

      if (rootMargin === void 0) {
        rootMargin = {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0
        };
      }

      queryElement(el, function (clientRect, frame) {
        var entry = generateEntry(frame, clientRect, el, rootMargin);
        callback(entry.isIntersecting && entry.intersectionRatio >= ratio);
      });
    }

    exports.on = on$$1;
    exports.off = off$$1;
    exports.scheduleRead = scheduleRead$$1;
    exports.scheduleWork = scheduleWork$$1;
    exports.IntersectionObserver = SpanielIntersectionObserver;
    exports.SpanielObserver = SpanielObserver;
    exports.setGlobalEngine = setGlobalEngine;
    exports.getGlobalEngine = getGlobalEngine;
    exports.__w__ = W;
    exports.invalidate = invalidate;
    exports.queryElement = queryElement;
    exports.elementSatisfiesRatio = elementSatisfiesRatio;
    exports.Watcher = Watcher;

    Object.defineProperty(exports, '__esModule', { value: true });

});
