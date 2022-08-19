import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ unique: true })
  @Field(() => String)
  email: string;

  @Column()
  // @Field(() => String) // front-end에서는 password를 몰라야한다.
  password: string;

  @Column({ type: 'varchar', length: 255 })
  @Field(() => String)
  name: string;

  @Column({ unsigned: true })
  @Field(() => Number)
  age: number;

  @Column({ default: 0, unsigned: true })
  @Field(() => Int)
  point: number;
}
