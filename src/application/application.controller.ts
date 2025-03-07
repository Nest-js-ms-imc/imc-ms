import { Application } from './application.interface';
import { ImcApplicationDto } from './dto';
import { NewRecordImcUseCase } from './use-cases/new-record.use-case';
import { IImcRepository } from './persistence/repositories/imc.repository';
import { IImcModel } from './persistence/models/imc.model';
import { Domain } from '../domain/domain.interface';
import { RecordsImcUseCase } from './use-cases/records-imc.use-case';

export class ApplicationController extends Application {
  constructor(
    private readonly imcRepository: IImcRepository<IImcModel>,
    private readonly domainController: Domain,
  ) {
    super();
  }

  newRecordImcCalc(
    height: number,
    weight: number,
    // imc: number,
    userId: string,
  ): Promise<ImcApplicationDto> {
    const useCase = new NewRecordImcUseCase(
      this.imcRepository,
      this.domainController,
    );
    return useCase.execute({ height, weight, userId });
  }

  listRecordsImc(id: string): Promise<ImcApplicationDto[]> {
    const useCase = new RecordsImcUseCase(this.imcRepository);
    return useCase.execute({ id });
  }
}
