'use strict'

import { expect, sinon } from '@dimensionalpocket/development'
import { AALineSegment } from '../src/AALineSegment.js'

describe('AALineSegment', function () {
  describe('#add', function () {
    before(function () {
      this.sandbox = sinon.createSandbox()
      this.parent = new AALineSegment(1, 2)
      this.child = new AALineSegment(3, 4)
      this.calledParentSetterWith = null
      this.sandbox.stub(this.child, 'parent').set((/** @type {any} */ arg) => { this.calledParentSetterWith = arg })
      this.parent.add(this.child)
    })

    after(function () {
      this.sandbox.restore()
    })

    it('calls the parent setter of the given segment with self', function () {
      expect(this.calledParentSetterWith).to.eq(this.parent)
    })
  })
})
