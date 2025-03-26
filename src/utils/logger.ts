/**
 * Simple logging utility for the Automation Exercise framework
 */
export class Logger {
  private readonly logLevels = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
  };
  
  private currentLevel: number = this.logLevels.info;
  
  constructor(level: string = 'info') {
    this.setLogLevel(level);
  }
  
  setLogLevel(level: string): void {
    const normalizedLevel = level.toLowerCase();
    if (normalizedLevel in this.logLevels) {
      this.currentLevel = this.logLevels[normalizedLevel as keyof typeof this.logLevels];
    }
  }
  
  debug(message: string, ...args: any[]): void {
    if (this.currentLevel <= this.logLevels.debug) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }
  
  info(message: string, ...args: any[]): void {
    if (this.currentLevel <= this.logLevels.info) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }
  
  warn(message: string, ...args: any[]): void {
    if (this.currentLevel <= this.logLevels.warn) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }
  
  error(message: string, ...args: any[]): void {
    if (this.currentLevel <= this.logLevels.error) {
      console.error(`[ERROR] ${message}`, ...args);
    }
  }
}

export const logger = new Logger(process.env.LOG_LEVEL || 'info');