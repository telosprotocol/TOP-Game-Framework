import Vue from 'vue';
import DebugTool from './DebugTool.vue';
let debugToolVueInstance: Vue;
export function showDebugTool() {
  if (!debugToolVueInstance) {
    const debugDom = document.createElement('div');
    document.body.appendChild(debugDom);
    debugToolVueInstance = new Vue({
      render: (h) => h(DebugTool),
    }).$mount(debugDom);
    (window as any).debugToolVueInstance = debugToolVueInstance;
  }
  console.log('showDebugTool');
  (debugToolVueInstance.$children[0] as any).isVisible = true;
}
