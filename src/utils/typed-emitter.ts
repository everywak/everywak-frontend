export type EventListeners<L> = {
  [k in keyof L]: (...args: any[]) => any;
};

export class TypedEmitter<T extends EventListeners<T> = Record<string, (...args: any[]) => any>> {
  private listeners: Record<keyof T, Function[]> = {} as Record<keyof T, Function[]>;

  on = <K extends keyof T>(event: K, listener: T[K]) => {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener as Function);
  };

  off = <K extends keyof T>(event: K, listener: T[K]) => {
    if (!this.listeners[event]) {
      return;
    }
    const index = this.listeners[event].indexOf(listener as Function);
    if (index === -1) {
      return;
    }
    this.listeners[event].splice(index, 1);
  };

  emit = <K extends keyof T>(event: K, ...args: Parameters<T[K]>) => {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event].forEach((listener) => listener(...args));
  };
}
