import { tryTraceEvent } from '@/utils/trace';
import type { DirectiveOptions } from 'vue';
import Vue from 'vue';
import type { DirectiveBinding } from 'vue/types/options';
const DIR_CONTEXT_KEY = '@@traceContext';
function doTrace(e: Event) {
  const target = e.currentTarget;
  if (!target) {
    return;
  }
  const { eventName, props } = (target as any)[DIR_CONTEXT_KEY] as {
    eventName: string;
    props: { [key: string]: string } | false | true;
  };
  if (props === false) {
    return;
  }
  if (!eventName) {
    return;
  }
  // console.log('[VTrace]', eventName, props, target)
  const data = (props !== true ? props : {}) || {};
  tryTraceEvent(eventName, data);
}
const directiveOptions: DirectiveOptions = {
  bind(el, binding: DirectiveBinding) {
    (el as any)[DIR_CONTEXT_KEY] = {};
    updateContext(el, binding);
    el.addEventListener('click', doTrace, {
      passive: true,
    });
  },
  update: updateContext,
  unbind: function (el: Element) {
    el.removeEventListener('click', doTrace);
  },
};
function updateContext(el: Element, binding: DirectiveBinding) {
  if (el && binding) {
    const { arg, value } = binding;
    let eventName = arg;
    let props = value;
    if (eventName == null && props && props.eventName) {
      eventName = props.eventName;
      props = { ...props };
      delete props.eventName;
    }

    const elContextObj = (el as any)[DIR_CONTEXT_KEY];
    elContextObj.eventName = eventName;
    elContextObj.props = props;
  }
}

/**
 * v-trace:eventname="{otherprop:'sdf'}"
 * v-trace:eventname
 * v-trace:eventname="false" //
 * v-trace:[EVENT_NAME_VAR]
 * v-trace={eventName,...otherprops}
 */
export default function install() {
  Vue.directive('trace', directiveOptions);
}
