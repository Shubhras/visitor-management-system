import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  BeforeCreate,
} from 'sequelize-typescript';
import * as bcrypt from 'bcryptjs';

// This model only stores what the auth service needs to authenticate a user.
// All profile information like name and active status lives in the user service.
@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.ENUM('admin', 'resident'),
    allowNull: false,
    defaultValue: 'resident',
  })
  role: string;

  // Hashed refresh token stored so we can verify and rotate it on each use.
  @Column({
    type: DataType.TEXT,
    allowNull: true,
    defaultValue: null,
  })
  refreshToken: string | null;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    defaultValue: null,
  })
  resetPasswordToken: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: null,
  })
  resetPasswordExpires: Date | null;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BeforeCreate
  static async hashPassword(instance: User) {
    if (instance.password) {
      instance.password = await bcrypt.hash(instance.password, 10);
    }
  }
}