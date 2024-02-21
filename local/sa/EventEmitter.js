function EventEmitter() {
  this._events = {};
}

function isValidListener(listener) {
  if (typeof listener === 'function') {
    return true;
  } else if (listener && typeof listener === 'object') {
    return isValidListener(listener.listener);
  } else {
    return false;
  }
}
EventEmitter.prototype.on = function (eventName, listener) {
  if (!eventName || !listener) {
    return false;
  }

  if (!isValidListener(listener)) {
    throw new Error('listener must be a function');
  }

  this._events[eventName] = this._events[eventName] || [];
  var listenerIsWrapped = typeof listener === 'object';

  this._events[eventName].push(
    listenerIsWrapped
      ? listener
      : {
          listener: listener,
          once: false,
        }
  );

  return this;
};

EventEmitter.prototype.prepend = function (eventName, listener) {
  if (!eventName || !listener) {
    return false;
  }

  if (!isValidListener(listener)) {
    throw new Error('listener must be a function');
  }

  this._events[eventName] = this._events[eventName] || [];
  var listenerIsWrapped = typeof listener === 'object';

  this._events[eventName].unshift(
    listenerIsWrapped
      ? listener
      : {
          listener: listener,
          once: false,
        }
  );

  return this;
};

EventEmitter.prototype.prependOnce = function (eventName, listener) {
  return this.prepend(eventName, {
    listener: listener,
    once: true,
  });
};

EventEmitter.prototype.once = function (eventName, listener) {
  return this.on(eventName, {
    listener: listener,
    once: true,
  });
};

EventEmitter.prototype.off = function (eventName, listener) {
  var listeners = this._events[eventName];
  if (!listeners) {
    return false;
  }
  if (typeof listener === 'number') {
    listeners.splice(listener, 1);
  } else if (typeof listener === 'function') {
    for (var i = 0, len = listeners.length; i < len; i++) {
      if (listeners[i] && listeners[i].listener === listener) {
        listeners.splice(i, 1);
      }
    }
  }
  return this;
};

EventEmitter.prototype.emit = function (eventName, args) {
  var listeners = this._events[eventName];
  if (!listeners) {
    return false;
  }

  for (var i = 0; i < listeners.length; i++) {
    var listener = listeners[i];
    if (listener) {
      listener.listener.call(this, args || {});
      if (listener.once) {
        this.off(eventName, i);
      }
    }
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function (eventName) {
  if (eventName && this._events[eventName]) {
    this._events[eventName] = [];
  } else {
    this._events = {};
  }
};

EventEmitter.prototype.listeners = function (eventName) {
  if (eventName && typeof eventName === 'string') {
    return this._events[eventName];
  } else {
    return this._events;
  }
};
