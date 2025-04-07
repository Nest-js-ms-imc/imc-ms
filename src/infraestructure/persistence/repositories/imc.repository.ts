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

    const listLastRecordEachUser = Array.from(
      records.reduce((map, record) => {
        const current = map.get(record.userId);
        if (!current || record.createdAt > current.createdAt) {
          map.set(record.userId, record);
        }
        return map;
      }, new Map()),
    )
      .map(([, record]) => record)
      .filter((user) => user.userId !== imc.userId);

    const newImcModel = this.mapImcApplicationDtoToImcModel(imc);

    // const userRecords = listLastRecordEachUser.filter(
    //   (record) => record.userId === imc.userId,
    // );

    listLastRecordEachUser.push(newImcModel);
    listLastRecordEachUser.sort((a, b) => (a.imc ?? 0) - (b.imc ?? 0));

    return (
      listLastRecordEachUser.findIndex(
        (record) => record.userId === imc.userId,
      ) + 1
    );

    // if (!userRecords) {
    //   return listLastRecordEachUser.findIndex((record) => record.userId === imc.userId) + 1;
    // } else {
    //   const mostRecent = userRecords.reduce((latest, current) => {
    //     return new Date(current.date) > new Date(latest.date)
    //       ? current
    //       : latest;
    //   });

    //   return allRecords.findIndex((r) => r.id === mostRecent.id);
    // }
  }
}
