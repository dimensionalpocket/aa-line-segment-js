'use strict'

// Data indexes
export const POSITION_LOCAL = 0
export const A_LOCAL = 1
export const B_LOCAL = 2
export const POSITION_GLOBAL = 3
export const A_GLOBAL = 4
export const B_GLOBAL = 5
export const FLIP_MODIFIER_LOCAL = 6
export const FLIP_MODIFIER_GLOBAL = 7

export class AALineSegment {
  /**
   * @param {number} a - Start of the segment.
   * @param {number} b - End of the segment.
   */
  constructor (a, b) {
    var data = new Float64Array(8)

    // Default flip modifiers.
    data[FLIP_MODIFIER_LOCAL] = 1
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
   *
   * @returns {number}
   */
  get a () {
    return this.data[A_GLOBAL]
  }

  /**
   * Returns the global position of the end point.
   *
   * @returns {number}
   */
  get b () {
    return this.data[B_GLOBAL]
  }

  /**
   * Sets local A.
   * Updates global A (unflipped) or B (flipped).
   *
   * @param {number} value
   */
  set a (value) {
    var data = this.data
    var current = data[A_LOCAL]
    var delta = value - current

    if (delta === 0) return

    data[A_LOCAL] = value

    if (this.flipped()) {
      data[B_GLOBAL] -= delta
    } else {
      data[A_GLOBAL] += delta
    }
  }

  /**
   * Sets local B.
   * Updates global B (unflipped) or A (flipped) based on delta.
   *
   * @param {number} value
   */
  set b (value) {
    var data = this.data
    var current = data[B_LOCAL]
    var delta = value - current

    if (delta === 0) return

    data[B_LOCAL] = value

    if (this.flipped()) {
      data[A_GLOBAL] -= delta
    } else {
      data[B_GLOBAL] += delta
    }
  }

  /**
   * @param {number} value
   */
  set position (value) {
    var data = this.data
    var oldPos = data[POSITION_LOCAL]
    var delta = value - oldPos

    if (delta === 0) return

    data[POSITION_LOCAL] = value

    this.updateGlobalPosition(delta)
  }

  /**
   * @param {?AALineSegment} newParent
   */
  set parent (newParent) {
    var data = this.data
    var positionDelta

    if (newParent == null) {
      // Removing the parent resets globals to their base values.
      // Using delta update on position so children can be updated as well.
      data[A_GLOBAL] = data[A_LOCAL]
      data[B_GLOBAL] = data[B_LOCAL]

      data[FLIP_MODIFIER_GLOBAL] = data[FLIP_MODIFIER_LOCAL]
      positionDelta = -data[POSITION_GLOBAL]
      this.updateGlobalPosition(positionDelta)
      return
    }

    var oldParent = this._parent
    if (oldParent) {
      positionDelta = newParent.data[POSITION_GLOBAL] - oldParent.data[POSITION_GLOBAL]
    } else {
      positionDelta = newParent.data[POSITION_GLOBAL]
    }

    this.updateGlobalPosition(positionDelta)
  }

  get parent () {
    return this._parent
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
    var oldMod = data[FLIP_MODIFIER_LOCAL]

    if ((newMod > 0 && oldMod > 0) || (newMod < 0 && oldMod < 0)) return // no change

    data[FLIP_MODIFIER_LOCAL] = newMod

    // If local mod changed, global mod will always toggle
    data[FLIP_MODIFIER_GLOBAL] *= -1

    if (this.flipped()) {
      this.onFlip()
    } else {
      this.onUnflip()
    }
  }

  /**
   * Called after the segment is flipped globally.
   */
  onFlip () {
    var data = this.data

    // Flips A and B globals around its position
    var position = data[POSITION_GLOBAL]

    // var pA = data[A_GLOBAL] - position
    // var pB = data[B_GLOBAL] - position

    data[A_GLOBAL] = position - data[B_LOCAL]
    data[B_GLOBAL] = position - data[A_LOCAL]

    // data[POSITION_GLOBAL] += data[POSITION_LOCAL] * 2

    // this.flipAB()

    // /** @type {Array<AALineSegment>} */
    // var children = this.children

    // /** @type {AALineSegment} */
    // var child

    // // Flips all children
    // for (child of children) {
    //   child.data[FLIP_MODIFIER_GLOBAL] *= -1
    // }

    // // Determines the position delta caused by flipping.
    // // This *only* affects children!
    // var position = data[POSITION_GLOBAL]
    // var positionDelta
    // for (child of children) {
    //   // We calculate the position difference between the parent and child
    //   // then multiply by 2 as we have to send the child "across" the position
    //   positionDelta = -(child.data[POSITION_GLOBAL] - position) * 2
    //   child.updateGlobalPosition(positionDelta)
    // }
  }

  onUnflip () {
    var data = this.data

    // Restores A and B globals
    var position = data[POSITION_GLOBAL]

    data[A_GLOBAL] = position + data[A_LOCAL]
    data[B_GLOBAL] = position + data[B_LOCAL]

    // TODO
  }

  /**
   * `true` if segment is flipped globally.
   *
   * @returns {boolean}
   */
  flipped () {
    return this.data[FLIP_MODIFIER_GLOBAL] < 0
  }

  /**
   * @param {number} delta - Position change difference.
   */
  updateGlobalPosition (delta) {
    if (delta === 0) return

    var data = this.data

    if (this.flipped()) {
      data[POSITION_GLOBAL] -= delta
      data[A_GLOBAL] -= delta
      data[B_GLOBAL] -= delta
    } else {
      data[POSITION_GLOBAL] += delta
      data[A_GLOBAL] += delta
      data[B_GLOBAL] += delta
    }

    /** @type {Array<AALineSegment>} */
    var children = this.children

    if (children.length === 0) return

    /** @type {AALineSegment} */
    var child

    for (child of children) {
      child.updateGlobalPosition(delta)
    }
  }
}
