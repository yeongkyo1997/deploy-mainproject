import { Field, ObjectType } from '@nestjs/graphql';
import { Product } from 'src/apis/products/entities/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class ProductCategory {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ unique: true })
  @Field(() => String)
  name: string;

  // DB에서 제공하는 기능이 아니다. (ManyToOne을 반대편에 무조건 써줘야함!!!!)
  @OneToMany(() => Product, (products) => products.productCategory)
  products: Product[];
}
