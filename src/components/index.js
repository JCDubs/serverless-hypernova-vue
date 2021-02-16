import { renderVue } from 'hypernova-vue';
import Vue from 'vue';
import HelloWorld from '@/components/HelloWorld.vue';
Vue.config.productionTip = false;
renderVue(process.env.COMPONENT_NAME, Vue.extend(HelloWorld));