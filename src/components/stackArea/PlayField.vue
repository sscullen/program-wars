<template>
<div id="play-field" :class="{ play: isCurrentPlayer }"
    @drop="onDrop($event)" @dragover.prevent @dragenter.prevent>

  <h3 id="main-func">{{ player.name }}_main:</h3>

  <ul class="stack-list">
    <div class="method">
      <card-stack :stack="player.playField.method"/>
    </div>

    <li class="card-stack" v-for="stack in player.playField.stacks" v-bind:key="stack.id">
      <card-stack :stack="stack"/>
    </li>
  </ul>

  <div class="info-button">
    <play-field-info/>
  </div>

</div>
</template>

<script>
import CardStack from '@/components/stackArea/CardStack'
import PlayFieldInfo from '@/components/info/PlayFieldInfo'
import { isBase } from '@/classes/card/cardData'
import { mapGetters } from 'vuex'

/**
 * A component to hold all of the players card stacks during a game.
 * Responsible for handling drop events for cards that can start new stacks
 * and calling the appropriate actions to deal with them.
 */
export default {
  name: 'play-field',
  props: ['player'],
  components: {
   'card-stack': CardStack,
   'play-field-info': PlayFieldInfo
  },
  computed: {
    ...mapGetters(['game']),
    isCurrentPlayer () {
      return this.game.currentPlayer() === this.player
    }
  },
  methods: {
    /**
     * Handles events when a card is dropped in the playing feild.
     * If the card is an instruction it cannot be placed on any stacks,
     * So instead we add a new stack containing the card.
     */
    onDrop (event) {
      const id = event.dataTransfer.getData('playerId')
      const owner = this.game.getPlayer(id)
      const cardId = event.dataTransfer.getData('cardId')
      const card = owner.hand.getCardById(cardId)

      if (this.isCurrentPlayer && isBase(card.type)) {
        event.stopPropagation();
        this.game.takeTurn({
          type: "newStack",
          player: this.game.currentPlayer(),
          card: card, cardOwner: owner,
          playField: this.player.playField
        })
      }
    }
  }
}
</script>

<style scoped>
#play-field {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #333333;
  border: ridge #a0a0a0 8px;
  border-radius: 6px;
  overflow: auto;
  text-align: left;
}

#main-func {
  margin: 0;
  margin-top: 2px;
  margin-left: 5px;
  color: #fff;
}

.method {
  display: inline-block;
  vertical-align: top;
  background-color: #444444;
  border: solid white 3px;
  color: white;
  width: 250px;
  height: 150px;
}

.stack-list {
  list-style: none;
  margin: 0;
  margin-top: 4px;
  padding: 0 0 0 0;
  text-align: left;
}

.card-stack {
  position: relative;
  display: inline-block;
  margin-left: 5px;
}

.info-button {
  position: absolute;
  top: 10px;
  right: 10px;
}

.play {
  -webkit-box-shadow: 0 0 24px 15px rgba(0,255,0,1);
  -moz-box-shadow: 0 0 24px 15px rgba(0,255,0,1);
  box-shadow: 0 0 24px 15px rgba(0,255,0,1);
}
</style>

