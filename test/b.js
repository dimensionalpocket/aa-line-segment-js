// @ts-check

'use strict'

import { expect } from '@dimensionalpocket/development'
import { AALineSegment } from '../src/AALineSegment.js'

describe('AALineSegment', function () {
  describe('#b=', function () {
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
        //                             P  A───────────B     (before B change)
        //                             P  A────────B        (after B change)
        this.segment.b = 4
        this.segment.position = 0
      })

      it('updates global B to same value as local B', function () {
        expect(this.segment.b).to.eq(4)
      })
    })

    context('when position is not zero', function () {
      before(function () {
        // -9 -8 -7 -6 -5 -4 -3 -2 -1  0  1  2  3  4  5  6  7  8  9
        //  ├──┬──┬──┬──┬──┬──┬──┬──┬──┼──┬──┬──┬──┬──┬──┬──┬──┬──┤
        //                             P     A────────B      (before position change)
        //                                P     A────────B   (after position change)
        this.segment.b = 5
        this.segment.position = 1
      })

      it('updates global B to local B + position', function () {
        expect(this.segment.b).to.eq(6)
      })
    })

    context('when segment is flipped', function () {
      before(function () {
        // -9 -8 -7 -6 -5 -4 -3 -2 -1  0  1  2  3  4  5  6  7  8  9
        //  ├──┬──┬──┬──┬──┬──┬──┬──┬──┼──┬──┬──┬──┬──┬──┬──┬──┬──┤
        //                             P  A───────────B  (unflipped)
        //              A───────────B  P                 (flipped around position)
        this.segment.b = 5
        this.segment.flip(true)
      })

      after(function () {
        this.segment.flip(false)
      })

      context('when position is zero', function () {
        before(function () {
          // -9 -8 -7 -6 -5 -4 -3 -2 -1  0  1  2  3  4  5  6  7  8  9
          //  ├──┬──┬──┬──┬──┬──┬──┬──┬──┼──┬──┬──┬──┬──┬──┬──┬──┬──┤
          //              A───────────B  P                 (before B change)
          //                 A────────B  P                 (after B change ── changes A)
          this.segment.position = 0
          this.segment.b = 4
        })

        it('updates global A to inverse of local B', function () {
          expect(this.segment.a).to.eq(-4)
        })
      })

      context('when position is not zero', function () {
        before(function () {
          // -9 -8 -7 -6 -5 -4 -3 -2 -1  0  1  2  3  4  5  6  7  8  9
          //  ├──┬──┬──┬──┬──┬──┬──┬──┬──┼──┬──┬──┬──┬──┬──┬──┬──┬──┤
          //              A───────────B  P                 (before B change)
          //                 A────────B  P                 (after B change)
          //                          A────────B  P        (after position change)
          this.segment.b = 4
          this.segment.position = 3
        })

        it('updates global A to inverse local B + position', function () {
          expect(this.segment.a).to.eq(-1)
        })
      })
    })
  })
})
