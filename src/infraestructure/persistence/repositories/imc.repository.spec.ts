import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ImcModel } from '../models/imc.model';
import { ImcRepository } from './imc.repository';
import { ImcApplicationDto } from '../../../application/dto';

describe('ImcRepository', () => {
  let imcRepository: ImcRepository;
  let repositoryMock: jest.Mocked<Repository<ImcModel>>;

  beforeEach(async () => {
    repositoryMock = {
      findOne: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<Repository<ImcModel>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImcRepository,
        { provide: getRepositoryToken(ImcModel), useValue: repositoryMock },
      ],
    }).compile();

    imcRepository = module.get<ImcRepository>(ImcRepository);
  });

  it('should be defined', () => {
    expect(imcRepository).toBeDefined();
  });

  describe('recordImc', () => {
    it('should record a imc if it does not exist', async () => {
      const dto: ImcApplicationDto = {
        id: '123456',
        height: 1.6,
        weight: 80,
        imc: 21.5,
        userId: '123456',
        createdAt: new Date(),
        position: 8,
      };

      repositoryMock.findOne.mockResolvedValue(null);
      repositoryMock.save.mockResolvedValue(dto as ImcModel);

      const result = await imcRepository.recordImc(dto);
      expect(repositoryMock.save).toHaveBeenCalledWith(
        expect.objectContaining(dto),
      );
      expect(result).toEqual(dto);
    });
  });
});
