'use strict'

import { expect } from '@dimensionalpocket/development'
import { AALineSegment } from '../src/AALineSegment.js'

describe('AALineSegment', function () {
  describe('#parent=', function () {
    context('when given parent is not flipped', function () {
      context('when child (not flipped) does not have a parent', function () {
        before(function () {
          // -9 -8 -7 -6 -5 -4 -3 -2 -1  0  1  2  3  4  5  6  7  8  9
          //  ├──┬──┬──┬──┬──┬──┬──┬──┬──┼──┬──┬──┬──┬──┬──┬──┬──┬──┤
          //                                   P        A──B      (child before add)
          //
          //                                P  A──B               (parent)
          //                                      P        A──B   (child after add)
          this.parent = new AALineSegment(1, 2)
          this.parent.position = 1
          this.child = new AALineSegment(3, 4)
          this.child.position = 2
          this.child.parent = this.parent
        })

        it('sets the child parent to the given segment', function () {
          expect(this.child.parent).to.eq(this.parent)
        })

        it('adds the child to the parent children array', function () {
          expect(this.parent._children).to.contain(this.child)
        })

        it('updates the global A on the child', function () {
          expect(this.child.a).to.eq(6)
        })

        it('updates the global B on the child', function () {
          expect(this.child.b).to.eq(7)
        })

        it('updates the global position on the child', function () {
          expect(this.child.position).to.eq(3)
        })
      })

      context('when child (flipped) does not have a parent', function () {
        before(function () {
          // -9 -8 -7 -6 -5 -4 -3 -2 -1  0  1  2  3  4  5  6  7  8  9
          //  ├──┬──┬──┬──┬──┬──┬──┬──┬──┼──┬──┬──┬──┬──┬──┬──┬──┬──┤
          //                                   P        A──B      (child before add)
          //                       A──B        P                  (flipped child before add)
          //
          //                                P  A──B               (parent)
          //                          A──B        P               (flipped child after add)
          this.parent = new AALineSegment(1, 2)
          this.parent.position = 1
          this.child = new AALineSegment(3, 4)
          this.child.position = 2
          this.child.flip(true)
          this.child.parent = this.parent
        })

        it('sets the child parent to the given segment', function () {
          expect(this.child.parent).to.eq(this.parent)
        })

        it('adds the child to the parent children array', function () {
          expect(this.parent._children).to.contain(this.child)
        })

        it('updates the global A on the child', function () {
          expect(this.child.a).to.eq(-1)
        })

        it('updates the global B on the child', function () {
          expect(this.child.b).to.eq(0)
        })

        it('updates the global position on the child', function () {
          expect(this.child.position).to.eq(3)
        })

        it('keeps the flip state on the child', function () {
          expect(this.child._globalFlipped).to.eq(true)
        })
      })

      context('when child (not flipped) has a parent (not flipped)', function () {
        before(function () {
          // -9 -8 -7 -6 -5 -4 -3 -2 -1  0  1  2  3  4  5  6  7  8  9
          //  ├──┬──┬──┬──┬──┬──┬──┬──┬──┼──┬──┬──┬──┬──┬──┬──┬──┬──┤
          //                                   P        A──B      (child before add)
          //
          //                    A──B  P                           (parent2)
          //                                P        A──B         (child after add to parent2)
          //
          //                                P  A──B               (parent)
          //                                      P        A──B   (child after re-add to parent)
          this.parent = new AALineSegment(1, 2)
          this.parent.position = 1
          this.parent2 = new AALineSegment(-2, -1)
          this.parent2.position = -1
          this.child = new AALineSegment(3, 4)
          this.child.position = 2
          this.child.parent = this.parent2
          this.child.parent = this.parent
        })

        it('updates the global A on the child', function () {
          expect(this.child.a).to.eq(6)
        })

        it('updates the global B on the child', function () {
          expect(this.child.b).to.eq(7)
        })

        it('updates the global position on the child', function () {
          expect(this.child.position).to.eq(3)
        })

        it('sets the child parent to the given segment', function () {
          expect(this.child.parent).to.eq(this.parent)
        })

        it('adds the child to the new parent children array', function () {
          expect(this.parent._children).to.contain(this.child)
        })

        it('removes the child from the old parent children array', function () {
          expect(this.parent2._children).to.not.contain(this.child)
        })
      })
    })

    context('when given parent is flipped', function () {
      context('when child (not flipped) does not have a parent', function () {
        before(function () {
          // -9 -8 -7 -6 -5 -4 -3 -2 -1  0  1  2  3  4  5  6  7  8  9
          //  ├──┬──┬──┬──┬──┬──┬──┬──┬──┼──┬──┬──┬──┬──┬──┬──┬──┬──┤
          //                                   P        A──B      (child before add)
          //
          //                                P  A──B               (parent)
          //                                      P        A──B   (child after add)
          //
          //                          A──B  P                     (parent - flipped)
          //              A──B        P                           (child flipped by parent)
          this.parent = new AALineSegment(1, 2)
          this.parent.position = 1
          this.parent.flip(true)
          this.child = new AALineSegment(3, 4)
          this.child.position = 2
          this.child.parent = this.parent
        })

        it('sets the child parent to the given segment', function () {
          expect(this.child.parent).to.eq(this.parent)
        })

        it('adds the child to the parent children array', function () {
          expect(this.parent._children).to.contain(this.child)
        })

        it('updates the global flip state on the child', function () {
          expect(this.child._globalFlipped).to.eq(true)
        })

        it('updates the global A on the child', function () {
          expect(this.child.a).to.eq(-5)
        })

        it('updates the global B on the child', function () {
          expect(this.child.b).to.eq(-4)
        })

        it('updates the global position on the child', function () {
          expect(this.child.position).to.eq(-1)
        })
      })
    })

    context('when null', function () {
      context('when child (not flipped) has a parent (not flipped)', function () {
        before(function () {
          // -9 -8 -7 -6 -5 -4 -3 -2 -1  0  1  2  3  4  5  6  7  8  9
          //  ├──┬──┬──┬──┬──┬──┬──┬──┬──┼──┬──┬──┬──┬──┬──┬──┬──┬──┤
          //                                P  A──B               (parent)
          //                                      P        A──B   (child under parent)
          //
          //                                   P        A──B      (child without parent)
          this.parent = new AALineSegment(1, 2)
          this.parent.position = 1
          this.child = new AALineSegment(3, 4)
          this.child.position = 2
          this.child.parent = this.parent
          this.child.parent = null
        })

        it('removes parent from child', function () {
          expect(this.child.parent).to.eq(null)
        })

        it('removes child from parent children', function () {
          expect(this.parent._children).to.not.contain(this.child)
        })

        it('restores global A', function () {
          expect(this.child.a).to.eq(5)
        })

        it('restores global B', function () {
          expect(this.child.b).to.eq(6)
        })

        it('restores global position', function () {
          expect(this.child.position).to.eq(2)
        })

        it('restores flip state', function () {
          expect(this.child._globalFlipped).to.eq(false)
        })
      })

      context('when child (flipped) has a parent (not flipped)', function () {
        before(function () {
          // -9 -8 -7 -6 -5 -4 -3 -2 -1  0  1  2  3  4  5  6  7  8  9
          //  ├──┬──┬──┬──┬──┬──┬──┬──┬──┼──┬──┬──┬──┬──┬──┬──┬──┬──┤
          //                                P  A──B               (parent)
          //                          A──B        P               (flipped child under parent)
          //
          //                       A──B        P                  (flipped child without parent)
          this.parent = new AALineSegment(1, 2)
          this.parent.position = 1
          this.child = new AALineSegment(3, 4)
          this.child.position = 2
          this.child.flip(true)
          this.child.parent = this.parent
          this.child.parent = null
        })

        it('removes parent from child', function () {
          expect(this.child.parent).to.eq(null)
        })

        it('removes child from parent children', function () {
          expect(this.parent._children).to.not.contain(this.child)
        })

        it('restores global A', function () {
          expect(this.child.a).to.eq(-2)
        })

        it('restores global B', function () {
          expect(this.child.b).to.eq(-1)
        })

        it('restores global position', function () {
          expect(this.child.position).to.eq(2)
        })

        it('keeps flip state', function () {
          expect(this.child._globalFlipped).to.eq(true)
        })
      })

      context('when child (not flipped) has a parent (flipped)', function () {
        before(function () {
          // -9 -8 -7 -6 -5 -4 -3 -2 -1  0  1  2  3  4  5  6  7  8  9
          //  ├──┬──┬──┬──┬──┬──┬──┬──┬──┼──┬──┬──┬──┬──┬──┬──┬──┬──┤
          //                                P  A──B               (parent)
          //                                      P        A──B   (child under parent)
          //
          //                          A──B  P                     (parent, flipped)
          //              A──B        P                           (child, appears flipped)
          //
          //                                   P        A──B      (child without parent)

          this.parent = new AALineSegment(1, 2)
          this.parent.position = 1
          this.parent.flip(true)
          this.child = new AALineSegment(3, 4)
          this.child.position = 2
          this.child.parent = this.parent
          this.child.parent = null
        })

        it('removes parent from child', function () {
          expect(this.child.parent).to.eq(null)
        })

        it('removes child from parent children', function () {
          expect(this.parent._children).to.not.contain(this.child)
        })

        it('restores global A', function () {
          expect(this.child.a).to.eq(5)
        })

        it('restores global B', function () {
          expect(this.child.b).to.eq(6)
        })

        it('restores global position', function () {
          expect(this.child.position).to.eq(2)
        })
      })

      context('when child (flipped) has a parent (flipped)', function () {
        before(function () {
          // -9 -8 -7 -6 -5 -4 -3 -2 -1  0  1  2  3  4  5  6  7  8  9
          //  ├──┬──┬──┬──┬──┬──┬──┬──┬──┼──┬──┬──┬──┬──┬──┬──┬──┬──┤
          //                                P  A──B               (parent, unflipped)
          //                          A──B        P               (child, flipped under parent)
          //
          //                          A──B  P                     (parent, flipped)
          //                          P        A──B               (child, flipped, appears unflipped)
          //
          //                       A──B        P                  (child, flipped without parent)

          this.parent = new AALineSegment(1, 2)
          this.parent.position = 1
          this.parent.flip(true)
          this.child = new AALineSegment(3, 4)
          this.child.position = 2
          this.child.flip(true)
          this.child.parent = this.parent
          this.child.parent = null
        })

        it('removes parent from child', function () {
          expect(this.child.parent).to.eq(null)
        })

        it('removes child from parent children', function () {
          expect(this.parent._children).to.not.contain(this.child)
        })

        it('restores global A', function () {
          expect(this.child.a).to.eq(-2)
        })

        it('restores global B', function () {
          expect(this.child.b).to.eq(-1)
        })

        it('restores global position', function () {
          expect(this.child.position).to.eq(2)
        })

        it('keeps flip state', function () {
          expect(this.child._globalFlipped).to.eq(true)
        })
      })
    })
  })
})
