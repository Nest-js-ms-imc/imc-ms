import { Test, TestingModule } from '@nestjs/testing';

import { Application } from '../../application/application.interface';
import { ImcController } from './imc.controller';
import { RecordImcDto, RecordsImcDomainDto } from '../../domain/dto';

describe('ImcController', () => {
  let imcController: ImcController;
  let applicationMock: jest.Mocked<Application>;

  beforeEach(async () => {
    applicationMock = {
      registerImc: jest.fn().mockResolvedValue({ success: true }),
      listRecords: jest.fn().mockResolvedValue({ token: 'mocked_token' }),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImcController],
      providers: [{ provide: Application, useValue: applicationMock }],
    }).compile();

    imcController = module.get<ImcController>(ImcController);
  });

  it('should record a imc', async () => {
    const dto: RecordImcDto = {
      height: 1.6,
      weight: 80,
      userId: '123456',
    };
    const result = await imcController.registerImc(dto);

    expect(applicationMock.newRecordImcCalc).toHaveBeenCalledWith(
      dto.height,
      dto.weight,
      dto.userId,
    );
    expect(result).toEqual({ success: true });
  });

  it('should display the list of records', async () => {
    const dto: RecordsImcDomainDto = {
      id: '123456',
    };
    const result = await imcController.listRecords(dto);

    expect(applicationMock.listRecordsImc).toHaveBeenCalledWith(dto.id);
    expect(result).toEqual({ token: 'mocked_token' });
  });

  it('should handle errors in list of records', async () => {
    const dto: RecordsImcDomainDto = {
      id: '123456',
    };

    const error = new Error('No records');
    applicationMock.listRecordsImc.mockRejectedValue(error);

    jest.spyOn(console, 'error').mockImplementation(() => {});

    await imcController.listRecords(dto);

    expect(console.error).toHaveBeenCalledWith(error);
  });

  it('should handle errors in new record imc and log them', async () => {
    const registerDto: RecordImcDto = {
      height: 1.6,
      weight: 80,
      userId: '123456',
    };

    const error = new Error('Record imc failed');
    applicationMock.newRecordImcCalc.mockRejectedValue(error);

    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    await imcController.registerImc(registerDto);

    expect(consoleErrorSpy).toHaveBeenCalledWith(error, registerDto);

    consoleErrorSpy.mockRestore();
  });
});
