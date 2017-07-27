# ember-spaniel Changelog

### 0.2.0 (July 27, 2017)

Bump [`spaniel`](https://github.com/linkedin/spaniel) to `3.0.0`.

* `defaultRootMargin` sign flip. Positive `defaultRootMargin` values now expand offset. This is a breaking change.
* Use native `IntersectionObserver` when available
* When polling `requestAnimationFrame`, only poll every 3 frames instead of every single frame. This improves performance, but will slightly slow down reaction time to changes.