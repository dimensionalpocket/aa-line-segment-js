'use strict'

import { expect } from '@dimensionalpocket/development'
import { AALineSegment } from '../src/AALineSegment.js'

describe('AALineSegment', function () {
  describe('#a=', function () {
    before(function () {
      // -9 -8 -7 -6 -5 -4 -3 -2 -1  0  1  2  3  4  5  6  7  8  9
      //  ├──┬──┬──┬──┬──┬──┬──┬──┬──┼──┬──┬──┬──┬──┬──┬──┬──┬──┤
      //                             P  A───────────B
      this.segment = new AALineSegment(1, 5)
    })

    context('when position is zero', function () {
      before(function () {
        // -9 -8 -7 -6 -5 -4 -3 -2 -1  0  1  2  3  4  5  6  7  8  9
        //  ├──┬──┬──┬──┬──┬──┬──┬──┬──┼──┬──┬──┬──┬──┬──┬──┬──┬──┤
        //                             P  A───────────B     (before A change)
        //                             P     A────────B     (after A change)
        this.segment.position = 0
      })

      it('updates global A to same value as local A', function () {
        this.segment.a = 2
        expect(this.segment.a).to.eq(2)
      })
    })

    context('when position is not zero', function () {
      before(function () {
        // -9 -8 -7 -6 -5 -4 -3 -2 -1  0  1  2  3  4  5  6  7  8  9
        //  ├──┬──┬──┬──┬──┬──┬──┬──┬──┼──┬──┬──┬──┬──┬──┬──┬──┬──┤
        //                             P     A────────B      (before position change)
        //                                P     A────────B   (after position change)
        this.segment.position = 1
      })

      it('updates global A to local A + position', function () {
        this.segment.a = 2
        expect(this.segment.a).to.eq(3)
      })
    })

    context('when segment is flipped', function () {
      before(function () {
        // -9 -8 -7 -6 -5 -4 -3 -2 -1  0  1  2  3  4  5  6  7  8  9
        //  ├──┬──┬──┬──┬──┬──┬──┬──┬──┼──┬──┬──┬──┬──┬──┬──┬──┬──┤
        //                             P  A───────────B  (unflipped)
        //              A───────────B  P                 (flipped around position)
        this.segment = new AALineSegment(1, 5)
        this.segment.flip(true)
      })

      after(function () {
        this.segment.flip(false)
      })

      context('when position is zero', function () {
        before(function () {
          // -9 -8 -7 -6 -5 -4 -3 -2 -1  0  1  2  3  4  5  6  7  8  9
          //  ├──┬──┬──┬──┬──┬──┬──┬──┬──┼──┬──┬──┬──┬──┬──┬──┬──┬──┤
          //              A───────────B  P                 (before A change)
          //              A────────B     P                 (after A change ── changes B)
          this.segment.position = 0
        })

        it('updates global B to inverse of local A', function () {
          this.segment.a = 2
          expect(this.segment.b).to.eq(-2)
        })
      })

      context('when position is not zero', function () {
        before(function () {
          // -9 -8 -7 -6 -5 -4 -3 -2 -1  0  1  2  3  4  5  6  7  8  9
          //  ├──┬──┬──┬──┬──┬──┬──┬──┬──┼──┬──┬──┬──┬──┬──┬──┬──┬──┤
          //              A───────────B  P                 (before A change)
          //              A────────B     P                 (before position change)
          //                       A────────B     P        (after position change)
          this.segment.a = 2
          this.segment.position = 3
        })

        it('updates global B to inverse local A + position', function () {
          expect(this.segment.b).to.eq(1)
        })
      })
    })
  })
})
