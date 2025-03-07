import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ImcModel } from '../models/imc.model';
import { IImcRepository } from '../../../application/persistence/repositories/imc.repository';
import {
  ImcApplicationDto,
  ListRecordsImcApplicationDto,
} from '../../../application/dto';

@Injectable()
export class ImcRepository implements IImcRepository<ImcModel> {
  constructor(
    @InjectRepository(ImcModel)
    readonly repository: Repository<ImcModel>,
  ) {}

  async recordImc(imc: ImcApplicationDto): Promise<ImcModel> {
    try {
      const data = this.mapImcApplicationDtoToImcModel(imc);

      return await this.repository.save(data);
    } catch (err) {
      throw new RpcException({
        status: 400,
        message: err.message,
      });
    }
  }

  async findRecordsById(
    user: ListRecordsImcApplicationDto,
  ): Promise<ImcModel[]> {
    return await this.repository.findBy({ userId: user.id });
  }

  private mapImcApplicationDtoToImcModel(data: ImcApplicationDto): ImcModel {
    const imc = new ImcModel();
    const height = data.height;
    //TODO: Falta pruebas unitarias + Posición de IMC frente a otros usuarios
    imc.id = data.id;
    imc.height = height;
    imc.weight = data.weight;
    imc.userId = data.userId;
    imc.imc = data.weight / (height * height);
    return imc;
  }
}
