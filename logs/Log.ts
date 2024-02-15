class Log {
  private static instance: Log;

  info(tag: string, msg: string, ...args: unknown[]) {
    console.info(`(${tag}) INFO: ${msg}`, ...args);
  }
  error(tag: string, msg: string, ...args: unknown[]) {
    console.error(`(${tag}) ERROR: ${msg}`, ...args);
  }
  warn(tag: string, msg: string, ...args: unknown[]) {
    console.warn(`(${tag}) WARN: ${msg}`, ...args);
  }
  debug(tag: string, msg: string, ...args: unknown[]) {
    console.debug(`(${tag}) DEBUG: ${msg}`, ...args);
  }

  log(tag: string, msg: string, ...args: unknown[]) {
    console.log(`(${tag}) LOG: ${msg}`, ...args);
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }

    this.instance = new Log();
    return this.instance;
  }
}

export default Log.getInstance();
