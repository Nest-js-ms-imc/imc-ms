import { jest } from '@jest/globals';
import { NewRecordImcUseCase } from './new-record.use-case';
import { IImcRepository } from '../persistence/repositories/imc.repository';
import { IImcModel } from '../persistence/models/imc.model';
import { Domain } from '../../domain/domain.interface';
import { ImcApplicationDto, NewRecordImcApplicationDto } from '../dto';

describe('NewRecordImc', () => {
  let newRecordImcUseCase: NewRecordImcUseCase;
  let mockImcRepository: jest.Mocked<IImcRepository<IImcModel>>;
  let mockDomainController: jest.Mocked<Domain>;

  beforeEach(() => {
    mockImcRepository = {
      recordImc: jest.fn(),
      findRecordsById: jest.fn(),
    } as jest.Mocked<IImcRepository<IImcModel>>;

    mockDomainController = {
      createImc: jest.fn(),
      getRecordsImc: jest.fn(),
    } as jest.Mocked<Domain>;

    newRecordImcUseCase = new NewRecordImcUseCase(
      mockImcRepository,
      mockDomainController,
    );
  });

  it('should create a new Imc and return Imc DTO', async () => {
    const newImcDto: NewRecordImcApplicationDto = {
      height: 1.6,
      weight: 80,
      userId: '123456',
    };

    const createdImcDomain: ImcApplicationDto = {
      id: '123456',
      height: newImcDto.height,
      weight: newImcDto.weight,
      imc: 21.5,
      userId: newImcDto.userId,
      createdAt: new Date(),
      position: 8,
    };

    const savedImc: IImcModel = {
      id: '123456',
      height: createdImcDomain.height,
      weight: createdImcDomain.weight,
      userId: createdImcDomain.userId,
      createdAt: new Date(),
      imc: createdImcDomain.imc,
      position: createdImcDomain.position,
    };

    mockDomainController.createImc.mockResolvedValue(createdImcDomain);
    mockImcRepository.recordImc.mockResolvedValue(savedImc);

    const result = await newRecordImcUseCase.execute(newImcDto);

    expect(mockDomainController.createImc).toHaveBeenCalledWith(
      expect.any(createdImcDomain),
    );
    expect(mockImcRepository.recordImc).toHaveBeenCalledWith(
      expect.objectContaining({
        id: savedImc.id,
        height: savedImc.height,
        weight: savedImc.weight,
      }),
    );

    expect(result).toEqual({
      id: savedImc.id,
      height: savedImc.height,
      weight: savedImc.weight,
    });
  });

  it('should throw an error if Imc creation fails', async () => {
    const createdImcDomain: ImcApplicationDto = {
      id: '123456',
      height: 1.6,
      weight: 80,
      imc: 21.5,
      userId: '123456',
      createdAt: new Date(),
      position: 8,
    };

    mockDomainController.createImc.mockImplementation(() => {
      throw new Error('Imc creation failed');
    });

    await expect(newRecordImcUseCase.execute(createdImcDomain)).rejects.toThrow(
      'Imc creation failed',
    );

    expect(mockDomainController.createImc).toHaveBeenCalled();
    expect(mockImcRepository.recordImc).not.toHaveBeenCalled();
  });
});
