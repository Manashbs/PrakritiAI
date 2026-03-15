import { Test, TestingModule } from '@nestjs/testing';
import { EcommerceController } from './ecommerce.controller';

describe('EcommerceController', () => {
  let controller: EcommerceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EcommerceController],
    }).compile();

    controller = module.get<EcommerceController>(EcommerceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
