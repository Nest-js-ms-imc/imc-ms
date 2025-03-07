import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IImcModel } from '../../../application/persistence/models/imc.model';

@Entity()
export class ImcModel implements IImcModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('float')
  height: number;

  @Column('int')
  weight: number;

  @Column('float')
  imc: number;

  @Column('text')
  userId: string;

  @Column('date', {
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
