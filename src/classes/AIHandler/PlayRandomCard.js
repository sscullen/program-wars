import PlayBestCard from '@/classes/AIHandler/PlayBestCard'

export default class PlayRandomCard extends PlayBestCard {
  constructor () {
    super([])
  }

  sortCards (cards) {
    for (let i = cards.length; i; i--) {
      const j = Math.floor(Math.random() * i);
      [cards[i - 1], cards[j]] = [cards[j], cards[i - 1]]
    }
  }

  isValidCard (card) {
    return card !== undefined
  }

  search (card, { player, deck }) {
    const idx = Math.floor(Math.random() * deck.cards.length)
    const chosen = deck.takeCardAt(idx)

    if (chosen) {
      console.log('search', chosen.type)
      return {
        type: 'playSearch',
        player, card, cardOwner: player,
        chosenCard: chosen, deck
      }
    }
    return undefined
  }
}
