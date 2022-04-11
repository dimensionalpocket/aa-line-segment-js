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

/* 
-9 -8 -7 -6 -5 -4 -3 -2 -1  0  1  2  3  4  5  6  7  8  9
 ├──┬──┬──┬──┬──┬──┬──┬──┬──┼──┬──┬──┬──┬──┬──┬──┬──┬──┤
                         A──P──────────────B 
                            ↑
                            Position starts at 0
*/

segment.a // <= -1
segment.b // <= 5
```

### Positioning

The segment can be moved along the axis:

```js
segment.position = 2

/* 
-9 -8 -7 -6 -5 -4 -3 -2 -1  0  1  2  3  4  5  6  7  8  9
 ├──┬──┬──┬──┬──┬──┬──┬──┬──┼──┬──┬──┬──┬──┬──┬──┬──┬──┤
                               A──P──────────────B
                                  ↑
                                  New position
*/

segment.a // <= 1
segment.b // <= 7
```

### Flipping

Segments can be flipped around their positions:

```js
segment.flip(true)

/* 
-9 -8 -7 -6 -5 -4 -3 -2 -1  0  1  2  3  4  5  6  7  8  9
 ├──┬──┬──┬──┬──┬──┬──┬──┬──┼──┬──┬──┬──┬──┬──┬──┬──┬──┤
                   A──────────────P──B
*/

segment.a // <= -3
segment.b // <= 3

segment.flip(false) // unflip
```

### Nested Segments

Segments can be added to other segments, inheriting their positions and flip states.

```js
var child = new AALineSegment(1, 2)

/* 
-9 -8 -7 -6 -5 -4 -3 -2 -1  0  1  2  3  4  5  6  7  8  9
 ├──┬──┬──┬──┬──┬──┬──┬──┬──┼──┬──┬──┬──┬──┬──┬──┬──┬──┤
                               A──P──────────────B

                            P  A──B
                            ↑
                            Child without parent, position 0
                            
*/

child.a // <= 1
child.b // <= 2
```

```js
segment.add(child)

/* 
-9 -8 -7 -6 -5 -4 -3 -2 -1  0  1  2  3  4  5  6  7  8  9 
 ├──┬──┬──┬──┬──┬──┬──┬──┬──┼──┬──┬──┬──┬──┬──┬──┬──┬──┤ 
                               A──P──────────────B       
                                  P  A──B
                                  ↑
                                  Child with parent, inherits position
*/

child.a // <= 3
child.b // <= 4
```

```js
child.flip(true)

/*
-9 -8 -7 -6 -5 -4 -3 -2 -1  0  1  2  3  4  5  6  7  8  9
 ├──┬──┬──┬──┬──┬──┬──┬──┬──┼──┬──┬──┬──┬──┬──┬──┬──┬──┤
                               A──P──────────────B
                            A──B  P
                                  ↑
                                  Flipped child
*/

child.a // <= 0
child.b // <= 1

child.flip(false) // unflip
```

Flipping the parent also flips its children:

```js
segment.flip(true)

/* 
-9 -8 -7 -6 -5 -4 -3 -2 -1  0  1  2  3  4  5  6  7  8  9
 ├──┬──┬──┬──┬──┬──┬──┬──┬──┼──┬──┬──┬──┬──┬──┬──┬──┬──┤
                   A──────────────P──B
                            A──B  P
*/

child.a // <= 0
child.b // <= 1
```

If any child is already flipped, their global flip state is toggled:

```js
child.flip(true)

/* 
-9 -8 -7 -6 -5 -4 -3 -2 -1  0  1  2  3  4  5  6  7  8  9
 ├──┬──┬──┬──┬──┬──┬──┬──┬──┼──┬──┬──┬──┬──┬──┬──┬──┬──┤
                   A──────────────P──B
                                  P  A──B
                                  ↑
                                  Child is flipped,
                                  but appears unflipped
                                  because parent is flipped
*/

child.a // <= 3
child.b // <= 4
```

## License

MIT
