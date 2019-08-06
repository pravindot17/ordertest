import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('health')
  checkHealth(): object {
    return { status: 'working' };
  }

  @Get()
  getTitle(): string {
    return this.appService.getTitle();
  }
}
