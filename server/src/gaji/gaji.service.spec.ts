import { Test, TestingModule } from '@nestjs/testing';
import { GajiService } from './gaji.service';

describe('GajiService', () => {
  let service: GajiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GajiService],
    }).compile();

    service = module.get<GajiService>(GajiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
