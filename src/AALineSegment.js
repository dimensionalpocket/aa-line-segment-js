// @ts-check

'use strict'

// Data indexes
const POSITION_BASE = 0
const A_BASE = 1
const B_BASE = 2
const POSITION_GLOBAL = 3
const A_GLOBAL = 4
const B_GLOBAL = 5
// const FLIP_MODIFIER_BASE = 6
// const FLIP_MODIFIER_GLOBAL = 7

export class AALineSegment {
  /**
   * @param {number} a - Start of the segment.
   * @param {number} b - End of the segment.
   */
  constructor (a, b) {
    /**
     * @type {Float64Array}
     * @private
     */
    this._data = new Float64Array(8)

    // data[FLIP_MODIFIER_BASE] = 1

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
    return this._data[A_GLOBAL]
  }

  /**
   * Returns the global position of the end point.
   * @returns {number}
   */
  get b () {
    return this._data[B_GLOBAL]
  }

  /**
   * @param {number} value
   */
  set a (value) {
    var data = this._data
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
    var data = this._data
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
    var data = this._data
    var oldPos = data[POSITION_BASE]
    var delta = value - oldPos

    if (delta === 0) return

    data[POSITION_BASE] = value

    this.update(delta)
  }

  /**
   *
   * @param {AALineSegment} child
   */
  add (child) {
    this.children.push(child)

    var positionDelta = this._data[POSITION_GLOBAL]

    child.update(positionDelta)

    // var parentData = this._data
    // var childData = child._data

    // childData[POSITION_GLOBAL] += parentData[POSITION_GLOBAL]
  }

  /**
   * Updates globals based on incremental changes in position.
   *
   * @param {number} positionDelta - Position change value.
   */
  update (positionDelta) {
    if (positionDelta === 0) return

    var data = this._data

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
