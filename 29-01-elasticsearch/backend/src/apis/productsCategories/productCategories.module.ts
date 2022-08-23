import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCategory } from './entities/productCategory.entity';
import { ProductCategoryResolver } from './productCategories.resolver';
import { ProductCategoryService } from './productCategories.service';

@Module({
  // graphql과 관련
  imports: [
    TypeOrmModule.forFeature([
      // 주입될 데이터를 입력
      ProductCategory,
    ]),
  ],

  // restapi와 관련
  controllers: [],

  // 의존성과 관련
  providers: [
    ProductCategoryResolver, //
    ProductCategoryService, //
  ],
})
export class ProductCategoryModule {}
