import { IImcRepository } from '../persistence/repositories/imc.repository';
import { IImcModel } from '../persistence/models/imc.model';
import { ImcApplicationDto, NewImcApplicationDto } from '../dto';
import { Domain } from '../../domain/domain.interface';
import { CreateImcDomainDto } from '../../domain/dto/create-imc.dto';

export class NewImcUseCase {
  constructor(
    private readonly imcRepository: IImcRepository<IImcModel>,
    private readonly domainController: Domain,
  ) {}

  async execute(newImcDto: NewImcApplicationDto): Promise<ImcApplicationDto> {
    const newImc = this.mapImcDtoToDomain(newImcDto);

    const data = this.domainController.createImc(newImc);

    const imc = this.mapImcDtoToPersistence(data);

    const imcDto = await this.imcRepository.registerImc(imc);

    const answer = this.mapImcDtoToApplication(imcDto);
    return answer;
  }

  private mapImcDtoToDomain(imcDto: NewImcApplicationDto): CreateImcDomainDto {
    const imc = new CreateImcDomainDto();
    imc.height = imcDto.height;
    imc.weight = imcDto.weight;
    imc.imc = imcDto.imc;
    return imc;
  }

  private mapImcDtoToPersistence(imcDto: ImcApplicationDto): ImcApplicationDto {
    const imc = new ImcApplicationDto();
    imc.id = imcDto.id;
    imc.height = imcDto.height;
    imc.weight = imcDto.weight;
    imc.imc = imcDto.imc;
    return imc;
  }

  private mapImcDtoToApplication(imcDto: IImcModel): ImcApplicationDto {
    const imc = new ImcApplicationDto();
    imc.id = imcDto.id;
    imc.height = imcDto.height;
    imc.weight = imcDto.weight;
    imc.imc = imcDto.imc;
    return imc;
  }
}
