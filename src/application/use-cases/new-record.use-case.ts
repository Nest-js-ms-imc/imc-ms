import { IImcRepository } from '../persistence/repositories/imc.repository';
import { IImcModel } from '../persistence/models/imc.model';
import { ImcApplicationDto, NewRecordImcApplicationDto } from '../dto';
import { Domain } from '../../domain/domain.interface';
import { CreateImcDomainDto } from '../../domain/dto/create-record.dto';
import { UseCaseException } from '../exceptions/use-case.exception';

export class NewRecordImcUseCase {
  constructor(
    private readonly imcRepository: IImcRepository<IImcModel>,
    private readonly domainController: Domain,
  ) {}

  async execute(
    newRecordImcDto: NewRecordImcApplicationDto,
  ): Promise<ImcApplicationDto> {
    const newImc = this.mapImcDtoToDomain(newRecordImcDto);

    if (!newImc) {
      throw new UseCaseException('Invalid data');
    }

    const data = await this.domainController.createImc(newImc);
    const imc = this.mapImcDtoToPersistence(data);
    const imcDto = await this.imcRepository.recordImc(imc);

    const answer = this.mapImcDtoToApplication(imcDto);
    return answer;
  }

  private mapImcDtoToDomain(
    imcDto: NewRecordImcApplicationDto,
  ): CreateImcDomainDto {
    const imc = new CreateImcDomainDto();
    imc.height = imcDto.height;
    imc.weight = imcDto.weight;
    // imc.imc = imcDto.imc;
    imc.userId = imcDto.userId;
    return imc;
  }

  private mapImcDtoToPersistence(imcDto: ImcApplicationDto): ImcApplicationDto {
    const imc = new ImcApplicationDto();
    imc.id = imcDto.id;
    imc.height = imcDto.height;
    imc.weight = imcDto.weight;
    // imc.imc = imcDto.imc;
    imc.userId = imcDto.userId;
    return imc;
  }

  private mapImcDtoToApplication(imcDto: IImcModel): ImcApplicationDto {
    const imc = new ImcApplicationDto();

    // imc.id = imcDto.id;
    imc.height = imcDto.height;
    imc.weight = imcDto.weight;
    imc.imc = Number(imcDto.imc.toFixed(1));
    // imc.userId = imcDto.userId;
    imc.position = imcDto.position;

    return imc;
  }
}
