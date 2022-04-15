'use strict'

import { expect } from '@dimensionalpocket/development'
import { AALineSegment } from '../src/AALineSegment.js'

describe('AALineSegment', function () {
  describe('#flip', function () {
    context('without parent', function () {
      context('with true', function () {
        before(function () {
          // -9 -8 -7 -6 -5 -4 -3 -2 -1  0  1  2  3  4  5  6  7  8  9
          //  ├──┬──┬──┬──┬──┬──┬──┬──┬──┼──┬──┬──┬──┬──┬──┬──┬──┬──┤
          //                          A──P──────────────B      (before flipping)
          //              A──────────────P──B                  (after flipping)
          this.segment = new AALineSegment(-1, 5)
          this.segment.flip(true)
        })

        it('flips A', function () {
          expect(this.segment.a).to.eq(-5)
        })

        it('flips B', function () {
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

          it('updates A', function () {
            expect(this.segment.a).to.eq(-3)
          })

          it('updates B', function () {
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

        it('restores A', function () {
          expect(this.segment.a).to.eq(-1)
        })

        it('restores B', function () {
          expect(this.segment.b).to.eq(5)
        })

        context('with position > 0', function () {
          before(function () {
            // -9 -8 -7 -6 -5 -4 -3 -2 -1  0  1  2  3  4  5  6  7  8  9
            //  ├──┬──┬──┬──┬──┬──┬──┬──┬──┼──┬──┬──┬──┬──┬──┬──┬──┬──┤
            //              A──────────────P──B                      (flip on)
            //                          A──P──────────────B          (flip off)
            //                                A──P──────────────B    (flip off w/ position)
            this.segment.position = 2
            this.segment.flip(true)
            this.segment.flip(false)
          })

          it('updates A', function () {
            expect(this.segment.a).to.eq(1)
          })

          it('updates B', function () {
            expect(this.segment.b).to.eq(7)
          })
        })
      })
    })

    context('with parent (unflipped)', function () {
      context('with true', function () {
        before(function () {
          // -9 -8 -7 -6 -5 -4 -3 -2 -1  0  1  2  3  4  5  6  7  8  9
          //  ├──┬──┬──┬──┬──┬──┬──┬──┬──┼──┬──┬──┬──┬──┬──┬──┬──┬──┤
          //                          A──P──────────────B      (before flipping)
          //              A──────────────P──B                  (after flipping)
          //
          //                                P  A──B            (parent)
          //                 A──────────────P──B               (under parent)
          this.parent = new AALineSegment(1, 2)
          this.parent.position = 1
          this.segment = new AALineSegment(-1, 5)
          this.segment.parent = this.parent
          this.segment.flip(true)
        })

        it('flips A', function () {
          expect(this.segment.a).to.eq(-4)
        })

        it('flips B', function () {
          expect(this.segment.b).to.eq(2)
        })

        context('with position > 0', function () {
          before(function () {
            // -9 -8 -7 -6 -5 -4 -3 -2 -1  0  1  2  3  4  5  6  7  8  9
            //  ├──┬──┬──┬──┬──┬──┬──┬──┬──┼──┬──┬──┬──┬──┬──┬──┬──┬──┤
            //                                P  A──B            (parent)
            //                 A──────────────P──B               (before position)
            //                       A──────────────P──B         (after position)
            this.segment.position = 2
          })

          it('updates A', function () {
            expect(this.segment.a).to.eq(-2)
          })

          it('updates B', function () {
            expect(this.segment.b).to.eq(4)
          })
        })
      })

      context('with false', function () {
        before(function () {
          // -9 -8 -7 -6 -5 -4 -3 -2 -1  0  1  2  3  4  5  6  7  8  9
          //  ├──┬──┬──┬──┬──┬──┬──┬──┬──┼──┬──┬──┬──┬──┬──┬──┬──┬──┤
          //              A──────────────P──B                  (flipped)
          //                          A──P──────────────B      (unflipped)
          //
          //                                P  A──B            (parent)
          //                             A──P──────────────B   (under parent)
          this.parent = new AALineSegment(1, 2)
          this.parent.position = 1
          this.segment = new AALineSegment(-1, 5)
          this.segment.parent = this.parent
          this.segment.flip(true)
          this.segment.flip(false)
        })

        it('restores A', function () {
          expect(this.segment.a).to.eq(0)
        })

        it('restores B', function () {
          expect(this.segment.b).to.eq(6)
        })

        context('with position > 0', function () {
          before(function () {
            // -9 -8 -7 -6 -5 -4 -3 -2 -1  0  1  2  3  4  5  6  7  8  9
            //  ├──┬──┬──┬──┬──┬──┬──┬──┬──┼──┬──┬──┬──┬──┬──┬──┬──┬──┤
            //                                P  A──B            (parent)
            //                             A──P──────────────B   (under parent, before position)
            //                       A──P──────────────B         (under parent, after position)
            this.segment.position = -2
            this.segment.flip(true)
            this.segment.flip(false)
          })

          it('updates A', function () {
            expect(this.segment.a).to.eq(-2)
          })

          it('updates B', function () {
            expect(this.segment.b).to.eq(4)
          })
        })
      })
    })

    context('with parent (flipped)', function () {
      context('with true', function () {
        before(function () {
          // -9 -8 -7 -6 -5 -4 -3 -2 -1  0  1  2  3  4  5  6  7  8  9
          //  ├──┬──┬──┬──┬──┬──┬──┬──┬──┼──┬──┬──┬──┬──┬──┬──┬──┬──┤
          //                          A──P──────────────B      (before flipping)
          //              A──────────────P──B                  (after flipping)
          //
          //                                P  A──B            (parent, unflipped)
          //                 A──────────────P──B               (under parent, flipped)
          //
          //                          A──B  P                  (parent, flipped)
          //                             A──P──────────────B   (under parent, becomes unflipped)
          this.parent = new AALineSegment(1, 2)
          this.parent.position = 1
          this.segment = new AALineSegment(-1, 5)
          this.segment.parent = this.parent
          this.parent.flip(true)
          this.segment.flip(true)
        })

        it('unflips A', function () {
          expect(this.segment.a).to.eq(0)
        })

        it('unflips B', function () {
          expect(this.segment.b).to.eq(6)
        })

        context('with position > 0', function () {
          before(function () {
            // -9 -8 -7 -6 -5 -4 -3 -2 -1  0  1  2  3  4  5  6  7  8  9
            //  ├──┬──┬──┬──┬──┬──┬──┬──┬──┼──┬──┬──┬──┬──┬──┬──┬──┬──┤
            //                                P  A──B            (parent, unflipped)
            //                 A──────────────P──B               (under parent, flipped)
            //                    A──────────────P──B            (under parent, flipped, after position)
            //
            //                          A──B  P                  (parent, flipped)
            //                             A──P──────────────B   (under parent, unflipped, before position)
            //                          A──P──────────────B      (under parent, after position)
            this.segment.position = 1
          })

          it('updates A', function () {
            expect(this.segment.a).to.eq(-1)
          })

          it('updates B', function () {
            expect(this.segment.b).to.eq(5)
          })
        })
      })

      context('with false', function () {
        before(function () {
          // -9 -8 -7 -6 -5 -4 -3 -2 -1  0  1  2  3  4  5  6  7  8  9
          //  ├──┬──┬──┬──┬──┬──┬──┬──┬──┼──┬──┬──┬──┬──┬──┬──┬──┬──┤
          //              A──────────────P──B                  (flipped)
          //                          A──P──────────────B      (unflipped)
          //
          //                                P  A──B            (parent, unflipped)
          //                             A──P──────────────B   (under parent, unflipped)
          //
          //                          A──B  P                  (parent, flipped)
          //                 A──────────────P──B               (under parent, unflipped but appears flipped)
          this.parent = new AALineSegment(1, 2)
          this.parent.position = 1
          this.segment = new AALineSegment(-1, 5)
          this.segment.parent = this.parent
          this.parent.flip(true)
          this.segment.flip(true)
          this.segment.flip(false)
        })

        it('flips A', function () {
          expect(this.segment.a).to.eq(-4)
        })

        it('flips B', function () {
          expect(this.segment.b).to.eq(2)
        })

        context('with position > 0', function () {
          before(function () {
            // -9 -8 -7 -6 -5 -4 -3 -2 -1  0  1  2  3  4  5  6  7  8  9
            //  ├──┬──┬──┬──┬──┬──┬──┬──┬──┼──┬──┬──┬──┬──┬──┬──┬──┬──┤
            //                          A──P──────────────B        (segment before position)
            //                             A──P──────────────B     (segment after position)
            //
            //                                P  A──B              (parent, unflipped)
            //                             A──P──────────────B     (under parent, unflipped, before position)
            //                                A──P──────────────B  (under parent, unflipped, after position)
            //
            //                          A──B  P                    (parent, flipped)
            //                 A──────────────P──B                 (under parent, unflipped but appears flipped, before position)
            //              A──────────────P──B                    (under parent, after position)
            // console.log(this.segment)
            this.segment.position = 1
            // console.log(this.segment)
          })

          it.skip('updates A', function () {
            expect(this.segment.a).to.eq(-5)
          })

          it.skip('updates B', function () {
            expect(this.segment.b).to.eq(1)
          })
        })
      })
    })
  })
})
