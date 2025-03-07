import { ImcDomainDto, RecordImcDto } from './dto';

export abstract class Domain {
  abstract createImc(data: RecordImcDto): Promise<ImcDomainDto>;
  abstract getRecordsImc(id: string): Promise<ImcDomainDto[]>;
}
