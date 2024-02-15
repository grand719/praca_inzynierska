export class Emitter<T, ParamsT = any> {
  private callbacks: Map<T, Set<(param: ParamsT) => void>> = new Map();

  public on(event: T, callback: (params: ParamsT) => void): void {
    const currentCallbacks = this.callbacks.get(event);
    if (currentCallbacks) {
      currentCallbacks.add(callback);
      return;
    }

    this.callbacks.set(event, new Set([callback]));
  }

  public clear(): void {
    this.callbacks.clear();
  }

  public off(event: T, callback: (params: ParamsT) => void): void {
    const events = this.callbacks.get(event);
    if (events) {
      events.delete(callback);
    }
  }

  public notify(event: T, params: ParamsT): void {
    const events = this.callbacks.get(event);
    if (events) {
      events.forEach(callback => {
        callback && callback(params);
      });
    }
  }
}
