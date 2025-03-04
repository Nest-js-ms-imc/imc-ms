import { Controller, Body, Post } from '@nestjs/common';

import { Application } from '../../application/application.interface';
import { RegisterImcDto } from '../../domain/dto';

@Controller('imc')
export class ImcController {
  constructor(private readonly application: Application) {}

  // @MessagePattern('auth.register.user')
  // registerUser(@Payload() registerUserDto: LoginUserDto) {
  @Post('register')
  async registerImc(@Body() registerImcDto: RegisterImcDto) {
    try {
      const data = await this.application.newImcCalc(
        registerImcDto.height,
        registerImcDto.weight,
        registerImcDto.imc,
      );
      return data;
    } catch (error) {
      console.error(error, registerImcDto);
    }
  }
}
