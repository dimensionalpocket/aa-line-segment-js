// @ts-check

'use strict'

import { expect } from '@dimensionalpocket/development'
import { AALineSegment, FLIP_MODIFIER_LOCAL, FLIP_MODIFIER_GLOBAL } from '../src/AALineSegment.js'

describe('AALineSegment', function () {
  describe('constructor', function () {
    before(function () {
      this.segment = new AALineSegment(-1, 5)
    })

    it('sets flip defaults', function () {
      expect(this.segment.data[FLIP_MODIFIER_LOCAL]).to.eq(1)
      expect(this.segment.data[FLIP_MODIFIER_GLOBAL]).to.eq(1)
    })

    it('sets a and b correctly', function () {
      expect(this.segment.a).to.eq(-1)
      expect(this.segment.b).to.eq(5)
    })
  })

  describe('#a=', function () {
    before(function () {
      // -9 -8 -7 -6 -5 -4 -3 -2 -1  0  1  2  3  4  5  6  7  8  9
      //  |==|==|==|==|==|==|==|==|==|==|==|==|==|==|==|==|==|==|
      //                             P  A-----------B
      this.segment = new AALineSegment(1, 5)
    })

    context('when position is zero', function () {
      before(function () {
        // -9 -8 -7 -6 -5 -4 -3 -2 -1  0  1  2  3  4  5  6  7  8  9
        //  |==|==|==|==|==|==|==|==|==|==|==|==|==|==|==|==|==|==|
        //                             P  A-----------B     (before A change)
        //                             P     A--------B     (after A change)
        this.segment.a = 2
        this.segment.position = 0
      })

      it('updates global A to same value as local A', function () {
        expect(this.segment.a).to.eq(2)
      })
    })

    context('when position is not zero', function () {
      before(function () {
        // -9 -8 -7 -6 -5 -4 -3 -2 -1  0  1  2  3  4  5  6  7  8  9
        //  |==|==|==|==|==|==|==|==|==|==|==|==|==|==|==|==|==|==|
        //                             P     A--------B      (before position change)
        //                                P     A--------B   (after position change)
        this.segment.a = 2
        this.segment.position = 1
      })

      it('updates global A to local A + position', function () {
        expect(this.segment.a).to.eq(3)
      })
    })

    context.skip('when segment is flipped', function () {
      before(function () {
        // -9 -8 -7 -6 -5 -4 -3 -2 -1  0  1  2  3  4  5  6  7  8  9
        //  |==|==|==|==|==|==|==|==|==|==|==|==|==|==|==|==|==|==|
        //                             P  A-----------B  (unflipped)
        //              A-----------B  P                 (flipped around position)
        this.segment.a = 1
        this.segment.flip(true)
      })

      after(function () {
        this.segment.flip(false)
      })

      context('when position is zero', function () {
        before(function () {
          // -9 -8 -7 -6 -5 -4 -3 -2 -1  0  1  2  3  4  5  6  7  8  9
          //  |==|==|==|==|==|==|==|==|==|==|==|==|==|==|==|==|==|==|
          //              A-----------B  P                 (before A change)
          //              A--------B     P                 (after A change -- changes B)
          this.segment.position = 0
          this.segment.a = 2
        })

        it('updates global B to inverse of local A', function () {
          expect(this.segment.b).to.eq(-2)
        })
      })

      context('when position is not zero', function () {
        before(function () {
          // -9 -8 -7 -6 -5 -4 -3 -2 -1  0  1  2  3  4  5  6  7  8  9
          //  |==|==|==|==|==|==|==|==|==|==|==|==|==|==|==|==|==|==|
          //              A-----------B  P                 (before A change)
          //              A--------B     P                 (before position change)
          //                       A--------B     P        (after position change)
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
