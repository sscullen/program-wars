<template>
<div id="game-mode">

  <h4 class="sub-heading"> Game Type </h4>

  <div class="drop-menu">
    <div class="dropdown my-drop">
      <button class="btn btn-sm btn-primary dropdown-toggle" type="button"
          data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        {{ home.mode }}
      </button>

      <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
        <button v-for="mode in getModes" v-bind:key="mode"
            v-on:click="home.changeMode(mode)" class="dropdown-item" type="button">
          {{ mode }}
        </button>
      </div>
    </div>

    <div class="describe">
      {{ describe }}
    </div>
  </div>

</div>
</template>

<script>
import { mapGetters } from 'vuex'

/**
 * Displays the game modes and allows the player to change between them.
 *
 * The mode and it's related info is stored in the home state and not this component.
 *
 * @vue-computed {string[]} getModes - A list of string names for available
 * game modes.
 * @vue-computed {string} describe - A description of the current game mode.
 */
export default {
  name: 'game-mode',
  computed: {
    ...mapGetters(['home']),
    getModes () {
      return ['beginner', 'standard']
    },
    describe () {
      if (this.home.mode === 'beginner') {
        return 'Play with fewer card types and easier AI'
      } else {
        return 'Play with more card types and smarter AI'
      }
    }
  }
}
</script>

<style scoped>
#game-mode {
  margin: 0.5rem 1rem;
}

.sub-heading {
  color: black;
  text-decoration: underline;
  text-decoration-skip-ink: none;
}

.my-drop {
  margin: 0.5rem 1rem;
}

.describe {
  margin: 0.5rem 1rem;
}
</style>
