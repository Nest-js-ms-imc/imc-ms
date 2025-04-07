import { Controller, Body, Post, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { Application } from '../../application/application.interface';
import { RecordImcDto, RecordsImcDomainDto } from '../../domain/dto';

@Controller('imc')
export class ImcController {
  constructor(private readonly application: Application) {}

  @MessagePattern('imc.new.record')
  async registerImc(@Payload() recordImcDto: RecordImcDto) {
    // @Post('new-record')
    // async registerImc(@Body() recordImcDto: RecordImcDto) {
    return await this.application.newRecordImcCalc(
      recordImcDto.height,
      recordImcDto.weight,
      recordImcDto.userId,
    );
  }

  @MessagePattern('imc.list.records')
  async listRecords(@Payload() user: RecordsImcDomainDto) {
    // @Get('list-records')
    // async listRecords(@Body() user: RecordsImcDomainDto) {
    return await this.application.listRecordsImc(user.id);
  }
}
