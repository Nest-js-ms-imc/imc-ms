import { ImcApplicationDto } from './dto';

export abstract class Application {
  abstract newImcCalc(
    height: number,
    weight: number,
    imc: number,
  ): Promise<ImcApplicationDto>;
}
