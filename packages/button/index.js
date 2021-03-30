// packages/button/index.js
import OwnButton from './src/main.vue';

OwnButton.install = function (Vue) {
  Vue.component(OwnButton.name, OwnButton);
};

export default OwnButton;