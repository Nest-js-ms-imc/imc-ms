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
      const position = await this.getPosition(imc);

      const data = this.mapImcApplicationDtoToImcModel({
        ...imc,
        position,
      });

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

    imc.id = data.id;
    imc.createdAt = new Date();
    imc.height = height;
    imc.weight = data.weight;
    imc.userId = data.userId;
    imc.imc = +(data.weight / (height * height)).toFixed(1);
    imc.position = data.position;

    return imc;
  }

  private async getPosition(imc: ImcApplicationDto): Promise<number> {
    const records = await this.repository.find();

    const lastRecords = Array.from(
      records.reduce((map, record) => {
        const current = map.get(record.userId);
        if (!current || record.createdAt > current.createdAt) {
          map.set(record.userId, record);
        }
        return map;
      }, new Map()),
    ).map(([, record]) => record);

    const newImcModel = this.mapImcApplicationDtoToImcModel(imc);

    const userAlreadyExists = lastRecords.some(
      (record) => record.userId === imc.userId,
    );
    if (!userAlreadyExists) return -1;

    lastRecords.push(newImcModel);
    lastRecords.sort((a, b) => (a.imc ?? 0) - (b.imc ?? 0));

    const position =
      lastRecords.findIndex((record) => record.userId === imc.userId) + 1;

    return position;
  }
}
