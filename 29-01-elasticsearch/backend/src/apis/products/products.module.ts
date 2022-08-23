import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductsResolver } from './products.resolver';
import { ProductsService } from './products.service';
import { ProductSaleslocation } from '../productsSaleslocations/entities/productSaleslocation.entity';
import { ProductTag } from '../productsTags/entities/productTag.entity';
import { ProductSubscriber } from './entities/product.subscriber';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
  // graphql과 관련
  imports: [
    TypeOrmModule.forFeature([
      // 주입될 데이터를 입력
      Product,
      ProductSaleslocation,
      ProductTag,
    ]),
    ElasticsearchModule.register({
      node: 'http://elasticsearch:9200',
    }),
  ],

  // restapi와 관련
  controllers: [],

  // 의존성과 관련
  providers: [
    ProductsResolver, //
    ProductsService,
    ProductSubscriber,
  ],
})
export class ProductModule {}
