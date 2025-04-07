import { Test, TestingModule } from '@nestjs/testing';
import { CarteService } from './carte.service';

describe('CarteService', () => {
  let service: CarteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarteService],
    }).compile();

    service = module.get<CarteService>(CarteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
