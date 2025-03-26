// src/utils/credentials-manager.ts
import * as fs from 'fs';
import * as path from 'path';
import { logger } from './logger';

interface UserCredentials {
  name: string;
  email: string;
  password: string;
}

export class CredentialsManager {
  private filePath: string;
  
  constructor(filename: string = 'test-credentials.json') {
    this.filePath = path.join(process.cwd(), filename);
  }
  
  saveCredentials(credentials: UserCredentials): void {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(credentials, null, 2));
      logger.info(`Credentials saved to ${this.filePath}`);
    } catch (error) {
      logger.error(`Failed to save credentials: ${(error as Error).message}`);
    }
  }
  
  getCredentials(): UserCredentials | null {
    try {
      if (fs.existsSync(this.filePath)) {
        const data = fs.readFileSync(this.filePath, 'utf8');
        return JSON.parse(data) as UserCredentials;
      }
    } catch (error) {
      logger.error(`Failed to read credentials: ${(error as Error).message}`);
    }
    return null;
  }
  
  hasCredentials(): boolean {
    return fs.existsSync(this.filePath);
  }
}

export const credentialsManager = new CredentialsManager();