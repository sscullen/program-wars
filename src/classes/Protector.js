import AiMove from './AiMove'
import {store} from '../store/store'
export default class Gambler {

  /**
   * Constructor for this AI personality.
   */
  constructor() {
    this.move = new AiMove();
    this.boolSide = this.move.getBoolSide();
    console.log("Protector")
  }

  /**
   * This function will figure out what card the AI should play.
   * @param event
   * @returns {*} The card to play, the stack to play, the opponent to attack, and the move type.
   */
  turnLogic(event) {
    let cardToPlay = undefined;
    let stackToPlay = undefined;
    let opponentToAttack = undefined;
    let moveType = undefined;

    let hand = this.move.organizeHand(event);

    this.boolSide = store.getters.getCoinMsg;
    // console.log("The coinMsg: " + store.getters.getCoinMsg)
    // console.log("AI is choosing: " + this.boolSide)

    let canGroup = this.move.findGroup(event.stack, hand.bestGCard);

    if(hand.bestGCard.length > 0 && canGroup  !== undefined) {
      cardToPlay = canGroup.cardToPlay;
      stackToPlay = canGroup.stackToPlay;
      moveType = 'group';

    }

    // else if(hand.virusCard !== undefined) {
    //   opponentToAttack = this.move.getHackOpponent(event);
    //   cardToPlay = hand.virusCard;
    //   moveType = 'attack';
    // }

    else if(hand.powerOutageCard !== undefined){
      opponentToAttack = this.move.getOpponentToAttack(event);
      cardToPlay = hand.powerOutageCard;
      moveType = 'attack';
    }
    // else if(hand.batteryBackupCard !== undefined && store.getters.getCurrentPlayer.hasPowerOutage){
    //   cardToPlay = hand.batteryBackupCard;
    //   moveType = 'enhance'
    // }
    //
    // else if(hand.overclockCard !== undefined && store.getters.getCurrentPlayer.trueScore !== 0 &&  store.getters.getCurrentPlayer.falseScore !== 0){
    //   cardToPlay = hand.overclockCard;
    //   moveType = 'enhance'
    // }
    //
    // else if(hand.antiVirusCard !== undefined){
    //   cardToPlay = hand.antiVirusCard;
    //   moveType = 'protection'
    // }
    // else if(hand.firewallCard !== undefined){
    //   cardToPlay = hand.firewallCard;
    //   moveType = 'protection'
    // }
    // else if(hand.generatorCard !== undefined){
    //   cardToPlay = hand.generatorCard;
    //   moveType = 'protection'
    // }

    else if(hand.bestVCard !== undefined && this.move.stackToAddVariable(event) !== undefined && event.stack.find(stack => stack.boolSide === this.boolSide)) {
      cardToPlay = hand.bestVCard;
      stackToPlay = this.move.stackToAddVariable(event);
      moveType = 'play';

    } else if(hand.bestRCard !== undefined && this.move.getStackToRepeat(event) !== undefined && event.stack.find(stack => stack.boolSide === this.boolSide)) {
      cardToPlay = hand.bestRCard;
      stackToPlay = this.move.getStackToRepeat(event);
      moveType = 'play';

    } else if(hand.bestICard !== undefined) {
      cardToPlay = hand.bestICard;
      stackToPlay = event.stack.find(stack => stack.boolSide === this.boolSide && stack.score === 0);
      moveType = 'play';

    } else if(hand.rXCard !== undefined && this.move.getStackToRepeat(event) !== undefined && hand.bestVCard !== undefined && event.stack.find(stack => stack.boolSide === this.boolSide)) {
      cardToPlay = hand.rXCard;
      stackToPlay = this.move.getStackToRepeat(event);
      moveType = 'play';

    } else if(hand.hackCard !== undefined && this.move.getHackOpponent(event) !== undefined && event.stack.find(stack => stack.boolSide === this.boolSide)) {
      cardToPlay = hand.hackCard;
      opponentToAttack = this.move.getHackOpponent(event);
      moveType = 'hack';

    } else if(hand.bestGCard !== undefined && event.stack.find(stack => stack.boolSide === this.boolSide)) {
      cardToPlay = hand.bestGCard[0];
      for(let card in hand.bestGCard) {
        if(cardToPlay.value > card.value) {
          cardToPlay = card;
        }
      }
      moveType = 'discard';

      }




    // This should not get called, used as a failsafe
    if(cardToPlay === undefined) {
      cardToPlay = event.hand.cards[0];
      moveType = 'discard';
    }

    return {cardToPlay, stackToPlay, opponentToAttack, moveType};
  }
}
