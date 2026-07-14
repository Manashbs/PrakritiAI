import { Test, TestingModule } from '@nestjs/testing';
import { TeleconsultationService } from './teleconsultation.service';

describe('TeleconsultationService', () => {
  let service: TeleconsultationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeleconsultationService],
    }).compile();

    service = module.get<TeleconsultationService>(TeleconsultationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
