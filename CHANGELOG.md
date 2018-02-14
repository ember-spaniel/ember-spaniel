# ember-spaniel Changelog

### 0.3.4 (February 14, 2018)
* Spaniel Dependency Bump and unpinned to ^2.4.7

### 0.3.0 (August 4, 2017)

Downgrade [`spaniel`](https://github.com/linkedin/spaniel) to `2.3.0` to workaround [issue #14](https://github.com/asakusuma/ember-spaniel/issues/14) for the time being. Reverses the last breaking `defaultRootMargin` change. Also reverts back to always using Spaniel's IntersectionObserver.

### 0.2.0 (July 27, 2017)

Bump [`spaniel`](https://github.com/linkedin/spaniel) to `3.0.0`.

* `defaultRootMargin` sign flip. Positive `defaultRootMargin` values now expand offset. This is a breaking change.
* Use native `IntersectionObserver` when available
* When polling `requestAnimationFrame`, only poll every 3 frames instead of every single frame. This improves performance, but will slightly slow down reaction time to changes.