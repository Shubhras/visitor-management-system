import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  BeforeCreate,
  BeforeUpdate,
} from 'sequelize-typescript';
import * as bcrypt from 'bcryptjs';
import { Role } from '../../roles/role.enum';

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model<User> {

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
    type: DataType.STRING(150),
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.ENUM(...Object.values(Role)),
    allowNull: false,
    defaultValue: Role.RESIDENT,
  })
  declare role: Role;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare isActive: boolean;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  // Hash the password before creating a new user record.
  @BeforeCreate
  static async hashPasswordOnCreate(instance: User) {
    if (instance.password) {
      instance.password = await bcrypt.hash(instance.password, 10);
    }
  }

  // Hash password if updated
  @BeforeUpdate
  static async hashPasswordOnUpdate(instance: User) {
    if (instance.changed('password')) {
      instance.password = await bcrypt.hash(instance.password, 10);
    }
  }
}