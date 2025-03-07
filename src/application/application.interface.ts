import { ImcApplicationDto } from './dto';

export abstract class Application {
  abstract newRecordImcCalc(
    height: number,
    weight: number,
    // imc: number,
    userId: string,
  ): Promise<ImcApplicationDto>;

  abstract listRecordsImc(id: string): Promise<ImcApplicationDto[]>;
}
