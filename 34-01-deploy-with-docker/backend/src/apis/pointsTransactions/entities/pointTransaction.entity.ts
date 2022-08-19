import { Field, ObjectType, Int, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

// enum
export enum POINT_TRANSACTION_STATUS_ENUM {
  PAYMENT = 'PAYMENT',
  CANCEL = 'CANCEL',
}

// graphql enum type
registerEnumType(POINT_TRANSACTION_STATUS_ENUM, {
  name: 'POINT_TRANSACTION_STATUS_ENUM',
});

// 결제 히스토리 테이블
// insert only table
@Entity()
@ObjectType()
export class PointTransaction {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  impUid: string;

  @Column()
  @Field(() => Int)
  amount: number;

  // 상수값이어야 한다.
  @Column({ type: 'enum', enum: POINT_TRANSACTION_STATUS_ENUM })
  @Field(() => POINT_TRANSACTION_STATUS_ENUM)
  status: POINT_TRANSACTION_STATUS_ENUM;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  // @UpdateDateColumn()
  // updatedAt: Date;
}
