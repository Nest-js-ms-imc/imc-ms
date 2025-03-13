import { ApplicationController } from './application.controller';
import { NewRecordImcUseCase } from './use-cases/new-record.use-case';
import { RecordsImcUseCase } from './use-cases/records-imc.use-case';
import { Domain } from '../domain/domain.interface';
import { IImcRepository } from './persistence/repositories/imc.repository';
import { IImcModel } from './persistence/models/imc.model';

jest.mock('./use-cases/new-record.use-case');
jest.mock('./use-cases/records-imc.use-case');

describe('ApplicationController', () => {
  let controller: ApplicationController;
  let mockImcRepository: jest.Mocked<IImcRepository<IImcModel>>;
  let mockDomainController: jest.Mocked<Domain>;

  beforeEach(() => {
    mockImcRepository = {
      save: jest.fn(),
      findOne: jest.fn(),
      findAll: jest.fn(),
    } as unknown as jest.Mocked<IImcRepository<IImcModel>>;

    mockDomainController = {} as jest.Mocked<Domain>;

    controller = new ApplicationController(
      mockImcRepository,
      mockDomainController,
    );
  });

  describe('new-record', () => {
    it('should create a new record imc', async () => {
      const mockImcDto = {
        height: 1.78,
        weight: 120,
        userId: '123456',
      };
      const mockResponse = { id: '1', ...mockImcDto };

      (NewRecordImcUseCase.prototype.execute as jest.Mock).mockResolvedValue(
        mockResponse,
      );

      const result = await controller.newRecordImcCalc(
        mockImcDto.height,
        mockImcDto.weight,
        mockImcDto.userId,
      );

      expect(NewRecordImcUseCase).toHaveBeenCalledWith(
        mockImcRepository,
        mockDomainController,
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error if new-record-use-case fails', async () => {
      (NewRecordImcUseCase.prototype.execute as jest.Mock).mockRejectedValue(
        new Error('Record creation failed'),
      );

      await expect(
        controller.newRecordImcCalc(1.8, 120, '123456'),
      ).rejects.toThrow('User creation failed');
    });
  });

  describe('login', () => {
    it('should return a valid token', async () => {
      const mockEmail = 'test@example.com';
      const mockToken = 'mocked-jwt-token';

      (RecordsImcUseCase.prototype.execute as jest.Mock).mockResolvedValue({
        token: mockToken,
      });

      const result = await controller.listRecordsImc(mockEmail);

      expect(RecordsImcUseCase).toHaveBeenCalledWith(
        mockImcRepository,
        mockDomainController,
      );
      expect(result).toBe(mockToken);
    });

    it('should throw an error if RecordsImcUseCase fails', async () => {
      (RecordsImcUseCase.prototype.execute as jest.Mock).mockRejectedValue(
        new Error('Invalid credentials'),
      );

      await expect(controller.listRecordsImc('123456')).rejects.toThrow(
        'Invalid user ID',
      );
    });
  });
});
