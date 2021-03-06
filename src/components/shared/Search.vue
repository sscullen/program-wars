<template>
<div id='search'>
  <div class="backdrop">

    <div class="popup">
      <h3 class="title"> <b>Search</b> </h3>

      <div class="content">
        <img v-for="card in deckCards" v-bind:key="card.id"
          :src="card.image" :class="['card', { active: isSelected(card) }]"
          v-on:click="select(card)">
      </div>

      <button class="btn btn-success my-btn" v-on:click="choose"
          :disabled="!selected">
        Choose Card
      </button>
    </div>

  </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'

/**
 * Displays the top `N` cards of the deck so the player can select one of them
 * to add to their hand.
 *
 * `N` is the value of the search card or the number of card remaining in the deck,
 * whichever is smaller. `search` cards are not included in the cards being searched.
 *
 * @vue-prop {Player} cardOwner - The owner of the search card.
 * @vue-prop {Card} card - The search card.
 * @vue-prop {Deck} deck - The deck being searched.
 * @vue-data {Card} [selected=null] - The selected card. If it is null
 * then the player will not be able to continue, until a card is selected.
 *
 * @vue-computed {Card[]} deckCards - The top `N` cards of the deck, or if there
 * are not `N` cards, the remaining cards in the deck. Exculding `search` cards.
 */
export default {
  name: 'search',
  props: ['cardOwner', 'card', 'deck'],
  data () {
    return {
      selected: null,
    }
  },
  computed: {
    ...mapGetters(['game']),
    deckCards () {
      const cards = this.deck.cards.filter(c => c.type !== 'SEARCH')
      return cards.slice(0, this.card.value)
    }
  },
  methods: {
    /**
     * True if the given card is the currently selected card.
     */
    isSelected (card) {
      return card === this.selected
    },
    /**
     * Sets the given card as the selected card.
     */
    select (card) {
      this.selected = card
    },
    /**
     * Takes a turn for playing the `search` card and adding the `selected`
     * card to the player's hand.
     */
    choose () {
      this.game.takeTurn({
        type: 'playSearch',
        player: this.game.currentPlayer(),
        card: this.card, cardOwner: this.cardOwner,
        chosenCard: this.selected, deck: this.deck
      })
    }
  },
  created () {
    // Ensures that there are cards to search
    if (this.deckCards === 0) {
      this.deck.refresh()
    }
  }
}
</script>

<style scoped>
#search {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}

.popup {
  position: absolute;
  top: 25%;
  left: 10%;
  width: 80%;
  height: 40%;
  border: ridge grey 0.5rem;
  border-radius: 1rem;
  background-color: white;
  padding: 1rem;
  z-index: 1000;
}

.title {
  margin: 0;
  margin-top: 1%;
}

.content {
  position: relative;
  height: 65%;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
}

.backdrop {
  width: 100%;
  height: 100%;
  background: rgba(50, 50, 50, 0.5);
}

.my-btn {
  margin: 1%;
}

.card {
  display: inline-block;
  height: 80%;
  border: 0;
  margin: 2%;
}

.active {
  -webkit-box-shadow: 0 0 0.7rem 0.7rem rgba(0,255,0,1);
  -moz-box-shadow: 0 0 0.7rem 0.7rem rgba(0,255,0,1);
  box-shadow: 0 0 0.7rem 0.7rem rgba(0,255,0,1);
}
</style>

