import { Domain } from 'domain';

import { InvalidDataException } from './exceptions/invalid-data.exception';
import { ImcDomainDto, RegisterImcDto } from './dto';
import { ImcEntity } from './entities/imc.entity';

export class DomainController extends Domain {
  createImc(data: RegisterImcDto): ImcDomainDto {
    const imc = new ImcEntity(data);

    if (!imc.isValid()) {
      throw new InvalidDataException('Invalid imc data', imc.getErrors());
    }
    return imc.create(data);
  }
}
