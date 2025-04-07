import { IImcRepository } from '../persistence/repositories/imc.repository';
import { IImcModel } from '../persistence/models/imc.model';
import { ImcApplicationDto, ListRecordsImcApplicationDto } from '../dto';
import { RecordsImcUseCase } from './records-imc.use-case';

describe('RecordsImcUseCase', () => {
  let useCase: RecordsImcUseCase;
  let repositoryMock: jest.Mocked<IImcRepository<IImcModel>>;

  beforeEach(() => {
    repositoryMock = {
      findRecordsById: jest.fn(),
    } as unknown as jest.Mocked<IImcRepository<IImcModel>>;

    useCase = new RecordsImcUseCase(repositoryMock);
  });

  it('should retrieve and map IMC records', async () => {
    const user: ListRecordsImcApplicationDto = { id: '123' };
    const imcRecords: IImcModel[] = [
      {
        createdAt: new Date('2024-03-01T12:00:00Z'),
        height: 1.75,
        weight: 70,
        imc: 22.857,
        position: 1,
        id: '1',
        userId: '123',
      },
    ];

    repositoryMock.findRecordsById.mockResolvedValue(imcRecords);

    const result = await useCase.execute(user);

    expect(repositoryMock.findRecordsById).toHaveBeenCalledWith(user);
    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(ImcApplicationDto);
    expect(result[0].imc).toBe(22.9);
  });

  it('should throw UseCaseException if mapped DTO is invalid', async () => {
    const dto = null;

    await expect(useCase.execute(dto)).rejects.toThrow('No records');
  });
});
