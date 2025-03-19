import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';

import { ImcModel } from '../models/imc.model';
import { ImcRepository } from './imc.repository';
import {
  ImcApplicationDto,
  ListRecordsImcApplicationDto,
} from '../../../application/dto';

describe('ImcRepository', () => {
  let imcRepository: ImcRepository;
  let repositoryMock: jest.Mocked<Repository<ImcModel>>;

  beforeEach(async () => {
    repositoryMock = {
      save: jest.fn(),
      find: jest.fn(),
      findBy: jest.fn(),
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
    it('should record an imc successfully', async () => {
      const dto: ImcApplicationDto = {
        id: '123456',
        height: 1.7,
        weight: 80,
        imc: 27.7,
        userId: 'user123',
        createdAt: new Date(),
        position: 1,
      };

      repositoryMock.find.mockResolvedValue([
        {
          id: '1',
          height: 1.7,
          weight: 70,
          imc: 24.2,
          userId: 'user123',
          createdAt: new Date(),
          position: 3,
        },
        {
          userId: 'user123',
          createdAt: new Date('2024-03-01T10:00:00Z'),
          imc: 25.0,
        },
        {
          userId: 'user123',
          createdAt: new Date('2024-03-02T10:00:00Z'),
          imc: 24.5,
        },
        {
          userId: 'user456',
          createdAt: new Date('2024-03-01T12:00:00Z'),
          imc: 27.0,
        },
      ] as ImcModel[]);

      repositoryMock.save.mockResolvedValue(dto as ImcModel);

      const result = await imcRepository.recordImc(dto);

      expect(repositoryMock.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: '123456',
          height: 1.7,
          weight: 80,
          imc: 27.7,
          position: 1,
          userId: 'user123',
        }),
      );
      expect(result).toEqual(dto);
    });

    it('should throw RpcException on error', async () => {
      const dto: ImcApplicationDto = {
        id: '123456',
        height: 1.7,
        weight: 80,
        imc: 27.7,
        userId: 'user123',
        createdAt: new Date(),
        position: 1,
      };

      repositoryMock.save.mockRejectedValue(new Error('Database error'));

      await expect(imcRepository.recordImc(dto)).rejects.toThrow(RpcException);
    });
  });

  describe('findRecordsById', () => {
    it('should return records for a given user', async () => {
      const user: ListRecordsImcApplicationDto = { id: 'user123' };
      const records: ImcModel[] = [
        {
          id: '1',
          height: 1.7,
          weight: 80,
          imc: 27.7,
          userId: 'user123',
          createdAt: new Date(),
          position: 1,
        },
      ] as ImcModel[];

      repositoryMock.findBy.mockResolvedValue(records);

      const result = await imcRepository.findRecordsById(user);

      expect(repositoryMock.findBy).toHaveBeenCalledWith({ userId: user.id });
      expect(result).toEqual(records);
    });
  });

  describe('getPosition', () => {
    it('should return the correct position', async () => {
      const imcDto: ImcApplicationDto = {
        id: '123456',
        height: 1.7,
        weight: 80,
        imc: 27.7,
        userId: 'user456',
        createdAt: new Date(),
        position: 1,
      };

      const existingRecords: ImcModel[] = [
        {
          id: '1',
          height: 1.6,
          weight: 70,
          imc: 27.3,
          userId: 'user456',
          createdAt: new Date(),
          position: 2,
        },
      ] as ImcModel[];

      repositoryMock.find.mockResolvedValue(existingRecords);

      const position = await imcRepository['getPosition'](imcDto);

      expect(position).toBe(1);
    });
  });

  it('should correctly sort records when some imc values are 0 or undefined', async () => {
    repositoryMock.find.mockResolvedValue([
      {
        userId: 'user123',
        createdAt: new Date(),
        imc: undefined,
        id: 'test-id',
        height: 1.7,
        weight: 0,
        position: 0,
      },
      {
        userId: 'user456',
        createdAt: new Date(),
        imc: 28.0,
        id: 'test-id',
        height: 1.7,
        weight: 30,
        position: 3,
      },
      {
        userId: 'user789',
        createdAt: new Date(),
        imc: undefined,
        id: 'test-id',
        height: 1.7,
        weight: 80,
        position: 1,
      },
    ]);

    const dto: ImcApplicationDto = {
      id: 'test-id',
      height: 1.7,
      weight: 80,
      imc: 27.7,
      userId: 'user789',
      createdAt: new Date(),
      position: 2,
    };

    await imcRepository.recordImc(dto);

    expect(repositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining({ position: 2 }),
    );
  });

  it('should return -1 if user is not found in records', async () => {
    repositoryMock.find.mockResolvedValue([
      {
        userId: 'user123',
        createdAt: new Date(),
        imc: 24.0,
        id: '',
        height: 0,
        weight: 0,
        position: 0,
      },
      {
        userId: 'user456',
        createdAt: new Date(),
        imc: 28.0,
        id: '',
        height: 0,
        weight: 0,
        position: 0,
      },
    ]);

    const dto: ImcApplicationDto = {
      id: 'test-id',
      height: 1.7,
      weight: 80,
      imc: 27.7,
      userId: 'non-existent-user',
      createdAt: new Date(),
      position: 0,
    };

    const position = await imcRepository['getPosition'](dto);

    expect(position).toBe(-1);
  });
});
