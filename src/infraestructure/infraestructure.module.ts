import { Module } from '@nestjs/common';

import { PersistenceModule } from './persistence/persistence.module';
import { Application } from '../application/application.interface';
import { ApplicationController } from '../application/application.controller';
import { DomainController } from '../domain/domain.controller';
import { Domain } from '../domain/domain.interface';
import { SecretsModule } from './secrets/aws-secrets.module';
import { ImcController } from './controllers/imc.controller';
import { ImcRepository } from './persistence/repositories/imc.repository';
import { NatsModule } from './transports/nats.module';

@Module({
  imports: [SecretsModule, NatsModule, PersistenceModule],
  controllers: [ImcController],
  providers: [
    {
      provide: Domain,
      useClass: DomainController,
    },
    {
      provide: Application,
      inject: [ImcRepository, Domain],
      useFactory: (imcRepository: ImcRepository, domainController: Domain) =>
        new ApplicationController(imcRepository, domainController),
    },
  ],
})
export class InfraestructureModule {}
