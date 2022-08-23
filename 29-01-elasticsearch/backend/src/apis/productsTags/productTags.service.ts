import { Inject, Injectable } from '@nestjs/common';
import { ProductTag } from './entities/productTag.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductTagsService {
  constructor(
    @Inject(ProductTag)
    private readonly productTagRepository: Repository<ProductTag>,
  ) {}

  async create({ name }) {
    return this.productTagRepository.save({ name });
  }
}
