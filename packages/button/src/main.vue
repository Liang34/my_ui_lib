<!-- packages/button/src/main.vue -->
<template>
  <button :class="['own-button', typeClass]"
          :style="btnStyle"
          @click="handleClick">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'OwnButton',
  props: {
    type: {
      // 文字标题
      type: String,
      default: 'default'
    },
    inline: {
      // 行内按钮
      type: Boolean,
      default: false
    },
    outline: {
      // 外边框
      type: Boolean,
      default: false
    },
    btnStyle: {
      // 自定义样式
      type: Object,
      default: () => {}
    }
  },
  computed: {
    typeClass () {
      return {
        'own-button-default': this.type === 'default',
        'own-button-disabled': this.type === 'disabled',
        'own-button-light': this.type === 'light',
        'own-button-inline': this.inline,
        'own-button-outline': this.outline
      }
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