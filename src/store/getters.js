/**
 * Includes getters for handy and non-trivial access to state members.
 * Cannot take payloads like mutations and actions without being made into
 * methods. See getPlayerScores for an example of this.
 *
 * A second param getters can be added after state. This can be used to access
 * other getters to avoid code duplication when necessary.
 * ie) someGetter (state, getter) {let hand = getters.getCurrentPlayerHand}
 */
export default {
  /**
   * Returns the Hand object for the current player.
   */
  getCurrentPlayerHand (state) {
    return state.hands.find(h => h.playerId === state.activePlayer.id)
  },

  /**
   * Return a list of the current player's stacks.
   */
  getCurrentPlayerStacks (state) {
    return state.stacks.filter(st => st.playerId === state.activePlayer.id)
  },

  /**
   * Get AI handler for the current player.
   */
  getCurrentAiHandler (state) {
    return state.aiHandlers.find(h => h.player.id === state.activePlayer.id)
  },

  /**
   * Get attackable opponents given a card type.
   * Not for Hacking.
   */
  getAttackableOpponents (state) {
    const effect = state.activeCard.type
    return state.players.filter((p) => {
      return p.id !== state.activePlayer.id && !p.isProtectedFrom(effect)
             && !p.hurtBy(effect)

    })
  },

  /**
   * Get current players objectives.
   */
  getCurrentPlayerObjectives (state) {
    return state.objectives.find(ob => ob.playerId === state.activePlayer.id)
  },

  /**
   * Tell if the program is in game state.
   */
  isGame (state) {
    return state.gameState === 'game'
  },

  /**
   * Get the base and adjusted scores for all players.
   *
   * Returns
   * {
   *   playerId: the player's id, 
   *   baseScore: the score without modifiers,
   *   score: the score with modifiers
   * }
   *
   * Creates a method on getters to avoid caching.
   * see https://vuex.vuejs.org/guide/getters.html#method-style-access
   */
  getPlayerScores: (state) => () => {
    let scores = []
    for (let player of state.players) {
      let stacks = state.stacks.filter(s => s.playerId === player.id)
      let base = stacks.reduce((acc, stack) => {
        return acc + stack.getScore()
      }, 0)

      let total = player.hurtBy("VIRUS") ? base * 0.75 : base

      scores.push({
        playerId: player.id,
        score: Math.floor(total),
        baseScore: base
      })
    }
    return scores
  }
}

