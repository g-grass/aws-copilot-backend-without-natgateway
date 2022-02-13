import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/create')
  putItem(
    @Body('name') name: string,
    @Body('type') type: string,
  ): Promise<string> {
    return this.appService.putItem(name, type);
  }
}
