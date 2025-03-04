import { ImcDomainDto, RegisterImcDto } from './dto';

export abstract class Domain {
  abstract createImc(data: RegisterImcDto): ImcDomainDto;
}
