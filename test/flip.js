// @ts-check

'use strict'

import { expect } from '@dimensionalpocket/development'
import { AALineSegment } from '../src/AALineSegment.js'

describe('AALineSegment', function () {
  describe('#flip', function () {
    context('with true', function () {
      before(function () {
        // -9 -8 -7 -6 -5 -4 -3 -2 -1  0  1  2  3  4  5  6  7  8  9
        //  ├──┬──┬──┬──┬──┬──┬──┬──┬──┼──┬──┬──┬──┬──┬──┬──┬──┬──┤
        //                          A──P──────────────B      (before flipping)
        //              A──────────────P──B                  (after flipping)
        this.segment = new AALineSegment(-1, 5)
        this.segment.flip(true)
      })

      it('flips A and B', function () {
        expect(this.segment.a).to.eq(-5)
        expect(this.segment.b).to.eq(1)
      })

      context('with position > 0', function () {
        before(function () {
          // -9 -8 -7 -6 -5 -4 -3 -2 -1  0  1  2  3  4  5  6  7  8  9
          //  ├──┬──┬──┬──┬──┬──┬──┬──┬──┼──┬──┬──┬──┬──┬──┬──┬──┬──┤
          //              A──────────────P──B                  (before position)
          //                    A──────────────P──B            (after position)
          this.segment.position = 2
        })

        it('updates A and B', function () {
          expect(this.segment.a).to.eq(-3)
          expect(this.segment.b).to.eq(3)
        })
      })
    })

    context('with false', function () {
      before(function () {
        // -9 -8 -7 -6 -5 -4 -3 -2 -1  0  1  2  3  4  5  6  7  8  9
        //  ├──┬──┬──┬──┬──┬──┬──┬──┬──┼──┬──┬──┬──┬──┬──┬──┬──┬──┤
        //              A──────────────P──B                  (flip on)
        //                          A──P──────────────B      (flip off)
        this.segment = new AALineSegment(-1, 5)
        this.segment.flip(true)
        this.segment.flip(false)
      })

      it('restores A and B', function () {
        expect(this.segment.a).to.eq(-1)
        expect(this.segment.b).to.eq(5)
      })
    })
  })
})
