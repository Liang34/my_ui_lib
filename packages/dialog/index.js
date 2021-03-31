import OwnDialog from './src/main.vue'

OwnDialog.install = function(vue){
    vue.component(OwnDialog.name, OwnDialog)
}
export default OwnDialog