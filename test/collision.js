'use strict'

import { expect } from '@dimensionalpocket/development'
import { AALineSegment } from '../src/AALineSegment.js'

describe('AALineSegment', function () {
  describe('#collidesWith', function () {
    before(function () {
      this.segment1 = new AALineSegment(-2, -1)
      this.segment2 = new AALineSegment(1, 2)
    })

    context('when segment1 is to the far left of segment2', function () {
      it('returns false', function () {
        expect(this.segment1.collidesWith(this.segment2)).to.eq(false)
      })
    })

    context('when segment1 is to the far right of segment2', function () {
      it('returns false', function () {
        this.segment1.position = 5
        expect(this.segment1.collidesWith(this.segment2)).to.eq(false)
        this.segment1.position = 0
      })
    })

    context('when segment1 touches segment2 on the left', function () {
      it('returns true', function () {
        this.segment1.position = 2
        expect(this.segment1.collidesWith(this.segment2)).to.eq(true)
        this.segment1.position = 0
      })
    })

    context('when segment1 touches segment2 on the right', function () {
      it('returns true', function () {
        this.segment1.position = 4
        expect(this.segment1.collidesWith(this.segment2)).to.eq(true)
        this.segment1.position = 0
      })
    })

    context('when segment1 intersects with segment2 on the left', function () {
      it('returns true', function () {
        this.segment1.position = 3
        expect(this.segment1.collidesWith(this.segment2)).to.eq(true)
        this.segment1.position = 0
      })
    })

    context('when segment1 intersects with segment2 on the right', function () {
      it('returns true', function () {
        this.segment1.position = 3.5
        expect(this.segment1.collidesWith(this.segment2)).to.eq(true)
        this.segment1.position = 0
      })
    })
  })
})
