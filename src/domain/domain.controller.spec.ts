import { DomainController } from './domain.controller';
import { CreateImcDomainDto } from './dto';
import { ImcEntity } from './entities/imc.entity';
import { InvalidDataException } from './exceptions/invalid-data.exception';

jest.mock('./entities/imc.entity');

describe('DomainController', () => {
  let controller: DomainController;

  beforeEach(() => {
    controller = new DomainController();
    jest.clearAllMocks();
  });

  describe('createRecordImc', () => {
    it('Should create Imc', () => {
      const mockData: CreateImcDomainDto = {
        height: 1.6,
        weight: 80,
        userId: '123456',
      };

      const mockImc = {
        validate: jest.fn(),
        isValid: jest.fn().mockReturnValue(true),
        create: jest.fn().mockReturnValue({ height: mockData.height }),
      };

      (ImcEntity as jest.Mock).mockImplementation(() => mockImc);

      const result = controller.createImc(mockData);

      expect(result).toEqual({ height: mockData.height });
      expect(mockImc.validate).toHaveBeenCalled();
      expect(mockImc.isValid).toHaveBeenCalled();
      expect(mockImc.create).toHaveBeenCalledWith(mockData);
    });

    it('Should launch InvalidDataException', () => {
      const mockData: CreateImcDomainDto = {
        height: 1.6,
        weight: 80,
        userId: '123456',
      };

      const mockImc = {
        validate: jest.fn(),
        isValid: jest.fn().mockReturnValue(false),
        getErrors: jest
          .fn()
          .mockReturnValue(['Invalid email', 'Invalid password']),
      };

      (ImcEntity as jest.Mock).mockImplementation(() => mockImc);

      expect(() => {
        controller.createImc(mockData);
      }).toThrow(InvalidDataException);
    });
  });
});
