import { ImcApplicationDto, ListRecordsImcApplicationDto } from '../../dto';
import { IImcModel } from '../models/imc.model';

export interface IImcRepository<Imc extends IImcModel> {
  recordImc(user: ImcApplicationDto): Promise<Imc>;
  findRecordsById(id: ListRecordsImcApplicationDto): Promise<Imc[]>;
}
