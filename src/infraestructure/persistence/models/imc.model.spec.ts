import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ImcModel } from './imc.model';

describe('ImcModel Repository', () => {
  let imcRepository: Repository<ImcModel>;

  const mockImc = {
    id: '123456',
    height: 1.6,
    weight: 80,
    imc: 21.5,
    userId: '123456',
    createdAt: new Date(),
    position: 8,
  };

  const mockRepository = {
    findOne: jest.fn().mockResolvedValue(mockImc),
    save: jest.fn().mockResolvedValue(mockImc),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(ImcModel),
          useValue: mockRepository,
        },
      ],
    }).compile();

    imcRepository = module.get<Repository<ImcModel>>(
      getRepositoryToken(ImcModel),
    );
  });

  it('should be defined', () => {
    expect(imcRepository).toBeDefined();
  });

  it('should get records by userId', async () => {
    const user = await imcRepository.findOne({
      where: { userId: mockImc.userId },
    });
    expect(user).toEqual(mockImc);
    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { userId: mockImc.userId },
    });
  });

  it('should save a imc', async () => {
    const savedImc = await imcRepository.save(mockImc);
    expect(savedImc).toEqual(mockImc);
    expect(mockRepository.save).toHaveBeenCalledWith(mockImc);
  });
});
