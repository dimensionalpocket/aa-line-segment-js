'use strict'

export class AALineSegment {
  /**
   * @param {number} a - Start of the segment.
   * @param {number} b - End of the segment.
   */
  constructor (a, b) {
    /**
     * Local A.
     *
     * @type {number}
     */
    this._localA = a

    /**
     * Local B.
     *
     * @type {number}
     */
    this._localB = b

    /**
     * Local position.
     *
     * @type {number}
     */
    this._localPosition = 0

    /**
     * Local flip state.
     *
     * @type {boolean}
     */
    this._localFlipped = false

    /**
     * The global value of A, relative to the world.
     *
     * @type {number}
     */
    this._globalA = this._localA

    /**
     * The global value of B, relative to the world.
     *
     * @type {number}
     */
    this._globalB = this._localB

    /**
     * The global position, relative to the world.
     *
     * @type {number}
     */
    this._globalPosition = 0

    /**
     * Global flip state, relative to the world.
     *
     * @type {boolean}
     */
    this._globalFlipped = false

    /**
     * The parent segment.
     *
     * @type {?AALineSegment}
     */
    this._parent = null

    /**
     * The segment's children.
     *
     * @type {Array<AALineSegment>}
     */
    this._children = []
  }

  /**
   * Returns the global position of the start point.
   *
   * @returns {number}
   */
  get a () {
    return this._globalA
  }

  /**
   * Returns the global position of the end point.
   *
   * @returns {number}
   */
  get b () {
    return this._globalB
  }

  /**
   * Sets local A.
   * Updates global A (unflipped) or B (flipped).
   *
   * @param {number} value
   */
  set a (value) {
    var current = this._localA
    var delta = value - current

    if (delta === 0) return

    this._localA = value

    if (this._globalFlipped) {
      this._globalB -= delta
    } else {
      this._globalA += delta
    }
  }

  /**
   * Sets local B.
   * Updates global B (unflipped) or A (flipped).
   *
   * @param {number} value
   */
  set b (value) {
    var current = this._localB
    var delta = value - current

    if (delta === 0) return

    this._localB = value

    if (this._globalFlipped) {
      this._globalA -= delta
    } else {
      this._globalB += delta
    }
  }

  /**
   * Returns global position.
   *
   * @returns {number}
   */
  get position () {
    return this._globalPosition
  }

  /**
   * Sets local position and updates global positions of self and children.
   *
   * @param {number} value
   */
  set position (value) {
    var oldPos = this._localPosition
    var delta = value - oldPos

    if (delta === 0) return

    this._localPosition = value

    this.updateGlobalPosition(delta)
  }

  get parent () {
    return this._parent
  }

  /**
   * Set the segment's parent. If given `null`, removes the parent.
   *
   * @param {?AALineSegment} newParent
   */
  set parent (newParent) {
    var positionDelta
    var oldParent = this._parent

    if (newParent == null) {
      // Setting a null parent on a child without a parent
      // does not have any effect
      if (!oldParent) return

      // Remove this segment from the old parent's children
      var children = oldParent._children
      children.splice(children.indexOf(this), 1)

      this._parent = null

      // Removing the parent resets flip state.
      if (this._globalFlipped !== this._localFlipped) {
        this._globalFlipped = this._localFlipped
        if (this._globalFlipped) {
          this._onFlip()
        } else {
          this._onUnflip()
        }
      }

      positionDelta = -oldParent._globalPosition
      this.updateGlobalPosition(positionDelta)

      return
    }

    // Re-call this method with null to remove old parent, if any.
    // This isn't very efficient, but changing parents shouldn't be called often.
    this.parent = null

    this._parent = newParent
    newParent._children.push(this)

    // Segment will be translated by this amount.
    // This value may change based on the flip state of the parent.
    positionDelta = newParent._localPosition

    // Flip or unflip segment if orientation changed due to the new parent.
    if (newParent._globalFlipped !== this._globalFlipped) {
      this._globalFlipped = !this._globalFlipped
      positionDelta += this._localPosition
      if (this._globalFlipped) {
        positionDelta *= -1 // translate to the left
        this._onFlip()
      } else {
        this._onUnflip()
      }
      // console.log('parentFlip', this)
    }

    this.updateGlobalPosition(positionDelta)
  }

  /**
   * Add a child segment.
   *
   * @param {AALineSegment} child
   */
  add (child) {
    child.parent = this
  }

  /**
   * Flips a segment around its position.
   *
   * @param {boolean} newState
   */
  flip (newState) {
    var oldState = this._localFlipped

    if (newState === oldState) return // no change

    this._localFlipped = newState

    // If local mod changed, global mod will always toggle
    this._globalFlipped = !this._globalFlipped

    if (this._globalFlipped) {
      this._onFlip()
    } else {
      this._onUnflip()
    }
  }

  /**
   * Called after the segment is flipped globally.
   * Do not call this method directly!
   *
   * @private
   */
  _onFlip () {
    // Flips A and B globals around its position
    var globalPosition = this._globalPosition

    this._globalA = globalPosition - this._localB
    this._globalB = globalPosition - this._localA

    this._flipChildren()
  }

  /**
   * Called after the segment is unflipped globally.
   * Do not call this method directly!
   *
   * @private
   */
  _onUnflip () {
    // Restores A and B globals
    var position = this._globalPosition

    this._globalA = position + this._localA
    this._globalB = position + this._localB

    this._flipChildren()
  }

  /**
   * Called after the segment flip state changes.
   * Do not call this method directly!
   *
   * @private
   */
  _flipChildren () {
    /** @type {Array<AALineSegment>} */
    var children = this._children

    /** @type {AALineSegment} */
    var child

    // Toggles flipping on all children
    for (child of children) {
      child._globalFlipped = !child._globalFlipped
    }

    // Determines the new positions caused by flipping.
    // This *only* affects children!
    var positionDelta, parent, parentPosition
    for (child of children) {
      parent = child._parent
      // @ts-ignore - parent is never null in this case
      parentPosition = parent._globalPosition

      // We calculate the position difference between the parent and child
      // then multiply by 2 as we have to send the child "across" the position
      // @ts-ignore - parent is never null in this case
      if (parent._globalFlipped) {
        positionDelta = -(child._globalPosition - parentPosition) * 2
      } else {
        positionDelta = (child._globalPosition - parentPosition) * 2
      }

      // console.log('Moving child by', positionDelta, child)
      child.updateGlobalPosition(positionDelta)
    }
  }

  /**
   * @param {number} delta - Position change difference.
   */
  updateGlobalPosition (delta) {
    if (delta === 0) return

    var parent = this._parent

    if (parent?._globalFlipped && !this._globalFlipped) {
      // A flipped parent changes the orientation of a unflipped segment.
      this._globalPosition -= delta
      this._globalA -= delta
      this._globalB -= delta
    } else {
      this._globalPosition += delta
      this._globalA += delta
      this._globalB += delta
    }

    // if (this._globalFlipped) {
    // } else {
    //   this._globalA += delta
    //   this._globalB += delta
    // }

    /** @type {Array<AALineSegment>} */
    var children = this._children

    if (children.length === 0) return

    /** @type {AALineSegment} */
    var child

    for (child of children) {
      child.updateGlobalPosition(delta)
    }
  }
}
