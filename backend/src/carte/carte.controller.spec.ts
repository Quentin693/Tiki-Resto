import { Test, TestingModule } from '@nestjs/testing';
import { CarteController } from './carte.controller';

describe('CarteController', () => {
  let controller: CarteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarteController],
    }).compile();

    controller = module.get<CarteController>(CarteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
