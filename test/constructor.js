'use strict'

import { expect } from '@dimensionalpocket/development'
import { AALineSegment } from '../src/AALineSegment.js'

describe('AALineSegment', function () {
  describe('constructor', function () {
    before(function () {
      this.segment = new AALineSegment(-1, 5)
    })

    it('sets flip defaults', function () {
      expect(this.segment._localFlipped).to.eq(false)
      expect(this.segment._globalFlipped).to.eq(false)
    })

    it('sets a and b correctly', function () {
      expect(this.segment.a).to.eq(-1)
      expect(this.segment.b).to.eq(5)
    })
  })
})
