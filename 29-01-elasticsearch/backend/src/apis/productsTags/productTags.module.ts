import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductTag } from './entities/productTag.entity';
import { ProductTagsService } from './productTags.service';
import { ProductTagsResolver } from './productTags.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductTag, //
    ]),
  ],
  providers: [
    ProductTagsService, //
    ProductTagsResolver,
  ],
})
export class ProductTagsModule {}
