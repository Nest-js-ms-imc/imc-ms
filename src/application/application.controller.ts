import { Application } from './application.interface';
import { ImcApplicationDto } from './dto';
import { NewImcUseCase } from './use-cases/new-imc.use-case';
import { IImcRepository } from './persistence/repositories/imc.repository';
import { IImcModel } from './persistence/models/imc.model';
import { Domain } from '../domain/domain.interface';

export class ApplicationController extends Application {
  constructor(
    private readonly imcRepository: IImcRepository<IImcModel>,
    private readonly domainController: Domain,
  ) {
    super();
  }

  newImcCalc(
    height: number,
    weight: number,
    imc: number,
  ): Promise<ImcApplicationDto> {
    const useCase = new NewImcUseCase(
      this.imcRepository,
      this.domainController,
    );
    return useCase.execute({ height, weight, imc });
  }
}
