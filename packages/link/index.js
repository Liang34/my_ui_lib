import Link from './src/main.vue';

Link.install = function (Vue) {
  Vue.component(Link.name, Link);
};

export default Link;
