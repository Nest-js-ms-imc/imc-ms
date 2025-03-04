import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ImcModel } from '../models/imc.model';
import { IImcRepository } from '../../../application/persistence/repositories/imc.repository';
import { ImcApplicationDto } from '../../../application/dto';

@Injectable()
export class ImcRepository implements IImcRepository<ImcModel> {
  constructor(
    @InjectRepository(ImcModel)
    readonly repository: Repository<ImcModel>,
  ) {}

  async registerImc(imc: ImcApplicationDto): Promise<ImcModel> {
    try {
      const data = this.mapImcApplicationDtoToUserModel(imc);

      return await this.repository.save(data);
    } catch (err) {
      throw new RpcException({
        status: 400,
        message: err.message,
      });
    }
  }

  private mapImcApplicationDtoToUserModel(data: ImcApplicationDto): ImcModel {
    const imc = new ImcModel();
    imc.id = data.id;
    imc.height = data.height;
    imc.weight = data.weight;
    imc.imc = data.imc;
    return imc;
  }
}
