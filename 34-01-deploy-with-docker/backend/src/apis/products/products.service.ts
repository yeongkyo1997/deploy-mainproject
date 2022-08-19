import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductSaleslocation } from '../productsSaleslocations/entities/productSaleslocation.entity';
import { ProductTag } from '../productsTags/entities/productTag.entity';

@Injectable()
export class ProductsService {
  constructor(
    // productRepository
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    // productSaleslocationRepository
    @InjectRepository(ProductSaleslocation)
    private readonly productSaleslocationRepository: Repository<ProductSaleslocation>,

    // productTagRepository
    @InjectRepository(ProductTag)
    private readonly productTagRepository: Repository<ProductTag>,
  ) {}

  // 조회 서비스
  findAll() {
    return this.productRepository.find({
      // entity의 이름과 똑같이 해야한다.
      relations: ['productSaleslocation', 'productCategory', 'productTags'],
    }); // 전체 다 찾는 함수
  }

  findOne({ productId }) {
    return this.productRepository.findOne({
      where: { id: productId },
      relations: ['productSaleslocation', 'productCategory', 'productTags'],
    }); // where에 조건을 입력해서 튜플을 찾는 함수
  }

  async create({ createProductInput }) {
    // // 1. 상품만 등록하는 경우
    // const result = await this.productRepository.save({
    //   // isSoldout: false, // 디폴트값

    //   // 하나하나 직접 나열하는 방식
    //   // name: createProductInput.name,
    //   // description: createProductInput.description,
    //   // price: createProductInput.price,

    //   // 스프레드 연산자를 활용해서 한번에 저장
    //   ...createProductInput,
    // });

    // 2. 상품 및 상품 거래위치를 같이 등록하는 경우
    const {
      productSaleslocation,
      productCategoryId,
      productTags,
      ...product
    } = // productTags 추가
      createProductInput;

    const addProductSaleslocation =
      await this.productSaleslocationRepository.save({
        ...productSaleslocation,
      });

    // productTagRepository
    // M:N 관계이므로 여러개의 데이터를 저장해야한다.
    // 따라서 저장할 데이터의 개수 만큼 저장을 반복해야한다.

    // const result111 = this.productTagRepository.save({ name: productTags[0] });
    // const result222 = this.productTagRepository.save({ name: productTags[1] });
    // const result333 = this.productTagRepository.save({ name: productTags[2] });
    const addProductTags = []; // [ {}, {}, {}, .... ] => tag의 정보들이 저장된다.
    for (let i = 0; i < productTags.length; i++) {
      const tagName = productTags[i].replace('#', '');

      /**
       * 기존에 태그가 존재한다면
       * 새로운 태그를 만들 필요없이
       * 기존의 태그를 사용하여
       * 테이블을 연결해준다.
       */

      // 기존 테이블에 태그가 있는지 확인
      const prevTag = await this.productTagRepository.findOne({
        where: { name: tagName },
      });

      // 기존에 태그가 존재한다면
      if (prevTag) {
        addProductTags.push(prevTag);
      }

      // 기존에 태그가 존재하지 않았다면
      else {
        const newTag = await this.productTagRepository.save({
          name: tagName,
        });

        addProductTags.push(newTag);
      }
    }

    const result = this.productRepository.save({
      ...product,
      // productSaleslocation: result.id, => 질문
      productSaleslocation: {
        ...addProductSaleslocation,
      },
      productCategory: { id: productCategoryId },

      // productTag 추가
      // productTags: [result111, result222, result333],
      productTags: [...addProductTags],
    });

    return result; // 실무에서는 바로 결과를 리턴해준다. (결과값이 없으면 error)
  }

  async update({ productId, updateProductInput }) {
    // 수정만 할때 사용
    // this.productRepository.update({ id: productId }, { ...updateProductInput });

    // 수정 후 결과값까지 받을 때 사용
    const myproduct = await this.productRepository.findOne({
      where: { id: productId },
    });

    const result = this.productRepository.save({
      ...myproduct,
      id: productId,
      ...updateProductInput,
    });

    return result;
  }

  async checksoldout({ productId }) {
    try {
      const product = await this.productRepository.findOne({
        where: { id: productId },
      });
      console.log(product);
    } catch (error) {
      throw new UnprocessableEntityException(error);
    } // 예외처리

    //
    //
    //
    // if (product.isSoldout) {
    //   throw new UnprocessableEntityException('이미 판매 완료된 상품입니다.');
    // }
  }

  async delete({ productId }) {
    // 1. 실제 DB에서 삭제하는 방법
    // const result = await this.productRepository.delete({ id: productId });
    // return result.affected ? true : false; // 삭제 성공여부
    //
    // 2. 소프트 삭제(직접 구현) - isDeleted를 true로 바꿔주면서 삭제된 상태로 저장
    // this.productRepository.update({ id: productId }, { isDeleted: true });
    //
    // 3. 소프트 삭제(직접 구현) - deletedAt을 사용하는 방법
    // this.productRepository.update({ id: productId }, { deletedAt: new Date() });  // 삭제 시간 저장, 삭제 시간을 저장하는 필드를 추가해야 한다.
    //
    // 4. 소프트 삭제(TypeORM 제공) - typeorm에서 제공하는 softRemove를 사용하는 방법
    // await this.productRepository.softRemove({ id: productId });
    //
    // 5. 소프트 삭제(TypeORM 제공) - typeorm에서 제공하는 softDelete를 사용하는 방법
    const result = await this.productRepository.softDelete({ id: productId });
    return result.affected ? true : false; // 삭제 성공여부
  }
}
