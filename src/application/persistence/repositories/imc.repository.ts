import { ImcApplicationDto } from '../../dto';
import { IImcModel } from '../models/imc.model';

export interface IImcRepository<Imc extends IImcModel> {
  registerImc(user: ImcApplicationDto): Promise<Imc>;
}
