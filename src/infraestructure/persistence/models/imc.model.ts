import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IImcModel } from '../../../application/persistence/models/imc.model';

@Entity()
export class ImcModel implements IImcModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('number')
  height: number;

  @Column('number')
  weight: number;

  @Column('number')
  imc: number;

  @Column('date', {
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
