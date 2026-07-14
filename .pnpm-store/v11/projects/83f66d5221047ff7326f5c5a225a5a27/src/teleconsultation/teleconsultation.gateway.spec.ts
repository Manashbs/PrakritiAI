import { Test, TestingModule } from '@nestjs/testing';
import { TeleconsultationGateway } from './teleconsultation.gateway';

describe('TeleconsultationGateway', () => {
  let gateway: TeleconsultationGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeleconsultationGateway],
    }).compile();

    gateway = module.get<TeleconsultationGateway>(TeleconsultationGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
