<!-- packages/button/src/main.vue -->
<template>
  <button class="one-button" :class="[`one-button-${type}`,{
    'is-round':round
  }, {
    'is-circle': circle
  }]"
  @click="handleClick"
  :disabled="disabled"
  >
   <span><slot></slot></span>
  </button>
</template>

<script>
export default {
  name: 'OwnButton',
  props: {
    type: {
      type: String,
      default: 'default'
    },
    round: {
      type: Boolean,
      default: false
    },
    circle: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClick (event) {
      if (this.type !== 'disabled') {
        this.$emit('click', event)
      }
    }
  }
}
</script>