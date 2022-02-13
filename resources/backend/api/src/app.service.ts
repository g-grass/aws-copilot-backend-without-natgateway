import { Injectable } from '@nestjs/common';
import { AppRepository } from './app.repository';
@Injectable()
export class AppService {
  async putItem(name: string, type: string): Promise<string> {
    const result = await new AppRepository().putItem(name, type);
    return result;
  }
}
