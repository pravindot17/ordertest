import { IsEmail, IsString, Length, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  public readonly orderId: string;

  @IsString() @Length(3, 64)
  public readonly name: string;

  @IsEmail()
  public readonly email: string;

  @IsString() @Length(3, 64)
  public readonly address: string;

  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  public readonly products: ProductDto[];
}

class ProductDto {
  @IsString() @Length(3, 64)
  public readonly name: string;

  @IsNumber()
  public readonly amount: number;
}