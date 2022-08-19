import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategory } from './entities/productCategory.entity';

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly productCategoryRepository: Repository<ProductCategory>,
  ) {}

  async create({ name }) {
    // DB에 카테고리 등록
    const result = await this.productCategoryRepository.save({ name: name });
    console.log(result);
    return result; // 실무에서는 바로 결과를 리턴해준다.
  }
}
