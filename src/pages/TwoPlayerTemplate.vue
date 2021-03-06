<template>
<div id="two-player-game" v-if="inGame">
  <slot name="modals">
    <winner-modal id="winner-modal" class="modal"
      data-backdrop='static' data-keyboard='false'/>
  </slot>

  <slot name="page-header">
    <page-header>
        <template v-slot:pageHeading> Score Limit: {{ game.scoreLimit }} </template>
    </page-header>
  </slot>

  <div class="player" style="left: 0;">
    <slot name="player-1">
      <player-area :player="game.getPlayer(0)" side="left"/>
    </slot>
  </div>

  <div class="stacks-area" style="left: 0.5%">
    <slot name="p1-stack-area">
      <stack-area :player="game.getPlayer(0)" tabSide="right"/>
    </slot>
  </div>

  <div class="hand-area">
    <slot name="hand-area">
      <hand-area/>
    </slot>
  </div>

  <div class="player" style="right: 0;">
    <slot name="player-2">
      <player-area :player="game.getPlayer(1)" side="right"/>
    </slot>
  </div>

  <div class="stacks-area" style="right: 0.5%;">
    <slot name="p2-stack-area">
      <stack-area :player="game.getPlayer(1)" tabSide="left"/>
    </slot>
  </div>

  <effect-notifications/>

</div>
<div v-else>
  <error-page/>
</div>
</template>

<script>
import WinnerModal from '@/components/modals/WinnerModal'
import PageHeader from '@/components/shared/PageHeader'
import PlayerArea from '@/components/playerArea/PlayerArea'
import HandArea from '@/components/handArea/HandArea'
import StackArea from '@/components/stackArea/StackArea'
import EffectNotifications from '@/components/shared/EffectNotifications'
import ErrorPage from '@/components/shared/ErrorPage'
import { bus } from '@/components/shared/Bus'
import { mapActions, mapGetters } from 'vuex'

/**
 * Template component for 2 player games.
 *
 * Has slots for all the main areas of the game page. These can be replaced when
 * the component is used to add custom components for different game modes.
 * Currently the defaults are all set up for the `standard` mode game. Using a
 * slot wil replace the default completely.
 *
 * ### Slots
 * - `modals` - Holds all the modals needed for the page.
 * - `page-header` - Holds the page header component to use.
 * - `player-1` - Holds the player area for the left player (player 1).
 * - `player-2` - Holds the player area for the right player (player 2).
 * - `hand-area` - Holds the hand area for the current player, along with turn history.
 * - `p1-stack-area` - Holds the stack area for the left player.
 * - `p2-stack-area` - Holds the stack area for the right player.
 */
export default {
  name: 'beginner-game',
  components: {
    'winner-modal': WinnerModal,
    'page-header': PageHeader,
    'player-area': PlayerArea,
    'hand-area': HandArea,
    'effect-notifications': EffectNotifications,
    'stack-area': StackArea,
    'error-page': ErrorPage
  },
  computed: {
    ...mapGetters(['game', 'inGame'])
  },
  methods: {
    ...mapActions(['leaveGame']),
    /**
     * Opens the winner modal.
     */
    showWinner () {
      $('#winner-modal').modal('show')
    }
  },
  created () {
    // Add a 'game-over' listener to show the winner modal
    bus.$on('game-over', this.showWinner)
    // Ensures we are always in a game mode when on this page
    if (!this.inGame) {
      this.leaveGame()
    }
  },
  beforeDestroy () {
    // Remove the listener when the component is destroyed
    bus.$off('game-over', this.showWinner)
  }
}
</script>

<style>
#two-player-game {
  position: absolute;
  top: 0;
  width: 100vw;
  height: 100vh;
  min-width: 72rem;
}

.player {
  position: absolute;
  top: 5%;
  width: 25%;
  height: 45%;
}

.hand-area {
  position: absolute;
  top: 5%;
  left: 25%;
  width: 50%;
  height: 45%;
}

.stacks-area {
  position: absolute;
  top: 50%;
  width: 49%;
  height: 49%;
}
</style>

