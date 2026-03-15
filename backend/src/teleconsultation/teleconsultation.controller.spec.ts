import { Test, TestingModule } from '@nestjs/testing';
import { TeleconsultationController } from './teleconsultation.controller';

describe('TeleconsultationController', () => {
  let controller: TeleconsultationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeleconsultationController],
    }).compile();

    controller = module.get<TeleconsultationController>(TeleconsultationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
