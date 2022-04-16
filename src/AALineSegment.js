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

    this._recalculateGlobalA()
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

    this._recalculateGlobalB()
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

    this._recalculateGlobalPositions()
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
        this._onGlobalFlipChange()
      } else {
        this._recalculateGlobalPositions()
      }

      return
    }

    // Re-call this method with null to remove old parent, if any.
    // This isn't very efficient, but changing parents shouldn't be called often.
    this.parent = null

    this._parent = newParent
    newParent._children.push(this)

    // Flip or unflip segment if orientation changed due to the new parent.
    if (newParent._globalFlipped) {
      this._globalFlipped = !this._globalFlipped
      this._onGlobalFlipChange()
    } else {
      this._recalculateGlobalPositions()
    }
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

    // If local state changed, global state will always toggle.
    this._globalFlipped = !this._globalFlipped

    this._onGlobalFlipChange()
  }

  /**
   * @param {AALineSegment} anotherSegment
   * @returns {boolean} `true` if this segment touches or intersects with another segment.
   */
  collidesWith (anotherSegment) {
    return this._globalB >= anotherSegment._globalA && this._globalA <= anotherSegment._globalB
  }

  /**
   * Recalculates global A based on the global position.
   *
   * @private
   */
  _recalculateGlobalA () {
    if (this._globalFlipped) {
      this._globalB = this._globalPosition - this._localA
    } else {
      this._globalA = this._globalPosition + this._localA
    }
  }

  /**
   * Recalculates global B based on the global position.
   *
   * @private
   */
  _recalculateGlobalB () {
    if (this._globalFlipped) {
      this._globalA = this._globalPosition - this._localB
    } else {
      this._globalB = this._globalPosition + this._localB
    }
  }

  /**
   * Recalculates global position of self and all children.
   *
   * @private
   */
  _recalculateGlobalPositions () {
    this._recalculateGlobalPosition()

    for (var child of this._children) {
      child._recalculateGlobalPositions()
    }
  }

  /**
   * Recalculates global position.
   *
   * @private
   */
  _recalculateGlobalPosition () {
    var parent = this.parent
    var parentGlobalPosition = 0

    if (parent) {
      parentGlobalPosition = parent._globalPosition
    }

    var globalPosition = parentGlobalPosition
    if (parent?._globalFlipped) {
      globalPosition -= this._localPosition
    } else {
      globalPosition += this._localPosition
    }

    this._globalPosition = globalPosition

    this._recalculateGlobalA()
    this._recalculateGlobalB()
  }

  _onGlobalFlipChange () {
    if (this._globalFlipped) {
      this._onFlip()
    } else {
      this._onUnflip()
    }
  }

  /**
   * Called after the segment is flipped globally.
   *
   * @private
   */
  _onFlip () {
    this._recalculateGlobalPosition()
    this._flipChildren()
  }

  /**
   * Called after the segment is unflipped globally.
   *
   * @private
   */
  _onUnflip () {
    this._recalculateGlobalPosition()
    this._flipChildren()
  }

  /**
   * Called after the segment flip state changes.
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

      if (child._globalFlipped) {
        child._onFlip()
      } else {
        child._onUnflip()
      }
    }
  }
}
