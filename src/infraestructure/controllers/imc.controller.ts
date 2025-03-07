import { Controller, Body, Post, Get } from '@nestjs/common';

import { Application } from '../../application/application.interface';
import { RecordImcDto, RecordsImcDomainDto } from '../../domain/dto';

@Controller('imc')
export class ImcController {
  constructor(private readonly application: Application) {}

  // @MessagePattern('imc.new.record')
  // newRecord(@Payload() recordImcDto: RecordImcDto) {
  @Post('new-record')
  async registerImc(@Body() recordImcDto: RecordImcDto) {
    try {
      const data = await this.application.newRecordImcCalc(
        recordImcDto.height,
        recordImcDto.weight,
        recordImcDto.userId,
      );
      return data;
    } catch (error) {
      console.error(error, recordImcDto);
    }
  }

  // @MessagePattern('imc.list.records')
  // listRecords(@Payload() user: RecordsImcDomainDto) {
  @Get('list-records')
  async listRecords(@Body() user: RecordsImcDomainDto) {
    try {
      const data = await this.application.listRecordsImc(user.id);
      return data;
    } catch (error) {
      console.error(error, user);
    }
  }
}
