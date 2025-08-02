// Development logging utilities
class DevLogger {
  private static loggedKeys = new Set<string>();

  static logOnce(key: string, message: string, ...args: any[]) {
    if (process.env.NODE_ENV === 'development' && !this.loggedKeys.has(key)) {
      this.loggedKeys.add(key);
      console.log(message, ...args);
    }
  }

  static warnOnce(key: string, message: string, ...args: any[]) {
    if (process.env.NODE_ENV === 'development' && !this.loggedKeys.has(key)) {
      this.loggedKeys.add(key);
      console.warn(message, ...args);
    }
  }

  static clearCache() {
    this.loggedKeys.clear();
  }

  static clearKey(key: string) {
    this.loggedKeys.delete(key);
  }

  static hasLogged(key: string): boolean {
    return this.loggedKeys.has(key);
  }
}

export default DevLogger;
