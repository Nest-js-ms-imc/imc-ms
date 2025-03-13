import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { EnvsService } from '../secrets/envs.service';
import { SecretsModule } from '../secrets/aws-secrets.module';
import { ImcModel } from './models/imc.model';
import { ImcRepository } from './repositories/imc.repository';

describe('PersistenceModule', () => {
  let module: TestingModule;
  let imcRepository: ImcRepository;
  let envsServiceMock: Partial<EnvsService>;
  let imcRepositoryMock: Partial<Record<keyof Repository<ImcModel>, jest.Mock>>;
  let dataSourceMock: Partial<DataSource>;

  beforeEach(async () => {
    envsServiceMock = {
      get: jest.fn((key) => {
        const mockEnv = {
          DB_HOST: 'localhost',
          DB_PORT: '5433',
          DB_USERNAME: 'test_user',
          DB_PASSWORD: 'test_password',
          DB_NAME: 'test_db',
        };
        return mockEnv[key];
      }),
      loadSecrets: jest.fn().mockResolvedValue(undefined),
    };

    imcRepositoryMock = {
      findOne: jest.fn(),
      save: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    dataSourceMock = {
      getRepository: jest.fn().mockReturnValue(imcRepositoryMock),
      createQueryRunner: jest
        .fn()
        .mockReturnValue({ connect: jest.fn(), release: jest.fn() }),
    };

    module = await Test.createTestingModule({
      imports: [SecretsModule],
      providers: [
        ImcRepository,
        { provide: EnvsService, useValue: envsServiceMock },
        {
          provide: getRepositoryToken(ImcModel),
          useValue: imcRepositoryMock,
        },
        { provide: DataSource, useValue: dataSourceMock },
      ],
    }).compile();

    imcRepository = module.get<ImcRepository>(ImcRepository);
  });

  it('module should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should get an instance of the ImcRepository', () => {
    expect(imcRepository).toBeDefined();
  });
});
