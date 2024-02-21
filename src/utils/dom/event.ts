// from vant

// from vant
import type { EventHandler } from '../types';

export let supportsPassive = false;

try {
  const opts = {};
  Object.defineProperty(opts, 'passive', {
    get() {
      /* istanbul ignore next */
      supportsPassive = true;
    },
  });
  window.addEventListener('test-passive', null as any, opts);
} catch (e) {}

/**
 *
 * @param target
 * @param event
 * @param handler
 * @param passive passive    ：  chrome56    passive=true
 */
export function on<E extends Event>(
  target: EventTarget,
  event: string,
  handler: EventHandler<E>,
  passive = false
) {
  target.addEventListener(
    event,
    handler as EventHandler<Event>,
    supportsPassive ? { capture: false, passive } : false
  );
}
export type ON_FUNC = typeof on;

export function off<E extends Event>(
  target: EventTarget,
  event: string,
  handler: EventHandler<E>
) {
  target.removeEventListener(event, handler as EventHandler<Event>);
}

export type OFF_FUNC = typeof off;
export function stopPropagation(event: Event) {
  event.stopPropagation();
}

export function preventDefault(event: Event, isStopPropagation?: boolean) {
  /* istanbul ignore else */
  if (typeof event.cancelable !== 'boolean' || event.cancelable) {
    event.preventDefault();
  }

  if (isStopPropagation) {
    stopPropagation(event);
  }
}
