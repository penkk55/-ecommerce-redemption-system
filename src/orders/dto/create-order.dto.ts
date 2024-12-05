import { Decimal } from '@prisma/client/runtime/library';
import { Type } from 'class-transformer';
import { IsArray, IsDecimal, IsInt, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  @IsNotEmpty()
  customerId: string;

  @IsArray()
  @IsNotEmpty()
  products: {
    productId: string;
    quantity: number;
  }[];

  @IsNotEmpty()
  //   @IsDecimal({ decimal_digits: '2' })
  //   @Type(() => Number) // Use class-transformer to convert the input into Decimal
  total: number;
}
