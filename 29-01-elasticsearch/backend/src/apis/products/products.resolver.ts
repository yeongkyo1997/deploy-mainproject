import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateProductInput } from './dto/createProduct.input';
import { UpdateProductInput } from './dto/updateProduct.input';
import { Product } from './entities/product.entity';
import { ProductsService as ProductsService } from './products.service';

@Resolver()
export class ProductsResolver {
  constructor(
    private readonly productService: ProductsService, //
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  // 전체조회
  @Query(() => [Product])
  async fetchProducts() {
    // 엘라스틱서치에서 조회하기 연습!(연습 이후에는 다시 삭제하기!!)
    // const result = await this.elasticsearchService.search({
    //   index: 'myproduct04', // NoSQL에서 Collection 이름

    //   // 엘라스틱서치에서 조회하기 위한 조건
    //   query: {
    //     // 전체 조회
    //     match_all: {},
    //   },
    // });
    // console.log(JSON.stringify(result, null, '  '));
    //
    //
    //
    // 엘라스틱서치에서 조회해보기 위해 임시로 주석!!
    return this.productService.findAll();
  }

  // 개별조회
  @Query(() => Product)
  fetchProduct(
    @Args('productId') productId: string, //
  ) {
    return this.productService.findOne({ productId });
  }

  // 상품 생성
  @Mutation(() => Product)
  async createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput, //
  ) {
    // 엘라스틱서치에 등록하기 연습!!(연습 이후에는 다시 삭제하기!!)
    // const result = this.elasticsearchService.create({
    //   id: 'myid', // 엘라스틱서치에서 조회하기 위한 조건
    //   // 저장할 데이터의 컬렉션
    //   index: 'myproduct04',
    //   // 저장할 문서
    //   document: {
    //     name: '철수',
    //     age: 13,
    //     school: '다람쥐초등학교',
    //     ...createProductInput,
    //   },
    // });
    // console.log(
    //   '🚀 ~ file: products.resolver.ts ~ line 60 ~ ProductsResolver ~ result',
    //   result,
    // );
    //
    //
    //
    // 엘라스틱서치에 등록해보기위해 임시로 주석!!
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
