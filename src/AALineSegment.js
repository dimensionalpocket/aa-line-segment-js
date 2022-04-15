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
     * The value of A relative to the world.
     *
     * @type {number}
     */
    this._worldA = this._localA

    /**
     * The value of B relative to the world.
     *
     * @type {number}
     */
    this._worldB = this._localB

    /**
     * The segment position relative to the world.
     *
     * @type {number}
     */
    this._worldPosition = 0

    /**
     * Flip state relative to the world.
     *
     * @type {boolean}
     */
    this._worldFlipped = false

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
    return this._worldA
  }

  /**
   * Returns the global position of the end point.
   *
   * @returns {number}
   */
  get b () {
    return this._worldB
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

    if (this._worldFlipped) {
      this._worldB -= delta
    } else {
      this._worldA += delta
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

    if (this._worldFlipped) {
      this._worldA -= delta
    } else {
      this._worldB += delta
    }
  }

  /**
   * Returns world position.
   *
   * @returns {number}
   */
  get position () {
    return this._worldPosition
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
      if (this._worldFlipped !== this._localFlipped) {
        this._worldFlipped = this._localFlipped
        if (this._worldFlipped) {
          this._onFlip()
        } else {
          this._onUnflip()
        }
      }

      positionDelta = -oldParent._worldPosition
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
    if (newParent._worldFlipped !== this._worldFlipped) {
      this._worldFlipped = !this._worldFlipped
      positionDelta += this._localPosition
      if (this._worldFlipped) {
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
    this._worldFlipped = !this._worldFlipped

    if (this._worldFlipped) {
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
    var worldPosition = this._worldPosition

    this._worldA = worldPosition - this._localB
    this._worldB = worldPosition - this._localA

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
    var position = this._worldPosition

    this._worldA = position + this._localA
    this._worldB = position + this._localB

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
      child._worldFlipped = !child._worldFlipped
    }

    // Determines the new positions caused by flipping.
    // This *only* affects children!
    var positionDelta, parent, parentPosition
    for (child of children) {
      parent = child._parent
      // @ts-ignore - parent is never null in this case
      parentPosition = parent._worldPosition

      // We calculate the position difference between the parent and child
      // then multiply by 2 as we have to send the child "across" the position
      // @ts-ignore - parent is never null in this case
      if (parent._worldFlipped) {
        positionDelta = -(child._worldPosition - parentPosition) * 2
      } else {
        positionDelta = (child._worldPosition - parentPosition) * 2
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

    if (parent?._worldFlipped && !this._worldFlipped) {
      // A flipped parent changes the orientation of a unflipped segment.
      this._worldPosition -= delta
      this._worldA -= delta
      this._worldB -= delta
    } else {
      this._worldPosition += delta
      this._worldA += delta
      this._worldB += delta
    }

    // if (this._worldFlipped) {
    // } else {
    //   this._worldA += delta
    //   this._worldB += delta
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
