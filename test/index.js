// @ts-check

'use strict'

import { expect } from '@dimensionalpocket/development'

import AALineSegment from '../index.js'
import { AALineSegment as AALineSegmentFromSrc } from '../src/AALineSegment.js'

describe('index', function () {
  it('exports AALineSegment from src', function () {
    expect(AALineSegment).to.eq(AALineSegmentFromSrc)
  })
})
