# Axis-Aligned Line Segment

A Node library for line segment operations. Features include:

* positioning,
* nesting (add segments inside segments),
* flipping around its pivot,
* global positioning, and
* collision detection.

It is tailored for usage in games that require a box management system, for handling things such as scrolling stages, hitboxes/hurtboxes, etc.

## Usage

```js
var segment = new AALineSegment(-1, 5) // from -1 to 5
segment.a // <= -1
segment.b // <= 5

segment.length // <= 6

segment.position = 10 // move the segment along the axis
segment.a // <= 9
segment.b // <= 15

segment.flip() // flips the segment around point zero
segment.a // <= -15
segment.b // <= -9
segment.unflip()

var child = new AALineSegument(1, 2)
child.a // <= 1
child.b // <= 2

segment.add(child)
child.a // <= 10 - global position changed by parent
child.b // <= 12
child.localA // <= 1
child.localB // <= 2

```