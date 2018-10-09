# ember-spaniel Changelog

### 0.6.0 (October 9, 2018)
* Modify Node Support Engine dropping Node 4 and Node 6
* Unpin Spaniel for future patches

### 0.5.0 (August 27, 2018)
* Update build tooling
* Drop Travis testing support for Node 4 and Node 6
* Upgrade dependencies
* Migrate to yarn
* Prebuild spaniel.js
* Effectively pulls in the 1.0.0 improvements that are runtime backwards compatible.

### 0.4.0 (June 13, 2018)
* New API method `invalidate`
* Spaniel Dependency Bump to 2.5.0
* Includes the ability to watch a custom root within `onInViewportOnce`
* Includes optional perf flag `ALLOW_CACHED_SCHEDULER`

### 0.3.4 (February 14, 2018)
* Spaniel Dependency Bump and unpinned to ^2.4.7

### 0.3.0 (August 4, 2017)

Downgrade [`spaniel`](https://github.com/linkedin/spaniel) to `2.3.0` to workaround [issue #14](https://github.com/asakusuma/ember-spaniel/issues/14) for the time being. Reverses the last breaking `defaultRootMargin` change. Also reverts back to always using Spaniel's IntersectionObserver.

### 0.2.0 (July 27, 2017)

Bump [`spaniel`](https://github.com/linkedin/spaniel) to `3.0.0`.

* `defaultRootMargin` sign flip. Positive `defaultRootMargin` values now expand offset. This is a breaking change.
* Use native `IntersectionObserver` when available
* When polling `requestAnimationFrame`, only poll every 3 frames instead of every single frame. This improves performance, but will slightly slow down reaction time to changes.