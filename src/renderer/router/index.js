import Vue from 'vue'
import Router from 'vue-router'
import NodeBeat from '@/components/node/NodeBeat.vue'
import EffectMaker from '@/components/effect/EffectMaker.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/node-beat',
      name: 'NodeBeat',
      component: NodeBeat,
    },
    {
      path: '/',
      name: 'EffectMaker',
      component: EffectMaker,
    }
  ]
})
