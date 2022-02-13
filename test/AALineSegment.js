// @ts-check

'use strict'

import { expect } from '@dimensionalpocket/development'
import { AALineSegment, FLIP_MODIFIER_BASE, FLIP_MODIFIER_GLOBAL } from '../src/AALineSegment.js'

describe('AALineSegment', function () {
  describe('constructor', function () {
    before(function () {
      this.segment = new AALineSegment(-1, 5)
    })

    it('sets flip defaults', function () {
      expect(this.segment.data[FLIP_MODIFIER_BASE]).to.eq(1)
      expect(this.segment.data[FLIP_MODIFIER_GLOBAL]).to.eq(1)
    })

    it('sets a and b correctly', function () {
      expect(this.segment.a).to.eq(-1)
      expect(this.segment.b).to.eq(5)
    })
  })
})
