'use strict'

import { expect } from '@dimensionalpocket/development'
import { AALineSegment } from '../src/AALineSegment.js'

describe('AALineSegment', function () {
  describe('#position=', function () {
    before(function () {
      this.segment = new AALineSegment(1, 2)
      this.segment.position = 1
    })

    it('updates global A', function () {
      expect(this.segment.a).to.eq(2)
    })

    it('updates global B', function () {
      expect(this.segment.b).to.eq(3)
    })

    it('updates global position', function () {
      expect(this.segment.position).to.eq(1)
    })
  })
})
