import { InputType, PartialType } from '@nestjs/graphql';
import { CreateProductInput } from './createProduct.input';

// PartialType을 사용하면 상속받은 클래스가 전부 nullable로 바뀐다.
@InputType()
export class UpdateProductInput extends PartialType(CreateProductInput) {}
