// index.js
// import Button from './packages/button/index.js';
// import Link from './packages/link/index.js';
// import Dialog from './packages/dialog/index'
import Button from './lib/button.js';
import Link from './lib/link.js';
import Dialog from './lib/dialog.js'
const components = [
  Button,
  Link,
  Dialog,
];

const install = function (Vue, opt = {}) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  Button,
  Link,
  Dialog,
};