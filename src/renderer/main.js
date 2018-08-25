// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import '@/assets/styles/all.scss'
import 'bulma-slider/dist/js/bulma-slider'

import { toneMixin } from '@/data/tone'
import Tabs from '@/components/base/Tabs.vue'
import Toolbar from '@/components/base/Toolbar.vue'
import Splitter from '@/components/base/Splitter.vue'
import Dropdown from '@/components/base/Dropdown.vue'
import DevidePanel from '@/components/base/DevidePanel.vue'
import ButtonRadio from '@/components/base/form/ButtonRadio.vue'
import Slider from '@/components/base/form/Slider.vue'
import Input from '@/components/base/form/Input.vue'

Vue.mixin(toneMixin)
Vue.component('Tabs', Tabs)
Vue.component('Toolbar', Toolbar)
Vue.component('Splitter', Splitter)
Vue.component('Dropdown', Dropdown)
Vue.component('DevidePanel', DevidePanel)
Vue.component('ButtonRadio', ButtonRadio)
Vue.component('Slider', Slider)
Vue.component('Input', Input)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
