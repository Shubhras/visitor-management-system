import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { VisitorStatus } from '../enums/visitor-status.enum';

@Table({
  tableName: 'visitors',
  timestamps: true,
})
export class Visitor extends Model<Visitor> {

  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
  })
  declare phone: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
  })
  declare unitNumber: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare visitDate: string;

  @Column({
    type: DataType.ENUM(...Object.values(VisitorStatus) as string[]),
    allowNull: false,
    defaultValue: VisitorStatus.PENDING,
  })
  declare status: VisitorStatus;

  // Track which resident submitted this visitor request.
  // This lets us filter visitors by the logged-in resident
  // when they view their own list from the mobile app.
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare createdBy: number;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}