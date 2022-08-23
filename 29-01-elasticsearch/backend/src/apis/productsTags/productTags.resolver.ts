import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ProductTagsService } from './productTags.service';
import { ProductTag } from './entities/productTag.entity';

@Resolver()
export class ProductTagsResolver {
  constructor(
    private readonly productTagsService: ProductTagsService, //
  ) {}
  @Mutation(() => ProductTag)
  async createProductTag(
    @Args('name') name: string, //
  ) {
    return this.productTagsService.create({ name });
  }
}
