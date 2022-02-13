import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { Test, TestingModule } from '@nestjs/testing';
import { mockClient } from 'aws-sdk-client-mock';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  const clientMock = mockClient(DynamoDBDocumentClient);

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();
    appController = app.get<AppController>(AppController);
    clientMock.reset();
  });

  describe('/create POST', () => {
    it('should return "ok', async () => {
      clientMock.on(PutCommand).resolves({});
      const name = 'dummyName';
      const type = 'dummyType';
      const result = await appController.putItem(name, type);
      const calls = clientMock.commandCalls(PutCommand);
      expect(result).toBe('ok');
      expect(calls.length).toBe(1);
    });
  });
});
