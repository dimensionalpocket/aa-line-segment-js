# Axis-Aligned Line Segment

[![build](https://github.com/dimensionalpocket/aa-line-segment-js/actions/workflows/node.js.yml/badge.svg)](https://github.com/dimensionalpocket/aa-line-segment-js/actions/workflows/node.js.yml) [![Total alerts](https://img.shields.io/lgtm/alerts/g/dimensionalpocket/aa-line-segment-js.svg)](https://lgtm.com/projects/g/dimensionalpocket/aa-line-segment-js/alerts/) [![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/dimensionalpocket/aa-line-segment-js.svg)](https://lgtm.com/projects/g/dimensionalpocket/aa-line-segment-js/context:javascript)

A Node library for line segment manipulations. Features include:

* positioning,
* nesting (add segments inside segments),
* flipping around its position,
* global positioning, and
* collision detection.

It is tailored for usage in games that require a box management system, for handling things such as scrolling stages, hitboxes/hurtboxes, etc.

## Usage

```js
var segment = new AALineSegment(-1, 5)
segment.a // <= -1
segment.b // <= 5

segment.length // <= 6

segment.position = 10 // move the segment along the axis
segment.a // <= 9
segment.b // <= 15

segment.flip(true) // flip the segment around its position
segment.a // <= -15
segment.b // <= -9
segment.flip(false) // unflip

var child = new AALineSegment(1, 2)
child.a // <= 1
child.b // <= 2

segment.add(child)
child.a // <= 11 - global position changed by parent's position (10)
child.b // <= 12
```

## Flipping

Calling `segment.flip(true)` will flip a segment (and all its children) around its position:

![Flipping](https://raw.githubusercontent.com/dimensionalpocket/docs/main/draw.io/aa-line-segment.png)

Call `segment.flip(false)` to unflip.

## License

MIT
