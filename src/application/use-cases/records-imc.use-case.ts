import { IImcRepository } from '../persistence/repositories/imc.repository';
import { IImcModel } from '../persistence/models/imc.model';
import { ImcApplicationDto, ListRecordsImcApplicationDto } from '../dto';
import { UseCaseException } from '../exceptions/use-case.exception';

export class RecordsImcUseCase {
  constructor(private readonly imcRepository: IImcRepository<IImcModel>) {}

  async execute(
    user: ListRecordsImcApplicationDto,
  ): Promise<ImcApplicationDto[]> {
    const registersDto = await this.imcRepository.findRecordsById(user);

    if (!registersDto) {
      throw new UseCaseException('No records');
    }

    const registers = this.mapImcDtoToApplication(registersDto);

    return registers;
  }

  // private mapImcDtoToDomain(imcDto: NewImcApplicationDto): CreateImcDomainDto {
  //   const imc = new RegistersImcDomainDto();
  //   imc.id = imcDto;
  //   imc.height = imcDto.height;
  //   imc.weight = imcDto.weight;
  //   imc.imc = imcDto.imc;
  //   return imc;
  // }

  // private mapImcDtoToPersistence(imcDto: ImcApplicationDto): ImcApplicationDto {
  //   const imc = new ImcApplicationDto();
  //   imc.id = imcDto.id;
  //   imc.height = imcDto.height;
  //   imc.weight = imcDto.weight;
  //   imc.imc = imcDto.imc;
  //   return imc;
  // }

  private mapImcDtoToApplication(imcDto: IImcModel[]): ImcApplicationDto[] {
    const registers: ImcApplicationDto[] = [];

    imcDto.map((imc) => {
      const imcApp = new ImcApplicationDto();

      // imcApp.id = imc.id;
      imcApp.createdAt = imc.createdAt;
      imcApp.height = imc.height;
      imcApp.weight = imc.weight;
      imcApp.imc = Number(imc.imc.toFixed(1));
      imcApp.position = imc.position;
      // imcApp.userId = imc.userId;

      registers.push(imcApp);
    });

    return registers;
  }
}
