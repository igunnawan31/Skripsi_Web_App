import { Test, TestingModule } from '@nestjs/testing';
import { ReimburseController } from './reimburse.controller';

describe('ReimburseController', () => {
  let controller: ReimburseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReimburseController],
      providers: [],
    }).compile();

    controller = module.get<ReimburseController>(ReimburseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
