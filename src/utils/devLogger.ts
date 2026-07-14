// Development logging utilities
class DevLogger {
  private static loggedKeys = new Set<string>()

  static logOnce(key: string, message: string, ...args: unknown[]) {
    if (process.env.NODE_ENV === 'development' && !this.loggedKeys.has(key)) {
      this.loggedKeys.add(key)
      console.log(message, ...args)
    }
  }

  static warnOnce(key: string, message: string, ...args: unknown[]) {
    if (process.env.NODE_ENV === 'development' && !this.loggedKeys.has(key)) {
      this.loggedKeys.add(key)
      console.warn(message, ...args)
    }
  }

  static clearCache() {
    this.loggedKeys.clear()
  }

  static clearKey(key: string) {
    this.loggedKeys.delete(key)
  }

  static hasLogged(key: string): boolean {
    return this.loggedKeys.has(key)
  }

  /**
   * Reports the outcome of parsing one CSV file: a single success line if
   * every row parsed cleanly, or a summary line pointing at the row-level
   * warnings logged via `csvRowError` otherwise. Keyed by file name so each
   * file gets its own line instead of one global message.
   */
  static csvParsed(fileName: string, validRows: number, totalRows: number) {
    const key = `csv-parsed-${fileName}`
    if (validRows === totalRows) {
      this.logOnce(key, `[CSV] ${fileName}: ${validRows}/${totalRows} rows parsed OK`)
    } else {
      this.warnOnce(
        key,
        `[CSV] ${fileName}: ${validRows}/${totalRows} rows parsed, ${totalRows - validRows} skipped (see row errors above)`
      )
    }
  }

  /**
   * Reports a single unparseable CSV row with the exact file name and line
   * number, so it can be located and fixed in the source file.
   */
  static csvRowError(fileName: string, line: number, reason: string) {
    this.warnOnce(
      `csv-row-error-${fileName}-${line}`,
      `[CSV] ${fileName}:${line} — ${reason}`
    )
  }
}

export default DevLogger
