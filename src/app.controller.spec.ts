import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('App Controller', () => {
    it('should return health status', () => {
      expect(appController.checkHealth()).toEqual({ status: 'working' });
    });

    it('should return application title', () => {
      expect(appController.getTitle()).toEqual('<h1>Order test app!</h1>');
    });
  });
});
