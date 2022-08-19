import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateProductInput } from './dto/createProduct.input';
import { UpdateProductInput } from './dto/updateProduct.input';
import { Product } from './entities/product.entity';
import { ProductsService as ProductsService } from './products.service';

@Resolver()
export class ProductsResolver {
  constructor(private readonly productService: ProductsService) {}

  // 전체조회
  @Query(() => [Product])
  fetchProducts() {
    return this.productService.findAll();
  }

  // 개별조회
  @Query(() => Product)
  fetchProduct(
    @Args('productId') productId: string, //
  ) {
    return this.productService.findOne({ productId });
  }

  @Mutation(() => Product)
  createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput, //
  ) {
    return this.productService.create({ createProductInput });
  }

  // 수정하기
  @Mutation(() => Product)
  async updateProduct(
    @Args('productId') productId: string,
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ) {
    // 수정을 할때는 항상 조건을 만족시켜야 된다.
    // 판매 완료가 되었는지 확인해보기
    await this.productService.checksoldout({ productId });

    return this.productService.update({ productId, updateProductInput });
  }

  // 삭제하기
  @Mutation(() => Boolean)
  deleteProduct(
    @Args('productId') productId: string, //
  ) {
    return this.productService.delete({ productId });
  }
}
