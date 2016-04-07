import EventEmitter from 'eventemitter3';

const emitter = new EventEmitter();

export const EE = emitter;


export function notify(notification) {
  emitter.emit('add/notification', notification);
}
