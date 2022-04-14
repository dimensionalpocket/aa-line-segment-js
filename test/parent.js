// @ts-check

'use strict'

import { expect } from '@dimensionalpocket/development'
import { AALineSegment } from '../src/AALineSegment.js'

describe('AALineSegment', function () {
  describe('#parent=', function () {
    context('when given parent is not flipped', function () {
      context('when child does not have a parent', function () {
        before(function () {
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
          expect(this.child.a).to.eq(3 + 2 + 1) // a + child local position + parent world position
        })

        it('updates the global B on the child', function () {
          expect(this.child.b).to.eq(4 + 2 + 1) // b + child local position + parent world position
        })

        it('updates the global position on the child', function () {
          expect(this.child.position).to.eq(2 + 1)
        })
      })

      context('when child has a parent', function () {
        before(function () {
          this.parent = new AALineSegment(1, 2)
          this.parent.position = 1
          this.parent.flip(true)
          this.parent2 = new AALineSegment(-2, -1)
          this.parent2.position = -1
          this.child = new AALineSegment(3, 4)
          this.child.position = 2
          this.child.parent = this.parent2
          this.child.parent = this.parent
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

        it.skip('updates the global A on the child', function () {
          expect(this.child.a).to.eq(3 + 2 + 1) // a + child local position + parent world position
        })

        it.skip('updates the global B on the child', function () {
          expect(this.child.b).to.eq(4 + 2 + 1) // b + child local position + parent world position
        })

        it.skip('updates the global position on the child', function () {
          expect(this.child.position).to.eq(2 + 1)
        })
      })
    })

    context.skip('when null', function () {
      context('when child has a parent', function () {
        before(function () {
          this.parent = new AALineSegment(1, 2)
          this.parent.position = 1
          this.parent.flip(true)
          this.child = new AALineSegment(3, 4)
          this.child.position = 2
          this.child.parent = this.parent
          this.child.parent = null
          // console.log(this.child)
        })

        it('restores global A', function () {
          expect(this.child.a).to.eq(3)
        })

        it('restores global B', function () {
          expect(this.child.b).to.eq(4)
        })

        it('restores global position', function () {
          expect(this.child.position).to.eq(2)
        })

        it('restores flip state', function () {
          expect(this.child._worldFlipped).to.eq(false)
        })
      })
    })
  })
})
