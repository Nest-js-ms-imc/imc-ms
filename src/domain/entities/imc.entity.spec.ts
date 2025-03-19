import { jest } from '@jest/globals';
import { ImcEntity } from './imc.entity';
import { ImcApplicationDto } from '../../application/dto';

describe('ImcEntity', () => {
  let mockImcService: ImcApplicationDto = {
    id: '123456',
    height: 1.6,
    weight: 80,
    imc: 21.5,
    userId: '123456',
    createdAt: new Date(),
    position: 8,
  };

  beforeEach(() => {
    mockImcService = {
      id: '123456',
      height: 1.6,
      weight: 80,
      imc: 21.5,
      userId: '123456',
      createdAt: new Date(),
      position: 8,
    };
  });

  it('should create a new Imc entity', () => {
    const Imc = new ImcEntity(mockImcService);
    Imc.create({
      height: 1.6,
      weight: 80,
      userId: '123456',
    });

    expect(Imc.height).toBe(1.6);
    expect(Imc.weight).toBe(80);
  });

  it('should validate Imc sign in', () => {
    const Imc = new ImcEntity({ ...mockImcService, height: 1.8, weight: 90 });

    const mockResponse = {
      id: '123456',
      height: 1.6,
      weight: 80,
      imc: 21.5,
      userId: '123456',
      position: 8,
    };

    const result = Imc.create(mockImcService);

    expect(result).toMatchObject(mockResponse);
  });

  it('should validate Imc fields correctly', () => {
    const Imc = new ImcEntity({ ...mockImcService, height: 1.8, weight: 90 });
    Imc.validate();

    expect(Imc.getErrors().has('height')).toBe(false);
    expect(Imc.getErrors().has('weight')).toBe(false);
  });

  it('should validate entity correctly', () => {
    const Imc = new ImcEntity();

    Imc.validate();
    expect(Imc.isValid()).toBe(false);
    expect(Imc.getErrors().size).toBe(4);
  });

  it('should pass validation for correct Imc details', () => {
    const Imc = new ImcEntity({ ...mockImcService, height: 1.8, weight: 90 });

    Imc.validate();

    expect(Imc.isValid()).toBe(true);
  });
});
