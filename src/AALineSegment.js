// @ts-check

'use strict'

// Data indexes
export const POSITION_BASE = 0
export const A_BASE = 1
export const B_BASE = 2
export const POSITION_GLOBAL = 3
export const A_GLOBAL = 4
export const B_GLOBAL = 5
export const FLIP_MODIFIER_BASE = 6
export const FLIP_MODIFIER_GLOBAL = 7

export class AALineSegment {
  /**
   * @param {number} a - Start of the segment.
   * @param {number} b - End of the segment.
   */
  constructor (a, b) {
    var data = new Float64Array(8)

    // Default flip modifiers.
    data[FLIP_MODIFIER_BASE] = 1
    data[FLIP_MODIFIER_GLOBAL] = 1

    /**
     * @type {Float64Array}
     * @readonly
     */
    this.data = data

    /**
     * @type {?AALineSegment}
     */
    this._parent = null

    /**
     * @type {Array<AALineSegment>}
     */
    this.children = []

    this.a = a
    this.b = b
  }

  /**
   * Returns the global position of the start point.
   * @returns {number}
   */
  get a () {
    return this.data[A_GLOBAL]
  }

  /**
   * Returns the global position of the end point.
   * @returns {number}
   */
  get b () {
    return this.data[B_GLOBAL]
  }

  /**
   * @param {number} value
   */
  set a (value) {
    var data = this.data
    var oldA = data[A_BASE]
    var delta = value - oldA

    if (delta === 0) return

    data[A_BASE] = value
    data[A_GLOBAL] = data[A_GLOBAL] + delta
  }

  /**
   * @param {number} value
   */
  set b (value) {
    var data = this.data
    var oldB = data[B_BASE]
    var delta = value - oldB

    if (delta === 0) return

    data[B_BASE] = value
    data[B_GLOBAL] = data[B_GLOBAL] + delta
  }

  /**
   * @param {number} value
   */
  set position (value) {
    var data = this.data
    var oldPos = data[POSITION_BASE]
    var delta = value - oldPos

    if (delta === 0) return

    data[POSITION_BASE] = value

    this.update(delta)
  }

  /**
   * @param {?AALineSegment} p
   */
  set parent (p) {
    // TODO this method is not finished
    var oldParent = this._parent

    this._parent = p

    var data = this.data

    var positionDelta

    if (p == null) {
      data[A_GLOBAL] = data[A_BASE]
      data[B_GLOBAL] = data[B_BASE]
      data[FLIP_MODIFIER_GLOBAL] = data[FLIP_MODIFIER_BASE]
      positionDelta = data[POSITION_BASE] - data[POSITION_GLOBAL]
    } else {
      p.children.push(this)
      positionDelta = this.data[POSITION_GLOBAL]
    }

    this.update(positionDelta)

    // var parentData = this.data
    // var childData = child.data

    // childData[POSITION_GLOBAL] += parentData[POSITION_GLOBAL]
  }

  /**
   *
   * @param {AALineSegment} child
   */
  add (child) {
    child.parent = this
  }

  /**
   * Flips a segment around its position.
   *
   * @param {boolean} flipped
   */
  flip (flipped) {
    var data = this.data

    var newMod = flipped ? -1 : 1
    var oldMod = data[FLIP_MODIFIER_BASE]

    if ((newMod > 0 && oldMod > 0) || (newMod < 0 && oldMod < 0)) return // no change

    data[FLIP_MODIFIER_BASE] = newMod
    data[FLIP_MODIFIER_GLOBAL] *= newMod

    // TODO
  }

  /**
   * Updates globals based on incremental changes in position.
   * Position can be indirectly changed by parent changes and flipping.
   *
   * @param {number} positionDelta - Position change value.
   */
  update (positionDelta) {
    if (positionDelta === 0) return

    var data = this.data

    data[POSITION_GLOBAL] = data[POSITION_GLOBAL] + positionDelta
    data[A_GLOBAL] = data[A_GLOBAL] + positionDelta
    data[B_GLOBAL] = data[B_GLOBAL] + positionDelta

    this.updateChildren(positionDelta)
  }

  /**
   * @param {number} positionDelta - Position change
   */
  updateChildren (positionDelta) {
    if (positionDelta === 0) return

    /** @type {Array<AALineSegment>} */
    var children = this.children

    if (children.length === 0) return

    /** @type {AALineSegment} */
    var child

    for (child of children) {
      child.update(positionDelta)
    }
  }
}
