import { IsNumber } from 'class-validator';

export class RegisterImcDto {
  @IsNumber()
  height: number;

  @IsNumber()
  weight: number;

  @IsNumber()
  imc: number;
}
