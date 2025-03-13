import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EnvsService } from './secrets/envs.service';
import { SecretsModule } from './secrets/aws-secrets.module';
import { ApplicationController } from '../application/application.controller';
import { Application } from '../application/application.interface';
import { Domain } from '../domain/domain.interface';
import { ImcRepository } from './persistence/repositories/imc.repository';
import { ImcController } from './controllers/imc.controller';
import { ImcModel } from './persistence/models/imc.model';

jest.mock('./persistence/repositories/user.repository');

describe('InfraestructureModule', () => {
  let module: TestingModule;
  let imcRepository: ImcRepository;
  let envsService: EnvsService;
  let envsServiceMock: jest.Mocked<EnvsService>;

  beforeEach(async () => {
    envsService = {
      get: jest.fn().mockReturnValue('mocked_secret'),
    } as unknown as EnvsService;

    envsServiceMock = {
      get: jest.fn().mockReturnValue('mocked_secret'),
    } as any;

    module = await Test.createTestingModule({
      imports: [SecretsModule],
      controllers: [ImcController],
      providers: [
        {
          provide: EnvsService,
          useValue: envsService,
        },
        {
          provide: Domain,
          useValue: {
            signIn: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: Application,
          useFactory: (userRepo: ImcRepository, domain: Domain) =>
            new ApplicationController(userRepo, domain),
          inject: [ImcRepository, Domain],
        },
        {
          provide: getRepositoryToken(ImcModel),
          useClass: Repository,
        },
        {
          provide: ImcRepository,
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    })
      .overrideProvider(ImcRepository)
      .useValue({
        findOne: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      })
      .overrideProvider(EnvsService)
      .useValue({
        get: jest.fn((key: string) => {
          const mockValues = {
            DB_HOST: 'localhost',
            DB_PORT: '5433',
            DB_NAME: 'test_db',
            DB_USERNAME: 'test_user',
            DB_PASSWORD: 'test_password',
          };
          return mockValues[key];
        }),
        loadSecrets: jest.fn().mockResolvedValue(undefined),
      })
      .overrideProvider(getRepositoryToken(ImcModel))
      .useValue({
        find: jest.fn(),
        save: jest.fn(),
      })
      .overrideProvider(ImcRepository)
      .useValue({
        findOne: jest.fn(),
        save: jest.fn(),
      })
      .compile();

    imcRepository = module.get<ImcRepository>(ImcRepository);
    envsService = module.get<EnvsService>(EnvsService);
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have ImcRepository defined', () => {
    expect(imcRepository).toBeDefined();
  });
});
