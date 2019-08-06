import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getTitle(): string {
    return '<h1>Order test app!</h1>';
  }
}
